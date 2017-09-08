'use strict';

jest.mock('fs');
jest.mock('mrm-core/src/util/log', () => ({
	added: jest.fn(),
}));

const fs = require.requireActual('fs');
const path = require('path');
const { getConfigGetter } = require('mrm');
const vol = require('memfs').vol;
const task = require('./index');

const console$log = console.log;

const json = o => JSON.stringify(o, null, '  ');

beforeEach(() => {
	console.log = jest.fn();
});

afterEach(() => {
	vol.reset();
	console.log = console$log;
});

it('should add EditorConfig', () => {
	vol.fromJSON({
		[`${__dirname}/templates/MIT.md`]: fs.readFileSync(path.join(__dirname, 'templates/MIT.md')),
	});

	task(
		getConfigGetter({
			name: 'Gendalf',
			email: 'gendalf@middleearth.com',
			url: 'http://middleearth.com',
		})
	);

	expect(vol.toJSON()['/License.md']).toMatchSnapshot();
});

it('should read lincese name from package.json', () => {
	vol.fromJSON({
		[`${__dirname}/templates/Apache-2.0.md`]: fs.readFileSync(
			path.join(__dirname, 'templates/Apache-2.0.md')
		),
		'/package.json': json({
			name: 'unicorn',
			license: 'Apache-2.0',
		}),
	});

	task(
		getConfigGetter({
			name: 'Gendalf',
			email: 'gendalf@middleearth.com',
			url: 'http://middleearth.com',
		})
	);

	expect(vol.toJSON()['/License.md']).toMatchSnapshot();
});

it('should skip when template not found', () => {
	task(
		getConfigGetter({
			name: 'Gendalf',
			email: 'gendalf@middleearth.com',
			url: 'http://middleearth.com',
		})
	);

	expect(console.log).toBeCalledWith(expect.stringMatching('skipping'));
});
