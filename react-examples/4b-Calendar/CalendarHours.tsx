import * as React from 'react';
import BTree from 'sorted-btree';
import {timeToString, timeToStringUTC} from 'simplertime';
import TimeSelector from './TimeSelector';
import {CalendarEntry} from './CalendarEntryEditor';

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const Quarters = ["", "¼", "½", "¾"];
const MaxHeightPerHour = 4.4; // em units
const OneDay = 24*60*60*1000;

//export default function CalendarDay(p: {entries: CalendarEntry[], date: Date, onCreate: (d:Date)=>void, onSelect: (e:CalendarEntry)=>void})
//{
//  return <CalendarHours entries={p.entries} onCreate={p.onCreate} onSelect={p.onSelect}/>;
//}

export type CalendarHoursProps = {
  entries: CalendarEntry[], // must be sorted by startTime
  onCreate: (d:Date)=>void,
  onSelect: (e:CalendarEntry)=>void
}

export class CalendarHours extends React.Component<CalendarHoursProps,{clickedHour?:number}>
{
  render() {
    var results: React.ReactNode[] = [];
    var entries = this.props.entries.filter(e => !e.allDay);
    var allDays = this.props.entries.filter(e => e.allDay);
    if (allDays.length) {
      results.push(<div className="allday-entries">
                     {this.calendarHours(allDays, 0, -1)}
                   </div>);
    }

    // Ideally we would just make one calendar-hours element. However,
    // what if two or more Calendar appointments happen at the same time?
    // Can we prevent the simultaneous events from overlapping on-screen?
    // This calendar app supports two separate columns in case of 
    // overlapping events (it is not designed to avoid overlapping if 
    // three or more events happen at once).
    //   However, if we split events into multiple columns, we don't want
    // those columns to affect other events that don't overlap with 
    // anything, and ideally the boundary between the columns should not
    // have to be in a constant location throughout the day. For example,
    // if two events overlap from 2-3pm and two other events overlap from 
    // 5-8pm, there is no reason to use the same boundary for both, but
    // that's what a css grid is designed to do.
    //   I found this issue quite challenging. To avoid glitches where 
    // overlapping events in one part of the day mess up the appearance
    // of different events elsewhere in the day, here is the solution I
    // chose: CalendarHours produces multiple grids in a single day.
    // So the render() function's job is to produce a series of grids,
    // each grid covering one or more hours, and calendarHours()'s job 
    // is to produce a single one of these grids.
    for (var i = 0, h = 0; i < entries.length; i = j) {
      let endHour = endHourOf(entries[i]);
      for (var j = i + 1; j < entries.length; j++) {
        if (entries[j].startTime!.getHours() > endHour)
          break;
        endHour = Math.max(endHour, endHourOf(entries[j]));
      }

      results.push(this.calendarHours(entries.slice(i, j), h, endHour));
      h = endHour + 1;
    }
    // Draw the end of the day (when there are no more appointments)
    results.push(this.calendarHours([], h, 23));
    return <div>{results}</div>;
  }

