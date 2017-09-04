// @ts-check
'use strict';

const minimist = require('minimist');
const { json, packageJson, install, uninstall } = require('mrm-core');

// TODO: .eslintignore

function task(config) {
	const packages = ['eslint'];
	const oldPackages = ['jslint', 'jshint'];

	const { eslintPreset, eslintPeerDependencies } = config
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

	// .eslintrc
	const eslintrc = json('.eslintrc');
	if (!eslintrc.get('extends', '').startsWith(eslintPreset)) {
		eslintrc.set('extends', eslintPreset).save();
	}

	// package.json
	const pkg = packageJson();

	// Keep custom extensions
	let exts = '';
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
