![Campaign Zero Logo](https://github.com/campaignzero/artwork/raw/master/logo/campaign-zero/web/306x128/campaign-zero.png "Campaign Zero Logo")

# Campaign Zero API 

[![Build Status](https://circleci.com/gh/campaignzero/api/tree/master.svg?style=shield)](https://circleci.com/gh/campaignzero/api/tree/master)  [![Known Vulnerabilities] (https://snyk.io/test/github/campaignzero/api/badge.svg)](https://snyk.io/test/github/campaignzero/api)  [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/campaignzero/api/master/LICENSE)  [![GitHub contributors](https://img.shields.io/github/contributors/campaignzero/api.svg)](https://github.com/campaignzero/api/graphs/contributors)

Campaign Zero was developed with contributions from activists, protesters and researchers across the nation. This [data-informed](http://www.joincampaignzero.org/problem) platform presents comprehensive solutions to end police violence in America. It integrates [community demands](http://thedemands.org) and policy recommendations from [research organizations](http://justiceinpolicing.com/) and the [President's Task Force on 21st Century Policing](http://www.cops.usdoj.gov/pdf/taskforce/TaskForce_FinalReport.pdf). Together, we will win.

#### Using our API:

[![API Documentation](https://peter.build/apiary-button.png)](http://docs.campaignzero.apiary.io) 

Table of Contents
---

* [Requirements](#requirements)
* [Getting Setup](#getting-setup)
* [Downloading API](#downloading-api)
* [Server Configuration](#server-configuration)
* [Elasticsearch Configuration](#elasticsearch-configuration)
* [Development Scripts](#development-scripts)
* [Unit Testing and Code Coverage Reports](#unit-testing-and-code-coverage-reports)
* [Maintaining API](#maintaining-api)


Requirements
---

**[⇧ back to top](#table-of-contents)**

* [NodeJS 6.x](https://nodejs.org/en/)
* [MySQL](http://www.mysql.com/)
* [Elasticsearch 2.4.x](https://www.elastic.co/)
* [Redis](http://redis.io/)
* [Bcrypt](http://bcrypt.sourceforge.net/)


Getting Setup
---

**[⇧ back to top](#table-of-contents)**

### Installing Requirements

#### OSX

It's recommended that you install and use [Homebrew](http://brew.sh/) for the system-level requirements for the project. Once you have it installed, you can run the following:

```bash
brew install node mysql elasticsearch bcrypt redis
```

#### Linux

Please use the requirement links above to review install instructions for each dependency.

#### NPM Packages

```bash
npm install -g mysql
npm install -g forever
npm install -g istanbul
npm install -g sequelize-cli
```

Downloading API
---

**[⇧ back to top](#table-of-contents)**

You can download this API using the code below ( this assumes you have [SSH integrated with Github](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/) ):

```bash
cd path/to/api
git clone git@github.com:campaignzero/api.git .
npm install
```

Server Configuration
---

**[⇧ back to top](#table-of-contents)**

This API requires a configuration file in the `./app/config/` folder based on the environment you are in.

You will need to set the API Environment via:

```bash
set API_NODE_ENV=local
```

__The supported environments are:__ ( FYI, you can download config file samples for local, staging & production below )

* [local](https://gist.github.com/manifestinteractive/7f43bd37a477ca115cb0057896304bbb)
* [staging](https://gist.github.com/manifestinteractive/78b30cec648748708a7f7d24c84607c1)
* [production](https://gist.github.com/manifestinteractive/2b4a061bcc2a68c349b0d50b579b8a50)

You can also use Environmental Variables rather than a config file, if that is easier by editing the `~/.bash_profile` file ( or whatever profile file you have ).

```bash
nano ~/.bash_profile
```

__API Environmental Variables:__

```bash
export API_API_DATABASE='CHANGE_ME';
export API_API_HOST='locahost';
export API_API_PASSWORD='CHANGE_ME';
export API_API_USERNAME='CHANGE_ME';
export API_API_VERSION='v1'
export API_APP_SECRET='CHANGE_ME';
export API_BUGSNAG='CHANGE_ME';
export API_DEBUG=true;
export API_DEBUG_KEY='CHANGE_ME7';
export API_ELASTIC_SEARCH='http://localhost:9200';
export API_HASH_ID_ALPHABET='BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz';
export API_HASH_ID_LENGTH=6;
export API_HASH_ID_SECRET='CHANGE_ME';
export API_INVITE_CAP=15;
export API_INVITE_ONLY=true;
export API_LOGZIO_DEBUG=true;
export API_LOGZIO_TOKEN='CHANGE_ME';
export API_LOGZIO_TYPE='CampaignZeroAPI';
export API_MANDRILL_API_KEY='CHANGE_ME';
export API_NODE_ENV='local';
export API_OPENSTATES_API_KEY='CHANGE_ME';
export API_PORT=5000;
export API_REDIS_HOST='127.0.0.1';
export API_REDIS_PORT=6379;
export API_REDIS_PASSWORD='CHANGE_ME';
export API_SESSION_KEY='CHANGE_ME';
```

You can use [https://guid.it](https://guid.it) to create random strings for stuff like Session Key's and App Secret's.

You will now need to apply these new Environmental Variables

```bash
source ~/.bash_profile
```

Now you can verify that your settings are applied correctly:

```bash
echo $API_NODE_ENV
```

Redis Configuration
---

**[⇧ back to top](#table-of-contents)**


__Start/Stop:__

You need Elasticsearch running, which you can do if you've Brew-installed it like this:

```bash
brew services start redis
brew services stop redis
```

On Linux you can run in like this ( assuming you installed the service ):

```bash
sudo systemctl start redis
sudo systemctl stop redis
```

Elasticsearch Configuration
---

**[⇧ back to top](#table-of-contents)**


__Start/Stop:__

You need Elasticsearch running, which you can do if you've Brew-installed it like this:

```bash
brew services start elasticsearch
brew services stop elasticsearch
```

On Linux you can run in like this ( assuming you installed the service ):

```bash
sudo service elasticsearch start
sudo service elasticsearch stop
```

__Manage:__

There are a number of commands to run to get your local Elasticsearch index set up and maintained.

To create the events index and mappings:

```bash
npm run elasticsearch:create
```

To delete the index:

```bash
npm run elasticsearch:delete
```

To update the index:

```bash
npm run elasticsearch:update
```


Development Scripts
---

**[⇧ back to top](#table-of-contents)**

API Development Scripts:

| command                        | description                                                                                         |
|--------------------------------|-----------------------------------------------------------------------------------------------------|
| `npm run help`                 | Generates List of NPM Scripts you can run                                                           |
| `npm run start`                | Runs API using `forever` service after running `npm run cleanup`                                    |
| `npm run start:debug`          | Starts the API in Debug Mode so you can see Console statements in terminal                          |
| `npm run stop`                 | Stop API when run from `npm start` using `forever`                                                  |
| `npm run cleanup`              | Remove files & folders generated by API that are not apart of the code base                         |
| `npm run docs`                 | Generate JSDoc Documentation                                                                        |
| `npm run docs:clean`           | Remove the JSDoc Documentation Folder in `./static/docs/`                                           |
| `npm run test`                 | Runs complete test suite of Linting, Unit Tests & Code Coverage Reports                             |
| `npm run lint`                 | Tests Javascript Code against Linting Rules                                                         |
| `npm run coverage`             | Generate Code Coverage Reports and Run Unit Tests                                                   |
| `npm run check-coverage`       | Check Coverage Reports against Minimum Requirements                                                 |
| `npm run migrate`              | Migrate to Latest Database Schema                                                                   |
| `npm run migrate:create  `     | Create new Migration Template file in `./app/seeders` folder                                        |
| `npm run migrate:rollback`     | Roll Back Migration Changes                                                                         |
| `npm run seed`                 | Run Seeders in `./app/seeders` folder                                                               |
| `npm run seed:create`          | Create new Seeder Template file in `./app/seeders` folder                                           |
| `npm run seed:rollback`        | Undo Seeders                                                                                        |
| `npm run elasticsearch:create` | Create Elasticsearch Indexes                                                                        |
| `npm run elasticsearch:update` | Update Elasticsearch Indexes                                                                        |
| `npm run elasticsearch:delete` | Delete Elasticsearch Indexes                                                                        |
| `npm run snyk-protect`         | Patches Security issues detected running via `npm run snyk-test`                                    |
| `npm run snyk-test`            | Checks for Known NPM Package Dependency Security Issues                                             |
| `npm run flatdb:download-all`  | Downloads All Flat Database Files used for API                                                      |
| `npm run flatdb:geo-city`      | Downloads and Unzips [GeoLite2 City](http://dev.maxmind.com/geoip/geoip2/geolite2/) from MaxMind    |
| `npm run flatdb:geo-country`   | Downloads and Unzips [GeoLite2 Country](http://dev.maxmind.com/geoip/geoip2/geolite2/) from MaxMind |
| `npm run make-config`          | Runs during `npm install` and downloads sample local.json file if one was not already created       |
| `npm run prepublish`           | Runs any commands necessary before publishing API                                                   |
| `npm run postinstall`          | This runs automatically after running `npm install`                                                 |

#### To see all scripts:

```
npm run help
```
#### to filter scripts:

```
npm run help [regex]
```


Unit Testing and Code Coverage Reports
---

**[⇧ back to top](#table-of-contents)**

#### Unit Tests

Testing is run with [MochaJS](https://mochajs.org/) and uses [ChaiJS](http://chaijs.com/) [assert](http://chaijs.com/api/assert/). All unit tests should go under the `test/` directory and should be named to match up with files in `app/`.

To run unit tests, run:

```bash
npm test
```

#### Code Coverage

This will also generate code coverage reports in `./coverage/`.  Unit Tests will automatically fail if Code Coverage reports fall below the following thresholds:

* Statements: 70% 
* Branches: 70%
* Functions: 70% 
* Lines: 70%

#### JSDoc Documentation

Documentation is automatically generates everytime you run `npm start` and can be accessed via http://127.0.0.1:5000/docs/.  


Maintaining API
---

**[⇧ back to top](#table-of-contents)**

This project uses `npm shrinkwrap` to lock down dependencies so we're better guarded against breaking changes to public packages. If you need to add or update a dependency, in addition updating `package.json` you'll also need to run the following:

```bash
npm prune             # Remove locally installed pacakges not in packages.json
npm dedupe            # Deduplicate child dependencies to minimize copies
npm shrinkwrap --dev  # Update our npm-shrinkwrap.json
```

Verify that the updated shrinkwrap file doesn't incorporate unexpected changes, primarily watching out for changes to versions in child packages. Changes can result in some unfortunately large diffs, so generally your best bet is to only add/update a single dependency at a time and ensure it gets its own commit so tools like `git bisect` can work their magic to surface bugs and regressions.

**NOTE: When using a dependency installed directly off GitHub, shrinkwrap requires a SHA:**

```bash
npm install --save git://github.com/mysqljs/mysql.git#a0f2cec26ee86536dbc1c2837b92b191ca9618f1
```