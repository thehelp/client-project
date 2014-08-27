set -e

npm install
bower install
grunt
grunt dist
grunt client-test