  calendarHours(entries: CalendarEntry[], firstHour: number, lastHour: number)
  {
    var parts: React.ReactNode[] = [];
    
    // If there are all-day entries, expect them at entries[0]
    var baseRow = 1;
    for (var i = 0; i < entries.length && entries[i].allDay; i++) {
      parts.push(<div className="hour" style={{gridRow: baseRow}}>All day</div>);
      parts.push(<div className="entry" style={{gridRow: baseRow++}}>{entrySummary(entries[i], false, false)}</div>);
    }
  
    // This is designed to be displayed with CSS grid using a row per 15 minutes (96 rows per day)
    baseRow = 1 - firstHour*4;
    var lastEndTime: number|undefined;
    for (let hour = firstHour; hour <= lastHour; hour++) {
      var h = hour % 24;
      var hourStr = h === 0 ? "12AM" : h === 12 ? "12PM" : 
                    h < 12 ? h + "AM" : (h-12) + "PM";
      var style: React.CSSProperties = {};
      style.gridRow = `${baseRow+hour*4} / span 4`;
      // hours after midnight are gray so users know why clicking it has no effect
      if (hour >= 24)
        style.opacity = 0.5;
      parts.push(<div className="hour"
                      onClick={() => this.onClickedHour(hour)}
                      style={style}>{hourStr}</div>);
      let start, stop;
      for (; i < entries.length && (start = entries[i].startTime!).getHours() <= hour; i++) {
        stop = endTimeOf(entries[i]);
        var column: number|undefined;
        if (lastEndTime && entries[i].startTime!.valueOf() < lastEndTime) {
          // Overlapping entries detected! Use the extra grid column.
          column = 3;
        } else
          lastEndTime = stop.valueOf();
        parts.push(this.entrySummaryDiv(entries[i], 
          baseRow + rowOffsetOf(start), baseRow + endRowOf(entries[i])), column);
      }
    }
    return <div className="calendar-hours">{parts}</div>;
  }

  entrySummaryDiv(entry: CalendarEntry, rowStart: number, rowStop: number, gridColumn?: number) {
    var style = { 
      gridRow: `${rowStart} / ${rowStop}`, gridColumn,
      maxHeight: (MaxHeightPerHour * Math.max(0.75, entry.allDay ? 24 : entry.durationMinutes/60)) + "em"
    };
    return <div className="entry" style={style} onClick={() => this.props.onSelect(entry)}>{
      entrySummary(entry, entry.startTime! && entry.startTime!.getMinutes() !== 0, entry.durationMinutes > 0)
    }</div>;
  }

  onClickedHour(hour: number) {
    this.setState({clickedHour: hour < 24 ? hour : undefined});
  }
}

/** Gets the number of 15-minute intervals since midnight */
function rowOffsetOf(time: Date) {
  var midnight = new Date(time);
  midnight.setHours(0,0,0,0);
  return Math.round((time.valueOf() - midnight.valueOf()) / (15*60000));
}

/** Gets the end time of a CalendarEntry. */
export function endTimeOf(e: CalendarEntry) {
  if (e.allDay) {
    var d = new Date(e.startTime!);
    d.setHours(0, 0, 0, 0);
    return addMinutes(d, 24*60);
  } else
    return addMinutes(e.startTime!, Math.max(e.durationMinutes, 0));
}

/** Gets the "row" when a CalendarEntry ends - the number of 15-minute intervals 
 *  since midnight. Above 96 if event passes midnight. */
function endRowOf(e: CalendarEntry) {
  var firstRow = rowOffsetOf(e.startTime!);
  var lastRow = rowOffsetOf(endTimeOf(e));
  return lastRow < firstRow ? lastRow + 96 : lastRow;
}

/** Gets the hour when a CalendarEntry ends. Above 24 if event passes midnight. */
function endHourOf(e: CalendarEntry) {
  return (endRowOf(e) - 1) / 4 | 0;
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes*60000);
}

export function minutesToString(min: number): string {
  if (min < 60)
    return min + "m";
  else if (min % 15 === 0)
    return min / 60 + Quarters[min / 15 % 4] + "h";
  else
    return (min / 60) + "h " + (min % 60) + "m";
}

export function entrySummary(entry: CalendarEntry, withStartTime: boolean, withDuration: boolean) {
  var parts: React.ReactNode[] = [];
  if (withStartTime || withDuration) {
    var startTime = withStartTime ? timeToString(entry.startTime!) : undefined;
    var duration = minutesToString(entry.durationMinutes);
    if (withStartTime && withDuration)
      parts.push(<b>{startTime}, {duration}</b>, " ");
    else
      parts.push(<b>{startTime || duration}</b>, " ");
  }
  parts.push(entry.eventName);
  if (entry.location.length > 0)
    parts.push(" ", <i>{entry.location}</i>);
  return parts;
}
