# Campaign Zero API

NodeJS application serving the needs of the Campaign Zero Applications.

Table of Contents
---

* [Requirements](#requirements)
* [Getting Setup](#getting-setup)
* [Downloading API](#downloading-api)
* [Server Configuration](#server-configuration)
* [Database Configuration](#database-configuration)
* [Elasticsearch Configuration](#database-configuration)
* [Starting API](#starting-api)
* [Unit Testing](#unit-testing)
* [Remote Mobile Testing](#remote-mobile-testing)

Requirements
---

**[⇧ back to top](#table-of-contents)**

* [NodeJS 6.x](https://nodejs.org/en/)
* [mysql](http://www.mysql.com/)
* [Elasticsearch](https://www.elastic.co/)
* [Bcrypt](http://bcrypt.sourceforge.net/)


Getting Setup
---

**[⇧ back to top](#table-of-contents)**

### Installing Requirements

#### OSX

It's recommended that you install and use [Homebrew](http://brew.sh/) for the system-level requirements for the project. Once you have it installed, you can run the following:

```bash
brew install node mysql elasticsearch bcrypt
```

#### Linux

Please use the requirement links above to review install instructions for each dependency.


Downloading API
---

**[⇧ back to top](#table-of-contents)**

You can download this API using the code below ( this assumes you have [SSH integrated with Github](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/) ):

```bash
cd path/to/api
git clone git@github.com:api/api.git .
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

__The supported environments are:__ ( FYI, you can download the config files for local & remote below )

* [local](https://gist.githubusercontent.com/manifestinteractive/6b4346b9cf3442226c65/raw/7c1b28bd4d3ff91a8654bc038e0e9421c949895b/local.json)
* staging
* production

You can also use Environmental Variables rather than a config file, if that is easier by editing the `~/.bash_profile` file ( or whatever profile file you have ).

```bash
nano ~/.bash_profile
```

__API Environmental Variables:__

```bash
export API_DEBUG=true;
export API_NODE_ENV='local';
export API_PORT=5000;
export API_API_VERSION='0.1';
export API_SESSION_KEY='CHANGE_ME';
export API_BUGSNAG='CHANGE_ME';
export API_API_HOST='locahost';
export API_API_DATABASE='CHANGE_ME';
export API_API_USERNAME='CHANGE_ME';
export API_API_PASSWORD='CHANGE_ME';
export API_APP_SECRET='CHANGE_ME';
export API_SENTRY_DSN='';
export API_ELASTIC_SEARCH='http://localhost:9200';
export API_MANDRILL_API_KEY='';
```

You will now need to apply these new Environmental Variables

```bash
source ~/.bash_profile
```

Now you can verify that your settings are applied correctly:

```bash
echo $API_NODE_ENV
```

Database Configuration
---

**[⇧ back to top](#table-of-contents)**

For new installs you will need to run the following command ( assuming your env is local and you have already downloaded and updated the local.json file ):

```bash
set API_NODE_ENV=local && sequelize db:seed --config config/local.json
```

If you get a error stating `command not found: sequelize` run the following:

```bash
npm install -g sequelize-cli
```

__Advanced Options:__ ( You will likely node need the following unless you are managing the database )

You can run the following DB Migrations to automatically manage API Migrations:

```bash
sequelize db:migrate        # Run pending migrations.
sequelize db:migrate:undo   # Revert the last migration run.
sequelize help              # Display this help text.
sequelize init              # Initializes the project.
sequelize migration:create  # Generates a new migration file.
sequelize version           # Prints the version number.
```

Before you can use Migrations, you will first need to initialize the project ( you will only need to do this once per install ).

```bash
cd ./app
sequelize init
```

To update the API to the latest and greatest, all you need to do is run:

```bash
cd ./app
sequelize db:migrate
```

Screw something up with that migration? Just undo it:

```bash
cd ./app
sequelize db:migrate:undo
```

Need to create a new migration?

```bash
cd ./app
sequelize migration:create
```


Elasticsearch Configuration
---

**[⇧ back to top](#table-of-contents)**

__Configure:__

Before starting Elasticsearch, you need to configure it.

Look for a file named `elasticsearch.yml`.  If you are running on OSX, this file is likely located in
`/usr/local/Cellar/elasticsearch/1.7.1/config`.  On Linux, the file is located at `/etc/elasticsearch/elasticsearch.yml`

Your version number might not be `1.7.1`, you can get your version number by running `elasticsearch -v`

Add the following setting at the bottom of the `elasticsearch.yml` file:

```yaml
script.groovy.sandbox.enabled: true
```

__Start:__

You need Elasticsearch running, which you can do if you've Brew-installed it like this:

```bash
elasticsearch
```

On Linux you can run in like this ( assuming you installed the service ):

```bash
sudo service elasticsearch start
```

__Manage:__

The API is fueled solely by the data indexed in Elasticsearch. There are a number of commands to run to get your local Elasticsearch index set up.

To create the events index and mappings:

```bash
node ./app/elasticsearch/create
```

To delete the index:

```bash
node ./app/elasticsearch/delete
```

To update the index:

```bash
node ./app/elasticsearch/update
```

This script will query your database and import all events, nesting their location information, being careful only to index events past the highest event `id` present in the index.


Starting API
---

**[⇧ back to top](#table-of-contents)**

Once you have everything configured required for this API, you can finally start it.

Run the following to start the API:

```bash
npm start
```

Unit Testing
---

**[⇧ back to top](#table-of-contents)**

Testing is run with [MochaJS](https://mochajs.org/) and uses [ChaiJS](http://chaijs.com/) [assert](http://chaijs.com/api/assert/). All unit tests should go under the `test/` directory and should be named to match up with files in `app/`.

To run unit tests, run:

```bash
npm test
```

npm Dependencies and Shrinkwrap
---

This project uses `npm shrinkwrap` to lock down dependencies so we're better guarded against breaking changes to public packages. If you need to add or update a dependency, in addition updating `package.json` you'll also need to run the following:

```bash
npm prune             # Remove locally installed pacakges not in packages.json
npm dedupe            # Deduplicate child dependencies to minimize copies
npm shrinkwrap --dev  # Update our npm-shrinkwrap.json
```

Verify that the updated shrinkwrap file doesn't incorporate unexpected changes, primarily watching out for changes to versions in child packages. Changes can result in some unfortunately large diffs, so generally your best bet is to only add/update a single dependency at a time and ensure it gets its own commit so tools like `git bisect` can work their magic to surface bugs and regressions.

**NOTE: When using a dependency installed directly off GitHub, shrinkwrap requires a SHA:**

```bash
npm install --save git://github.com/angulartics/angulartics-scroll.git#00167dc1bfa28213f88d8cc3578bb3dc50843309
