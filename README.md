# Git Branch Deploy

A Node.js tool to deploy build artifacts to a GitHub branch using a Git commit.

## Installation

```bash
$ npm i @julmot/git-branch-deploy
```

## Deployment

```javascript
const deploy = require('@julmot/git-branch-deploy');

deploy({
  branch: 'website', // Name of the target branch
  sourceDir: `${__dirname}/library/`, // Folder where the build artifacts are located
  deployDir: `${__dirname}/deploy/`, // Build folder where the GitHub repository can be cloned to
  gitName: process.env.GIT_USER_NAME, // The name that should appear in the Git commit
  gitEmail: process.env.GIT_USER_EMAIL, // The e-mail address to use in the Git commit
  ghRepository: process.env.GITHUB_REPOSITORY, // The GitHub repository URL, e.g. https://github.com/julmot/git-branch-deploy
  ghUser: process.env.GITHUB_USERNAME, // The GitHub username of the account with which the commit should be pushed
  ghToken: process.env.GITHUB_TOKEN, // A GitHub private access key of the account with which the commit should be pushed
  travis: true // Makes sure the deployment only succeeds when running on Travis CI
});
```

The above mentioned values are the default values, except:

* `branch`
* `sourceDir`
* `deployDir`

which must be provided (no default values). So, the minimal example would be:

```javascript
deploy({
  branch: 'website',
  sourceDir: `${__dirname}/library/`,
  deployDir: `${__dirname}/deploy/`
});
```

__NOTE__: Make sure that the target branch in the repository exists on GitHub. To create an empty branch you can use [these instructions](https://stackoverflow.com/a/13969482/3894981).