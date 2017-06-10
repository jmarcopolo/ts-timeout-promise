# ts-timeout-promise

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/alexjoverm/typescript-library-starter.svg)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/alexjoverm/typescript-library-starter.svg)](https://travis-ci.org/alexjoverm/typescript-library-starter)
[![Coveralls](https://img.shields.io/coveralls/alexjoverm/typescript-library-starter.svg)](https://coveralls.io/github/alexjoverm/typescript-library-starter)
[![bitHound Dev Dependencies](https://www.bithound.io/github/alexjoverm/typescript-library-starter/badges/devDependencies.svg)](https://www.bithound.io/github/alexjoverm/typescript-library-starter/master/dependencies/npm)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/AJoverMorales)

`setTimeout` as a promise.

### Usage

```ts
import timeout from 'ts-timeout-promise';
(async() => {
    // timeout
    await timeout(1000);
    console.log(`1s passed`);

    // clear timeout
    const timer = timeout(100);
    timer.then(() => {
        console.log(`won't log`);
    });
    timer.clear();
})();
```

### NPM scripts

 - `npm t`: Run test suite
 - `npm start`: Runs `npm run build` in watch mode
 - `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
 - `npm run test:prod`: Generate coverage
 - `npm run build`: Generage bundles and typings, create docs
 - `npm run commit`: Commit using conventional commit style ([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:)

### Automatic releases

If you'd like to have automatic releases with Semantic Versioning, follow these simple steps.

_**Prerequisites**: you need to create/login accounts and add your project to:_
 - npm
 - Travis
 - Coveralls

Run the following command to prepare hooks and stuff:

```bash
npm run semantic-release-prepare
```

Follow the console instructions to install semantic release run it (answer NO to "Generate travis.yml").

_Note: make sure you've setup `repository.url` in your `package.json` file_

```bash
npm install -g semantic-release-cli
semantic-release setup
# IMPORTANT!! Answer NO to "Generate travis.yml" question. Is already prepared for you :P
```

From now on, you'll need to use `npm run commit`, which is a convenient way to create conventional commits.

Automatic releases are possible thanks to [semantic release](https://github.com/semantic-release/semantic-release), which publishes your code automatically on github and npm, plus generates automatically a changelog. This setup is highly influenced by [Kent C. Dodds course on egghead.io](https://egghead.io/courses/how-to-write-an-open-source-javascript-library)

### Git Hooks

By default, there are 2 disabled git hooks. They're set up when you run the `npm run semantic-release-prepare` script, by using [husky](https://github.com/typicode/husky). They make sure:
 - You follow a [conventional commit message](https://github.com/conventional-changelog/conventional-changelog)
 - Your build is not gonna fail in [Travis](https://travis-ci.org) (or your CI server), since it's runned locally before `git push`

This makes more sense in combination of [automatic releases](#automatic-releases)

#### What is `npm install` doing the first time runned?

It runs the script `tools/init` which sets up everything for you. In short, it:
 - Configures RollupJS for the build, which creates the bundles.
 - Configures `package.json` (typings file, main file, etc)
 - Renames main src and test files

#### What if I don't want git-hooks, automatic releases or semantic-release?

Then you may want to:
 - Remove `commitmsg`, `postinstall` scripts from `package.json`. That will not use those git hooks to make sure you make a conventional commit
 - Remove `npm run semantic-release` from `.travis.yml`

#### What if I don't want to use coveralls or report my coverage?

Remove `npm run report-coverage` from `.travis.yml`
