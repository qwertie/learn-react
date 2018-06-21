import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {measureText} from './measureText';

// Expected format of bar chart items and properties
interface BarItem {
  name?: string;    // label for this bar (plain text)
  label?: React.ReactNode[]; // label for this bar (markup)
  value?: number | number[]; // value of the bar (undefined for spacer)
  color?: string;  // bar color
}
interface BarProps {
  item: BarItem;
  maxValue: number; // value of largest bar
  maxWidth: number; // width in pixels of largest bar
  legend?: {color:string}[];
  formatter(value:number): string; // converts BarItem.value to a string
}
interface LegendItem {
  name: string;
  color: string;
}

class Bar extends React.Component<BarProps,{}>
{
  render() {  
    if (this.props.item.value === undefined) {
      var label = Bar.getLabel(this.props.item);
      return <tr style={ {height:20} }><td colSpan={2}>{label}</td></tr>;
    }
    return (<tr><td style={ {paddingRight:'5px'} }>
                {Bar.getLabel(this.props.item)}</td>
                {Bar.renderBar(this.props)}</tr>);
  }
  componentDidMount() {
    //this.refs.
  }
  static getLabel(item: BarItem) {
    var leftSide: React.ReactNode[] = item.label || [];
    if (item.name)
      leftSide.push(item.name);
    return leftSide;
  }
  static getValue(item: BarItem) { 
    const v = item.value;
    return v ? (typeof v === 'number' ? v : v.reduce((p,c) => p+c, 0)) : 0;
  }
  private static renderBar(props: BarProps) {
    var bar: React.ReactNode[];
    if (props.item.value instanceof Array) {
      // Stacked bar chart! This is complicated because:
      // - It is difficult to fit non-overlapping labels on a single bar,
      //   so we use an algorithm to prevent overlap using two lines of
      //   text, but it cannot run during render() when there's no DOM -
      //   not if we want to use the font inherited via CSS.
      // - We can't even choose the height of the svg because we can't 
      //   find out what the font is, let alone its height.
      // - However, it's good to at least make correctly-sized sub-bars
      //   here so that v
      bar = [<svg></svg>];
    } else {
      const value = Bar.getValue(props.item);
      const width = value / props.maxValue * props.maxWidth;
      const style = { display: 'inline-block', width: width,
            backgroundColor: props.item.color, color: '#ffffff', 
            textAlign: 'right', padding: '10px 0px 10px 0' };
      const formatted = (props.formatter || (x => x))(value);
  
      // If the bar isn't very wide, write value on the right side of the bar 
      if (value * 2 < props.maxValue)
        bar = [<span style={style as any}>
                {'\u00A0' /* &nbsp; causes bar to have the correct height*/}
              </span>, " "+formatted];
      else
        // Otherwise, write the bar's value inside the bar
        bar = [<span style={style as any}>
                {formatted+"\u00A0"}
              </span>];
    }
    return <td className="Bar" style={ {borderLeft: '1px solid #ccc'} }>{bar}</td>;
  }
}

interface BarChartProps {
  title: string;       // title shown above the bars (second column)
  data: BarItem[];     // data items to show
  maxBarWidth: number; // width in pixels of largest bar
  formatter(value:number): string; // converts BarItem.value to a string
}

class BarChart extends React.Component<BarChartProps,{}> {
  render() {
    const maxValue = this.props.data
          .map(item => Bar.getValue(item))
          .reduce((x,y) => Math.max(x, y), 0);
    return (
      <table style={ {borderSpacing:0} }>
        <thead><tr>
          <th colSpan={2}>{this.props.title}</th>
        </tr></thead>
        <tbody>
          {this.props.data.map(item => 
            <Bar item={item} maxValue={maxValue} 
                 maxWidth={this.props.maxBarWidth} 
                 formatter={this.props.formatter}/>)}
        </tbody>
      </table>);
  }
}

