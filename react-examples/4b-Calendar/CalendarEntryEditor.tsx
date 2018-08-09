import * as React from 'react';
import TimeSelector from './TimeSelector';

export interface CalendarEntry {
  eventName: string;
  allDay: boolean;
  // Includes date with local time zone. Undefined temporarily when no valid 
  // start time is given. If allDay flag is set, should be noon GMT (so that 
  // timezone changes won't change the assigned day)
  startTime?: Date;
  durationMinutes: number;
  alarmOn: boolean;
  alarmMinutes: number;
  location: string;
}

export default class CalendarEntryEditor extends React.Component<{}, CalendarEntry> {
  state = {
    eventName: "Daily run",
    allDay: false, 
    startTime: undefined,
    durationMinutes: 60,
    alarmOn: false,
    alarmMinutes: 5,
    location: "",
  }
  render() {
    var timeRangeElements: JSX.Element[] = [];
    if (!this.state.allDay) {
      let startTime = this.state.startTime;
      let endTime = startTime===undefined ? undefined :
          addMinutes(startTime, this.state.durationMinutes);
      timeRangeElements = [
        <p>Start time:&nbsp;
          <TimeSelector time={this.state.startTime}
                onTimeChange={ startTime => this.setState({startTime}) }/></p>,
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
      <p>Location: <input type="text" 
                onChange={e=>this.setState({location: e.target.value})}
                value={this.state.location}/></p>
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
