// @ts-check
'use strict';

const fs = require('fs');
const { MrmError, packageJson, lines, yaml, markdown, uninstall } = require('mrm-core');

const packageName = 'semantic-release';

function task(config) {
	const { readmeFile, changelogFile } = config
		.defaults({ readmeFile: 'Readme.md', changelogFile: 'Changelog.md' })
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
https://github.com/semantic-release/semantic-release#setup
`
		);
	}

	// Remove semantic-release devDependency
	pkg.unset(`devDependencies.${packageName}`);

	// Remove semantic-release script
	pkg.removeScript(packageName);

	// Save package.json
	pkg.save();

	const travisYml = yaml('.travis.yml');
	const afterSuccess = travisYml.get('after_success');

	// Remove the official semantic-release runner from commands list on .travis.yml
	if (Array.isArray(afterSuccess)) {
		travisYml.set('after_success', afterSuccess.filter(cmd => cmd !== 'npm run semantic-release'));
	}
	travisYml
		// Add global semantic-release runner to .travis.yml
		.merge({
			after_success: [
				`npm install -g semantic-release`,
				'semantic-release pre && npm publish && semantic-release post',
			],
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
	const name = pkg.get('name');
	const readme = markdown(readmeFile);
	if (readme.exists()) {
		readme
			.addBadge(
				`https://img.shields.io/npm/v/${name}.svg`,
				`https://www.npmjs.com/package/${name}`,
				'npm'
			)
			.save();
	}

	// Dependencies
	uninstall(packageName);
}

task.description = 'Adds semantic-release';
module.exports = task;
