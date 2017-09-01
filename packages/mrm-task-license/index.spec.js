'use strict';

jest.mock('fs');
jest.mock('mrm-core/src/util/log', () => ({
	added: jest.fn(),
}));

const fs = require.requireActual('fs');
const path = require('path');
const getConfigGetter = require('../../mrm').getConfigGetter;
const vol = require('memfs').vol;
const task = require('./index');

afterEach(() => vol.reset());

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

it.skip('should read lincese name from package.json', () => {});
it.skip('should skip when template not found', () => {});
