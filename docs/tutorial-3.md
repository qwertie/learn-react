Setting up your TypeScript Project: Summary
===========================================

This is a summary of the four ways you can set up your TypeScript project; see [Setting up your TypeScript Project](react-typescript-tutorial-2.md) for full details.

### One-time installations ###

1. [Install Node.js](https://nodejs.org/en/download/)
2. [Install Visual Studio Code](https://code.visualstudio.com/download)
3. (Optional) In a terminal: `npm --global typescript`
4. (For The Easy Way) In a terminal: `npm install --global parcel-bundler`
5. (For The Webpack Way) In a terminal: `npm install --global webpack`
5. (For The Gulp Way) In a terminal: `npm install --global webpack`

### How to start a new project ###

1. Create a folder for your project
2. In a terminal: `npm init`
3. (If TypeScript is not yet installed) In a terminal: `npm install --save-dev typescript`
4. Decide where to store your source code (e.g. In the project root folder? in an `app` subfolder? Or perhaps in a `src` subfolder? It's up to you.)
5. Create a tsx file and write some code in it (if you are not using JSX/React/Preact, make a ts file instead). Here is a simple React example:

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

### How to do it The Easy Way ###

6. Create this html file to load your app. Notice the 


Next
----

See [Part 4](react-typescript-tutorial-4.md) to learn about React programming.
