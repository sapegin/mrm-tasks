// @ts-check
'use strict';

const fs = require('fs');
const path = require('path');
const meta = require('user-meta');
const { template, packageJson } = require('mrm-core');

const defaultLicense = 'MIT';

const ANONYMOUS_LICENSES = ['Unlicense'];

const isAnonymouseLicense = name => ANONYMOUS_LICENSES.indexOf(name) > -1;

function task(config) {
	config.defaults({ licenseFile: 'License.md' }).defaults(meta);

	const configLicense = config.values().license;

	if (!isAnonymouseLicense(configLicense)) {
		config.require('name', 'email', 'url');
	}

	const { name, email, url, licenseFile } = config.values();
	const pkg = packageJson();

	let license = configLicense;
	let shouldUpdatePkgLicense = false;
	if (!license) {
		license = pkg.get('license', defaultLicense);
		shouldUpdatePkgLicense = true;
	}

	const templateFile = path.join(__dirname, `templates/${license}.md`);

	if (!fs.existsSync(templateFile)) {
		console.log(`No template for the "${license}" license found, skipping`);
		return;
	}

	if (shouldUpdatePkgLicense) {
		pkg.set('license', license);
		pkg.save();
	}

	template(licenseFile, templateFile)
		.apply({
			name,
			email,
			url,
			year: new Date().getFullYear(),
		})
		.save();
}
task.description = 'Adds license file';

module.exports = task;
