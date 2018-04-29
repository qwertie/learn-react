Part 3: Understanding React
===========================

Part 1: Why do people like React?
---------------------------------

Throughout history there have been many different ways of synchronizing an internal collection of data (the Model) with the graphical user interface (GUI or UI) that a user sees (also known as the View). In my early days as a programmer, I would synchronize manually. So if I had a textbox (which in HTML is called `<input type="text">`) I would have to install an event handler to find out when the textbox changed, and I would write some code to copy its value into an internal variable. When the internal variable changed, I would have to manually call a function whose job is to copy the model into the view.

This wasn't difficult in simple cases, but it tended to become much harder as the user interface got more complicated. Particularly when GUI widgets (a.k.a. controls, or "components" in React) depend on each other in complicated ways, or when multiple parts of the user interface showed the same, changing, information (which had to stay synchronized), it was hard to handle every situation that could possibly arise. Inevitably, the user interface would be buggy and needed a lot of testing, and the code would be messy, tightly coupled, and difficult to change.

The most common technique to make it easier to create user interfaces is probably [data binding](https://en.wikipedia.org/wiki/Data_binding), but by itself it doesn't solve the problem entirely. So beyond that people typically use [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) or [MVVM](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel). These techniques, I have found, don't make the code *easier* to write, because they tend to involve a bunch of boilerplate and duplication of concepts in different places. However, these techniques make the code less buggy, better-encapsulated, more readable, more scalable and easier to maintain. Beyond that, there are other ideas floating around to automate the synchronization between model and view, such as [C#'s Update Controls](http://updatecontrols.net/cs/index.html).

React is none of these things. Instead, React resembles the idea of immediate-mode user interfaces that was [invented/described by Casey Muratori in 2005](https://www.youtube.com/watch?v=Z1qyvQsjK5Y). The idea of immediate-mode user interfaces is to *eliminate* the problem of synchronizing the View and Model by "eliminating" the View. 

What do I mean by that? Obviously the view must exist in some sense, since you can see it on the screen. In the old world of desktop development, GUI widgets are objects that belong to the operating system. They have a long life cycle: you create a window filled with widgets, and those widgets exist as long as the user can see them.

In immediate-mode UIs, often used in game programming, widgets only have the illusion of permanence. In reality they exist long enough to be drawn on the screen, and checked against user input, and then they are deleted. A game with an immediate-mode UI will regenerate and redraw the entire UI from the underlying data model about 60 times per second. In this style of UI, there is no need to "synchronize" the UI with the model; the model is what "really" exists and the view is merely a temporary index that points into the model.

So in immediate mode, if there is a text box with the word "Hello" in it, it's directly showing the value `"Hello"` from the underlying model, and if there is a blinking cursor after the 'H', there must be another variable in the model (or in an extra data structure separate from the model) with the value `1` to represent the current location of the cursor. Although this style of programming requires you to include view-related state (such as the cursor position) alongside/inside your model, it is arguably an easier way of UI programming because it eliminates almost every bug and challenge with synchronizing the model with the view.

That's *fundamentally not* how a web browser works, though. A web browser "owns" all the user interface elements on the screen and (unless you are drawing *everything* on a `<canvas>` element) attempting to simulate immediate-mode drawing is not practical because it would be highly inefficient to destroy and recreate the entire [DOM](https://en.wikipedia.org/wiki/Document_Object_Model) constantly.

The innovation of React is that it approximates the advantage of immediate-mode UIs (less work to synchronize the model with the view) in a non-immediate-mode environment (a web browser). It also eliminates the main disadvantage of immediate-mode UIs: you don't have to keep track of view state such as the cursor position.

So in React, you specify the structure of your UI, but you don't say how to *modify* that UI when the model changes. Instead, whenever something changes, the UI is regenerated.

This would be slow if it were done naïvely, but React has a clever way of speeding up the process. First, even though you can write your code in JSX which *looks* like HTML, you're not making DOM elements, you're making plain-old JavaScript objects. For example `<img src={imageUrl}/>` actually means `React.createElement("img", { src: imageUrl })` in a .jsx or .tsx file.

Second, React doesn't *actually* destroy and recreate the DOM; instead it *compares* the DOM to the JavaScript tree you created, and figures out how to change the DOM *as little as possible* to make it match your tree. This is much faster when there are few changes.

Glitchy types
-------------

You may find that TypeScript is overly picky in JSX. For example, it accepts this code:

~~~ts
let test = <div style={{textAlign:'right'}}>Text</div>;
~~~

But it rejects this code:

~~~ts
let right = 'right';
let test = <div style={{textAlign: right }}>Text</div>;
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
let test = <div style={{textAlign:right as TextAlignProperty} as any}>Text</div>;
~~~

TypeScript will just say "`Cannot find name 'TextAlignProperty'`. There are two workarounds. The easy one is "as any":

~~~ts
let right = 'right';
let test = <div style={{textAlign:right} as any}>Text</div>;
~~~

The CSS types are defined in *node_modules/csstype/index.d.ts* (a dependency of *node_modules/@types/react*). So we can import and use them like this:

~~~ts
import * as CSS from 'csstype'; // at top of file

let right = 'right';
let test = <div style={{textAlign:right as CSS.TextAlignProperty}}>Text</div>;
~~~

But there is an easier way:

~~~ts
let right = 'right';
let test = <div style={{textAlign:right} as any}>Text</div>;
~~~

This article can be shared and modified under the [CC-BY-SA license](https://creativecommons.org/licenses/by-sa/4.0/).


Debugging (optional)
---------------------

