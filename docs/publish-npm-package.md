How to publish a npm package (properly)
---------------------------------------

To begin, set up an npm project [in the usual way](tutorial-3.md).

Write a module that you want to publish, probably using the ES6 `export` command to export things from it. You should also write some tests to test it; you could use a unit test framework such as [jasmine](https://jasmine.github.io/), but the `simplertime` package doesn't.

### Example ###

For [Part 5](tutorial-5.html#example-4-calendar-event-editor) I made a simple time parser/formatter; now I've published it as the `simplertime` npm package. See the [repo](https://github.com/qwertie/simplertime) to see how it is set up, and try `npm install simplertime` to download the installed package to find out how it differs from the version published in the repo (in short: the tests are gone and *package.json* was modified by npm).

### If it's a TypeScript package... ###

When publishing TypeScript packages on `npm`, it's polite to publish code that has been _compiled_ to JavaScript so that people who are not using TypeScript can still use your package. By also including a .d.ts file (which contains type information), you don't even need to publish the original TypeScript source code.

- For compatibility with both web servers and web browsers, use the `"module": "umd"` option in your tsconfig.json (see [Part 3](tutorial-3.md#approaches-b-and-c) for a sample tsconfig.json file)
- In *package.json* in the `"scripts"` section, create a build command for creating the Javascript files from the TypeScript code, e.g. `"build": "tsc"`. Use `npm run build` to run it.
- (optional) A popular convention in npm packages is to place the code in a folder called *dist*. In tsconfig.json you can send output there using `"outDir": "dist"`. If you get the error "Cannot write file '.../dist/....d.ts' because it would overwrite input file", then outside the compiler options, you must add `"dist"` to the `"exclude"` list ([see example](https://github.com/qwertie/simplertime/blob/master/tsconfig.json)). And don't forget to add `dist/` to your `"main"` option.

### Main preparation steps (for JavaScript and TypeScript) ###

- Create a *readme.md* file with documentation for your package. This file will be rendered on npmjs.com.
- It is also recommended to create documentation to describe the functions and classes in your code, in [JSDoc format](http://usejsdoc.org/).
- If your package can be invoked from the command line, then in *package.json*, create a section called `"bin"` for it. For example, if you have a command called `foo` implemented in `dist/foo.js`, you'll need a section like this: `"bin": { "foo": "dist/foo.js" }`
- Check [npmjs.com](https://www.npmjs.com) to find out if the package name you want is already in use.

    <span class="note">New package names very similar to existing package names are [not always allowed](https://gist.github.com/ashleygwilliams/e466c1e9fd3be42545da511239edd554).</span>

- You can either (1) specify the files you **want** in your package using the [`"files"` option of package.json](https://docs.npmjs.com/files/package.json#files), or (2) specify the files you **don't want** in your package by creating an *.npmignore* file (if there is no *.npmignore* file, `npm` will look for `.gitignore` instead.) As an example, the `files` list for `simplertime` is

          "files": ["readme.md", "**/simplertime.*"]

    <span class="note">Notice that package.json itself is included automatically. As far as I can tell, the *.npmignore* file is ignored when you are using `"files"`. And by the way: Windows has had a bug for over 20 years, due to which you can't create *.npmignore* (or any text file whose name starts with a dot) in Windows Explorer, so use another program such as VS Code.</span>

    <span class="tip">I strongly recommend using the `"files"` option to avoid accidentally putting temporary or "junk" files in your package. For example, using `npm pack` to preview your package will produce a *tgz* file with the contents of your package, and it would be easy to include such *tgz* files in your package accidentally.</span>

    <span class="warning">npm [will not warn you](https://github.com/npm/npm/issues/6582) if a file listed in `files` is missing.</span>

- In *package.json*, set the `"main"` option to the module's **JavaScript** name, e.g. "simplertime.js". This option is needed for users to be able to write `import * from 'simplertime'`.
- In *package.json*, check your dependencies. Make sure that the `"dependencies"` section contains all the dependencies that are required by people using your package, **but only those dependencies**. For example if you see `"typescript"` there, that's wrong, TypeScript should be in the `"devDependencies"` section instead. Other examples of packages that should _usually_ be in `"devDependencies"` include `webpack`, `uglifyjs`, `jasmine`, `mocha`, `jest`, and `ts-node`. If you find a dependency in the wrong section, you can move it by hand (be careful with those commas) or use <code>npm install --save-dev <i>package-name</i></code> to move `package-name` to the `devDependencies` section (but this seems to initiate a new package download).
- If you're a perfectionist with OCD, review all [package.json fields](https://docs.npmjs.com/files/package.json)

### How to minify your code (optional) ###

Some npm packages offer minified or production versions, but this is not required; there is no standardized method in npm to offer separate "development" and "production" versions of your package, and developers using Webpack get their entire app minified (including npm packages) when they use `webpack -p` or the `--optimize-minimize` option. Still, some developers will appreciate having a minified version that they can refer to via aliases ([Webpack aliases](https://webpack.js.org/configuration/resolve/) or [Parcel aliases](https://github.com/parcel-bundler/parcel/pull/850).

<span class="note">[TypeScript aliases](https://stackoverflow.com/a/38677886/22820) don't work for this purpose because if you tell TypeScript that `A` is an alias for `B`, then TypeScript loads `B` for type-checking purposes, but it generates code that still refers to `A`.</span>

So, I made a brief page explaining [how to minify your code](minification.md).

### How to verify that your package is set up correctly ###

It's important to check, because **you cannot change a package after publishing it** (except after changing the version number to something new that you've never used before). And if you don't check, you won't know if the published version of your package actually works. So clearly, the smart policy is to check in advance.

But **how**? npmjs.com offers no good answer to this question.

#### Option 1: npm pack

You can run `npm pack` to get a preview of what your package will contain:

    ~~~
    PS C:\Dev\simplertime> npm pack
    npm notice
    npm notice package: simplertime@1.0.0
    npm notice === Tarball Contents ===
    npm notice 950B  package.json
    npm notice 1.1kB readme.md
    npm notice 3.8kB dist/simplertime.d.ts
    npm notice 6.3kB dist/simplertime.js
    npm ...
    npm notice === Tarball Details ===
    npm notice name:          simplertime
    npm notice version:       1.0.0
    npm notice filename:      simplertime-1.0.0.tgz
    npm notice package size:  6.2 kB
    npm notice unpacked size: 24.2 kB
    npm notice shasum:        e731092eea4a4e49be9912e4710348f41c2c9dc4
    npm notice integrity:     sha512-6fxbApL17Dol9[...]WGtw70i6xv4mg==
    npm notice total files:   7
    ~~~

From this you can see whether the intended files were included, but it doesn't tell you if other settings are correct (e.g. `main`, `devDependencies`). 

You can improve this a bit by building and running unit tests at the same time. `npm` runs the `prepare` script before `npm pack` and before `npm publish`, so you'd want something like this in package.json

    "scripts": {
      ...
      "prepare": "npm run build && npm test"
    }

#### Option 2 (recommended): use testpack-cli

I think the right way to ensure that your package is packaged correctly is to run your unit tests against it - the same tests that make sure your code works _locally_ could also test the _packaged_ code.

I was trying to write a custom script in my project that would automate this idea, but I hit a roadblock: the way module resolution works. Specifically, when you import a local code file you **must** import from `./`, e.g. `import {stuff} from "./yourModule"`, but when you import something from *node_modules* you must import from `your_package_name`. So even if your package has the same name as your module (e.g. `simplertime` has `simplertime.ts`) a single import command cannot work for both. Therefore, there's no obvious way to write your tests in TypeScript so that they can run against *either* the local copy *or* a packaged version in `node_modules`.

I decided to solve this problem in a way that I hoped would help the whole community: by making a testing tool to test your package before publishing. It's called `testpack-cli`. I tried other names, but names like `testpack`, `testpackage`, `packtest`, `packagetest`, `checkpack`, and `checkpackage` were already taken by random people publishing "test packages" to "check" if they could figure out how to use npm. Finally I settled on the name `npm-testpack` which seemed unused, but actually someone had taken `npm-test-pack`, which [blocked me](https://gist.github.com/ashleygwilliams/e466c1e9fd3be42545da511239edd554).

**You use it like this:**

1. In a terminal: `npm install --save-dev --global testpack-cli`
2. Run it with `testpack`
3. Read the [documentation](https://www.npmjs.com/package/testpack-cli) if you need to configure it

**Here's what it does:** it packs your package with `npm pack`, then creates a test folder with its own separate `package.json` file. In the test folder it installs your package, it installs your unit test framework (if you one of the common ones is listed as a dependency), and it adds your unit tests (identified by the test patterns `test* *test.* *tests.* *test*/**`). If you have a tsconfig.json file, that's copied to the test folder too. And finally, whenever your tests import `"./something"` or `"../src/something"`, the `./` or `../src/` prefix is stripped off.

Therefore, if your package is called *pkg*, you should ideally create a single "main" source file called *pkg.js* or *pkg.ts* which you import using `import {...} from "./P"` in your tests. The test folder's copy will import `"P"` instead.

By default, the test folder is created as a sibling: if your package name is `pkg` then the test folder is `../pkg-testpack`.

If your package is a TypeScript project, make sure that your tests in the test folder are importing the compiled JavaScript version, because your end-users might not be using TypeScript. One way to guarantee this is to exclude all .ts files from your package (if you do that, be sure source maps are disabled in your tsconfig.json.) Your tests should still be written in TypeScript to make sure your d.ts files work; use `"declaration": true` in tsconfig.json so they can access type information.

### How to publish (finally!) ###

- Create an account on [npmjs.com](https://npmjs.com). You'll be asked for your full name, username and email address.
- You must use `npm` to publish your package. Log in with the `npm adduser` terminal command:

~~~
> npm adduser
Username: qwertie
Password:
Email: (this IS public) qwertie256@gmail.com
Logged in as qwertie on https://registry.npmjs.org/.
~~~

- In a terminal, run `npm publish` and you're done! By default your package will have the `latest` tag, which means that's the package that will be used when people type `npm install your-package`.
- View your package on npmjs.com by typing its name in the search box (it may be hidden at first.)

### To update the package (publish a new version) ###

- In *package.json*, increase the version number. Be aware that npm uses [semantic versioning rules](https://docs.npmjs.com/getting-started/semantic-versioning).
- Verify that your package is set up correctly (see above).
- In a terminal, run `npm publish` again if your code is stable, or `npm publish --tag beta` if not (a side effect of adding a custom tag like `beta` is to subtract the `latest` tag, so that the version you are publishing will not be installed automatically by `npm install your-package`.)
