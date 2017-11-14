// @ts-check
'use strict';

const fs = require('fs');
const path = require('path');
const { lines, packageJson, copyFiles, install, uninstall } = require('mrm-core');

function task() {
	const packages = ['jest'];
	const oldPackages = ['mocha', 'chai', 'ava'];

	// package.json
	const pkg = packageJson().merge({
		scripts: {
			'test:jest': 'jest',
			'test:watch': 'jest --watch',
			'test:coverage': 'jest --coverage',
		},
	});

	const needsMigration = oldPackages.some(name => pkg.get(`devDependencies.${name}`));
	const hasBabel = pkg.get('devDependencies.babel-core');
	const hasTypeScript = pkg.get('devDependencies.typescript');

	// Babel
	if (hasBabel) {
		packages.push('babel-jest');
		pkg.merge({
			jest: {
				testPathIgnorePatterns: ['/node_modules/', '<rootDir>/lib/'],
			},
		});
	}

	// TypeScript
	if (hasTypeScript) {
		packages.push('ts-jest', '@types/jest');
		pkg.merge({
			jest: {
				testPathIgnorePatterns: ['/node_modules/', '<rootDir>/lib/'],
				transform: {
					'^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
				},
				testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
				moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
			},
		});
	}

	// Clean up old scripts
	pkg
		.removeScript(/^mocha|mocha:.*?|ava|ava:.*?|test:mocha|test:ava$/)
		.removeScript('test', /mocha|ava/);

	// package.json: test command
	pkg.appendScript('test', 'npm run test:jest');

	pkg.save();

	// .gitignore
	lines('.gitignore')
		.add('coverage/')
		.save();

	// .npmignore
	if (!pkg.get('private')) {
		lines('.npmignore')
			.add('__tests__/')
			.save();
	}

	// ESLint
	if (pkg.get(`devDependencies.eslint`)) {
		const eslintignore = lines('.eslintignore').add('coverage/*');
		if (hasBabel) {
			eslintignore.add('lib/*');
		}
		eslintignore.save();
	}

	// Test template for small projects
	if (fs.existsSync('index.js') && !fs.existsSync('test.js')) {
		copyFiles(path.join(__dirname, 'templates'), 'test.js');
	}

	// Dependencies
	uninstall(oldPackages);
	install(packages);

	// Suggest jest-codemods if projects used other test frameworks
	if (needsMigration) {
		console.log(`\nCommit changes and migrate your tests to Jest:

  npx jest-codemods

More info:
https://github.com/skovhus/jest-codemods
`);
	}
}

task.description = 'Adds Jest';
module.exports = task;
