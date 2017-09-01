/* eslint-disable no-console */
'use strict';

jest.mock('fs');
jest.mock('mrm-core/src/util/log', () => ({
	added: jest.fn(),
}));
jest.mock('mrm-core/src/npm', () => ({
	install: jest.fn(),
}));

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

afterEach(() => vol.reset());

it('should add stylelint', () => {
	vol.fromJSON({
		'/package.json': packageJson,
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()).toMatchSnapshot();
});

it.skip('should install custom preset', () => {});
it.skip('should install extra dependencies', () => {});
