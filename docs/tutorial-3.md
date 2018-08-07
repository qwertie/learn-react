Setting up your TypeScript Project: Summary and Extra Tips
==========================================================

This is a summary of the four ways you can set up your TypeScript project; see [Setting up your TypeScript Project](tutorial-2.md) for full details.

### One-time installations ###

1. [Install Node.js](https://nodejs.org/en/download/)
2. [Install Visual Studio Code](https://code.visualstudio.com/download)
3. (Optional) In a terminal: `npm --global typescript`
4. (For The Easy Way) In a terminal: `npm install --global parcel-bundler`
4. (For The Webpack Way) In a terminal: `npm install --global webpack`
4. (For The Gulp Way) In a terminal: `npm install --global gulp`

### How to start a new project ###

1. Create a folder for your project
2. In a terminal: `npm init`
3. (If TypeScript is not yet installed) In a terminal: `npm install --save-dev typescript`
4. Decide where to store your source code (e.g. In the project root folder? in an `app` subfolder? Or perhaps in a `src` subfolder? It's up to you, but these instructions assume you will use the `app` folder.)
5. Create a tsx file and write some code in it (if you are not using JSX/React/Preact, make a ts file instead). Here is a simple React example:

~~~tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';

class App extends React.Component<{greeting: string}, {count:number}> {
  state = {count: 0};
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

### Approach A: The Easy Way, with Parcel ###

- Create this html file to load your app. Notice the reference to `app.tsx`.

~~~html
<!DOCTYPE html>
<html>
<head>
  <title>App</title>
  <meta charset="utf-8"/>
</head>
<body>
  <h1>React app ❤</h1>
  <div id="app"></div>
  <script src="app.tsx"></script>
</body>
</html>
~~~

- In a terminal: `parcel index.html`
- Open in web browser: [http://127.0.0.1:1234](http://127.0.0.1:1234)

### Approaches B and C ###

(1) Create a text file called `tsconfig.json` with this code like this in it:

~~~js
{ // TypeScript configuration file: provides options to the TypeScript 
  // compiler (tsc) and makes VSCode recognize this folder as a TS project,
  // enabling the VSCode build tasks "tsc: build" and "tsc: watch".
  "compilerOptions": {
    "target": "es5",            // Compatible with older browsers
    "module": "umd",            // Compatible with both Node.js and browser
    "moduleResolution": "node", // Tell tsc to look in node_modules for modules
    "sourceMap": true,          // Whether to create *.js.map files
    "jsx": "react",             // Causes inline XML (JSX code) to be expanded
    "strict": true,             // Strict types, eg. prohibits `var x=0; x=null`
    "alwaysStrict": true,       // Enable JavaScript's "use strict" mode
    "esModuleInterop": true     // CommonJS import behavior similar to Babel/mjs
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
~~~

A quicker way to create *tsconfig.json* is to run `tsc --init` in a terminal.

(2) Create a `server.js` file to serve files to your web browser. You could use the file server code from step B3 in [Part 2](tutorial-2.md#step-b3-make-a-simple-server), but if you install [Express](https://expressjs.com/) with `npm install express` then you can use short and simple server code, like this:

~~~js
const express = require('express');
const app = express();

app.use('/node_modules', express.static('node_modules'));
app.use('/', express.static('app'));
app.listen(1234, () => console.log('Express server running at http://127.0.0.1:1234'));
~~~

### Approach B, additional steps ###

(3) Add `"build"` and `"start"` scripts to `package.json`:

~~~json
  "scripts": {
    "test": "echo \"Error: no tests installed\" && exit 1",
    "build": "tsc",
    "start": "node server.js"
  },
~~~

(4) Create an `index.html` file in your app folder:

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

(5) In a terminal: `npm run build`<br/>
(6) In a terminal: `npm start`<br/>
(7) Visit http://127.0.0.1:1234 in a browser if the last two steps worked.<br/>
(8) To recompile your code automatically in VS Code: press Ctrl+Shift+B and choose "tsc: watch"

### Approach C, additional steps ###

(3) In a terminal: `npm install awesome-typescript-loader --save-dev`<br/>
(4) Add `"build"` and `"start"` scripts to `package.json`:

~~~json
  "scripts": {
    "test": "echo \"Error: no tests installed\" && exit 1",
    "build":     "webpack app/app.tsx --module-bind tsx=awesome-typescript-loader -o app/app.bundle.js --mode=production",
    "build:dev": "webpack app/app.tsx --module-bind tsx=awesome-typescript-loader -o app/app.bundle.js --mode=development",
    "watch":     "webpack app/app.tsx --module-bind tsx=awesome-typescript-loader -o app/app.bundle.js --mode=development --watch",
    "start": "node server.js"
  },
~~~

(5) (Optional): use `webpack.config.js` file instead (see [Part 2](tutorial-2.md) step C7)<br/>
(6) Create `index.html` file:

~~~html
<!DOCTYPE html>
<html>
<head>
  <title>App</title>
  <meta charset="utf-8"/>
</head>
<body>
  <h1>React app ❤</h1>
  <div id="app"></div>
  <script src="app.bundle.js"></script>
</body>
</html>
~~~

(7) In a terminal: `npm run watch`<br/>
(8) In a second terminal: `npm start`<br/>
(9) Visit http://127.0.0.1:1234 in a browser if the last two steps worked.

To run TypeScript scripts directly from the command prompt
-----------------------------------------------------------

1. In a terminal: `npm install --global ts-node`
2. In a terminal: `ts-node script.ts` (where _script.ts_ is a script's name).

To run JS or TypeScript source code from GitHub/Git
---------------------------------------------------

- [Fork](https://help.github.com/articles/fork-a-repo/) or [clone](https://help.github.com/articles/cloning-a-repository/) the Git project. You can also download the source code as a zip file if you aren't using Git yet. If you're looking for a nice user interface for Git, I suggest [GitKraken](https://www.gitkraken.com) or [Git Extensions](https://gitextensions.github.io/). For Git Extensions, you'll need to [install Git](https://git-scm.com/downloads) first ([and Mono](https://github.com/gitextensions/gitextensions/wiki/How-To%3A-run-Git-Extensions-on-Linux) if you have a Mac or Linux). Oh and there is a [GitHub app](https://desktop.github.com/) which has probably improved since the last time I tried it.
- In a terminal: `npm install` (downloads all dependencies)
- In a terminal: `npm start` (or `npm test` to run the project's tests)
- If that doesn't work, look for instructions in the project's README or CONTRIBUTING file.

Optional: Separating the js files from the ts files, in Approach B
------------------------------------------------------------------

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

Also, you'll need to change the server code so it can serve your code from the new location.

Debugging
---------

Chrome has a usable debugger - press F12 in Chrome and find your code file inside the Sources table. To set breakpoints, click the line number of the line at which you want to stop; you may need to reload the page (F5) to start running code from the beginning. Firefox also has a developer tools interface you can reach with F12 (use the Debugger tab).

List of common npm commands
---------------------------

- `npm install`: if you download a program or library written by someone else that does not include a `node_modules` folder, use this command to recreate it.
- `npm install name-of-package`: downloads a package and its dependencies to your `node_modules` folder. The package is also added to `package.json` under `"dependencies"`. New versions of `npm` have a package cache so that if you lose your internet connection, you can still add something to a project if you have installed it to another project before.
- `npm install --save-dev name-of-package`: downloads a package and its dependencies to `node_modules`, and adds the package to package.json under `"devDependencies"`. Conceptually, the difference between `"dependencies"` and `"devDependencies"` is that `"devDependencies"` are dependencies used only to **build** the code and run **unit tests**, while `"dependencies"` are **runtime** dependencies. In practice, the only difference between the two is what happens if you [share](https://docs.npmjs.com/getting-started/publishing-npm-packages) your code with other people via `npm publish`. `npm publish` will only treat `"dependencies"` as dependencies; the `"devDependencies"` will be ignored (because users of your library don't need to build your code or run unit tests).
- `npm uninstall name-of-package`: remove a package from `node_modules` and from `package.json`
- `npm start`: short for `npm run start`, this command starts your web server locally. By default it runs `node server.js`, but its behavior can be overridden by adding a `"start"` key under `"scripts"` in `package.json`.
- `npm run name-of-script`: runs a terminal command stored in `"scripts"` in `package.json`. If your script name is `X`, `npm` also looks for `preX` and runs that first if it exists. It also runs `postX` afterward.
- `npm pack` and `npm publish`: see my [npm publishing guide](publish-npm-package.md).
- `npm list`: shows a tree of npm dependencies, to help you understand why your node_modules folder is so enormous. See also [PackagePhobia](https://packagephobia.now.sh/) where you can type the name of a package to learn its size (including dependencies).

`npm` commands also have short forms, such as `npm i -D` for `npm install --save-dev`.

Next
----

See [Part 4](tutorial-4.md) to learn about TypeScript (and JSX), or skip straight to [Part 5](tutorial-5.md) to learn React.
