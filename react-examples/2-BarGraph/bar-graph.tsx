import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Expected format of bar chart items and properties
interface BarItem {
  name: string;
  value: number;
  source?: string;
}
interface BarProps {
  item: BarItem;
  maxValue: number;
  maxWidth: number;
  formatter(value:number): string;
}

class Bar extends React.Component<BarProps,{color:string}> {
  // props.maxBarWidth
  constructor(props) {
    super(props);
    this.state = { color: this.randomColor() };
  }
  render() {  
    const width = this.props.item.value / this.props.maxValue * this.props.maxWidth;

    const style = { display: 'inline-block', width: width,
               backgroundColor: this.state.color, color: '#ffffff', 
               textAlign: 'right', padding: '10px 5px 10px 0' };
    const formatter = this.props.formatter || (x => x);

    // If the bar isn't very wide, write value on the right side of the bar 
    if (this.props.item.value * 2 < this.props.maxValue)
      var bar = <td>
            <span style={style as any}
              onClick={() => this.setState({ color: this.randomColor() })}>
              {'\u00A0' /* &nbsp; causes bar to have the correct height*/}
            </span>{this.props.item.value}
          </td>;
    else
      // Otherwise, write the bar's value inside the bar
      var bar = <td>
            <span style={style as any}
              onClick={() => this.setState({ color: this.randomColor() })}>
              {this.props.item.value}
            </span>
          </td>;
    return (
        <tr>
          <td>{this.props.item.name}<a href={this.props.item.source}>*</a></td>
          {bar}
        </tr>);
  }
  randomColor() {
    return '#' + (Math.random() * 900000 + 100000 | 0).toString();
  }
}

interface BarChartProps {
  title: string;
  data:BarItem[];
  maxBarWidth:number;
  formatter(value:number):any
}

class BarChart extends React.Component<BarChartProps,{}> {
  render() {
    const maxValue = this.props.data
          .map(item => item.value)
          .reduce((x,y) => Math.max(x,y), 0);
    console.log(maxValue);
    console.log(this.props.data.map(item => item.value));
    return (
      <table>
        <thead><tr>
          <th>2017</th><th>{this.props.title}</th>
        </tr></thead>
        <tbody>
          {this.props.data.map(item => 
            <Bar item={item} maxValue={maxValue} maxWidth={this.props.maxBarWidth} formatter={this.props.formatter} key={item.name}/>)}
        </tbody>
      </table>);
  }
}

var graphData = [
  //{ name: 'Oil market revenue', value: 1700, source: 'http://www.visualcapitalist.com/size-oil-market/' },
  { name: 'New fossil fuel plants', value: 117.2, source: 'https://www.iea.org/publications/wei2017/' },
  { name: 'New solar plants', value: 114, source: 'http://fs-unep-centre.org/sites/default/files/publications/globaltrendsinrenewableenergyinvestment2017.pdf' },
  { name: 'New wind plants', value: 112, source: 'http://fs-unep-centre.org/sites/default/files/publications/globaltrendsinrenewableenergyinvestment2017.pdf' },
  { name: 'New nuclear plants', value: 26.3, source: 'https://www.iea.org/publications/wei2017/' },
  { name: 'New geothermal', value: 3, source: 'http://fs-unep-centre.org/sites/default/files/publications/globaltrendsinrenewableenergyinvestment2017.pdf' },
  { name: 'New hydro', value: 3, source: 'http://fs-unep-centre.org/sites/default/files/publications/globaltrendsinrenewableenergyinvestment2017.pdf' }
];

ReactDOM.render(
  <div>
    <h3>Graph</h3>
    <BarChart title="Annual worldwide spending (USD)" 
              data={graphData} maxBarWidth={500}
              formatter={value => '$'+value+' billion'}/>
  </div>,
  document.getElementById('app') 
)
