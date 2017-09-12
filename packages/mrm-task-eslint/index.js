// @ts-check
'use strict';

const minimist = require('minimist');
const { json, packageJson, lines, install, uninstall } = require('mrm-core');

function task(config) {
	let exts = '';
	const ignores = ['node_modules/'];
	const packages = ['eslint'];
	const oldPackages = ['jslint', 'jshint'];
	const { eslintPreset, eslintPeerDependencies, eslintRules } = config
		.defaults({
			eslintPreset: 'eslint:recommended',
			eslintPeerDependencies: [],
		})
		.values();

	// Preset
	if (eslintPreset !== 'eslint:recommended') {
		packages.push(`eslint-config-${eslintPreset}`);
	}

	// Peer dependencies
	packages.push(...eslintPeerDependencies);

	const pkg = packageJson();

	// .eslintrc
	const eslintrc = json('.eslintrc');
	if (!eslintrc.get('extends', '').startsWith(eslintPreset)) {
		eslintrc.set('extends', eslintPreset);
	}
	if (eslintRules) {
		eslintrc.merge({ rules: eslintRules });
	}

	// TypeScript
	if (pkg.get('devDependencies.typescript')) {
		const parser = 'typescript-eslint-parser';
		packages.push(parser);
		eslintrc.merge({
			parser,
			rules: eslintRules || {
				// Disable rules not supported by TypeScript parser
				// https://github.com/eslint/typescript-eslint-parser#known-issues
				'no-undef': 0,
				'no-unused-vars': 0,
				'no-useless-constructor': 0,
			},
		});
		exts = ' --ext .ts,.tsx';
	}

	eslintrc.save();

	// .eslintignore
	lines('.eslintignore')
		.add(ignores)
		.save();

	// Keep custom extensions
	const lintScript = pkg.getScript('lint');
	if (lintScript) {
		const args = minimist(lintScript.split(' ').slice(1));
		if (args.ext && args.ext !== '.js') {
			exts = ` --ext ${args.ext}`;
		}
	}

	pkg
		// Remove existing JS linters
		.removeScript(/^(lint:js|eslint|jshint|jslint)$/)
		.removeScript('test', / (lint|lint:js|eslint|jshint|jslint)( |$)/)
		// Add lint script
		.setScript('lint', 'eslint . --cache --fix' + exts)
		// Add pretest script
		.prependScript('pretest', 'npm run lint')
		.save();

	// Dependencies
	uninstall(oldPackages);
	install(packages);
}

task.description = 'Adds ESLint';
module.exports = task;
