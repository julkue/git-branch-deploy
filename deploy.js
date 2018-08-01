/*!***************************************************
 * git-branch-deploy v1.0.1
 * https://github.com/julmot/git-branch-deploy
 * Copyright (c) 2018, Julian Kühnel
 * Released under the MIT license https://git.io/fNwlS
 *****************************************************/
'use strict';
const del = require('del'),
  fs = require('fs-extra'),
  git = require('simple-git');

module.exports = props => {
  // settings
  let opts = Object.assign({}, {
    branch: '',
    sourceDir: '',
    deployDir: `${__dirname}/tmp/`,
    gitName: process.env.GIT_USER_NAME,
    gitEmail: process.env.GIT_USER_EMAIL,
    ghRepository: process.env.GITHUB_REPOSITORY,
    ghUser: process.env.GITHUB_USERNAME,
    ghToken: process.env.GITHUB_TOKEN,
    travis: true
  }, props);
  opts.ghRemote = opts.ghRepository.replace('https://', '');
  opts.ghRemote = `https://${opts.ghUser}:${opts.ghToken}@${opts.ghRemote}`;

  // validate
  if (opts.travis) {
    if (!process.env.TRAVIS) {
      console.log('Deploying is only available on Travis CI');
      process.exit();
    }
    if (process.env.TRAVIS_PULL_REQUEST !== 'false') {
      console.log('Deploying is not available in pull requests');
      process.exit();
    }
    if (process.env.TRAVIS_BRANCH !== 'master') {
      console.log('Deploying is only available for commits on master');
      process.exit();
    }
  }
  for (let prop in opts) {
    if (opts.hasOwnProperty(prop)) {
      if (typeof opts[prop] === 'undefined' || opts[prop] === '') {
        console.log(`Option '${prop}' is not defined`);
        process.exit();
      }
    }
  }

  // create deploy folder
  del.sync([`${opts.deployDir}**`]);
  fs.mkdirSync(opts.deployDir);

  // clone branch, commit and push changes
  git()
  .clone(opts.ghRepository, opts.deployDir)
  .exec(() => {
    git(opts.deployDir)
    .checkout(opts.branch)
    .addConfig('user.name', opts.gitName)
    .addConfig('user.email', opts.gitEmail)
    .exec(() => {
      fs.copySync(opts.sourceDir, opts.deployDir);
      git(opts.deployDir)
      .add('.')
      .commit(`Update ${opts.branch}`)
      .removeRemote('origin')
      .addRemote('origin', opts.ghRemote)
      .push('origin', opts.branch);
    });
  });
};