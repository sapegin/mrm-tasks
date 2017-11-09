/* eslint-disable no-console */
'use strict';

jest.mock('fs');
jest.mock('mrm-core/src/util/log', () => ({
	added: jest.fn(),
}));
jest.mock('mrm-core/src/npm', () => ({
	uninstall: jest.fn(),
}));

const { uninstall } = require('mrm-core');
const { getConfigGetter } = require('mrm');
const vol = require('memfs').vol;
const task = require('./index');

const stringify = o => JSON.stringify(o, null, '  ');

const travisYml = `language: node_js
node_js:
  - 8
`;
const packageJson = stringify({
	name: 'unicorn',
	scripts: {
		'semantic-release': 'semantic-release',
	},
});
const readmeMd = '# Unicorn';

afterEach(() => {
	vol.reset();
	uninstall.mockClear();
});

it('should add semantic-release', () => {
	vol.fromJSON({
		'/.travis.yml': travisYml,
		'/package.json': packageJson,
		'/Readme.md': readmeMd,
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()).toMatchSnapshot();
});

it('should add custom config to package.json', () => {
	vol.fromJSON({
		'/.travis.yml': travisYml,
		'/package.json': packageJson,
	});

	task(
		getConfigGetter({
			semanticConfig: { pizza: 42 },
		})
	);

	expect(vol.toJSON()['/package.json']).toMatchSnapshot();
});

it('should install extra dependencies on CI', () => {
	vol.fromJSON({
		'/.travis.yml': travisYml,
		'/package.json': packageJson,
	});

	task(
		getConfigGetter({
			semanticPeerDependencies: ['pizza'],
		})
	);

	expect(vol.toJSON()['/.travis.yml']).toMatchSnapshot();
});

it('should remove the official semantic-release runner', () => {
	vol.fromJSON({
		'/.travis.yml': `language: node_js
node_js:
  - 8
after_success:
  - bash <(curl -s https://codecov.io/bash)
  - npm run semantic-release
`,
		'/package.json': packageJson,
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()['/.travis.yml']).toMatchSnapshot();
	expect(uninstall).toBeCalledWith('semantic-release');
});

it('should throw when .travis.yml not found', () => {
	vol.fromJSON({
		'/package.json': packageJson,
	});

	const fn = () => task(getConfigGetter({}));

	expect(fn).toThrowError('Run travis task');
});

it('should throw when semantic-release script not found', () => {
	vol.fromJSON({
		'/.travis.yml': travisYml,
		'/package.json': '{}',
	});

	const fn = () => task(getConfigGetter({}));

	expect(fn).toThrowError('semantic-release needs to add required auth keys');
});
