# thehelp-client-project

Developing client-side javascript with [`requirejs`](http://requirejs.org/) and testing with [`mocha`](http://visionmedia.github.io/mocha/)? This easy-to-set-up library will streamline your project automation.

## Features

* [`connect`](https://github.com/gruntjs/grunt-contrib-connect) task to serve static files on localhost instead of `file:/` URLs, which have different security settings
* [`grunt-mocha`](https://github.com/kmiyashiro/grunt-mocha) to run your _client-side_ `mocha` tests on the command-line via [`phantomjs`](http://phantomjs.org/)
* [`grunt-requirejs`](https://github.com/asciidisco/grunt-requirejs) to concatenate and optimize your AMD-style modules into production javascript files.

## Setup

First, install the project (and its friend, [`thehelp-project`](https://github.com/thehelp/project)) as dev dependencies:

```
npm install thehelp-project thehelp-client-project --save-dev
```

If you're new to `thehelp-project`, it would be good to read [its docs](https://github.com/thehelp/project) first. Then make sure you have the grunt command available:

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

### Optimize

These methods give you two easier methods to generate concatenated, optimized javascript files via `requirejs`:

* `registerOptimize()` - Generates a concatenated, optimized file based on AMD modules.
* `registerOptimizeLibrary()` - Generates both minified and non-minified concatenated javascript files. Best-suited for generating a library for consumption by others.

This will generate a single, optimized file named 'home.js' under 'dist/js' which does not need `requirejs` on the page to run, as well as source maps:

```javascript
config.registerOptimize({
  source: 'src/client/home',
  target: 'dist/js/home_standalone.js',
  standalone: true,
  config: { // these are the options piped directly into requirejs
    baseUrl: './',
    paths: {
      backbone: 'lib/vendor/backbone',
      underscore: 'lib/vendor/underscore'
    }
  }
})
```

Or, you can generate a file which isn't standalone. Anything in the `empty` array will not be included in the final file. When your code runs it will still need those packages, so those components must be provided by other files on the page.

```javascript
config.registerOptimize({
  source: 'src/client/home',
  target: 'dist/js/home.js',
  empty: ['util', 'winston'],
  config: {
    baseUrl: './',
    paths: {
      backbone: 'lib/vendor/backbone',
      underscore: 'lib/vendor/underscore'
    }
  }
})
```

`registerOptimizeLibrary` will generate four separate requirejs sub-tasks...

```javascript
config.registerOptimizeLibrary({
  source: 'src/library',
  target: 'library-name',
  targetPath: 'dist/js',
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

...resulting in four files:

* dist/js/library-name.js
* dist/js/library-name.min.js
* dist/js/standalone/library-name.js
* dist/js/standalone/library-name.min.js

The first two files require you to provide a module loader like [`almond.js`](https://github.com/jrburke/almond) or `requirejs`. The second two include `almond.js` and can therefore be used with nothing else on the page.

For more information on requirejs configuration see the integration test included in this project (under 'test/default'), and the `requirejs` documentation:

* [`requirejs` optimization documentation](http://requirejs.org/docs/optimization.html)
* [`requirejs` complete example configuration](https://github.com/jrburke/r.js/blob/master/build/example.build.js)
* [`grunt-requirejs` documentation](https://github.com/asciidisco/grunt-requirejs)

### Test

Another two methods make it easy to automate your client-side testing.

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

_Note: the registered `connect:test` task runs the server on port 3001. The `connect:keepalive` task is useful for manual browser-based debugging, and runs on port 3000. This is so you can run grunt test runs while also keeping a server up for your browser-based testing._

## History

### 0.3.0 (2014-08-28)

* Breaking: removed `registerCopyFromDist()` and `registerCopyFromBower()`; no real need to copy into local repo. Will do it on a case-by-case basis when a project requires a build step.
* Breaking: `registerOptimize()` parameter names made more friendly `name`->`source`, `outName`->`target`, `basePath`->`targetPath`
* Documentation updates
* Update `thehelp-project` dev dependency
* Remove `blanket` dev dependency and configuration; we weren't really using it
* Remove `thehelp-test` (circular) dev dependency, add `sinon` and `chai` as replacements

### 0.2.0 (2014-06-25)

* `registerOptimizeLibrary()` turns off source maps, since they're really big
* Minor version update: `grunt-contrib-connect`
* Update dev dependencies

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
