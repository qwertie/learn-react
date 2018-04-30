import * as React from 'preact';
import * as ReactDOM from 'preact';
// workaround: Parcel sometimes uses h and sometimes React.createElement in preact mode
var h = React.createElement;

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
  document.getElementById('app'),
  document.getElementById('app').lastChild as Element // extra argument for preact
);
