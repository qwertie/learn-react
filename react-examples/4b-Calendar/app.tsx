import * as ReactDOM from 'react-dom';
import CalendarDay from './CalendarEntryEditor';
import {CalendarViewProps,MonthView,WeekView} from './CalendarViews'

interface CalendarAppState {
  focus: Date;
  view: React.Component<CalendarViewProps,any>;
  data: Map<Date,CalendarEntry[]>;
}

class CalendarApp extends React.Component<{}, CalendarAppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      focus = new Date(Date.now()), // currently selected week/month
      view = MonthView,
      data = {}
    };
  }
  render() {
    let View = this.state.view; // component name needs uppercase letter
    return (
      <View focus={this.state.focus} data={this.state.data}
        onChangeFocus={ focus => this.setState({focus}) }/>
    );
  }
}

ReactDOM.render(<CalendarApp/>, document.getElementById("app") + f());
