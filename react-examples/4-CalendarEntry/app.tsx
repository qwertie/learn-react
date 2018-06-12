import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {parseTime, timeToStringUTC} from './time';

class App extends React.Component<{message: string}> {
  render() {
      return <h2>{this.props.message}</h2>;
  }
}

class TimeSelector extends React.Component<{},{time:Date|undefined}> {
  state = { time: undefined };
  render() {
    return (<span>
        <input type="text" list="times" style={ {width:70} }
               onChange={ e => this.setState({time: parseTime(e.target.value)}) }/>
        <datalist id="times">
          <option value="12:00am"/><option value="12:30am"/>
          <option value="1:00am"/><option value="1:30am"/>
          <option value="2:00am"/><option value="2:30am"/>
          <option value="3:00am"/><option value="3:30am"/>
          <option value="4:00am"/><option value="4:30am"/>
          <option value="5:00am"/><option value="5:30am"/>
          <option value="6:00am"/><option value="6:30am"/>
          <option value="7:00am"/><option value="7:30am"/>
          <option value="8:00am"/><option value="8:30am"/>
          <option value="9:00am"/><option value="9:30am"/>
          <option value="10:00am"/><option value="10:30am"/>
          <option value="11:00am"/><option value="11:30am"/>
          <option value="12:00pm"/><option value="12:30pm"/>
          <option value="1:00pm"/><option value="1:30pm"/>
          <option value="2:00pm"/><option value="2:30pm"/>
          <option value="3:00pm"/><option value="3:30pm"/>
          <option value="4:00pm"/><option value="4:30pm"/>
          <option value="5:00pm"/><option value="5:30pm"/>
          <option value="6:00pm"/><option value="6:30pm"/>
          <option value="7:00pm"/><option value="7:30pm"/>
          <option value="8:00pm"/><option value="8:30pm"/>
          <option value="9:00pm"/><option value="9:30pm"/>
          <option value="10:00pm"/><option value="10:30pm"/>
          <option value="11:00pm"/><option value="11:30pm"/>
        </datalist>
      </span>);
  }
}

interface CalendarEventData {
  eventName: string,
  allDay: boolean, 
  startTime: Date,
  durationMinutes: number,
  alarmOn: boolean
  alarmMinutes: number,
}

class CalendarEntry extends React.Component<{}, CalendarEventData> {
  state = {
    eventName: 'Daily run',
    allDay: false, 
    startTime: parseTime('9am')!, // ! means "assume it's not undefined/null"
    durationMinutes: 60,
    alarmOn: false,
    alarmMinutes: 5,
  }
  render() {
    var timeRange: JSX.Element[] = [];
    if (!this.state.allDay) {
      timeRange = [
        <p>Start time <TimeSelector/></p>,
        <p>End time: <TimeSelector/>&nbsp;
          (<input type="number" style={ {width:50} } step={5} min={0} max={24*60}
           onChange={e => this.setState({durationMinutes: e.target.valueAsNumber || this.state.durationMinutes})}
           value={this.state.durationMinutes}/> minutes).
        </p>
      ];
    }
    return (<div style={ {width: 300} }>
      <p><input type="text" style={ {width:280} } 
                onChange={e=>this.setState({eventName: e.target.value})}
                value={this.state.eventName}/></p>
      <p style={ {float: 'right', margin: '0 40px 0 0'} }>
        <input type="checkbox" checked={this.state.allDay}
          onChange={e => this.setState({allDay: e.target.checked})}/>All day
      </p>
      {timeRange}
      <p style={ {clear: 'both'} }>
        <input type="checkbox" checked={this.state.alarmOn}
          onChange={e => this.setState({alarmOn: e.target.checked})}/>Alarm&nbsp;
        <input type="number" style={ {width:40} } min={0} max={720} 
          onChange={e => this.setState({alarmMinutes: 
              e.target.valueAsNumber || this.state.alarmMinutes, alarmOn: true})}
            value={this.state.alarmMinutes}/> minutes before
      </p>
    </div>);
  }
}

ReactDOM.render(<CalendarEntry/>, 
                document.getElementById("app"));
