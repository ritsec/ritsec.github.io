# ritsec.github.io

Website for RITESC. Built using [Jekyll](https://jekyllrb.com/)

## Development

### Install Ruby

#### Method 1 - `rbenv` (Recommended)

1. Install `rbenv` with your package manager (see [here](https://github.com/rbenv/rbenv?tab=readme-ov-file#using-package-managers))
2. Install the proper `ruby` version with `rbenv install`

#### Method 2 - Manual Installation

> ⚠️ **Be sure to check the [`.ruby-version`](./.ruby-version) file to ensure you're installing the correct Ruby version**

You can install Ruby manually using the instructions found [here](https://www.ruby-lang.org/en/documentation/installation/).

### Install dependencies

Install [`bundler`](https://bundler.io/) to easily install all of the dependency gems:

```shell
gem install bundler
bundle
```

### Development Server

To start up the dev server (runs locally on `http://127.0.0.1:4000`) run:

```shell
bundle exec jekyll serve
```

### Development Build

To generate a static build of the site run:

```shell
bundle exec jekyll build
```
