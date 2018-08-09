import BTree from "sorted-btree/b+tree";
import { CalendarEntry } from "./CalendarEntryEditor";
import * as React from "react";

export interface CalendarHoursProps {
  entries: BTree<Date,CalendarEntry>; // must be sorted by startTime
  year: number;
  onCreate: (d:Date)=>void;
  onSelect: (e:CalendarEntry)=>void;
}
  
export class CalendarScrollView extends React.Component<CalendarHoursProps,{clickedHour?:number}> {

}
