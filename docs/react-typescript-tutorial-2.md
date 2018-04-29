Setting up your TypeScript Project: 4 Different Approaches
==========================================================

Welcome to Part 2 of this series! Here we will go on a grand tour of the JavaScript tools ecosystem. This part is not about React (we'll get to that in Part 3) but it does include a simple React component. [Part 1](index.md) was a summary of the JavaScript Ecosystem.

Since this is a **grand** tour, we'll talk about writing your app in four different ways:

- A. The Easiest Way (with Parcel)
- B. The Way of Fewest Tools (a.k.a. the do-it-yourself way)
- C. The Webpack way
- D. The Gulp way

At the end of this guide there will be a quick summary to help you set up new projects faster. 

The more things change, the more they stay the same
---------------------------------------------------

The first six steps are the same in all four approaches, so let's get started!

### Step 1: Install Node.js (with npm) ###

If you haven't yet, go [install Node.js](https://nodejs.org/en/download/) which will also install the command-line package manager, `npm`. (If you want to deploy your app on some other web server, I recommend worrying about how to do that later.)

### Step 2: Install Visual Studio Code or other editor (optional) ###

One of the main reasons to use TypeScript instead of JavaScript is that it supports code completion features (also known as IntelliSense).

To enjoy this benefit, you'll need to edit your TypeScript `.ts` files in a compatible editor such as [Visual Studio Code](https://code.visualstudio.com/download) - which is free and multiplatform. It's also the most popular text editor for JavaScript apps ([alternatives](https://stateofjs.com/2017/other-tools/) include Atom and Sublime Text.)

Visual Studio Code is folder-oriented: you open a folder in VS Code and that folder will be treated like the current "project". During installation (on Windows, anyway) it will offer a checkbox to add an "Open with Code" action for folders (directories). I recommend using that option as an easy way to start VS Code from any folder:

![](screenshot-vscode-setup.png)

Create an empty folder for your app, then open that folder in VS Code. Notice that VS Code has a built-in terminal so you won't need a separate terminal window.

### Step 3: Set up your package.json ###

The `package.json` file will represent your project configuration (including its name, build commands, the list of npm modules used by your project, and more).

If you haven't done so yet, create an empty folder for your app and open a terminal window in that folder.

In the terminal, run `npm init`. `npm init` will ask you some questions in order to produce `package.json`.

I wanted to make a small educational app to draw some graphs demonstrating how climate science explains the 20th century temperature record. So I called my app climate-app:

~~~
C:\Dev\climate-app>npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.
[....]

package name: (climate-app)
version: (1.0.0)
description: Demo to visualize climate data
entry point: (index.js) 
test command:
git repository:
keywords:
author: David Piepgrass
license: (ISC) MIT

About to write to C:\Dev\climate-app\package.json:
{
  "name": "climate-app",
  "version": "1.0.0",
  "description": "Demo to visualize climate data",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "David Piepgrass",
  "license": "MIT"
}

Is this ok? (yes)
~~~

Notice the reference to `index.js`. Oddly, this file does not need to exist and we won't be using it. I assume it has to do with sharing libraries via `npm`, but we're writing an app, not a library.

### Step 4: Install Typescript ###

VS Code [reportedly](https://code.visualstudio.com/docs/languages/typescript) has TypeScript "language support" rather than a TypeScript *compiler*, so now we need to install the compiler.

There are two ways to install TypeScript with npm. Either use

    npm install --global typescript

or 

    npm install --save-dev typescript

If you use the `--global` option then the TypeScript compiler `tsc` will be available in all projects on the same machine and it will be available as a terminal command, but it will not be added to your package.json file. Therefore, if you share your code with others, TypeScript will **not** be installed when another person gets your code and runs `npm install`.

If you use `--save-dev`, TypeScript will be added to `package.json` and installed in your project's `node_modules` folder (current size: 34.2 MB), but it will **not** be available directly as a terminal command, although you can still run it from the terminal as `./node_modules/.bin/tsc`, and you can still use `tsc` inside the `npm` `"scripts"` section of `package.json`.

**Fun fact**: the TypeScript compiler is multiplatform because it is written in TypeScript (and compiled to JavaScript).

### Step 5: Install React or Preact ###

To add React to your project:

    npm install react react-dom
    npm install --save-dev @types/react @types/react-dom

Alternately you can use Preact, which is [almost the same](https://preactjs.com/guide/differences-to-react) and more than 10 times smaller than React. Preact includes its own TypeScript type definitions, so you only need a single command to install it:

    npm install preact

**Note**: do not to install `preact` and `@types/react` in the same project, or `tsc` will go insane and give you about 150 errors (see [preact issue #639](https://github.com/developit/preact/issues/639)). If this happens, uninstall the React types with `npm uninstall @types/react @types/react-dom`

### Step 6: Write some React code ###

Make a file called `app.tsx` with this small React program:

~~~tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';

class App extends React.Component<{greeting: string}, {count:number}> {
  constructor(props) {
    super(props);
    this.state = {count: 0};
  }
  render() {
      return (
          <div>
              <h2>{this.props.greeting}</h2>
              <button onClick={() => this.setState({count: this.state.count+1})}>
                This button has been clicked {this.state.count} times.
              </button>
          </div>);
  }
}

ReactDOM.render(
  <App greeting="Hello, world!"/>,
  document.getElementById('app')
);
~~~

**Note:** in order for the embedded JSX (HTML/XML) to work, the file extension must be `tsx`, not `ts`. If you have any trouble making your code work, try this code instead, it's the simplest possible React program:

~~~tsx
import * as ReactDOM from 'react-dom';
import * as React from 'react';

ReactDOM.render(React.createElement("h2", null, "Hello, world!"), document.body);
~~~

We'll discuss how the code works later; for now let's focus on making it run.

If you're using preact, change the first two lines like so:

~~~ts
import * as React from 'preact';
import * as ReactDOM from 'preact';
~~~

Some notes about Preact:

- There is a [preact-compat library](https://github.com/developit/preact-compat) which allows you to use preact with zero changes to your React code, but usage instructions exist only for users of Webpack/Browserify/Babel/Brunch.
- There are rumors that in Preact you should write `/** @jsx h */` at the top of the file, which tells TypeScript to call `h()` instead of the default `React.createElement`. Here you **must not** do that or you'll get a runtime error that `h` is not defined (`React.h`, however, is defined). In fact Preact defines `createElement` as an alias for `h`, and since our `import` statement assigns `'preact'` to `React`, `React.createElement` exists and works just fine.

Running your project, Approach A: The Easy Way
----------------------------------------------

I discovered Parcel when I was about two-thirds done writing this article. Honestly, if I knew about Parcel from the beginning I might not have bothered writing about Approaches #2, #3 and #4. Don't get me started on how easy Parcel is! It deserves a damn medal!

In fact I've been fibbing to you. Parcel is so easy, you don't even need all six steps above! You only really need Steps 1, 2 and 6 (install Node, install an editor and write some code) and Parcel will do steps 3, 4, and 5 for you automatically.

All we have to do now is to create an `index.html` file that refers to our `app.tsx` file, like this:

~~~html
<!DOCTYPE html>
<html>
<head>
  <title>App</title>
  <meta charset="utf-8"/>
</head>
<body>
  <h1>Mini React app ❤</h1>
  <div id="app"></div>
  <script src="app.tsx"></script>
</body>
</html>
~~~

This can't run directly in a browser, of course, so Parcel

1. Automatically compiles app.tsx
2. Installs React or Preact because it notices that you're using it
3. Bundles your app with its dependencies into a single file called `app.dd451710.js` (or another funny name)
4. Creates a modified index.html that refers to the compiled app
5. Puts these new files in a folder called `dist`.

Then Parcel does everything else for you:

1. It runs your app on a mini web server at [http://127.0.0.1:1234](http://127.0.0.1:1234).
2. It watches for changes to your code (app.tsx and index.html) and recompiles when you change them.
3. As if that wasn't enough, when your files change, it will send a command to your web browser to **automatically refresh it!** 
4. Even better, it updates the page without fully reloading it using its [Hot Module Replacement](https://parceljs.org/hmr.html) feature.

It is challenging to set up a conventional build that does all of these things; in this tutorial I will only cover how to do #1 and #2 in a conventional build.

To learn about more features of Parcel, have a look at the [Parcel documentation](https://parceljs.org/getting_started.html). 

Running your project, Approach A: The Easy Way
----------------------------------------------


Let's get our development environment up and running! We will be creating a folder with the following files inside:

  - package.json
  - tsconfig.json
  - server.js
  - app/index.html
  - app/app.ts

The `app` folder contains the code of our front end.

In addition, TypeScript will compile `app.ts` to `app.js` and `app.js.map`, while `npm` creates a folder called `node_modules` and a file called `package-lock.json` (I can't imagine why it's called "lock", but [this page explains why it exists](https://medium.com/@Quigley_Ja/everything-you-wanted-to-know-about-package-lock-json-b81911aa8ab8).)


Step 7: Create tsconfig.json and build command
----------------------------------------------

Create a text file called `tsconfig.json` and put this code in it:

~~~json
{   // TypeScript configuration file: provides options to the TypeScript 
    // compiler (tsc) and makes VSCode recognize this folder as a TS project,
    // enabling the VSCode build tasks "tsc: build" and "tsc: watch".
    "compilerOptions": {
        "target": "es5",            // Compatible with older browsers
        "module": "umd",            // Compatible with both Node.js and browser
        "moduleResolution": "node", // Tell tsc to look in node_modules for modules
        "sourceMap": true,          // Creates *.js.map files
        "jsx": "react",             // Causes inline XML (JSX code) to be expanded
    },
    "include": ["**/*.ts", "**/*.tsx"],
    "exclude": ["node_modules"]
}
~~~

This file marks the folder as a TypeScript project and enables build commands in VSCode with Ctrl+Shift+B (the "tsc: watch" command is useful - it will automatically recompile your code whenever you save it.) **Silly fact**: `tsc` allows comments in json files but `npm` does not. 

This file is very important because if the settings aren't right, something will go wrong and mysterious errors will punch you in the face. Here is the [documentation of tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html), but compiler options are [documented separately](https://www.typescriptlang.org/docs/handbook/compiler-options.html).).








To allow `npm` to build your project, you must also add entries in the "scripts" part of package.json. Modify that section so it looks like this:

    "scripts": {
      "test": "echo \"Error: no tests installed\" && exit 1",
      "build": "tsc",
      "start": "node server.js"
    },

The `build` script simply runs `tsc` which compiles your code according to the options in `tsconfig.json`, and to invoke this script you write `npm run build` on the command line.

"But wait!" you may be thinking. "It's really much easier to type `tsc` than `npm run build`!" That's true, but there are two reasons to define a `build` script:

1. If you installed TypeScript with `--save-dev` but not `--global`, you can't run `tsc` directly from the command line because it's not in the PATH.
2. There's a good chance your build process will become more complicated later. By creating a build script you can easily add other commands to the build process later.

**Note:** `npm` runs the `prestart` script automatically whenever someone runs the `start` script, so you *could* add this additional an additional script:

      "prestart": "npm run build",

This would build your project whenever you start your server with `npm start` or `npm run start`. But this has two disadvantages: one, `tsc` is a bit slow; two, if tsc fails then your server won't start. When TypeScript detects type errors, that doesn't stop it from writing JavaScript output files, and you may find it is occasionally useful to run your code even though it contains errors.

The default behavior of `npm start` is to run `node server.js`, so it seems redundant to include `"start": "node server.js"`. However, if your server is written in TypeScript you'll need this line because `server.js` doesn't exist until `server.ts` is compiled, and if `server.js` doesn't exist, `npm start` will give the error `missing script: start` unless you include this line.

Step 6: Make a simple server
----------------------------

To make sure Node.js is working, create a text file called server.js and put this code in it:

~~~js
const http = require('http');

http.createServer(function (request, response) {
  // Send HTTP headers and body with status 200 (meaning "OK", success)
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.end(`
    <html><body>
      <h1>Hello, world!</h1>
      You asked for: ${request.url}
    </body></html>`);
}).listen(1234);
~~~

Run `npm start` to start it, visit http://127.0.0.1:1234/index.html to make sure it works, then press Ctrl+C to stop the server.

To get IntelliSense for Node.js, you need to install type information for it with this command:

    npm install @types/node --save-dev

Then in VS Code, type `http.` to make sure it works:

![](intellisense-2.png)

Behind the scenes, VS Code uses the TypeScript engine for this. However, if you rename your file to `server.ts`, **IntelliSense doesn't work**! Is TypeScript broken in Node.js? Not really. TypeScript can still compile it, it just doesn't grok `require` in a .ts context. So in TypeScript files, you should use `import` instead of `require`:

~~~ts
import * as http from 'http';
~~~

TypeScript then converts `import` to `require` in its output (because of the `"module": "commonjs"` option in `tsconfig.json`.)

Now let's change our server so it can serve any file from a folder called `/app` (I didn't tell you to create the folder yet, but feel free to do so):

~~~js
// You can choose the port via command line, e.g. node server.js 3000
const port = process.argv[2] || '1234';
const folderToServe = 'app';
const mimeTypes = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ttf': 'aplication/font-sfnt'
};
// Each triplet is a URL prefix, a folder to serve, and the default
// filename to use when a folder is resolved. Longest prefixes first!
const routes = [['/node_modules/', 'node_modules', 'index.js'],
                ['/', 'app', 'index.html']];

http.createServer(function (request, response) {
  console.log(`${request.method} ${request.url}`);
  
  let parsedUrl = url.parse(request.url);
  let route = routes.filter(r => r[0] == parsedUrl.pathname.substr(0, r[0].length))[0];
  let filePath = route[1] + '/' + parsedUrl.pathname.substr(route[0].length);

  fs.stat(filePath, (err, fileInfo) => {
    if (err) {
      response.statusCode = 404;
      response.end("Error: " + err.message);
    } else {
      if (fileInfo.isDirectory())
        filePath += '/' + route[2];
      fs.readFile(filePath, (err, data) => {
        if (err) {
          response.statusCode = 404;
          response.end("Read error: " + err.message);
        } else {
          let ext = path.extname(filePath);
          let mimeType = mimeTypes[ext] || 'application/octet-stream';
          response.writeHead(200, {'Content-Type': mimeType});
          response.end(data);
        }
      });
    }
  });
}).listen(parseInt(port));

console.log(`Server running: http://127.0.0.1:${port}`);
~~~

If you want your server side to do any "routing" that is more complicated than serving a few files, you should probably learn about the most popular Node.js server framework: [Express](https://expressjs.com/).


Step 9: Make a web page to hold your app
----------------------------------------

Finally, make a folder called `app` and put an `index.html` file in there to load your app:

~~~html
<!DOCTYPE html>
<html>
<head>
  <title>App</title>
  <meta charset="utf-8"/>
  <script src="node_modules/react/umd/react.development.js"></script>
  <script src="node_modules/react-dom/umd/react-dom.development.js"></script>
  <script src="node_modules/preact/dist/preact.dev.js"></script>
  <script>
    module = {exports:{}}; exports = {};
    window.require = function(name) { return window[name]; };
    window['react'] = window['React'];
    window['react-dom'] = window['ReactDOM'];
  </script>
</head>
<body>
  <h1>Mini React app ❤</h1>
  <div id="app"></div>
  <script src="app.js"></script>
</body>
</html>
~~~

This page includes both React (react.development.js and react-dom.development.js) and Preact (preact.dev.js) so I don't need to give you separate instructions for each one. You can remove whichever one you aren't using, but the page can still load with unresolved script elements.

At this point you should be able to start your server (`npm start`) and visit http://127.0.0.1:1234 to view your app!

![](mini-react-app.png)

**Note**: It's important to load `app.js` at the end of the `body`, or React will say `Error: Target container is not a DOM element` because `app.js` would be calling `document.getElementById('app')` before the app element exists.

At this point it's worth noting that this code is a little hacky. Especially this part:

~~~html
  <script>
    module = {exports:{}}; exports = {};
    window.require = function(name) { return window[name]; };
    window['react'] = window['React'];
    window['react-dom'] = window['ReactDOM'];
  </script>
~~~

What's this for? The short answer is that if your code contains `import`, TypeScript *cannot* produce code that "just works" in a browser, and this is one of many possible workarounds for that problem.

The long answer? First of all, remember that the JavaScript ecosystem has multiple module systems. Right now, your `tsconfig.json` file uses the `"module": "umd"` option, because `"module": "umd"` and `"module": "commonjs"` are the only modes that can be used in both Node.js and a web browser. I asked you to make a server.js (not server.ts) file, but by using `"module": "umd"` you could write your server code in TypeScript if you want to.

UMD is the natural choice since it's supposed to make a "universal" module definition, but TypeScript doesn't really try to be universal - it simply won't attempt to work in a web browser unaided. Instead, it expects to find predefined symbols either for an AMD module system or a CommonJS (i.e. Node.js) module system; if neither of these is defined, the module exits without so much as printing an error.

Even if we *could* use the `"module": "es6"` option, which keeps `import` commands unchanged in the output file, it wouldn't work because Chrome somehow *still* doesn't support `import` in 2018. (another issue here is our modules' URLs have little in common with the string in our `import` statements, but I believe this issue can be solved with options in tsconfig.json including `baseUrl` and "Path mapping", as [documented here](https://www.typescriptlang.org/docs/handbook/module-resolution.html#base-url).)

TypeScript's CommonJS implementation requires `require` to be defined, of course (it's used to import modules), but it also looks for `exports` and `module.exports`, even though our module doesn't export anything. So our little hack must define all three.

The UMD versions of react React, ReactDOM, and Preact set global variables called `React`, `ReactDOM` and `preact` respectively. But "global" variables in a browser are actually members of a special object called `window`. And in JavaScript, `window.something` means exactly the same thing as `window['something']` except that the latter does not cause an error if `something` doesn't exist. Therefore, `window['preact']` and/or `window['React']` already exist. So by defining a `require` function that simply returns `window[name]`, it allows React or Preact to be imported. However, we also need to create lowercase aliases `'react'` and `'react-dom'` because those are the proper names of the React modules.

There's another thing in our index.html that is a bit... unfortunate:

~~~html
  <script src="node_modules/react/umd/react.development.js"></script>
  <script src="node_modules/react-dom/umd/react-dom.development.js"></script>
  <script src="node_modules/preact/dist/preact.dev.js"></script>
~~~

What makes this code less than ideal?

1. We already have `import` statements in our app.tsx file, so it's unfortunate that we need a separate command to load the modules in our index.html.
2. We're specifically referring to the "development" versions of the code, which include comments and are a lot more readable than minified versions. But when we roll out our web site to a large audience we'll want to switch to the minified versions so that pages load faster. It would be nice if we could do that without losing the debugging benefits of the development versions.
3. It assumes we can access files in `node_modules`, which is an unusual way to set up a server.

Step 10: Use webpack (optional)
-------------------------------

Is there some way to avoid the disadvantages mentioned above? Well, one of the most popular things to do with front-end apps is to "pack" all the modules (React + your code + anything else you need) into a single file. (This is comparable to what they call "linking" in some other languages, such as C++.)

Mainly what webpack does is that it "magically" combines a JavaScript file and all its dependencies into a single file. You can install it like this:

    npm install --save-dev webpack webpack-cli

Unfortunately, webpack is oversized: these two packages have 735 dependencies weighing in at 50.9 MB (13,198 files in 1868 folders). And for some reason, `webpack-cli` requires the webpack package but doesn't mark it as a dependency, hence you must install both of them explicitly. And although `webpack-cli` is ostensibly "just" the command-line interface for webpack's APIs, it is disproportionately large for some reason (webpack alone is only 13.6 MB).

Due to its size, no one will blame you for installing it as a global instead:

    npm install --global webpack webpack-cli

When using `--global`, keep in mind that if you share your code with someone else, the other person won't get webpack automatically when they type `npm install`, so you'll want to explain how to install in your readme file. If you change your mind and want to switch from `--save-dev` to `--global`, just run the `--global` installation command and then use `npm uninstall webpack webpack-cli` to delete the local copy.

Anyway, the most convenient way to use webpack is to add a script to run it in your package.json. You already wrote this line:

    "build": "tsc",

Now you just have to change it to

    "build":     "tsc && webpack app/app.js -o app/app.bundle.js --mode=production",
    "build:dev": "tsc && webpack app/app.js -o app/app.bundle.js --mode=development",

Then you can use either `npm run build` to build a minified production version, or `npm run build:dev` to build a development version with full symbols and comments.

After you've bundled up your code, you can simplify index.html a lot:

~~~html
<!DOCTYPE html>
<html>
<head>
  <title>App</title>
  <meta charset="utf-8"/>
</head>
<body>
  <h1>Mini React app ❤</h1>
  <div id="app"></div>
  <script src="app.bundle.js"></script>
</body>
</html>
~~~

Step 11: Improving your webpack workflow (optional)
---------------------------------------------------

Notice the **disadvantage** of using webpack: you now require a manual build step, where before you could use `tsc: watch` in VS Code and to make your project automatically recompile. So every time you edit your program you must:

 - Rebuild manually with `npm run build:dev`
 - Wait (this tiny program somehow takes 9 seconds to build on my laptop)
 - Refresh the browser window using F5.

Can we do better? Yes, we can use a webpack plugin called  `awesome-typescript-loader` which adds TypeScript support to webpack. Install it like this:

    npm install awesome-typescript-loader --save-dev

Then in `package.json`, replace your `"build"` (and `"build:dev"`) commands with these **three** commands:

    "build":     "webpack app/app.tsx --module-bind tsx=awesome-typescript-loader -o app/app.bundle.js --mode=production",
    "build:dev": "webpack app/app.tsx --module-bind tsx=awesome-typescript-loader -o app/app.bundle.js --mode=development",
    "watch":     "webpack app/app.tsx --module-bind tsx=awesome-typescript-loader -o app/app.bundle.js --mode=development --watch",

Use the new `watch` command to automatically recompile your code when it changes. While the `build` command is moderately faster than `tsc`, the `watch` command is *dramatically* faster. On my machine it recompiles this simple app within a quarter-second.

Since you need two separate terminals during development, one for your server (`npm start`) and one for your build system (`npm run watch`), it's worth noting that VS Code can keep track of multiple terminals. You can create two terminals and run one command in each, like this:

![Two terminals in Visual Studio Code](node-and-webpack-watch.png)

Step 12: Create a webpack.config.js file (optional)
---------------------------------------------------

Our build command is getting a bit long, and so similar for our three modes. The most popular way of using webpack is with a special configuration file, separate from package.json. Here's how the "build" script above translates into a `webpack.config.js file`:

~~~js
module.exports = {
  entry: 'app/app.tsx',
  output: {
    filename: 'app/app.bundle.js'
  },
  module: {
    loaders: [
      { test: /\.(ts|tsx)$/, loader: 'awesome-typescript-loader' }
    ]
  }
};
~~~

Yes, you're basically using JavaScript as a substitute for JSON. I must say, [Gulp](https://gulpjs.com/) makes a lot more sense to me - in Gulp, you also configure your build process with JavaScript code, but that code is *actually* code, not data. But of course, setting up a TypeScript build in Gulp (e.g. with tsproject) is completely different than setting up a build in webpack. Unless, that is, you use Gulp as a front-end for webpack, and I have no doubt some people are doing exactly that.

Optional: Separating the js files from the ts files
---------------------------------------------------

If you would like the `*.js` and `*.js.map` to go in a separate folder from the original original `*.ts` source files, this is controlled by `outDir` option inside `compilerOptions` in tsconfig.json. For example, if we use

~~~json
  "compilerOptions": {
    ...
    "outDir": "js",
    ...
  },
~~~

Then a file like `app/my_app.ts` will be compiled to `js/app/my_app.js`. If your server is also written in TypeScript, e.g. server.ts, then the entry point of your app will change from server.js to js/server.js, so you'll need to change your package.json to use the new entry point:

~~~json
  ...
  "scripts": {
    ...
    "start": "node js/server.js"
  },
  ...
~~~

Also, you may need to change the server code so it can serve files from the new output folder.

List of common npm commands
---------------------------

- `npm install`: if you download a program or library written by someone else that does not include a `node_modules` folder, use this command to recreate it.
- `npm install name-of-package`: downloads a package and its dependencies to your `node_modules` folder. The package is also added to `package.json` under `"dependencies"`. New versions of `npm` have a package cache so that if you lose your internet connection, you can still add something to a project if you have installed it to another project before.
- `npm install --save-dev name-of-package`: downloads a package and its dependencies to `node_modules`, and adds the package to package.json under `"devDependencies"`. Conceptually, the difference between `"dependencies"` and `"devDependencies"` is that `"devDependencies"` are dependencies used only to **build** the code and run **unit tests**, while `"dependencies"` are **runtime** dependencies. In practice, the only difference between the two is what happens if you [share](https://docs.npmjs.com/getting-started/publishing-npm-packages) your code with other people via `npm publish`. `npm publish` will only treat `"dependencies"` as dependencies; the `"devDependencies"` will be ignored (because users of your library don't need to build your code or run unit tests).
- `npm uninstall name-of-package`: remove a package from `node_modules` and from `package.json`
- `npm start`: short for `npm run start`, this command starts your web server locally. By default it runs `node server.js`, but its behavior can be overridden by adding a `"start"` key under `"scripts"` in `package.json`.
- `npm run name-of-script`: runs a terminal command stored in `"scripts"` in `package.json`. If your script name is `X`, `npm` also looks for `preX` and runs that first if it exists. It also runs `postX` afterward.

`npm` commands also have short forms, such as `npm i -D` for `npm install --save-dev`.


Part 3
-------

### One-time installations ###

1. [Install Node.js](https://nodejs.org/en/download/)
2. [Install Visual Studio Code](https://code.visualstudio.com/download)
3. In a terminal: `npm --global typescript`
3. In a terminal: `npm --global typescript`
4. (For The Easy Way) In a terminal: `npm install --global parcel-bundler`
5. (For The Webpack Way) In a terminal: `npm install --global webpack`
5. (For The Gulp Way) In a terminal: `npm install --global webpack`

### How to start a new project ###

1. Create a folder for your project
2. In a terminal: `npm init`
3. (Optional) In a terminal: `npm install typescript`
4. Decide where to store your source code (e.g. In the project root folder? in an `app` subfolder? Or perhaps in a `src` subfolder? It's up to you.)
5. Create a tsx file and write some code in it (if you are not using JSX/React/Preact, make a ts file instead). Here is a simple React example:



### How to do it The Easy Way ###

6. Create an html file that loads your