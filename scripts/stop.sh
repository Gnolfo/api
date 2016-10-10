#!/bin/bash

source ./scripts/common.sh

__make_header "Stopping API Server"

forever stop -w --minUptime 1000 --spinSleepTime 1000 -m 1 -l web-server.log -o ./web-server-stdout.log -e ./web-server-stderr.log index.js

echo " "

read -p "STOP MYSQL ? Y/n: " STOP_MYSQL
if [[ $STOP_MYSQL =~ ^[Yy]$ ]]; then

  echo " "

  __output "Stopping MySQL ..."

  # Check for OSX
  which -s mysql.server
  if [[ $? == 0 ]] ; then
    mysql.server stop
  else
    # Check for Linux
    which -s mysqld
    if [[ $? == 0 ]] ; then
       sudo service mysqld stop
    fi
  fi
fi

echo " "

read -p "STOP ELASTICSEARCH ? Y/n: " STOP_ELASTICSEARCH
if [[ $STOP_ELASTICSEARCH =~ ^[Yy]$ ]]; then

  echo " "

  __output "Stopping Elasticsearch ..."

  # Check for OSX
  which -s launchctl
  if [[ $? == 0 ]] ; then
    launchctl unload ~/Library/LaunchAgents/homebrew.mxcl.elasticsearch.plist
  fi

  # Check for Linux
  which -s service
  if [[ $? == 0 ]] ; then
     sudo service elasticsearch stop
  fi
fi
