'use strict';

jest.mock('fs');
jest.mock('mrm-core/src/util/log', () => ({
	added: jest.fn(),
}));

const getConfigGetter = require('../../mrm').getConfigGetter;
const vol = require('memfs').vol;
const task = require('./index');

afterEach(() => vol.reset());

it('should add EditorConfig', () => {
	vol.fromJSON();

	task(getConfigGetter({}));

	expect(vol.toJSON()).toMatchSnapshot();
});

it.skip('should add a single section when indent=2', () => {});
