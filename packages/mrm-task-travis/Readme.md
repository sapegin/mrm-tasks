# mrm-task-travis

[Mrm](https://github.com/sapegin/mrm) task that adds [Travis CI](https://travis-ci.org/).

## What it does

* Creates `.travis.yml`
* Adds Travis CI badge to the Readme

## Usage

```
npm install -g mrm mrm-task-travis
mrm travis
```

## Options

See [Mrm docs](https://github.com/sapegin/mrm#usage) for more details.

### `github` (default: extracted from `.git/config` file)

Your GitHub user name.

### `readmeFile` (default: `Readme.md`)

Name of the Readme file.

## Change log

The change log can be found in [Changelog.md](Changelog.md).

## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](../../Contributing.md).

## Authors and license

[Artem Sapegin](http://sapegin.me) and [contributors](https://github.com/sapegin/mrm-tasks/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
