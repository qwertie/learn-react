import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {parseTime, timeToStringUTC} from './time';

interface TimeSelectorProps {
  time?: Date;
  onTimeChange: (time?:Date) => void;
}

class TimeSelector extends React.Component<TimeSelectorProps,
                                           {timeInput?:string}>
{
  state = { timeInput: undefined as (string|undefined) };
  render() {
    let timeString = "";
    if (this.state.timeInput !== undefined)
        timeString = this.state.timeInput;
    else if (this.props.time !== undefined)
        timeString = timeToStringUTC(this.props.time, false);

    return (<span>
        <input type="text" list="times" style={ {width:75} }
               value={timeString}
               onChange={ e => this.setState({timeInput: e.target.value}) }
               onBlur={ e => {
                 this.setState({timeInput: undefined});
                 this.props.onTimeChange(parseTime(e.target.value)); 
               } }/>
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

interface CalendarEntry {
  eventName: string;
  allDay: boolean;
  startTime?: Date; // Allow undefined when no valid start time is given
  durationMinutes: number;
  alarmOn: boolean;
  alarmMinutes: number;
}

class CalendarEntryEditor extends React.Component<{}, CalendarEntry> {
  state = {
    eventName: 'Daily run',
    allDay: false, 
    startTime: undefined,
    durationMinutes: 60,
    alarmOn: false,
    alarmMinutes: 5,
  }
  render() {
    var timeRangeElements: JSX.Element[] = [];
    if (!this.state.allDay) {
      let startTime = this.state.startTime;
      let endTime = startTime===undefined ? undefined :
          addMinutes(startTime, this.state.durationMinutes);
      console.log(endTime?timeToStringUTC(endTime,false):'undef');
      timeRangeElements = [
        <p>Start time:&nbsp;
          <TimeSelector time={this.state.startTime}
                onTimeChange={ time => this.setState({startTime: time}) }/></p>,
        <p>End time:&nbsp;
          <TimeSelector time={endTime}
                onTimeChange={ time => this.setEndTime(time) }/>&nbsp;
          (<input type="number" style={ {width:50} } step={5} min={0} max={24*60}
             onChange={e => this.setState({durationMinutes: 
                     e.target.valueAsNumber || this.state.durationMinutes})}
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
      {timeRangeElements}
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
  setEndTime(time?: Date) {
    if (this.state.startTime && time) {
      // ! means "assume this value is not null or undefined"
      let dif = diffMinutes(time, this.state.startTime!);
      if (dif < 0)
          dif += 24*60;
      this.setState({durationMinutes: dif});
    }
  }
}

// Functions to add minutes to a Date or get the difference between two dates
function addMinutes(date: Date, minutes: number) {
  return new Date(date.valueOf() + minutes * 60000);
}
function diffMinutes(high: Date, low: Date) {
  return (high.valueOf() - low.valueOf()) / 60000;
}

ReactDOM.render(<CalendarEntryEditor/>, document.getElementById("app"));
