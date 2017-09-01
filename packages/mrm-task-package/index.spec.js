'use strict';

jest.mock('fs');
jest.mock('mrm-core/src/util/log', () => ({
	added: jest.fn(),
}));

const getConfigGetter = require('../../mrm').getConfigGetter;
const vol = require('memfs').vol;
const task = require('./index');

afterEach(() => vol.reset());

it('should add package.json', () => {
	task(
		getConfigGetter({
			name: 'Gendalf',
			url: 'http://middleearth.com',
			github: 'gendalf',
		})
	);

	expect(vol.toJSON()).toMatchSnapshot();
});
