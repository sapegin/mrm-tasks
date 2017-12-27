const { packageJson, install, getExtsFromCommand } = require('mrm-core');

const packages = ['lint-staged', 'husky'];

function extsToGlob(exts, defaults) {
	if (!exts) {
		exts = defaults.split(',').map(x => x.replace(/^\./, ''));
	}

	if (exts.length > 1) {
		return `*.{${exts}}`;
	}

	return `*.${exts}`;
}

function task(config) {
	const { lintStagedRules, eslintExtensions, prettierExtensions, stylelintExtensions } = config
		.defaults({
			eslintExtensions: '.js',
			prettierExtensions: '.js',
			stylelintExtensions: '.css',
		})
		.values();

	const pkg = packageJson();

	const rules = lintStagedRules || {};

	if (!lintStagedRules) {
		const newRules = [];

		// Prettier
		if (pkg.get('devDependencies.prettier') && !pkg.get('devDependencies.eslint-plugin-prettier')) {
			const script = pkg.getScript('format');
			const exts = getExtsFromCommand(script);
			newRules.push([extsToGlob(exts, prettierExtensions), 'prettier --write']);
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
		.merge({
			scripts: {
				precommit: 'lint-staged',
			},
			'lint-staged': rules,
		})
		.save();

	// package.json: dependencies
	install(packages);
}

task.description = 'Adds lint-staged';
module.exports = task;
