import * as React from 'react';
import { CalendarEntry } from './CalendarEntryEditor';
import BTree from 'sorted-btree/b+tree';

/*
export interface CalendarViewProps {
  entries: BTree<Date, CalendarEntry[]>;
  selectedDay: Date;
  onClick: (it:CalendarEntry|{date:Date, time:number})=>void;
}

export function MonthView() {
  
}

function ScrollView(p: CalendarViewProps) {
  p.entries.getRange(p.start, p.stop, false).map
  var days = [], OneDay = 24*60*60000;
  for (var date = p.start.valueOf(); date < p.stop.valueOf(); date += OneDay) {
    p.entries.getRange(date, OneDay);
  }
  return <div>{}</div>;
}
*/