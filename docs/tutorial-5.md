Part 5: Understanding React by Example
======================================

So, Why do people like React?
-----------------------------

There have been many different ways of synchronizing an internal collection of data (the Model) with the graphical user interface (GUI or UI) that a user sees (also known as the View). In my early days as a programmer, I would often synchronize manually. So if I had a textbox (which, in HTML, is called `<input type="text">`) I would have to install an event handler to find out when the textbox changed, and I would write some code to copy its value into an internal variable. When the internal variable changed, I would have to manually call a function whose job is to copy the model into the view. (In simple cases, I could skip this work and do nothing until the user clicks "OK" or "Submit".)

Often this wasn't difficult, but it became harder as the user interface got more sophisticated. If GUI widgets (a.k.a. Windows controls, Android views, etc.) depend on each other in complicated ways, or if multiple parts of the user interface showed the same, changing, information (which had to stay synchronized), it became challenging to handle every situation that could possibly arise. As complexity rose, bugs tended to appear in the user interface, and the code tended to be be messy and non-modular.

The most common technique to make it easier to create user interfaces is probably [data binding](https://en.wikipedia.org/wiki/Data_binding), but by itself it doesn't solve the problem entirely (and it still requires manually initiating synchronization from model to view). So beyond that, people typically use [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) or [MVVM](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel). These techniques, I have found, don't make the code *easier* to write, because they tend to involve a bunch of boilerplate and duplication of concepts in different places. However, these techniques make the code cleaner, better-encapsulated, more scalable and easier to maintain (especially in large programs). Beyond that, there are other ideas floating around to automate the synchronization between model and view, such as [C#'s Update Controls](http://updatecontrols.net/cs/index.html).

React is none of these things. Instead, React resembles the idea of immediate-mode user interfaces that was [invented/described by Casey Muratori in 2005](https://www.youtube.com/watch?v=Z1qyvQsjK5Y). The idea of immediate-mode user interfaces is to *eliminate* the problem of synchronizing the View and Model by "eliminating" the View. 

What do I mean by that? Obviously the view must exist in some sense, since you can see it on the screen. In the old world of desktop development, GUI widgets are objects that belong to the operating system. They have a long life cycle: you create a window filled with widgets, and those widgets exist as long as the user can see them.

In immediate-mode UIs, often used in game programming, widgets only have the *illusion* of permanence. In reality they exist long enough to be drawn on the screen, and checked against user input, and then they are deleted. A game with an immediate-mode UI will regenerate and redraw the entire UI from the underlying data model about 60 times per second. In this style of UI, there is no need to "synchronize" the UI with the model; the model is what "really" exists and the view is merely a temporary index that points into the model.

So in immediate mode, if there is a text box with the word "Hello" in it, it's directly showing the value `"Hello"` from the underlying model, and if there is a blinking cursor after the 'H', there must be another variable in the model (or in an extra data structure separate from the model) with the value `1` to represent the current location of the cursor. Although this style of programming requires you to include view-related state (such as the cursor position) alongside/inside your model, it is arguably an easier way of UI programming because it eliminates almost every bug and challenge with synchronizing the model with the view.

Let's consider the example of a user interface for a calendar entry in a Calendar app. 

![Calendar entry UI](calendar-ui.png)

We want a user interface for defining both all-day events and normal short events, so

- When "All day" is checked or unchecked, all the other "time range" widgets need to be hidden or shown.
- We want the user to be able to tell us either an end time or the length of the event, so the two parts of the third row must stay in sync somehow.
- Finally, if the user chooses a time from the fourth row then the "Alarm" checkbox should be checked automatically.

We might have a model with these data members:

~~~ts
class CalendarEvent {
  name:         string;
  allDay:       boolean;
  startTime:    Date;
  endTime:      Date;
  alarmMinutes: number;
}
~~~

In traditional user interface code, you would respond to a change in the "All day" checkbox or the `allDay` flag by somehow causing the "time range" widgets to be shown or hidden. The code that causes this change might be an event handler in the view, or, if you are using the MVVM pattern, it would be an event generated by the model; either way, a signal is sent **manually**.

By contrast, in immediate mode, we simply write code to create the view (associated somehow with a  model). When the view is changed by the user, the view changes the model, but it doesn't synchronize different parts of itself: there is no code to show or hide things. Likewise, in the model, there is no code to generate "events".

However, immediate mode is *fundamentally not* how a web browser works. A web browser "owns" all the user interface elements on the screen. Unless you are drawing *everything* on a `<canvas>` element, it is not practical to directly simulate immediate mode because it would be highly inefficient to destroy and recreate the entire [DOM](https://en.wikipedia.org/wiki/Document_Object_Model) frequently.

The innovation of React is that it simulates the advantage of immediate-mode UIs in a non-immediate-mode environment. This could be slow if it were done naïvely, but React speeds up the process by figuring out how to change the DOM as little as possible; it changes only parts of the DOM that are different now.

As a side effect of *not* changing elements that have not changed, React eliminates the main disadvantage of immediate-mode UIs: you **don't** have to keep track of standard view state such as the cursor position. For example, if a user types "Daily run" into a textbox, which causes "Daily run" to be saved into the model, then React will render a new user interface tree. As long as the new tree still includes a textbox that says "Daily run", React will not change the existing textbox, and therefore the cursor position in the textbox will remain unchanged.

Example #0: Hello, world!
-------------------------

These examples in this tutorial can use the same HTML file, such as this one:

~~~html
<!DOCTYPE html>
<html>
<head>
  <title>App</title>
  <meta charset="utf-8"/>
</head>
<body>
  <h1>React app</h1>
  <div id="app"></div>
  <script src="app.tsx"></script><!-- This line requires Parcel -->
</body>
</html>
~~~

Let's start with a "Hello" component, just to learn what a React component looks like:

~~~ts
import * as React from 'react';
import * as ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
      return <h2>Hello!!</h2>;
  }
}

ReactDOM.render(<App/>, document.getElementById("app"));
~~~

This code just puts **Hello!!** on the screen. It illustrates how you typically write a React program: 

1. Import `'react'` and `'react-dom'`. 
2. Write a class that `extends React.Component` and contains a `render()` function. 
3. Call `ReactDOM.render` to draw the component on the screen.

`document.getElementById` is a function built into all web browsers; it is used to find an element that has a particular `id` attribute. In this case it returns the element represented by `<div id="app"></div>` in our HTML code.

If you use F12 in your web browser to find out the final element tree of the page, it is very simple:

~~~html
<div id="app"><h2>Hello!!</h2></div>
~~~

Now let's learn about "properties" (props). Properties are data given to a component from its container (or from the `render` call):

~~~tsx
// (After this example, I will omit the import commands which are always the same)
import * as ReactDOM from 'react-dom';
import * as React from 'react';

class App extends React.Component<{message: string}> {
  render() {
      return <h2>{this.props.message}</h2>;
  }
}

ReactDOM.render(<App message="Hello, world!"/>, 
                document.getElementById("app"));
~~~

The part that says `React.Component<{message:string}>` indicates that `React.Component` has a single type parameter, which is `{message:string}`. The first type parameter of `React.Component` controls the type of `this.props`. Therefore, the type of `this.props` is `{message:string}`. What does that mean? It means that `this.props` contains a single property called `message`, and it is a `string`.

This is a bit unusual. In some other programming languages, every type has a name, such as `string` or `double` or `Component`. In TypeScript, many types do have names (e.g. `React.Component` is a type name) but, more fundamentally, most types are defined by their structure... even if they do have a name. `{message:string}` is an example of a "structural" type: it is a type defined entirely by the fact that it has a property called `message` which is a `string`.

When you are writing the JSX code to create a React component, properties are written like XML attributes, so in this case the attribute `message="Hello, world!"` sets `this.props.message` to the string `"Hello, world!"`.

Example #1: Random facts
------------------------

Now let's make a bigger page, something with not one but **two** props! It will look like this:

![](1-random-facts.png)

We'll need some CSS to style it, so we'll use an `app.css` file with this style code:

~~~css
.fact, .warning, .tip {
    padding: 0.3em;
}
.fact { 
    background-color: #eee;
    border: 1px solid #ccc;
}
.warning { 
    background-color: #fcc;
    border: 1px solid #f88;
}
.tip { 
    background-color: #ffc;
    border: 1px solid #cc4;
}
~~~

I assume you've learned about CSS already so I won't explain this part. We will also need to import that css into our html file, by adding a `<link>` element to the `<head>` of our `index.html` file:

~~~html
  <link rel="stylesheet" href="app.css">
~~~

You don't actually have to follow all these instructions, by the way. You can just download the completed examples from the [learn-react repository](https://github.com/qwertie/learn-react):

1. Click the "Clone or download" button and choose "Download ZIP" on that page.
2. Unzip the master.zip file that you downloaded
3. Go into the `react-examples` folder inside the unzipped folder
4. Go into `1-RandomFacts` subfolder 
5. Run `run.cmd` to serve the example from Parcel.
6. Visit `127.0.0.1:1234` or whatever address Parcel says the server is using.

Now that our CSS is set up, here is the React code that will generate the page:

~~~tsx
class Para extends React.Component<{type?: string, text: string}> {
  render() {
    // Create a list of ReactNodes which will be the children of a <p> element.
    let children: React.ReactNode[] = [ this.props.text ];
    // Find out if type contains a capital letter.
    let type = this.props.type || '';
    if (type !== type.toLowerCase()) {
      // It has a capital letter, so include it before the text, in bold.
      children.unshift(': ');
      children.unshift(<b>{type}</b>);
    }
    return <p className={type.toLowerCase()}>{children}</p>;
  }
}

ReactDOM.render(
  <div>
    <Para type="tip" text="This is a page of random facts."/>
    <Para text="But the facts are irrelevant. They're just an excuse to use React."/>
    <Para type="Fact" text="React is popular."/>
    <Para type="Fact" text="It is a myth that people use only 10% of their brains."/>
    <Para type="Warning" text="Grenades are dangerous."/>
    <Para type="Warning" text="Imagined facts may be false."/>
    <Para type="Tip" text="Is your Component not shown?
        Press F12 and look for clues about what error occurred."/>
  </div>,
  document.getElementById('app'));
~~~

This time, `this.props` has this type: `{type?: string, text: string}`. So both of the properties have type `string`, and the question mark indicates that `type` is optional. I would also draw your attention to the `ReactDOM.render` call. Our page contains multiple paragraphs, but `ReactDOM.render` can only accept one element to render. Therefore, we must enclose all the `Para`s in one `div` element, and then we give the `div` element to `ReactDOM.render`.

A strange thing in the `<p>` element is the `className` attribute. You are not allowed to use the `class` attribute in React; you must use `className` instead (don't ask me why; Preact allows you to use `class` but React does not.)

The `Para` component has some relatively complicated logic. The `type` property sets the `class` of each element (as you can see in the first paragraph), but if you use any capital letters in the `type` then it also becomes part of the text of the paragraph (as you can see in most of the other paragraphs).

TypeScript code tends to be a little longer than normal JavaScript code because it contains some type annotations. In this program there are two type annotations. One of them is the type parameter on `React.Component<{type?: string, text: string}>`; in normal JavaScript you would simply write `React.Component` because the entire concept of type parameters does not exist in JavaScript. We receive benefits from this longer code, because VS Code will tell us with a red underline when we have used a component incorrectly...

![](intellisense-3a.png)

...and it can also tell us what properties are available on any component (although unfortunately it incorrectly shows a lot of extra things on the list... hopefully that will be fixed in the future):

![](intellisense-3b.png)

The other type annotation appears on the `children` variable; TypeScript needs me to write this:

    let children: React.ReactNode[] = [ this.props.text ];

but plain JavaScript must be written without the type annotation as

    let children = [ this.props.text ];

The type annotation is important because `this.props.text` is a string. If the type annotation is left out, TypeScript will infer that `children` is an array of strings (`string[]`), but it actually needs to be an array of React nodes. A string is one of the legal kinds of React nodes, but you can see that our code sometimes adds a `<b>` element to the array, which is definitely not a `string` (it's a `JSX.Element`):

~~~tsx
      children.unshift(': ');
      children.unshift(<b>{type}</b>);
~~~

Since TypeScript is based on JavaScript, it inherits all the strange names that JavaScript uses. Who would have guessed that `unshift` means "add something to the beginning of the array"? Anyway, if the `type` is `"Fact"` and `text` is `"React is popular"` then you can imagine that our `children` array will end up with these three items in it: 

~~~tsx
  [<b>Fact</b>, ": ", "React is popular"]
~~~

**Tip:** How did I figure out that `children` should have type `React.ReactNode[]`? Believe it or not, I'm actually a beginner at React (I enjoy writing tutorials as part of my learning process.) Well, I already knew that JSX translates into `React.createElement` which is a function that takes 3 arguments:

1. The type of element or Component to create
2. An object that contains some properties (or `null` if no properties)
3. A list of children.

Knowing this, I typed `React.createElement(` in VS Code, which causes it to tell me the types of the three arguments:

![](intellisense-4.png)

Surprisingly there seem to be 8 different versions of `createElement`, but all of them have the same type for their third argument: `React.ReactNode[]`. So that's the type I used for our `children` variable. I don't know why it says `...` in the pop-up box, but apparently those dots aren't important right now.

**Fun fact:** we're asking React to create two plain-text nodes in a row: one is `": "`, the other is `"React is popular"`. We can see them both in the Chrome debugger:

![](1-two-text-nodes.png)

I find that interesting because in normal HTML, it's impossible to write two separate text nodes side-by-side like this. The DOM allows it but HTML does not, and so if you convert the DOM to HTML, the two text nodes are merged into one.

Example #2: The button thing from Part 2
----------------------------------------

![](mini-react-app.png)

~~~tsx
class App extends React.Component<{greeting: string}, {count:number}> {
  state = {count: 0};
  render() {
      return (
          <div>
              <h2>{this.props.greeting}</h2>
              <button onClick={() => this.setState({count: this.state.count+1})}>
                This button has been clicked {this.state.count} times.
              </button>
          </div>);
  }
}

ReactDOM.render(
  <App greeting="Hello, world!"/>,
  document.getElementById('app')
);
~~~

This example introduces the concept of state, which is required if the user can make changes to the data in the program. The state of an object is the second type parameter to `React.Component`, in this case `{count:number}`, which means, the state is an object that has a `count` property of type `number`.

**You are not allowed to change the state of a component directly.** Don't write `this.state.count += 1`; instead you must create a _new_ state object and pass that new object to `this.setState`, as demonstrated in the `onClick` handler in this example:

    this.setState({count: this.state.count+1});

This example demonstrates very simple and basic state. As our program gets more complex, we will have to think more carefully about how we deal with state; usually it's not this simple.

Example #3: Bar graph
---------------------

You don't need a fancy graphics package just for a bar chart; HTML alone can do them pretty well, so that's what our next example will do.

This example introduces two new things:

1. Defining multiple components in one page. React programs usually contain many components so it's important to learn to break up your user interface into parts.
2. The representation of CSS styles in React.

![](bar-graph.png)

First let's define a component that decides how to draw a single bar in the bar chart, including the label on the left-hand side. To make sure the left-hand side of each bar lines up with every other bar in the chart, we will draw the bar chart as a two-column table (left column: labels, right column: bars). Each label has an asterisk on it which is actually a link to the source of the data for that bar (I guess that's an unintuitive way to link to my sources, but a better idea didn't come to mind.) The size and color of each bar will be controlled by inline styles.

For example, here is the HTML of the first bar in the chart (`tr` = table row, `td` = table cell):

~~~html
<tr>
  <td>New fossil fuel plants<a href="https://www.iea.org/publications/wei2017/">*</a></td>
  <td><span style="display: inline-block; width: 500px; background-color: rgb(52, 73, 39); color: rgb(255, 255, 255); text-align: right; padding: 10px 5px 10px 0px;">$117.2 billion</span></td>
</tr>
~~~

And here's the `Bar` component that generates the code:

~~~tsx
// Expected format of bar chart items and properties
interface BarItem {
  name: string;   // label for this bar
  value: number;  // value of the bar
  source: string; // citation/reference URL
}
interface BarProps {
  item: BarItem;
  maxValue: number; // value of largest bar
  maxWidth: number; // width in pixels of largest bar
  formatter(value:number): string; // converts BarItem.value to a string
}

class Bar extends React.Component<BarProps,{color:string}>
{
  state = { color: this.randomColor() };
  render() {  
    const width = this.props.item.value / this.props.maxValue * this.props.maxWidth;

    const style = { display: 'inline-block', width: width,
               backgroundColor: this.state.color, color: '#ffffff', 
               textAlign: 'right', padding: '10px 5px 10px 0' };
    const formatted = (this.props.formatter || (x => x))(this.props.item.value);

    // If the bar isn't very wide, write value on the right side of the bar 
    if (this.props.item.value * 2 < this.props.maxValue)
      var bar = <td>
            <span style={style as any}
              onClick={() => this.setState({ color: this.randomColor() })}>
              {'\u00A0' /* &nbsp; causes bar to have the correct height*/}
            </span>{" "+formatted}
          </td>;
    else
      // Otherwise, write the bar's value inside the bar
      var bar = <td>
            <span style={style as any}
              onClick={() => this.setState({ color: this.randomColor() })}>
              {formatted}
            </span>
          </td>;
    return (
        <tr>
          <td>{this.props.item.name}<a href={this.props.item.source}>*</a></td>
          {bar}
        </tr>);
  }
  randomColor() {
    // Choose an appropriate color for the bar
    return '#' + (Math.random() * 900000 + 100000 | 0).toString();
  }
}
~~~

As you can see, the _data_ for a bar is in the `BarItem` interface and the _props_ for a bar is `BarProps`. Another point of interest is the state, which holds the bar color. If you click on a bar it will change color.

You can also see that React supports inline styles in an interesting way: instead of writing CSS code, you create a JavaScript object that merely _resemble_ CSS code. The name of the styles must be camelCased (e.g. `text-align` becomes `textAlign`) and if numbers are used as sizes, React assumes they are measured in pixels.

A `BarChart` will consist of a series of `Bars` in a table:

~~~tsx
interface BarChartProps {
  title: string;       // title shown above the bars (second column)
  data: BarItem[];     // data items to show
  maxBarWidth: number; // width in pixels of largest bar
  formatter(value:number): string; // converts BarItem.value to a string
}

class BarChart extends React.Component<BarChartProps,{}> {
  render() {
    const maxValue = this.props.data
          .map(item => item.value)
          .reduce((x,y) => Math.max(x,y), 0);
    return (
      <table>
        <thead><tr>
          <th></th><th>{this.props.title}</th>
        </tr></thead>
        <tbody>
          {this.props.data.map(item => 
            <Bar item={item} maxValue={maxValue} maxWidth={this.props.maxBarWidth} formatter={this.props.formatter} key={item.name}/>)}
        </tbody>
      </table>);
  }
}
~~~

Originally my `<table>` didn't have `<thead>` or `<tbody>` elements. It worked perfectly, but React complained about the lack of `<tbody>` in the browser console, so I changed the code. React also complained that *'Each child in an array or iterator should have a unique "key" prop.'*, so I added a `key` property to Bar; the reason for `key` properties is [discussed in the React documentation](https://reactjs.org/docs/lists-and-keys.html#keys).

Finally we need to define the data (an array of `BarItem[]`) and call `ReactDOM.render`:

~~~tsx
var graphData = [
  //{ name: 'Oil market revenue', value: 1700, source: 'http://www.visualcapitalist.com/size-oil-market/' },
  { name: 'New fossil fuel plants', value: 117.2, source: 'https://www.iea.org/publications/wei2017/' },
  { name: 'New solar plants', value: 114, source:  'http://fs-unep-centre.org/sites/default/files/publications/globaltrendsinrenewableenergyinvestment2017.pdf' },
  { name: 'New wind plants', value: 112, source: 'http://fs-unep-centre.org/sites/default/files/publications/globaltrendsinrenewableenergyinvestment2017.pdf' },
  { name: 'New nuclear plants', value: 26.3, source: 'https://www.iea.org/publications/wei2017/' },
  { name: 'New geothermal', value: 3, source: 'http://fs-unep-centre.org/sites/default/files/publications/globaltrendsinrenewableenergyinvestment2017.pdf' },
  { name: 'New hydro', value: 3, source: 'http://fs-unep-centre.org/sites/default/files/publications/globaltrendsinrenewableenergyinvestment2017.pdf' }
];

ReactDOM.render(
  <div>
    <h3>In ordinary HTML (generated by React, of course)</h3>
    <BarChart title="2017 Worldwide Spending (USD)" 
              data={graphData} maxBarWidth={500}
              formatter={value => '$'+value+' billion'}/>
  </div>,
  document.getElementById('app') 
)
~~~

One more thing, the chart looks better with a little CSS:

~~~css
body    { font-family: sans-serif; }
a       { text-decoration: none; }
a:hover { text-decoration: underline; }
~~~

#### Exercises for the reader: ####

- Change the bar chart to support [stacking](https://www.google.com.ph/search?q=stacked+bar+chart&num=20&tbm=isch) (e.g. each bar is composed of 2 or more smaller bars with different colors "stacked" end-to-end)
- Change the bar chart to support negative numbers. You can do this by adding a third column dedicated to negative numbers between the two existing columns; you'll need to reduce the margin/padding to zero between the second and third columns.
- Cheat by searching the internet for someone else's solution.

Example #3: Calendar event editor
---------------------------------

Let's create a React-based editor for the `CalendarEvent` model above. Let's start by making an HTML mockup of the user interface, without React. The mockup could use this code:

~~~html
  <h1>Edit Calendar Entry</h1>
  <div style="width: 300px">
    <style>
      p { margin: 5px; font-size: 100%; font-family: sans-serif; }
      input, select { border: 1px solid #cde; }
    </style>
    <p><input type="text" style="width:250px" value="Daily run"></p>
    <p style="float: right; margin: 0 40px 0 0;"><input type="checkbox">All day</p>
    <p>Start time 
      <input type="text" list="times" style="width:70px" name="startTime">
      <datalist id="times">
        <option value="12:00am"><option value="12:30am">
        <option value="1:00am"><option value="1:30am">
        <option value="2:00am"><option value="2:30am">
        <option value="3:00am"><option value="3:30am">
        <option value="4:00am"><option value="4:30am">
        <option value="5:00am"><option value="5:30am">
        <option value="6:00am"><option value="6:30am">
        <option value="7:00am"><option value="7:30am">
        <option value="8:00am"><option value="8:30am">
        <option value="9:00am"><option value="9:30am">
        <option value="10:00am"><option value="10:30am">
        <option value="11:00am"><option value="11:30am">
        <option value="12:00pm"><option value="12:30pm">
        <option value="1:00pm"><option value="1:30pm">
        <option value="2:00pm"><option value="2:30pm">
        <option value="3:00pm"><option value="3:30pm">
        <option value="4:00pm"><option value="4:30pm">
        <option value="5:00pm"><option value="5:30pm">
        <option value="6:00pm"><option value="6:30pm">
        <option value="7:00pm"><option value="7:30pm">
        <option value="8:00pm"><option value="8:30pm">
        <option value="9:00pm"><option value="9:30pm">
        <option value="10:00pm"><option value="10:30pm">
        <option value="11:00pm"><option value="11:30pm">
      </datalist>
    </p>
    <p>End time: 
      <input type="text" list="times" style="width:70px">
      (<input type="number" style="width:40px" value="0.5" step="0.25" min="0" max="24"> hours).</p>
    <p><input type="checkbox" checked>Alarm
       <input type="number" style="width:40px" value="5" min="0" max="720"> minutes before
    </p>
  </div>
~~~

Unfortunately the `datalist` element doesn't behave in a useful way (the dropdown list becomes useless once a time is selected) but it's a reasonable starting point.

*gasp*

Learn More
----------

Sorry, this article is not yet complete. I recommend reading [Thinking in React](https://reactjs.org/docs/thinking-in-react.html) or [some other tutorial](https://www.google.com.ph/search?q=react+tutorial).

Picky typing in JSX
-------------------

You may find that TypeScript is overly picky in JSX. For example, it accepts this code:

~~~ts
let test = <div style={ {textAlign:'right'} }>Text</div>;
~~~

But it rejects this code:

~~~ts
let right = 'right';
let test = <div style={ {textAlign: right } }>Text</div>;
~~~

Its complaint:

~~~
Type '{ style: { textAlign: string; }; }' is not assignable to type 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.
  Type '{ style: { textAlign: string; }; }' is not assignable to type 'HTMLAttributes<HTMLDivElement>'.
    Types of property 'style' are incompatible.
      Type '{ textAlign: string; }' is not assignable to type 'CSSProperties'.
        Types of property 'textAlign' are incompatible.
          Type 'string' is not assignable to type 'TextAlignProperty'.
~~~

Totally insane, right? And don't try fighting back with

~~~ts
let right = 'right';
let test = <div style={ {textAlign:right as TextAlignProperty} }>Text</div>;
~~~

TypeScript will just say "`Cannot find name 'TextAlignProperty'`. There are two workarounds. The easy one is "as any":

~~~ts
let right = 'right';
let test = <div style={ {textAlign:right} as any }>Text</div>;
~~~

The CSS types are defined in *node_modules/csstype/index.d.ts* (a dependency of *node_modules/@types/react*). So another option is to import and use them like this:

~~~ts
import * as CSS from 'csstype'; // at top of file

let right: CSS.TextAlignProperty = 'right';
let test = <div style={ {textAlign:right} }>Text</div>;
~~~

The End
-------

The examples here are in a [repository on GitHub](https://github.com/qwertie/learn-react), and Google offers a [lot more](https://www.google.com.ph/search?q=react+examples). I hope you learned a lot! If you have comments, [leave a message](https://github.com/qwertie/learn-react/issues/new) in the [issue tracker](https://github.com/qwertie/learn-react/issues).
