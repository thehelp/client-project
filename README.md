# thehelp-client-project

Developing client-side javascript with [`requirejs`](http://requirejs.org/) and testing with [`mocha`](http://visionmedia.github.io/mocha/)? This easy-to-set-up library will streamline your project automation.

## Features

* [`connect`](https://github.com/gruntjs/grunt-contrib-connect) task to serve static files on localhost instead of `file:/` URLs, which have different security settings
* [`grunt-mocha`](https://github.com/kmiyashiro/grunt-mocha) to run your _client-side_ `mocha` tests on the command-line via [`phantomjs`](http://phantomjs.org/)
* [`grunt-requirejs`](https://github.com/asciidisco/grunt-requirejs) to concatenate and optimize your AMD-style modules into production javascript files.
* [`grunt-saucelabs`](https://github.com/axemclion/grunt-saucelabs) to run tests on multiple browsers via [Sauce Labs](https://saucelabs.com)
* 'preamble-for-dist' task to add version number, author, and license information into final distrubition files

## Setup

First, install the project (and its friend, [`thehelp-project`](https://github.com/thehelp/project)) as dev dependencies:

```bash
npm install thehelp-project thehelp-client-project --save-dev
```

If you're new to `thehelp-project`, it would be good to read [its docs](https://github.com/thehelp/project) first. Then make sure you have the grunt command available:

```bash
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

### Add Preamble

Now that you've generated some concatenated and/or optimized files for distribution, you probably want to make sure that people know where the files came from:

```javascript
config.registerPreambleForDist();
config.registerTask('dist', ['requirejs', 'preamble-for-dist']);
```

Elements from your package.json will be injected into javascript files under your dist subdirectory. It will also look for a file LICENSE.txt in your project's root directory to include. And you can add comments to various subsets of your dist files with `options.comments`. More options and details are available at [the detailed documentation.](http://thehelp.github.io/client-project/src/server/mixin.html)

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

### Test on multiple browsers

To get your tests running on multiple browers via the Sauce Labs service, first set two environment variables with information about your account. `thehelp-project` prefers to put them in 'env.json' in your project's root directory:

```json
{
  "SAUCE_USERNAME": "your_username",
  "SAUCE_ACCESS_KEY": "your_key"
}
```

It's likely that you don't want to deploy your files to a publically-accessible server every new build for Sauce Labs, so they've provided [Sauce Labs Connect](https://docs.saucelabs.com/reference/sauce-connect/). It opens a secure tunnel to your machine, giving their services access to ports on your machine. Yes, they take security seriously - they get into the details on the download page.

Once you've got those two things in place, a lot of defaults have been provided for you. This will set things up to run on a minimum set of browsers with reasonable coverage:

```javascript
config.registerSauce({
  urls: [
    'http://localhost:3001/test/integration/dist.html'
  ]
});
grunt.registerTask('cross-browser', ['connect:test', 'sauce']);
```

Various browser subsets are available via `config.saucePlatforms`: `iOS`, `chrome`,
`internetExplorer`, etc. [(complete list of browser subsets).](http://thehelp.github.io/client-project/src/server/sauce_platforms.html) Just set the `browsers` key of the `options` you pass to `registerSauce()`. Check out the additional configuration available at the...

## Detailed Documentation

Detailed docs be found at this project's GitHub Pages, thanks to `groc`: [http://thehelp.github.io/client-project/src/server/mixin.html](http://thehelp.github.io/client-project/src/server/mixin.html)

## License

(The MIT License)

Copyright (c) 2014 Scott Nonnenberg &lt;scott@nonnenberg.com&gt;

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
