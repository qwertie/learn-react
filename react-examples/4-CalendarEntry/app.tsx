import * as ReactDOM from 'react-dom';
import * as React from 'react';

class App extends React.Component<{message: string}> {
  render() {
      return <h2>{this.props.message}</h2>;
  }
}

ReactDOM.render(<App message="NOT IMPLEMENTED"/>, 
                document.getElementById("app"));
