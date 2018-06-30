How to publish a TypeScript npm package
---------------------------------------

When publishing TypeScript packages on `npm`, it's polite to publish code that has been _compiled_ to JavaScript so that people who are not using TypeScript can still use your package. By also including a .d.ts file (which contains type information), you don't necessarily need to publish the original JavaScript source code. 

### Example ###

Remember the simple time parser/formatter from [Part 5](tutorial-5.html#example-4-calendar-event-editor)? I've published it as the `simplertime` npm package; see the [repo](https://github.com/qwertie/simplertime) to see how it is set up, and try `npm install simplertime` to download the installed package to find out how it differs from the version published in the repo (spoiler: the ts files are gone and *package.json* has changed).

### To prepare the package ###

- Set up an npm project [in the usual way](tutorial-3.md).
- Write a module that you want to publish, using the ES6 `export` command to export things from it. You should also write some tests to test it; you could use a unit test framework such as [jasmine](https://jasmine.github.io/) but the `simplertime` package doesn't.
- For compatibility with both web servers and web browsers, use the `"module": "umd"` option in your tsconfig.json (see [Part 3](tutorial-3.md#approaches-b-and-c) for a sample tsconfig.json file)
- In *package.json* in the `"scripts"` section, create a build command for creating the Javascript files from the TypeScript code, e.g. `"build": "tsc"`. Use `npm run build` to run it.
- In *package.json*, set the `"main"` option to the module's **JavaScript** name, e.g. "simplertime.js". This option is needed for users to be able to write `import * from 'simplertime'`.
- In *package.json*, check your dependencies. Make sure that the `"dependencies"` section contains all the dependencies that are required by people using your package, **but only those dependencies**. For example if you see `"typescript"` there, that's wrong, TypeScript should be in the `"devDependencies"` section instead. Other examples of packages that should _usually_ be in `"devDependencies"` include `webpack`, `uglifyjs`, `jasmine`, `mocha`, `jest`, and `ts-node`. If you find a dependency in the wrong section, you can move it by hand (be careful with those commas) or use <code>npm install --save-dev <i>package-name</i></code> to move `package-name` to the `devDependencies` section (but this seems to initiate a new package download).
- (optional) A popular convention in npm packages is to place the code in a folder called *dist*. In tsconfig.json you can send output there using `"outDir": "dist"`. If you get the error "Cannot write file '.../dist/....d.ts' because it would overwrite input file", then outside the compiler options, you must add `"dist"` to the `"exclude"` list ([see example](https://github.com/qwertie/simplertime/blob/master/tsconfig.json)). And don't forget to add `dist/` to your `"main"` option.
- Create a *readme.md* file with documentation for your package. This file will be rendered on npmjs.com.
- It is also recommended to create documentation to describe the functions and classes in your code, in [JSDoc format](http://usejsdoc.org/).
- If you're a perfectionist, review all the [package.json fields](https://docs.npmjs.com/files/package.json)
- Check [npmjs.com](https://www.npmjs.com) to find out if the package name you want is already in use.

<span class="note">New package names very similar to existing package names are [not always allowed](https://gist.github.com/ashleygwilliams/e466c1e9fd3be42545da511239edd554).</span>

### To minify your code (optional) ###

Some npm packages offer minified or production versions, but this is not required; there is no standardized method in npm to offer separate "development" and "production" versions of your package, and developers using Webpack get their entire app minified (including npm packages) when they use `webpack -p` or the `--optimize-minimize` option. Still, some developers will appreciate having a minified version that they can refer to via aliases ([Webpack aliases](https://webpack.js.org/configuration/resolve/), [Parcel aliases](https://github.com/parcel-bundler/parcel/pull/850), or [TypeScript aliases](https://stackoverflow.com/a/38677886/22820)).

So, I made a brief page explaining [how to minify your code](minification.md).

### To publish the package ###

- Create an account on [npmjs.com](https://npmjs.com). You'll be asked for your full name, username and email address.
- You must use `npm` to publish your package. Log in with the `npm adduser` terminal command:

~~~
> npm adduser
Username: qwertie
Password:
Email: (this IS public) qwertie256@gmail.com
Logged in as qwertie on https://registry.npmjs.org/.
~~~

- `npm` won't let you say which files you *want* in your package; instead you must say which files and folders to *ignore* by creating a `.npmignore` file. `npm` will also ignore any files in `.gitignore`.
- In a terminal, run `npm publish` - you're done! By default your package will have the `latest` tag, which means that's the package that will be used when people type `npm install your-package`.
- View your package on npmjs.com, e.g. 

<span class="tip">Windows has had a bug for over 20 years: you can't create `.npmignore` or any text file whose name starts with a dot in Windows Explorer. Create it in another program such as VS Code.</span>

### To update the package ###

- In *package.json*, increase the version number. Be aware that npm uses [semantic versioning rules](https://docs.npmjs.com/getting-started/semantic-versioning).
- Make sure there are no unwanted files/folders in your package's folder that aren't covered by `.gitignore` or `.npmignore`.
- In a terminal, run `npm publish` again if your code is stable, or `npm publish --tag beta` if not (adding a custom tag like `beta` means it won't have the `latest` tag, so will not be installed automatically by `npm install your-package`)

### 4. ###

"If you don't want something to install by default"

npm publish ./ --tag beta

- `npm` is for people to _use_ your code, not to _change_ it, so there's no need to include the TypeScript code in the npm package. If your package is open source, you should also publish it somewhere else (GitHub, BitBucket or SourceForge) and people who want to propose changes should go there to do so.