// @ts-check
'use strict';

const minimist = require('minimist');
const { packageJson, install } = require('mrm-core');

// TODO: Prettier support

const packages = ['lint-staged', 'husky'];

function task(config) {
	const { lintStagedRules, eslintExtensions, stylelintExtensions } = config
		.defaults({
			eslintExtensions: '.js',
			stylelintExtensions: '.css',
		})
		.values();

	const pkg = packageJson();

	const rules = lintStagedRules || {};

	if (!lintStagedRules) {
		if (pkg.get('devDependencies.eslint')) {
			const lintScript = pkg.getScript('lint');
			const args = lintScript && minimist(lintScript.split(' ').slice(1));
			const exts = args ? args.ext : eslintExtensions;
			rules[`*${exts}`] = ['eslint --fix', 'git add'];
		}

		if (pkg.get('devDependencies.stylelint')) {
			// TODO: infer extensions from package.json
			rules[`*${stylelintExtensions}`] = ['stylelint --fix', 'git add'];
		}
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
