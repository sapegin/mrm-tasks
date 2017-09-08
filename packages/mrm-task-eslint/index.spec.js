/* eslint-disable no-console */
'use strict';

jest.mock('fs');
jest.mock('mrm-core/src/util/log', () => ({
	added: jest.fn(),
}));
jest.mock('mrm-core/src/npm', () => ({
	install: jest.fn(),
	uninstall: jest.fn(),
}));

const { install } = require('mrm-core');
const { getConfigGetter } = require('mrm');
const vol = require('memfs').vol;
const task = require('./index');

const json = o => JSON.stringify(o, null, '  ');

const packageJson = json({
	name: 'unicorn',
	scripts: {
		test: 'jest',
	},
});

afterEach(() => {
	vol.reset();
	install.mockClear();
});

it('should add ESLint', () => {
	vol.fromJSON({
		'/package.json': packageJson,
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()).toMatchSnapshot();
	expect(install).toBeCalledWith(['eslint']);
});

it('should use a custom preset', () => {
	vol.fromJSON({
		'/package.json': packageJson,
	});

	task(getConfigGetter({ eslintPreset: 'airbnb' }));

	expect(vol.toJSON()['/.eslintrc']).toMatchSnapshot();
	expect(install).toBeCalledWith(['eslint', 'eslint-config-airbnb']);
});

it('should add custom rules', () => {
	vol.fromJSON({
		'/package.json': packageJson,
	});

	task(getConfigGetter({ eslintRules: { 'no-undef': 0 } }));

	expect(vol.toJSON()['/.eslintrc']).toMatchSnapshot();
});

it('should install extra dependencies', () => {
	vol.fromJSON({
		'/package.json': packageJson,
	});

	task(getConfigGetter({ eslintPeerDependencies: ['eslint-plugin-react'] }));

	expect(install).toBeCalledWith(['eslint', 'eslint-plugin-react']);
});

it('should keep custom extensions defined in a package.json script', () => {
	vol.fromJSON({
		'/package.json': json({
			name: 'unicorn',
			scripts: {
				lint: 'eslint --ext .ts',
				test: 'jest',
			},
		}),
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()['/package.json']).toMatchSnapshot();
});

it('should remove custom extension if it’s "js" (default value)', () => {
	vol.fromJSON({
		'/package.json': json({
			name: 'unicorn',
			scripts: {
				lint: 'eslint --ext .js',
				test: 'jest',
			},
		}),
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()['/package.json']).toMatchSnapshot();
});

it('should add extra rules, parser and extensions for a TypeScript project', () => {
	vol.fromJSON({
		'/package.json': json({
			name: 'unicorn',
			devDependencies: {
				typescript: '*',
			},
		}),
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()).toMatchSnapshot();
	expect(install).toBeCalledWith(['eslint', 'typescript-eslint-parser']);
});
