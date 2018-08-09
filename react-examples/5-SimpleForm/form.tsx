import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {TextBox, Holders, wrapInHolders} from './controls';

class Model {
  name: string = "";
  age?: number = undefined;
  address: string = "";
  city: string = "";
  province: string = "";
  country: string = "";
  date?: Date = undefined;
  color: string = "";
  virgin: boolean = false;
}

function Form(p: { model:Holders<Model> }) {
  return <form>
    <TextBox label="Name:"     value={p.model.name} autoComplete="name"/><br/>
    <TextBox label="Age:"      value={p.model.age} 
            parse={s => parseFloat(s) || new Error("Invalid age")}/><br/>
    <TextBox label="Address:"  value={p.model.country}  autoComplete="address-line1"/><br/>
    <TextBox label="City:"     value={p.model.city}     autoComplete="address-level1"/><br/>
    <TextBox label="Province:" value={p.model.province} autoComplete="address-level1"/><br/>
    <TextBox label="Country:"  value={p.model.country}/><br/>
    <TextBox label="Date:"     value={p.model.date} type="date" parse={d => new Date(Date.parse(d))}/><br/>
    <TextBox label="Color:"    value={p.model.color} type="color"/><br/>
  </form>;
}

class App extends React.Component<{model:Model}, Holders<Model>>
{
  constructor(props: {model:Model}) {
    super(props);
    this.state = wrapInHolders(props.model);
  }
  render() { return (
    <div>
      <h3>Personal Information Form</h3>
      <Form model={wrapInHolders(this.props.model)}/>
      <br/>
      <textarea value={JSON.stringify(this.props.model,null," ")} cols={40} rows={10} readOnly/>
    </div>);
  }
}

ReactDOM.render(<App model={new Model()}/>, document.getElementById('app'));
