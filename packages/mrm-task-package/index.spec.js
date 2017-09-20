'use strict';

jest.mock('fs');
jest.mock('mrm-core/src/util/log', () => ({
	added: jest.fn(),
}));

const path = require('path');
const { getConfigGetter } = require('mrm');
const vol = require('memfs').vol;
const task = require('./index');

afterEach(() => {
	vol.reset();
	process.chdir('/');
});

it('should add package.json', () => {
	vol.mkdirpSync(__dirname);
	process.chdir(__dirname);

	task(
		getConfigGetter({
			name: 'Gendalf',
			url: 'http://middleearth.com',
			github: 'gendalf',
		})
	);

	expect(vol.toJSON()[path.join(__dirname, 'package.json')]).toMatchSnapshot();
});
