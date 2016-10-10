#!/bin/bash

source ./scripts/common.sh

__make_header "Starting Tests"

./node_modules/jshint/bin/jshint --reporter=node_modules/jshint-stylish .
NODE_ENV=test mocha $(find ./test/ -name '*_test.js') --require test/bootstrap
