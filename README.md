# thehelp-client-project

Developing client-side javascript with [`requirejs`](http://requirejs.org/) and testing with [`mocha`](http://visionmedia.github.io/mocha/)? This library will help you streamline some of your project automation.

## Features

* [`connect`](https://github.com/gruntjs/grunt-contrib-connect) task to support loading your libraries on localhost instead of `file:/` URLs, which have different security settings
* [`grunt-mocha`](https://github.com/kmiyashiro/grunt-mocha) to run your _client-side_ `mocha` tests on the command-line via [`phantomjs`](http://phantomjs.org/)
* [`grunt-requirejs`](https://github.com/asciidisco/grunt-requirejs) to concatenate and optimize your `requirejs`/AMD-style code into production javascript files.
* Convenience methods to copy files from your `bower_components/` and node modules' `dist/` directories

## Setup

First, install the project (and its friend, `thehelp-project`) as dev dependencies:

```
npm install thehelp-project thehelp-client-project --save-dev
```

If you're new to [`thehelp-project`](https://github.com/thehelp/project), it would be good to read its docs first. Then make sure you have the grunt command available:

```
npm install -g grunt-cli
```

## Your Gruntfile

This is the place to start with your Gruntfile:

```javascript
var GruntConfig = require('thehelp-project').GruntConfig;
require('thehelp-client-project').mixin(GruntConfig);

module.exports = function(grunt) {
  var config = new GruntConfig(grunt);

  config.standardSetup();
  config.standardDefault();
};
```

## Usage

### Setup

Two methods are provided to help set your project up:

* `registerCopyFromBower()` - Copies the primary js files from installed bower modules to 'lib/vendor'
* `registerCopyFromDist()` - Copies the contents of node modules' 'dist/' folder to 'lib/vendor'

For example, in your Gruntfile you could do this to create a 'setup' task using both of these:

```javascript
config.registerCopyFromBower();
config.registerCopyFromDist({
  modules: ['thehelp-core', 'thehelp-test']
});
grunt.registerTask('setup', 'copy:from-bower', 'copy:from-dist');
```

### Optimize

Another two methods help simplify your

* `registerOptimize()` - Generates a concatenated, optimized based on AMD modules.
* `registerOptimizeLibrary()` - Generates both minified and non-minified concatenated javascript files.Best-suited for generating a library for consumption by others.

This will generate a single, optimized file named 'home.js' under 'dist/js' which does not need `requirejs` on the page to run:

```javascript
config.registerOptimize({
  name: 'src/client/home',
  outName: 'dist/js/home',
  standalone: true,
  config: {
    baseUrl: './',
    paths: {
      backbone: 'lib/vendor/backbone',
      underscore: 'lib/vendor/underscore'
    }
  }
})
```

For more information on requirejs configuration:

* [`requirejs` optimization documentation](http://requirejs.org/docs/optimization.html)
* [`requirejs` complete example configuration](https://github.com/jrburke/r.js/blob/master/build/example.build.js)
* [`grunt-requirejs` documentation](https://github.com/asciidisco/grunt-requirejs)

### Test

Finally, two methods are available to make it easy to automate your client-side testing.

* `registerConnect()` - Sets up a static file server for testing things on the client (called by `standardSetup()` so most of the time you won't call this directly)
* `registerMocha()` - Uses phantomjs to run mocha tests inside a headless browser.

This is how you might create a 'client-test' task which runs your tests against both your development (using `requirejs`) and fully optimized standalone files:

```javascript
config.registerMocha({
  urls: [
    'http://localhost:3001/test/integration/dev.html',
    'http://localhost:3001/test/integration/dist.html'
  ]
});
grunt.registerTask('client-test', ['connect:test', 'mocha']);
```

The default configuration expects that your tests will start whenever they are ready, and will pipe all console output in the browser to the command line. Take a look at the [`grunt-mocha` documentation](https://github.com/kmiyashiro/grunt-mocha) to get into the details.

## History

### 0.1.0 (2014-06-07)

* Six core functions available:
  * `registerConnect()`
  * `registerMocha()`
  * `registerOptimize()`
  * `registerOptimizeLibrary()`
  * `registerCopyFromBower()`
  * `registerCopyFromDist()`

## License

(The MIT License)

Copyright (c) 2013 Scott Nonnenberg &lt;scott@nonnenberg.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
