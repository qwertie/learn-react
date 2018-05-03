import * as ReactDOM from 'react-dom';
import * as React from 'react';

class Para extends React.Component<{type?: string, text: string}> {
  render() {
    // Create a list of ReactNodes which will be the children of a <p> element.
    let children: React.ReactNode[] = [ this.props.text ];
    // Find out if type contains a capital letter.
    let type = this.props.type || '';
    if (type !== type.toLowerCase()) {
      // It has a capital letter, so include it before the text, in bold.
      children.unshift(': ');
      children.unshift(<b>{type}</b>);
    }
    return <p className={type.toLowerCase()}>{children}</p>;
  }
}

ReactDOM.render(
  <div>
    <Para type="tip" text="This is a page of random facts."/>
    <Para text="But the facts are irrelevant. They're just an excuse to use React."/>
    <Para type="Fact" text="React is popular."/>
    <Para type="Fact" text="It is a myth that people use only 10% of their brains."/>
    <Para type="Warning" text="Grenades are dangerous."/>
    <Para type="Warning" text="Imagined facts may be false."/>
    <Para type="Tip" text="Is your Component not shown?
        Press F12 and look for clues about what error occurred."/>
  </div>,
  document.getElementById('app'));
