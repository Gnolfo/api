#!/bin/bash

source ./scripts/common.sh

__make_header "Updating API Server"

git fetch && git pull
rm -fr node_modules
npm install
