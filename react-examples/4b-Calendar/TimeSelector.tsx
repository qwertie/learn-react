import * as React from 'react';
import {parseTime, timeToStringUTC} from 'simplertime';

export interface TimeSelectorProps {
  time?: Date;
  onTimeChange: (time?:Date) => void;
}

export default class TimeSelector extends 
  React.Component<TimeSelectorProps, {timeInput?:string}>
{
  state = { timeInput: undefined as (string|undefined) };
  render() {
    let timeString = "";
    if (this.state.timeInput !== undefined)
      timeString = this.state.timeInput;
    else if (this.props.time !== undefined)
      timeString = timeToStringUTC(this.props.time, {showSeconds:false});

    return (<span>
      <input type="text" list="times" style={ {width:75} }
             value={timeString}
             onChange={ e => this.setState({timeInput: e.target.value}) }
             onBlur={ e => {
               this.setState({timeInput: undefined});
               var time = parseTime(e.target.value);
               this.props.onTimeChange(time ? new Date(time) : undefined);
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
 