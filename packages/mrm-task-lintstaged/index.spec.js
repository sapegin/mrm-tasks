/* eslint-disable no-console */
'use strict';

jest.mock('fs');
jest.mock('mrm-core/src/npm', () => ({
	install: jest.fn(),
}));

const { install } = require('mrm-core');
const { getConfigGetter } = require('mrm');
const vol = require('memfs').vol;
const task = require('./index');

const stringify = o => JSON.stringify(o, null, '  ');

const packageJson = stringify({
	name: 'unicorn',
	scripts: {
		test: 'jest',
	},
});

const console$log = console.log;

beforeEach(() => {
	console.log = jest.fn();
});

afterEach(() => {
	vol.reset();
	install.mockClear();
	console.log = console$log;
});

it('should not do anything if not supported tools are found', () => {
	vol.fromJSON({
		'/package.json': packageJson,
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()).toMatchSnapshot();
	expect(console.log).toBeCalledWith(expect.stringMatching('Cannot configure lint-staged'));
});

it('should add ESLint if project depends on it', () => {
	vol.fromJSON({
		'/package.json': stringify({
			name: 'unicorn',
			devDependencies: {
				eslint: '*',
			},
		}),
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()).toMatchSnapshot();
	expect(install).toBeCalledWith(['lint-staged', 'husky']);
});

it('should infer ESLint extension for an npm script', () => {
	vol.fromJSON({
		'/package.json': stringify({
			name: 'unicorn',
			scripts: {
				lint: 'eslint --fix --ext .js,.jsx',
			},
			devDependencies: {
				eslint: '*',
			},
		}),
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()).toMatchSnapshot();
});

it('should use a custom ESLint extension', () => {
	vol.fromJSON({
		'/package.json': stringify({
			name: 'unicorn',
			devDependencies: {
				eslint: '*',
			},
		}),
	});

	task(getConfigGetter({ eslintExtensions: '.js,.jsx' }));

	expect(vol.toJSON()).toMatchSnapshot();
});

it('should add stylelint if project depends on it', () => {
	vol.fromJSON({
		'/package.json': stringify({
			name: 'unicorn',
			devDependencies: {
				stylelint: '*',
			},
		}),
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()).toMatchSnapshot();
	expect(install).toBeCalledWith(['lint-staged', 'husky']);
});

it('should use a custom stylelint extension', () => {
	vol.fromJSON({
		'/package.json': stringify({
			name: 'unicorn',
			devDependencies: {
				stylelint: '*',
			},
		}),
	});

	task(getConfigGetter({ stylelintExtensions: '.scss' }));

	expect(vol.toJSON()).toMatchSnapshot();
});

it('should use a custom rules', () => {
	vol.fromJSON({
		'/package.json': stringify({
			name: 'unicorn',
			devDependencies: {
				eslint: '*',
				stylelint: '*',
			},
		}),
	});

	task(getConfigGetter({ lintStagedRules: { '*.js': 'false' } }));

	expect(vol.toJSON()).toMatchSnapshot();
	expect(install).toBeCalledWith(['lint-staged', 'husky']);
});
