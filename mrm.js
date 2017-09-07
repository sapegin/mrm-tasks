'use strict';

const { get } = require('lodash');

// TODO: Remove after new version of mrm is published

/**
 * Return a config getter.
 *
 * @param {Object} options
 * @return {any}
 */
function getConfigGetter(options) {
	/**
	 * Return a config value.
	 *
	 * @param {string} prop
	 * @param {any} [defaultValue]
	 * @return {any}
	 */
	function config(prop, defaultValue) {
		console.warn(
			'Warning: calling config as a function is deprecated. Use config.values() instead'
		);
		return get(options, prop, defaultValue);
	}

	/**
	 * Return an object with all config values.
	 *
	 * @return {Object}
	 */
	function values() {
		return options;
	}

	/**
	 * Mark config options as required.
	 *
	 * @param {string[]} names...
	 * @return {Object} this
	 */
	function require(...names) {
		const unknown = names.filter(name => !options[name]);
		if (unknown.length > 0) {
			throw new Error(`Required config options are missed: ${unknown.join(', ')}.`, {
				unknown,
			});
		}
		return config;
	}

	/**
	 * Set default values.
	 *
	 * @param {Object} defaultOptions
	 * @return {any}
	 */
	function defaults(defaultOptions) {
		options = Object.assign({}, defaultOptions, options);
		return config;
	}

	config.require = require;
	config.defaults = defaults;
	config.values = values;
	return config;
}

module.exports = {
	getConfigGetter,
};
