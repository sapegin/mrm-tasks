jest.mock('fs');
jest.mock('mrm-core/src/util/log', () => ({
	added: jest.fn(),
}));
jest.mock('mrm-core/src/npm', () => ({
	install: jest.fn(),
	uninstall: jest.fn(),
}));

const { install, uninstall } = require('mrm-core');
const { getConfigGetter } = require('mrm');
const vol = require('memfs').vol;
const task = require('./index');

const stringify = o => JSON.stringify(o, null, '  ');

const packageJson = stringify({
	name: 'unicorn',
	scripts: {
		test: 'jest',
	},
});

afterEach(() => {
	vol.reset();
	install.mockClear();
	uninstall.mockClear();
});

it('should add ESLint', () => {
	vol.fromJSON({
		'/package.json': packageJson,
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()).toMatchSnapshot();
	expect(install).toBeCalledWith(['eslint']);
});

it('should use a custom preset', () => {
	vol.fromJSON({
		'/package.json': packageJson,
	});

	task(getConfigGetter({ eslintPreset: 'airbnb' }));

	expect(vol.toJSON()['/.eslintrc']).toMatchSnapshot();
	expect(install).toBeCalledWith(['eslint', 'eslint-config-airbnb']);
});

it('should add custom rules', () => {
	vol.fromJSON({
		'/package.json': packageJson,
	});

	task(getConfigGetter({ eslintRules: { 'no-undef': 0 } }));

	expect(vol.toJSON()['/.eslintrc']).toMatchSnapshot();
});

it('should install extra dependencies', () => {
	vol.fromJSON({
		'/package.json': packageJson,
	});

	task(getConfigGetter({ eslintPeerDependencies: ['eslint-plugin-react'] }));

	expect(install).toBeCalledWith(['eslint', 'eslint-plugin-react']);
});

it('should remove obsolete dependencies', () => {
	vol.fromJSON({
		'/package.json': stringify({
			name: 'unicorn',
			devDependencies: {
				prettier: '*',
			},
		}),
	});

	task(getConfigGetter({ eslintObsoleteDependencies: ['prettier'] }));

	expect(uninstall).toBeCalledWith(['jslint', 'jshint', 'prettier']);
});

it('should keep custom extensions defined in a package.json script', () => {
	vol.fromJSON({
		'/package.json': stringify({
			name: 'unicorn',
			scripts: {
				lint: 'eslint --ext .ts',
				test: 'jest',
			},
		}),
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()['/package.json']).toMatchSnapshot();
});

it('should not add custom extensions when they were not specified', () => {
	vol.fromJSON({
		'/package.json': stringify({
			name: 'unicorn',
			scripts: {
				lint: 'eslint . --cache --fix',
				test: 'jest',
			},
		}),
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()['/package.json']).toMatchSnapshot();
});

it('should replace scripts.test.eslint with scripts.lint and scripts.pretest', () => {
	vol.fromJSON({
		'/package.json': stringify({
			name: 'unicorn',
			scripts: {
				test: 'eslint --ext .ts && jest',
			},
		}),
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()['/package.json']).toMatchSnapshot();
});

it('should remove custom extension if it’s "js" (default value)', () => {
	vol.fromJSON({
		'/package.json': stringify({
			name: 'unicorn',
			scripts: {
				lint: 'eslint --ext .js',
				test: 'jest',
			},
		}),
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()['/package.json']).toMatchSnapshot();
});

it('should add extra rules, parser and extensions for a TypeScript project', () => {
	vol.fromJSON({
		'/package.json': stringify({
			name: 'unicorn',
			devDependencies: {
				typescript: '*',
			},
		}),
	});

	task(getConfigGetter({}));

	expect(vol.toJSON()).toMatchSnapshot();
	expect(install).toBeCalledWith(['eslint', 'typescript-eslint-parser']);
});
