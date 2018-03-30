const fs = require('fs');
const { MrmError, packageJson, lines, yaml, markdown, uninstall } = require('mrm-core');

function task(config) {
	const {
		readmeFile,
		changelogFile,
		semanticConfig,
		semanticArgs,
		semanticPeerDependencies,
	} = config
		.defaults({
			readmeFile: 'Readme.md',
			changelogFile: 'Changelog.md',
			semanticPeerDependencies: [],
		})
		.values();

	// Require .travis.yml
	if (!fs.existsSync('.travis.yml')) {
		throw new MrmError(
			`Run travis task first:
  mrm travis`
		);
	}

	// package.json
	const pkg = packageJson();

	if (!pkg.getScript('semantic-release')) {
		throw new MrmError(
			`Setup semantic-release first:
  npx semantic-release-cli setup

semantic-release needs to add required auth keys to Travis CI.

WARNING: Do not agree to update your .travis.yml when asked.

More info:
https://semantic-release.gitbooks.io/semantic-release/content/docs/usage/ci-configuration.html#automatic-setup-with-semantic-release-cli
`
		);
	}

	// Remove semantic-release script
	pkg.removeScript('semantic-release');
	pkg.removeScript('travis-deploy-once');

	// Add or remove custom semantic-release config
	if (semanticConfig) {
		pkg.merge({ release: semanticConfig });
	} else {
		pkg.unset('release');
	}

	// Save package.json
	pkg.save();

	const travisYml = yaml('.travis.yml');
	const afterSuccess = travisYml.get('after_success');

	// Remove the official semantic-release runner from commands list on .travis.yml
	if (Array.isArray(afterSuccess)) {
		travisYml.set('after_success', afterSuccess.filter(cmd => cmd !== 'npm run semantic-release'));
	}

	// Add global semantic-release runner to .travis.yml
	const dependencies = ['semantic-release'].concat(semanticPeerDependencies);
	const commands = [
		`npm install --no-save ${dependencies.join(' ')}`,
		'npx travis-deploy-once "semantic-release' + (semanticArgs ? ` ${semanticArgs}` : '') + '"',
	];
	travisYml
		.merge({
			after_success: commands,
			branches: {
				except: ['/^v\\d+\\.\\d+\\.\\d+$/'],
			},
		})
		.save();

	// Add Changelog.md to .gitignore
	lines('.gitignore')
		.add(changelogFile)
		.save();

	// Add npm package version badge to Readme.md
	const packageName = pkg.get('name');
	const readme = markdown(readmeFile);
	if (readme.exists()) {
		readme
			.addBadge(
				`https://img.shields.io/npm/v/${packageName}.svg`,
				`https://www.npmjs.com/package/${packageName}`,
				'npm'
			)
			.save();
	}

	// Remove semantic-release from project dependencies
	uninstall(['semantic-release', 'travis-deploy-once']);
}

task.description = 'Adds semantic-release';
module.exports = task;