var labels: React.ReactNode[][] = [
  [<span style={ {color:'#067', fontWeight:'bold'} }>Endorse AGW</span>],
  [<div style={ {marginLeft:15} }>Explicitly (quantifies as 50+%)</div>],
  [<div style={ {marginLeft:15} }>Explicitly (doesn't quantify or minimise)</div>],
  [<div style={ {marginLeft:15,color:'#444'} }>Implicitly (without minimising)</div>],
  [<span style={ {color:'#832', fontWeight:'bold'} }>Minimize/reject AGW</span>],
  [<div style={ {marginLeft:15,color:'#444'} }>Implicitly</div>],
  [<div style={ {marginLeft:15} }>Explicitly (doesn't quantify)</div>],
  [<div style={ {marginLeft:15} }>Explicitly (quantifies as &lt;50%)</div>],
];
var graphData2 = [
  { label: [...labels[0], " - Judged by abstract"] },
  { label: labels[1], value: 64, color: '#079' },
  { label: labels[2], value: 922, color: '#079' },
  { label: labels[3], value: 2910, color: '#7AB' },
  { label: [...labels[0], " - Full papers judged by author*"] },
  { label: labels[1], value: 224, color: '#079' },
  { label: labels[2], value: 531, color: '#079' },
  { label: labels[3], value: 519, color: '#7AB' },
  {  },
  { label: [...labels[4], " - Judged by abstract"] },
  { label: labels[7], value: 9, color: '#943' },
  { label: labels[6], value: 15, color: '#943' },
  { label: labels[5], value: 54, color: '#B98' },
  { label: [...labels[4], " - Full papers judged by author*"] },
  { label: labels[7], value: 9, color: '#943' },
  { label: labels[6], value: 5, color: '#943' },
  { label: labels[5], value: 23, color: '#B98' },
];

var legend = [
  { name: '', },
];

var plateTectonics = [
  { label: [<b style={ {color:'#067'} }>Endorse Plate Tectonics</b>, " - Judged by abstract"] },
  { label: [<div style={ {marginLeft:15} }>Explicitly</div>],              value: 0, color: '#079' },
  { label: [<div style={ {marginLeft:15,color:'#444'} }>Implicitly</div>], value: 65, color: '#7AB' },
  {  },
  { label: [<b style={ {color:'#832'} }>Reject Plate Tectonics</b>, " - Judged by abstract"] },
  { label: [<div style={ {marginLeft:15} }>Explicitly</div>],              value: 0, color: '#943' },
  { label: [<div style={ {marginLeft:15,color:'#444'} }>Implicitly</div>], value: 0, color: '#B98' },
];

ReactDOM.render(
  <div>
    <h3>In ordinary HTML (generated by React, of course)</h3>
    <hr style={ {margin:50} }/>
    <BarChart title="Number of papers related to global warming/climate change" 
              data={graphData2} maxBarWidth={685}
              formatter={value => value+''}/>
    <p>* Survey response rate: 14%</p>
    <ul>
      <li>35.5% of self-rated papers and 66.4% of abstracts took no position.</li>
      <li>About 0.5% of "no position" abstracts indicated that the cause of global warming was uncertain (extrapolated).</li>
    </ul>
    <p>Source: <i>Quantifying the consensus on anthropogenic global warming in the scientific literature</i> (<a href="http://iopscience.iop.org/article/10.1088/1748-9326/8/2/024024">Cook et al. 2013</a>)</p>
    <hr style={ {margin:50} }/>
    <p>When a scientific field reaches 100% consensus, virtually all endorsements are implicit (<a href="https://skepticalscience.com/docs/Skuce_2017_consensus.pdf">Skuce et al 2017</a>):</p>
    <BarChart title="Number of geology papers (recent articles from two journals)"
              data={plateTectonics} maxBarWidth={700}
              formatter={value => value+''}/>
    <p><i>Note: the above does not include 75% of papers that take no position on plate tectonics.</i></p>
    <p>Source: <i>Does it matter if the consensus on anthropogenic global warming
is 97% or 99.99%?</i> (<a href="https://skepticalscience.com/docs/Skuce_2017_consensus.pdf">Skuce et al. 2017</a>)</p>
  </div>,
  document.getElementById('app') 
)
