'use strict';

jest.mock('fs');
jest.mock('mrm-core/src/util/log', () => ({
	added: jest.fn(),
}));
jest.mock('mrm-core/src/npm', () => ({
	install: jest.fn(),
}));

const fs = require.requireActual('fs');
const path = require('path');
const { omitBy } = require('lodash');
const getConfigGetter = require('../../mrm').getConfigGetter;
const vol = require('memfs').vol;
const task = require('./index');

const json = o => JSON.stringify(o, null, '  ');

afterEach(() => vol.reset());

it('should add a readme', () => {
	vol.fromJSON({
		[`${__dirname}/templates/styleguide.config.js`]: fs.readFileSync(
			path.join(__dirname, 'templates/styleguide.config.js')
		),
		'/package.json': json({
			name: 'unicorn',
		}),
	});

	task(getConfigGetter({}));

	expect(omitBy(vol.toJSON(), (v, k) => k.startsWith(__dirname))).toMatchSnapshot();
});

it.skip('should not install webpack when used with CRA', () => {});
