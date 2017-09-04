/* eslint-disable no-console */
'use strict';

jest.mock('fs');
jest.mock('mrm-core/src/util/log', () => ({
	added: jest.fn(),
}));
jest.mock('mrm-core/src/npm', () => ({
	install: jest.fn(),
}));

const { install } = require('mrm-core');
const getConfigGetter = require('../../mrm').getConfigGetter;
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

it('should add stylelint', () => {
	vol.fromJSON({
		'/package.json': packageJson,
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()).toMatchSnapshot();
	expect(install).toBeCalledWith(['stylelint', 'stylelint-config-standard']);
});

it('should install a custom preset', () => {
	vol.fromJSON({
		'/package.json': packageJson,
	});

	task(getConfigGetter({ stylelintPreset: 'stylelint-config-pizza' }));

	expect(vol.toJSON()['/.stylelintrc']).toMatchSnapshot();
	expect(install).toBeCalledWith(['stylelint', 'stylelint-config-pizza']);
});

it('should use custom extension', () => {
	vol.fromJSON({
		'/package.json': packageJson,
	});

	task(getConfigGetter({ stylelintExtensions: '.sass' }));

	expect(vol.toJSON()['/package.json']).toMatchSnapshot();
});
