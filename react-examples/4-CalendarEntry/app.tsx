import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { timeToString, parseTime } from 'simplertime/dist/simplertime';

interface TimeSelectorProps {
  day: Date;
  time?: Date;
  onChange: (time?: Date) => void;
  style?: React.CSSProperties;
  class?: string;
}

function TimeSelector(p: TimeSelectorProps) {
  const TimeFmt = {showSeconds:false, use24hourTime:true};
  return (
    <input type="time" style={p.style} className={p.class || "timeSelector"}
           value={p.time ? timeToString(p.time, TimeFmt) : ""}
           onChange={ e => p.onChange(parseTime(e.target.value, p.day)) }/>);
}

/** Add a certain number of minutes to a Date */
function addMinutes(date: Date, minutes: number) {
  return new Date(date.valueOf() + minutes * 60000);
}
/** Gets the difference between two Dates in minutes */
function diffMinutes(high: Date, low: Date) {
  return (high.valueOf() - low.valueOf()) / 60000;
}

function FormRow(p: { label: React.ReactNode, children: React.ReactNode }) {
  return (
    <p>
      <label>
        <span className="label">{p.label}</span>
        {p.children}
      </label>
    </p>);
}

interface CalendarEntry {
  eventName: string;
  location: string;
  allDay: boolean;
  startTime?: Date; // Allow undefined when no valid start time is given
  durationMinutes: number;
  alarmOn: boolean;
  alarmMinutes: number;
  color: string;
}

class CalendarEntryEditor extends React.Component<{}, CalendarEntry> {
  state = {
    eventName: "Daily run",
    location: "",
    allDay: false, 
    startTime: undefined,
    durationMinutes: 60,
    alarmOn: false,
    alarmMinutes: 5,
    color: "#DDFF00"
  }
  
  render() {
    let minuteStyle = {width: "3rem"};
    var timeRangeElements: JSX.Element[] = [];
    if (!this.state.allDay) {
      let startTime = this.state.startTime;
      let endTime = startTime===undefined ? undefined :
          addMinutes(startTime, this.state.durationMinutes);
      timeRangeElements = [
        <FormRow label="Start time:">
          <TimeSelector time={this.state.startTime} day={new Date()} 
            onChange={ time => this.setState({startTime: time}) }/>
        </FormRow>,
        <FormRow label="End time:">
          <TimeSelector time={endTime} day={new Date()} 
            onChange={ time => this.setEndTime(time) }/>&nbsp;
          (<input type="number" className="minuteCount" step={5} min={0} max={24*60}
             onChange={e => this.setState({durationMinutes: 
                     e.target.valueAsNumber || this.state.durationMinutes})}
             value={this.state.durationMinutes}/> minutes).
        </FormRow>,
        <p style={ {clear: 'both' } }>
          <label className="label">
            <input type="checkbox" checked={this.state.alarmOn}
              onChange={e => this.setState({alarmOn: e.target.checked})}/>Alarm&nbsp;
          </label>
          <input type="number" className="minuteCount" min={0} max={720} 
            onChange={e => this.setState({alarmMinutes: 
                e.target.valueAsNumber || this.state.alarmMinutes, alarmOn: true})}
              value={this.state.alarmMinutes}/> minutes before
        </p>
      ];
    }
    return (
      <form className="calendarEntryForm">
        <p>
          <input type="text" style={ {width:"24.2em"} } 
                 onChange={e=>this.setState({eventName: e.target.value})}
                 value={this.state.eventName}/>
        </p>
        <FormRow label="Location:">
            <input type="text" style={ {width:"17em"} } 
                   onChange={e=>this.setState({location: e.target.value})}
                   value={this.state.location}/>
        </FormRow>
        <label style={ {display: "block", float: 'right', margin: '0 4em 0 0'} }>
          <input type="checkbox" checked={this.state.allDay}
            onChange={e => this.setState({allDay: e.target.checked})}/>All day
        </label>
        {timeRangeElements}
        <FormRow label="Color:">
          <input type="color" className="width: 7em" value={this.state.color}
                 onChange={ e => this.setState({ color: e.target.value }) }/>
        </FormRow>
      </form>);
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

ReactDOM.render(<CalendarEntryEditor/>, document.getElementById("app"));
