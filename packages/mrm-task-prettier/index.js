// @ts-check
'use strict';

const path = require('path');
const minimist = require('minimist');
const editorConfigToPrettier = require('editorconfig-to-prettier');
const { json, packageJson, install } = require('mrm-core');
const { getStyleForFile } = require('mrm-core');

const defaultPattern = '**/*.{js,css,md}';
const defaultOptions = {
	singleQuote: true,
	trailingComma: 'es5',
	useTabs: true,
};
const defaultOverrides = {
	overrides: [
		{
			files: '*.md',
			options: {
				printWidth: 70,
				useTabs: false,
				trailingComma: 'none',
				proseWrap: 'never',
			},
		},
	],
};
const defaultPrettierOptions = {
	printWidth: 80,
	tabWidth: 2,
	useTabs: false,
	semi: true,
	singleQuote: false,
	trailingComma: 'none',
	bracketSpacing: true,
	jsxBracketSameLine: false,
};

function task(config) {
	const packages = ['prettier'];

	const { prettierPattern, prettierOptions } = config
		.defaults({
			prettierPattern: defaultPattern,
			prettierOptions: {},
		})
		.values();

	// Try to read options from EditorConfig
	const testJsFile = path.join(process.cwd(), 'test.js');
	const editorconfigOptions = editorConfigToPrettier(getStyleForFile(testJsFile));

	const pkg = packageJson();

	const options = Object.assign(
		{},
		defaultOptions,
		editorconfigOptions,
		prettierOptions,
		defaultOverrides
	);

	// Remove options that have the same values as Prettier defaults
	for (const option in options) {
		if (options[option] === defaultPrettierOptions[option]) {
			delete options[option];
		}
	}

	// .prettierrc
	json('.prettierrc')
		.merge(options)
		.save();

	// Keep custom pattern
	let pattern = prettierPattern;
	const formatScript = pkg.getScript('format');
	if (formatScript) {
		const args = minimist(formatScript.split(' ').slice(1));
		if (args.write && args.write !== `'${defaultPattern}`) {
			pattern = args.write.replace(/(^'|'$)/g, '');
		}
	}

	pkg
		// Add format script
		.setScript('format', `prettier --write '${pattern}'`)
		// Add pretest script
		.appendScript('posttest', 'npm run format')
		.save();

	// Dependencies
	install(packages);
}

task.description = 'Adds Prettier';
module.exports = task;
