Part 5: Advanced React
======================







Publishing a TypeScript package with npm
----------------------------------------

When publishing TypeScript packages on `npm`, it's polite to publish code that has been _compiled_ to JavaScript so that people can use your package whether or not they are using TypeScript. By also including a .d.ts file (which contains type information), you don't necessarily need to publish the original JavaScript source code.

### Example ###

Remember the simple time parser/formatter from [Part 5](tutorial-5.html#example-4-calendar-event-editor)? I've published it as the `simplertime` npm package; see the [repo](https://github.com/qwertie/simplertime) to see how it is set up, and try `npm install simplertime` to download the installed package to find out how it differs from the version published in the repo (spoiler: the tests are gone and package.json has changed).

### To prepare the package ###

- Write a module that you want to publish, using the ES6 `export` command to export things from it, and use `npm init` to create package.json if you haven't already. You should also write some tests to test it; you could use a unit test framework such as [jasmine](https://jasmine.github.io/) but the `simplertime` package doesn't.
- For compatibility with both web servers and web browsers, use the `"module": "umd"` option in your tsconfig.json (see [Part 3](tutorial-3.md#approaches-b-and-c) for a sample tsconfig.json file)
- In package.json in the `"scripts"` section, create a build command for creating the Javascript files from the TypeScript code, e.g. `"build": "tsc"`. Use `npm run build` to run it.
- In package.json, set the `"main"` option to the module's **JavaScript** name, e.g. "simplertime.js". This option is needed for users to be able to write `import * from 'simplertime'`.
- In package.json, check your dependencies. Make sure that the `"dependencies"` section contains all the dependencies that are required by people using your package, **but only those dependencies**. For example if you see `"typescript"` there, that's wrong, TypeScript should be in the `"devDependencies"` section instead. Other examples of packages that should be in `"devDependencies"` include `webpack`, `jasmine`, `mocha`, `jest`, and `ts-node`. If you find a dependency in the wrong section, you can move it by hand (making sure you get the commas right) or use `npm install --save-dev package-name` to move `package-name` to the `devDependencies` section.

### To publish the package ###

- In 
To publish on `npm`, the first step is to register for an account.