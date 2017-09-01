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

const fs = require.requireActual('fs');
const path = require('path');
const getConfigGetter = require('../../mrm').getConfigGetter;
const vol = require('memfs').vol;
const task = require('./index');

const json = o => JSON.stringify(o, null, '  ');

const packageJson = json({
	name: 'unicorn',
});

afterEach(() => vol.reset());

it('should add Jest', () => {
	vol.fromJSON({
		'/package.json': packageJson,
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()).toMatchSnapshot();
});

it('should add a basic test case when index.js file is present', () => {
	vol.fromJSON({
		[`${__dirname}/templates/test.js`]: fs.readFileSync(path.join(__dirname, 'templates/test.js')),
		'/package.json': packageJson,
		'/index.js': '',
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()['/test.js']).toMatchSnapshot();
});
