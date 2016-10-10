#!/bin/bash

source ./scripts/common.sh

__make_header "Starting API Server"

__output "Terminating any existing apps running on port 5050 ..."

lsof -i TCP:5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

__output "Removing old log files ..."

rm ~/.forever/web-server.log 2> /dev/null &
rm web-server-stdout.log 2> /dev/null &
rm web-server-stderr.log 2> /dev/null &

__output "Starting Web Server ..."

forever start -w --minUptime 1000 --spinSleepTime 1000 -m 1 -l web-server.log -o ./web-server-stdout.log -e ./web-server-stderr.log index.js

__output "Starting MySQL ..."

# Check for OSX
which -s mysql.server
if [[ $? == 0 ]] ; then
  mysql.server start
else
  # Check for Linux
  which -s mysqld
  if [[ $? == 0 ]] ; then
     sudo service mysqld start
  fi
fi

__output "Starting Elasticsearch ..."

# Check for OSX
which -s launchctl
if [[ $? == 0 ]] ; then
  launchctl load ~/Library/LaunchAgents/homebrew.mxcl.elasticsearch.plist
fi

# Check for Linux
which -s service
if [[ $? == 0 ]] ; then
   sudo service elasticsearch start
fi

__output "Waiting 10 seconds for Server to finish starting ..."

sleep 10s

cd ./app

__output "Migrate Database Tables ..."

sequelize db:migrate

__output "Seeding Database ..."

sequelize db:seed:all

__output "Deleting Elasticsearch Indexes ..."

node ./elasticsearch/delete

__output "Creating Elasticsearch Indexes ..."

node ./elasticsearch/create

__output "Updating Elasticsearch Indexes ..."

node ./elasticsearch/update
