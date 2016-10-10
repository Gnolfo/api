#!/bin/bash

source ./scripts/common.sh

__make_header "Post Installation"

__notice "ATTENTION:"

echo "This API requires a MySQL Database to work. If you need to create one, you can do that now."
echo " "

read -p "CREATE DATABASE ? Y/n: " -n 1 -r
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
 echo " "
  echo " "
  __notice "SKIPPING DATABASE CREATION"
else
  echo " "
  echo " "

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

  __success "CREATING DATABASE"

  DB_HOST='localhost'
  DB_NAME='api_database'
  DB_USER='root'
  DB_PASS=''

  read -p "Database Host [${DB_HOST}]: " READ_DB_HOST
  if [[ "$READ_DB_HOST" ]]; then
    DB_HOST=$READ_DB_HOST
  fi

  read -p "Database Name [${DB_NAME}]: " READ_DB_NAME
  if [[ "$READ_DB_NAME" ]]; then
    DB_NAME=$READ_DB_NAME
  fi

  read -p "Database Username [${DB_USER}]: " READ_DB_USER
  if [[ "$READ_DB_USER" ]]; then
    DB_USER=$READ_DB_USER
  fi

  read -p "Database Password [${DB_PASS}]: " READ_DB_PASS
  if [[ "$READ_DB_PASS" ]]; then
    DB_PASS=$READ_DB_PASS
  fi

  EXPECTED_ARGS=3
  E_BADARGS=65
  MYSQL=`which mysql`

  echo " "

  __output "Creating Database ( if it does not exist ) ..."

  Q1="CREATE DATABASE IF NOT EXISTS ${DB_NAME}; "
  Q2="GRANT USAGE ON *.* TO ${DB_USER}@${DB_HOST} IDENTIFIED BY ''; "
  Q3="GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO ${DB_USER}@${DB_HOST}; "
  Q4="FLUSH PRIVILEGES;"
  SQL="${Q1}${Q2}${Q3}${Q4}"

  $MYSQL -uroot -e "$SQL"

  echo " "
fi