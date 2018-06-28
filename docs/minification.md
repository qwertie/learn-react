Four ways to minify your code
-----------------------------

Since web apps are sent over the internet, it's good to keep them small so that the app loads quickly. For this reason, we have minifiers to remove spaces, remove newlines and shorten variable names to a single character. _Obfuscators_ are closely related - their goal is to make code harder to understand.

Unfortunately, the TypeScript compiler not only cannot produce minified output, it proactively wastes space. Even if your TypeScript code uses two spaces for indentation and has compact expressions like `x+1`, the TypeScript compiler produces output with _four_ spaces and adds spaces between things like `x + 1`. As of 2018 there is no compiler option to avoid this (at least you can remove comments with `"removeComments":true`, but if you are producing a d.ts file this will **also** remove comments from the d.ts file unless you perform a separate comment-removing build that does not produce a d.ts file, e.g. `tsc --declaration && tsc --removeComments`)

### 1. Webpack / Parcel ###

If you're using webpack to build your code, `webpack -p` [reportedly](https://webpack.js.org/guides/production/#cli-alternatives) minifies the application using "UglifyJSPlugin".

[Parcel's production mode](https://parceljs.org/production.html), `parcel build`, also uses a minifier.

Otherwise you have these options:

### 2. JSMin ###

This is a tiny (15KB), simple and old minifier, appropriate for simple programs/modules. It just removes spaces; it does not shorten variable names so it does not provide the smallest possible size.

Usage:

- Install in a terminal with `npm install --save-dev jsmin`
- In package.json in the `"scripts"` section, add a `minify` script that uses jsmin (replace `name` with the name of your JavaScript file, not your TypeScript file; multiple filenames are allowed):

~~~json
    "minify": "jsmin -o name.min.js name.js"
~~~

<span class="warning">JSMin cannot minify more than one file at a time. To minify two files you can write `jsmin -o name1.min.js name1.js && jsmin -o name2.min.js name2.js`.</span>

- Add `minify` to your build script. For example if your build script looked like this before...

~~~json
    "build": "tsc --declaration",
~~~

then change it to

~~~json
    "build": "tsc --declaration && npm run minify",
~~~

Here's the [documentation for jsmin](https://www.npmjs.com/package/jsmin#command-line-usage).

### 3. uglify-js / uglify-es ###

Uglify-js is 100 times larger than jsmin ([1.5MB](https://packagephobia.now.sh/result?p=uglify-js) vs 15KB) but has many more features, is more popular, and is still small compared to WebPack or the TypeScript compiler. Uglify can also produce a source map to your original TypeScript or ES6 code (source maps allow you to debug the minified code as if it was the original. Major web browsers will run the minified code but show you the original code when you use their debugger).

Confusingly there are two packages, `uglify-js` and `uglify-es`. I'm [waiting to hear the difference.](https://stackoverflow.com/questions/51069142/whats-the-difference-between-uglify-js-and-uglify-es)

Usage:

- Install in a terminal with `npm install --save-dev uglify-js`

<span class="tip">Note: npm tools installed with `--save-dev` are located in `./node_modules/bin` and if you want to run it directly from the command-line you need to write `./node_modules/.bin/uglifyjs` instead of just `uglifyjs`. If you install globally with `npm install --global jsmin`, you don't have to do this. The advantage of using `--save-dev` is that the dependency is listed in package.json so that when your code is placed on a different machine, running `npm install` installs all dependencies (except global ones). It is possible to install two copies - global and local - like this: `npm install uglify-js --global --save-dev`</span>

- In package.json in the `"scripts"` section, add a `minify` script that uses `uglifyjs` (replace `name` with the name of your JavaScript file, not your TypeScript file; multiple filenames are allowed):

~~~json
    "minify": "uglifyjs --compress --mangle --output name.min.js -- name.js"
~~~

<span class="note">Uglify shortens variable names if you use the `--mangle` option, and `--compress` uses different tricks to shorten code, such as replacing `undefined` with [`void 0`](https://stackoverflow.com/questions/7452341/what-does-void-0-mean). With neither option, Uglify simply removes spaces like JSMin. `--mangle` also obfuscates the code somewhat; for example, if the input is `function fruit(apple, banana, x, y) {}`, it produces `function fruit(n,f,o,t){}` instead of using more readable names like `function fruit(a,b,x,y){}`. The developers apparently [intend to keep it that way](https://github.com/mishoo/UglifyJS2/issues/3201). Uglify also renames inner functions, which can be avoided with the `--keep-fnames` option.</span>

<div class="warning" markdown="1">UglifyJS can minify multiple files by concatenating them, but it can only produce a single output file. As with JSMin, you can uglify two or more files with two or more separate commands, e.g. 

    uglifyjs -mc -o name1.min.js name1.js && uglifyjs -mc -o name2.min.js name2.js

<span class="note">`-mc` is short for `--mangle --compress`. Any Windows users trying this on the command prompt should be aware that `&&` doesn't work in Powershell, though it does work in the old command prompt, `cmd`. Yet, `./node_modules/.bin/uglifyjs` works in Powershell but not `cmd` (`cmd` requires `.\node_modules\.bin\uglifyjs`).</span>
</div>

- Add `minify` to your build script. For example if your build script looked like this before...

~~~json
    "build": "tsc --declaration",
~~~

then change it to

~~~json
    "build": "tsc --declaration && npm run minify",
~~~

### 4. Google Closure Compiler ###

More than just a minifier, the Closure Compiler can also analyze code to remove unused parts (known as "dead code"). I haven't used it, so [please see Google's instructions](https://developers.google.com/closure/compiler).
