// @ts-check
'use strict';

const path = require('path');
const minimist = require('minimist');
const { packageJson, install } = require('mrm-core');

const packages = ['lint-staged', 'husky'];

// '**/*.{js,jsx}' → js,jsx
const globToExts = g => {
	const suffix = path.extname(g);
	return suffix.replace(/[^\w.,]/g, '');
};

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
			const args = script && minimist(script.split(' ').slice(1));
			// XXX: Fragile, it’s not really a value of the --write option,
			// but a separate anonymous parameter
			const exts = (args && args.write && globToExts(args.write)) || prettierExtensions;
			newRules.push([`*${exts}`, 'prettier --write']);
		}

		// ESLint
		if (pkg.get('devDependencies.eslint')) {
			const script = pkg.getScript('lint');
			const args = script && minimist(script.split(' ').slice(1));
			const exts = (args && args.ext) || eslintExtensions;
			newRules.push([`*${exts}`, 'eslint --fix']);
		}

		// Stylelint
		if (pkg.get('devDependencies.stylelint')) {
			// TODO: infer extensions from package.json
			newRules.push([`*${stylelintExtensions}`, 'stylelint --fix']);
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
