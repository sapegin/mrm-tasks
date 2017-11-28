// @ts-check
'use strict';

const path = require('path');
const minimist = require('minimist');
const editorConfigToPrettier = require('editorconfig-to-prettier');
const { json, packageJson, install } = require('mrm-core');
const { getStyleForFile } = require('mrm-core');

const defaultPattern = '**/*.{js,css,md}';
const defaultOptions = {
	printWidth: 100,
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
				proseWrap: false,
			},
		},
	],
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

	// .prettierrc
	json('.prettierrc')
		.merge(defaultOptions)
		.merge(editorconfigOptions)
		.merge(defaultOverrides)
		.merge(prettierOptions)
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
