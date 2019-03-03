const { packageJson, install, getExtsFromCommand } = require('mrm-core');
const semver = require('semver');

const packages = { 'lint-staged': '>=8', husky: '>=1' };

function extsToGlob(exts, defaults) {
	if (!exts) {
		exts = defaults.split(',').map(x => x.replace(/^\./, ''));
	}

	if (exts.length > 1) {
		return `*.{${exts}}`;
	}

	return `*.${exts}`;
}

const defaults = {
	eslintExtensions: '.js',
	prettierExtensions: '.js',
	stylelintExtensions: '.css',
};

function task(config) {
	const {
		lintStagedRules,
		eslintExtensions,
		prettierExtensions,
		stylelintExtensions,
	} = config.defaults(defaults).values();

	const pkg = packageJson();

	const rules = lintStagedRules || {};

	if (!lintStagedRules) {
		const newRules = [];

		// Prettier
		if (pkg.get('devDependencies.prettier') && !pkg.get('devDependencies.eslint-plugin-prettier')) {
			const script = pkg.getScript('format');
			const exts = getExtsFromCommand(script);
			let suggestedExtensions = prettierExtensions;
			// Use different extensions for Prettier depending on its version
			// but only do so if user didn't override default extensions
			if (prettierExtensions === defaults.prettierExtensions) {
				const prettierVersion = semver.coerce(pkg.get('devDependencies.prettier'));
				if (semver.satisfies(prettierVersion, '1.4.0 - 1.5.0')) {
					// CSS was added in 1.4
					suggestedExtensions = '.js,.css';
				} else if (semver.satisfies(prettierVersion, '1.5.0 - 1.8.0')) {
					// JSON was added in 1.5
					suggestedExtensions = '.js,.css,.json';
				} else if (semver.satisfies(prettierVersion, '>=1.8.0')) {
					// Markdown was added in 1.8
					suggestedExtensions = '.js,.css,.json,.md';
				}
			}
			newRules.push([extsToGlob(exts, suggestedExtensions), 'prettier --write']);
		}

		// ESLint
		if (pkg.get('devDependencies.eslint')) {
			const script = pkg.getScript('lint');
			const exts = getExtsFromCommand(script, 'ext');
			newRules.push([extsToGlob(exts, eslintExtensions), 'eslint --fix']);
		}

		// Stylelint
		if (pkg.get('devDependencies.stylelint')) {
			const script = pkg.getScript('lint:css');
			const exts = getExtsFromCommand(script);
			newRules.push([extsToGlob(exts, stylelintExtensions), 'stylelint --fix']);
		}

		// Merge rules with the same extensions
		newRules.forEach(([exts, command]) => {
			if (rules[exts]) {
				rules[exts].unshift(command);
			} else {
				rules[exts] = [command, 'git add'];
			}
		});
	}

	if (Object.keys(rules).length === 0) {
		console.log(
			'\nCannot configure lint-staged, only ESLint, stylelint or custom rules are supported.'
		);
		return;
	}

	// package.json
	pkg
		// Remove husky 0.14 config
		.unset('scripts.precommit')
		// Add new config
		.merge({
			husky: {
				hooks: {
					'pre-commit': 'lint-staged',
				},
			},
			'lint-staged': rules,
		})
		.save();

	// Install dependencies
	install(packages);
}

task.description = 'Adds lint-staged';
module.exports = task;
