import * as ReactDOM from 'react-dom';
import * as React from 'react';
import BTree from 'sorted-btree/b+tree';
import { parseTime } from 'simplertime/dist/simplertime';
import CalendarDay, { CalendarEntry } from './CalendarEntryEditor';
import { addMinutes, CalendarHours } from './CalendarHours';

class EntryDB
{
  map: BTree<Date,CalendarEntry|CalendarEntry[]>;
  
  constructor()
  {
    function at(time:string) {return parseTime(time, new Date());}
    function entry(time:string, eventName:string, durationMinutes:number, location=""): CalendarEntry {
      return {eventName, allDay:false, startTime:at(time), durationMinutes, alarmOn: true, alarmMinutes: 11, location};
    }

    var entries = [
      entry("12AM", "Go to sleep", 15, "Bed"),
      entry("6AM", "Wake up", 15),
      entry("6:30AM", "Morning jog with Sue and the whole gang", 30, "Central park E of 51 st, New York, New York, USA"),
      entry("8AM", "Work.", 60*6),
      entry("9AM", "50m Meeting with Mr. G re: Project X", 50),
      entry("1:30PM", "", 60, "The Diner"),
      entry("11:00PM", "Midnight party", 180, "Andy's house"),
      entry("7PM", "Night of adventure!", 180),
      entry("8PM", "Interlude", 30),
      entry("8:30PM", "Defrocking", 30),
    ]
    this.map = new BTree(entries.map(e => [e.startTime, e] as [Date,CalendarEntry]));
  }

  entriesForDay(date: Date, endTime?: Date)
  {
    var d = new Date(date);
    d.setHours(0,0,0,0);
    endTime = endTime || addMinutes(date, 24*60);
    var e = [];
    for (var [k,v] of this.map.entries(d)) {
      if (k.valueOf() >= endTime.valueOf())
        break;
      if (Array.isArray(v))
        e.push(...v);
      else
        e.push(v);
    }
    return e;
  }
}

interface CalendarAppState {
  focus: Date; // currently selected week/month
  //view: React.Component<CalendarViewProps,any>;
  data: EntryDB;
}

class CalendarApp extends React.Component<{}, CalendarAppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      focus: new Date(),
      data: new EntryDB()
    };
  }
  render() {
    console.log("rendering");
    return (
      <CalendarHours entries={this.state.data.entriesForDay(new Date())}
                     onCreate={()=>{}} onSelect={()=>{}}/>);
  }
}

ReactDOM.render(<CalendarApp/>, document.getElementById("app"));

class Box {
  width: number;
  height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
  get area() { return this.width*this.height; }
  setSquare(side: number) {
    this.width = this.height = side;
  }
  static ZeroSize() { return new Box(0, 0); }
}

var big = new Box(1920, 1080);
var mini = new Box(19.2, 10.8);
console.log(`The big box is ${big.area/mini.area} times larger than the minibox`);
console.log(`The area of the zero-size box is ${Box.ZeroSize().area}.`);
