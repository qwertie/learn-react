How to publish a TypeScript npm package
---------------------------------------

When publishing TypeScript packages on `npm`, it's polite to publish code that has been _compiled_ to JavaScript so that people who are not using TypeScript can still use your package. By also including a .d.ts file (which contains type information), you don't necessarily need to publish the original JavaScript source code. 

### Example ###

Remember the simple time parser/formatter from [Part 5](tutorial-5.html#example-4-calendar-event-editor)? I've published it as the `simplertime` npm package; see the [repo](https://github.com/qwertie/simplertime) to see how it is set up, and try `npm install simplertime` to download the installed package to find out how it differs from the version published in the repo (spoiler: the tests are gone and *package.json* has changed).

### How to prepare the package ###

- Set up an npm project [in the usual way](tutorial-3.md).
- Write a module that you want to publish, using the ES6 `export` command to export things from it. You should also write some tests to test it; you could use a unit test framework such as [jasmine](https://jasmine.github.io/) but the `simplertime` package doesn't.
- For compatibility with both web servers and web browsers, use the `"module": "umd"` option in your tsconfig.json (see [Part 3](tutorial-3.md#approaches-b-and-c) for a sample tsconfig.json file)
- In *package.json* in the `"scripts"` section, create a build command for creating the Javascript files from the TypeScript code, e.g. `"build": "tsc"`. Use `npm run build` to run it.
- In *package.json*, set the `"main"` option to the module's **JavaScript** name, e.g. "simplertime.js". This option is needed for users to be able to write `import * from 'simplertime'`.
- In *package.json*, check your dependencies. Make sure that the `"dependencies"` section contains all the dependencies that are required by people using your package, **but only those dependencies**. For example if you see `"typescript"` there, that's wrong, TypeScript should be in the `"devDependencies"` section instead. Other examples of packages that should _usually_ be in `"devDependencies"` include `webpack`, `uglifyjs`, `jasmine`, `mocha`, `jest`, and `ts-node`. If you find a dependency in the wrong section, you can move it by hand (be careful with those commas) or use <code>npm install --save-dev <i>package-name</i></code> to move `package-name` to the `devDependencies` section (but this seems to initiate a new package download).
- (optional) A popular convention in npm packages is to place the code in a folder called *dist*. In tsconfig.json you can send output there using `"outDir": "dist"`. If you get the error "Cannot write file '.../dist/....d.ts' because it would overwrite input file", then outside the compiler options, you must add `"dist"` to the `"exclude"` list ([see example](https://github.com/qwertie/simplertime/blob/master/tsconfig.json)). And don't forget to add `dist/` to your `"main"` option.
- Create a *readme.md* file with documentation for your package. This file will be rendered on npmjs.com.
- It is also recommended to create documentation to describe the functions and classes in your code, in [JSDoc format](http://usejsdoc.org/).
- If your package can be invoked from the command line, then in *package.json*, create a section called `"bin"` for it. For example, if you have a command called `foo` implemented in `dist/foo.js`, you'll need a section like this: `"bin": { "foo": "dist/foo.js" }`
- If you're a perfectionist, review all the [package.json fields](https://docs.npmjs.com/files/package.json)
- Check [npmjs.com](https://www.npmjs.com) to find out if the package name you want is already in use.

<span class="note">New package names very similar to existing package names are [not always allowed](https://gist.github.com/ashleygwilliams/e466c1e9fd3be42545da511239edd554).</span>

- You can either (1) specify the files you **want** in your package using the [`"files"` option of package.json](https://docs.npmjs.com/files/package.json#files), or (2) specify the files you **don't want** in your package by creating an *.npmignore* file (if there is no *.npmignore* file, `npm` will look for `.gitignore` instead.) As an example, the `files` list for `simplertime` is

          "files": ["readme.md", "**/simplertime.*"]

    <span class="note">Notice that package.json is included automatically. As far as I can tell, the *.npmignore* file is ignored when you are using `"files"`. And by the way: Windows has had a bug for over 20 years, due to which you can't create *.npmignore* (or any text file whose name starts with a dot) in Windows Explorer, so use another program such as VS Code.</span>

    <span class="tip">I strongly recommend using the `"files"` option to avoid accidentally putting temporary or "junk" files in your package. For example, using `npm pack` to preview your package will produce a *tgz* file with the contents of your package, and it would be easy to include such *tgz* files in your package accidentally.</span>

    <span class="warning">npm [will not warn you](https://github.com/npm/npm/issues/6582) if a file listed in `files` is missing.</span>

### How to minify your code (optional) ###

Some npm packages offer minified or production versions, but this is not required; there is no standardized method in npm to offer separate "development" and "production" versions of your package, and developers using Webpack get their entire app minified (including npm packages) when they use `webpack -p` or the `--optimize-minimize` option. Still, some developers will appreciate having a minified version that they can refer to via aliases ([Webpack aliases](https://webpack.js.org/configuration/resolve/) or [Parcel aliases](https://github.com/parcel-bundler/parcel/pull/850).

<span class="note">[TypeScript aliases](https://stackoverflow.com/a/38677886/22820) don't work for this purpose because if you tell TypeScript that `A` is an alias for `B`, then TypeScript loads `B` for type-checking purposes, but it generates code that still refers to `A`.</span>

So, I made a brief page explaining [how to minify your code](minification.md).

### How to verify that your package is set up correctly ###

It's important to check, because **you cannot change a package after publishing it** (except after changing the version number to something new that you've never used before). Also, if you don't check, you'll never really know if the published version of your package actually works. But how can you check? npmjs.com offers no good answer to this question.

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

#### Option 2: npm pack with rebuild/test

This is the same as Option 1 except that it ensures all output files are built and it runs unit tests.

You can rebuild and test during `npm pack` (and `npm publish`) using the `prepare` script, which `npm` runs before `pack` and `publish`. For example:

  ~~~js
    "scripts": {
      ...
      "prepare": "npm run build && npm test"
    }
  ~~~

  <span class="note">The `prepare` script _also_ runs during `npm install`, when users have downloaded your source code and are running `npm install` **without** arguments (it does **not** run during `npm install your-package`). In the latter case it is undocumented _when_ the `prepare` script runs, but as you would expect, it runs after npm has downloaded dependencies.</span>

#### Option 3: check after publish with --tag test

I haven't tried this option, because it's inconvenient, but the idea is "It's okay if I publish a broken package as long as users aren't downloading it." So you would follow the instructions below for "How to publish the package" except that you add a tag while publishing, like this:

    npm publish --tag=test

The purpose of the tag is to _remove_ the default tag, `latest`, to prevent users from downloading the new version automatically. Then you create a special test folder just to test the published version of the package. In your special test folder you will

- Use `npm init -f` to create a package.json that is almost empty
- Write some test code in the special test folder
- Use a special install command that includes the tag or version number, e.g. `npm install your_package@1.1.7` if the potentially-broken package has version 1.0.7, or `npm install --tag test`.
- Run your custom test code to see if your package actually works
- If it **doesn't** work, you have to increase the version number in the *original* package.json, publish with `--tag=test` again, go back to the special test folder, download the new version with `npm update your_package@1.1.8`, and run the tests again.
- If your package was **not** broken you can mark the package as "good" by adding the `latest` tag to it. The command for this is `npm dist-tag add <pkg>@<version> <tag>`, e.g. `npm dist-tag add your_package@1.1.8 latest`
- (optional) Remove the `test` tag with `npm dist-tag rm your_package@1.1.8 test`

#### Option 3: manual verification with JavaScript tests

I think the right way to ensure that your package is packaged correctly is to run your unit tests against it - the same tests that make sure your code works _locally_ could also test the _packaged_ code.

However I ran into a serious roadblock with this idea: the way module resolution works. Specifically, when you import a local code file you **must** import from `./`, e.g. `import {stuff} from "./yourModule"`, but when you import something from *node_modules* you must import from `your_package_name`. So even if your package has the same name as your module (e.g. `simplertime` has `simplertime.ts`) a single import command cannot work for both. Therefore, there's no obvious way to write your tests in TypeScript so that they can run against *either* the local copy *or* a packaged version in `node_modules`.

You might think that [TypeScript aliases](https://stackoverflow.com/a/38677886/22820) could potentially solve this problem, but they can't because they are compile-time only. That is, if you tell TypeScript that `A` is an alias for `B`, then TypeScript loads `B` for type checking but it generates code that still refers to `A`. And [ts-node inherits this problem](https://github.com/TypeStrong/ts-node/issues/138). 

You can bypass the problem by writing your tests in plain JavaScript, importing the code like this:

    try {
        var module = require("your_package_name");
        console.log("*** Using packaged version ***");
    } catch { // package does not exist
        var module = require("./yourModule");
    }

This doesn't work in TypeScript, which (as far as I can tell) does not support `require`. But even if you do use JavaScript, you still need to find some way to "install" your package so that the tests will use it. Here's a simple but inconvenient way to do it:

1. In a terminal, run `npm pack` which creates a tgz file of your package (the file name includes the version number so each time you publish you'll get a different file name.)
2. In a terminal, run `tar -xvf file_created_by_npm_pack.tgz -C node_modules` (if `tar` is not installed, you could use another program to unpack it such as [7-zip](https://www.7-zip.org/); unfortunately 7-zip just converts the `.tgz` file to a `.tar` file which you then have to unpack as a separate step.)
3. Now you have a folder in *node_modules* called *package*. Rename that folder to the actual name of your package.
4. Run your tests with `npm test`. Make sure you see `Using packaged version` and, of course, make sure the tests work.
5. It's ready to publish! Now delete the folder you created in *node_modules*.

Unfortunately this "dirty" method has a limitation: it doesn't verify that your package's dependencies are correct, since the unpacked code is able to import any package that already exists in *node_modules*, even packages that aren't listed as dependencies.

#### Option 4: package-preview

The [package-preview tool](https://www.npmjs.com/package/package-preview) avoids the issue by assuming you will *always* run your unit tests against the packaged version of your package. Here's how it works: much like `npm pack`, it generates a package. Then it "installs" the package in your *node_modules* folder, essentially making your package a dependency of itself, except that your package.json is left unchanged so it's not _officially_ a dependency of itself, which would be really weird. Then you simply have to tell your tests to import your code as a package (i.e. without `./`).

This has a major drawback, however: it means your project must perform a (slow) rebuild and packaging step **every time** you run your tests, not just when you are ready to publish. In `simplertime` this means 18 seconds of preparation followed by 1 second of actual testing. Also, this doesn't let us test the minified version of our code, if any. And it creates a file in your project's root folder called *shrinkwrap.yaml*, whatever that is. 

Here's how to use `package-preview`:

1. Before you start, make sure your unit tests work: `npm test`
2. Install it: `npm install --save-dev package-preview`
3. Change your unit tests to `import` from the name of your package instead of the name of the source file (e.g. import `simplertime` instead of `./simplertime`).
4. The _command_ for `package-preview` is called `preview`. Run it before your unit tests, e.g. using `pretest`:

    ~~~js
      "scripts": {
        ...
        "pretest": "preview",
      }
    ~~~

5. In package.json, remove remove any test commands from the `"prepare"` or `"prepublishOnly"` script, if there is one. If you really want to run tests during `npm pack` and `npm publish`, you must use `preview --skip-prepublishOnly` as described in the [documentation of `package-preview`](https://www.npmjs.com/package/package-preview).
6. In a terminal, run `npm test` to find out if it works.

#### Option 5: custom script

This option will let you run your unit tests against your local code, but also run the same tests against the package produced by `npm pack`.

This time, the idea is to use a script to (1) `npm pack`, (2) copy your unit tests to a special test folder, (3) change the `import` command in the tests, (4) "install" the package by un-tarring it into `node_modules`, (5) install dependencies (but not devDependencies), and (6) run the tests.

- WORK IN PROGRESS. PLEASE WAIT.

### How to publish the package ###

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
- View your package on npmjs.com by typing its name in the search box.

### To update the package (publish a new version) ###

- In *package.json*, increase the version number. Be aware that npm uses [semantic versioning rules](https://docs.npmjs.com/getting-started/semantic-versioning).
- Verify that your package is set up correctly (see above).
- In a terminal, run `npm publish` again if your code is stable, or `npm publish --tag beta` if not (a side effect of adding a custom tag like `beta` is to subtract the `latest` tag, so that the version you are publishing will not be installed automatically by `npm install your-package`.)

