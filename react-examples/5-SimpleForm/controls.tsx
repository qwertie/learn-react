import * as React from "react";
export * from './hold';

/** A wrapper around a value. */
export type Holder<T> = { val: T; }

/** Labeling properties that can be attached to labelable elements such as
 *  Label, TextBox, TextArea, CheckBox, Radio, Button, and Slider. */
export interface LabelProps {
  /** If true, the label element is wrapped in a `<p>` element to add a line break. */
  p?: boolean;
  /** The label text string or element that is placed in a span, just inside the label. */
  label?: React.ReactNode;
  /** The className of the span that holds the label text (the default is h-label). */
  labelClass?: string;
  /** Styles of the label text (not the label element, but the text inside, which is a span.) */
  labelStyle?: React.CSSProperties;
  /** If true, the label text comes after the (child) element instead of before 
   *  (and the default class/style, if any, is not applied) */
  labelAfter?: boolean;
}

/** Default class and style of LabelSpan (Label's text span) when 
 *  labelClass, labelStyle and labelAfter props are not specified. */
export var DefaultLabelSpan = { class: "labelspan", style: undefined };

/** Wraps elements or components in a `<label>` element (and optional `<p>` element),
 *  for example, `<Label label="Hello"><TextBox value={x}/></Label>` becomes
 *  
 *      <label>
 *        <span style={DefaultLabel.style} class={DefaultLabel.class}>Hello</span>
 *        <TextBox value={x}/>
 *      </label>
 */
export function Label(p: LabelProps & React.HTMLAttributes<HTMLElement>)
{
  var label = React.createElement("label", omit(p, LabelAttrs), 
    ...(p.labelAfter ? [p.children, LabelSpan(p)] : [LabelSpan(p), p.children]));
  return p.p ? <p>{label}</p> : label;
}

export function LabelSpan(p: LabelProps)
{
  var auto = !(p.labelStyle || p.labelClass || p.labelAfter);
  return <span className={auto ? DefaultLabelSpan.class : p.labelClass} 
                   style={auto ? DefaultLabelSpan.style : p.labelStyle}>{p.label}</span>;
}

function LabelOrP(p: LabelProps & React.HTMLAttributes<HTMLElement>)
{
  return p.p && p.label === undefined ? <p>{p.children}</p> : Label(p);
}

/** Attributes that apply to all `input` elements including simple buttons */
export interface InputAttributesBase extends React.HTMLAttributes<HTMLElement>, LabelProps {
  /** If true, the label element is wrapped in a `<p>` element to add a line break. */
  p?: boolean;
  /** If this property is present, the form element will be wrapped in a <label> */
  label?: string;
  /** Class name of the label element, if the label property is used. */
  labelClass?: string;
  /** Styles of the label text (not the label element, but the text inside, which is a span.)
   *  If there is no labelClass and no labelStyle then DefaultLabelStyle is used. */
  labelStyle?: React.CSSProperties;
  /** Prevents the user from interacting with the input. */
  disabled?: boolean;
  /** Specifies that the input should have focus when the page loads. */
  autoFocus?: boolean;
  /** The form element that the input element is associated with (its form owner). The value of the attribute must be an id of a <form> element in the same document. If this attribute isn't used, the <input> element is associated with its nearest ancestor <form> element, if any. */
  form?: string;
  /** The position of the element in the tabbing navigation order for the current document. */
  tabIndex?: number;
  /** Specifies that the user must fill in a value before submitting a form. The :optional and :required CSS pseudo-classes will be applied to the field as appropriate. */
  required?: boolean;
}

/** Attributes that apply to `<input>` buttons */
export interface ButtonAttributes extends InputAttributesBase {
  type?: "button"|"submit"|"reset"|"file";
}

/** Attributes that apply to all `input` elements except buttons */
export interface InputAttributes<T> extends InputAttributesBase {
  /** Current value associated with the form element. */
  value: Holder<T>;
  /** Prevents the user from modifying the value of the input (without changing the widget's appearance) */
  readOnly?: boolean;
  /** The name of the control, which is submitted with the control's value as part of the form data. */
  name?: string;
  /** CSS styles. */
  style?: React.CSSProperties;
}

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

/** Properties of a Radio component. Example: `<Radio value={model.fruit} is="apple"/>` */
type RadioAttributes<T> = (T extends boolean ? {is?: T} : {is: T}) & Omit<InputAttributes<T>,"is">;

/** Attributes supported by Slider and its underlying `<input type="range">` element.
 *  Only horizontal sliders are supported in most browsers. */
export interface SliderAttributes extends InputAttributes<number> {
  /** The minimum (numeric or date/datetime) value for this input */
  min: number;
  /** The maximum (numeric or date/datetime) value for this input */
  max: number;
  /** Works with the min and max attributes to limit the increments at which a numeric or date-time value can be set. If this attribute is not set to any, the control accepts only values at multiples of the step value greater than the minimum. */
  step?: number;
  /** Indicates the kind of text field this is so that the field can be
   *  completed by the browser automatically. */
  autoComplete?: string;
  /** Points to a `<datalist>` which can specify the location of tick 
   *  marks on the slider (not supported by all browsers; may require
   *  styling datalist's display property to make it visible). */
  list?: string;
}

interface BaseInterface<T> {}
interface DerivedInterface_<T> extends BaseInterface<T> {
  type?: "text"|"url"|"tel"|"email"|"password"|"number"|"search"|"color"|
         "time"|"date"|"datetime"|"datetime-local"|"month"|"week"|"hidden";
  /* ... other props */
}

type ConvertsToString<T> = T extends string ? {} : 
     {parse: Parse<T>} &
       (T extends {toString(): string} ? {} : {stringify(t:T): string});

type Parse<T> = (input:string, oldValue: T) => T|Error;

export interface TextAttributesBase<T> extends InputAttributes<T> {
  /** A function that parses the input string into the internal format
   *  expected by the model. This function is called on every keypress. 
   *  If an error is returned, the error message is associated with the 
   *  element using the setCustomValidity() method of HTML5 elements.
   */
  parse?: Parse<T>;
  /** A function that converts the current T value to a string for 
   *  display in the TextBox or TextArea. */
  stringify?(t:T): string;
}

/** Attributes supported by TextBox and its underlying `<input>` element. */
export type TextInputAttributes<T> = TextInputAttributes_<T> & ConvertsToString<T>;
interface TextInputAttributes_<T> extends TextAttributesBase<T> {
  /** Type of textbox this is (this is the subset of HTML input types 
   *  that use a string value.) For certain types, the browser will
   *  validate the value and reject strings that do not conform to
   *  the expected syntax (by setting value to ""), and/or the browser
   *  will provide its own special editing interface. */
  type?: "text"|"url"|"tel"|"email"|"password"|"number"|"search"|"color"|
         "time"|"date"|"datetime"|"datetime-local"|"month"|"week"|"hidden";
  /** Points to a <datalist> of predefined options to suggest to the user. */
  list?: string;
  /** The initial size of the control (measured in character widths.) */
  size?: number;
  /** Maximum number of characters (in UTF-16 code units) that the user can enter. */
  maxLength?: number;
  /** indicates the kind of text field this is so that the field can be
   *  completed by the browser automatically, usually by remembering 
   *  previous values the user has entered. Common values: "off", "name",
   *  "username", "email", "tel", "address-line1", "country-name", "bday",
   *  "postal-code", "address-level2" (city), "address-level1" (province). */
  autoComplete?: string;
  /** The minimum (numeric or date/datetime) value for this input */
  min?: number|string;
  /** The maximum (numeric or date/datetime) value for this input */
  max?: number|string;
  /** Works with the min and max attributes to limit the increments at which a numeric or date-time value can be set. If this attribute is not set to any, the control accepts only values at multiples of the step value greater than the minimum. */
  step?: number|"any";
  /** indicates whether the user can enter more than one value. This attribute only applies when the type attribute is "email". */
  multiple?: boolean; 
  /** A regular expression that the control's value is checked against in HTML5 browsers. */
  pattern?: string;
  /** A hint to the user of what can be entered in the control */
  placeholder?: string; 
}

export interface DateInputAttributes extends TextInputAttributes_<Date|undefined>
{
  utc?: boolean;
}

export interface TimeInputAttributes extends DateInputAttributes
{
  /** Day to associate with the time by default (if unspecified, 
   *  the current date is used.) */
  day?: Date;
}

/** Attributes supported for TextArea and its underlying `<textarea>` element. */
export type TextAreaAttributes<T> = TextAreaAttributes_<T> & ConvertsToString<T>;
interface TextAreaAttributes_<T> extends TextAttributesBase<T> {
  /** The visible width of the text control, in average character widths. 
   *  If it is specified, it must be a positive integer. If it is not 
   *  specified, the default value is 20. You can also set the width
   *  using the CSS `width` style. */
  cols?: number;
  /** The number of visible text lines for the control. */
  rows?: number;
  /** Whether the <textarea> is subject to spell checking by the underlying browser. */
  spellcheck?: boolean|"default";
  /** Text wrapping mode. */
  wrap?: "hard"|"soft"|"off";
};

const LabelAttrs = ['label', 'labelStyle', 'labelClass', 'labelAfter', 'p'];
const LabelAttrsAndParse = LabelAttrs.concat('parse', 'stringify');
const LabelAttrsAndIs = LabelAttrs.concat('is');

// Base class of TextBox and TextArea
abstract class TextBase<T, Props extends TextAttributesBase<T>> 
       extends React.Component<Props, {tempText?:string}>
{
  abstract chooseType(p2: any): string;
  state = {} as {tempText?:string};
  render()
  {
    var p = this.props;
    var p2 = omit(p, LabelAttrsAndParse) as any;
    p2.value = this.state.tempText || asStr(p.value.val, p.stringify);
    p2.onBlur = (e: any) => { // lost focus
      this.setState({ tempText: undefined });
    };
    p2.onChange = (e: any) => {
      var value: string = e.target.value;
      if (p.parse) {
        this.setState({ tempText: value });
        var result = p.parse((e.target as any).value, p.value.val);
        var scv = e.target.setCustomValidity;
        if (result instanceof Error) {
          if (scv)
            scv.call(e.target, result.message);
        } else {
          p.value.val = result;
          if (scv)
            scv.call(e.target, ""); // no error
        }
      } else {
        // If user did not provide a parse function, assume T is string (no way to enforce)
        p.value.val = value as any as T;
      }
    };
    p2.onBlur = (e: any) => { // lost focus
      this.setState({ tempText: undefined });
    };
    var tag = this.chooseType(p2);
    return maybeWrapInLabel(p, React.createElement(tag, p2, p.children));

    function asStr(val: T, stringify?: (t:T) => string) {
      if (stringify)
        return stringify(val);
      else
        return val != null ? val.toString() : "";
    }
  }
}

function renderInput(p: any, defaultType: string|undefined, excludeAttrs: string[], preferLabelAfter: boolean, attributes?: object)
{
  var p2 = omit(p, excludeAttrs) as any;
  if (defaultType)
    p2.type || (p2.type = defaultType);
  Object.assign(p2, attributes);
  return maybeWrapInLabel(p, React.createElement("input", p2, p.children), preferLabelAfter)
}

function maybeWrapInLabel(p: LabelProps, el: JSX.Element, preferAfter?: boolean)
{
  return p.label === undefined && !p.p ? el :
    <LabelOrP labelClass={p.labelClass}
              labelStyle={p.labelStyle}
              labelAfter={p.labelAfter !== undefined ? p.labelAfter : preferAfter}
              label={p.label} p={p.p}>{el}</LabelOrP>;
}

/** A React version of `<input type="text">` based on `Holder<T>`
    that supports parsing and possibly invalid input. If T is
    not `string` then the `parse` property is required, and if
    T does not have a `toString` method then a `toString` property 
    is required. */
export class TextBox<T> extends TextBase<T, TextInputAttributes<T>>
{
  chooseType(p2: any) {
    p2.type || (p2.type = "text");
    return "input";
  }
}

/** A wrapper for `<textarea>` based on `Holder<T>` that supports 
    parsing and possibly invalid input. If T is not `string` then 
    the `parse` property is required. Supports a label.
 */
export class TextArea<T> extends TextBase<T, TextAreaAttributes<T>>
{
  chooseType(p2: any) { return "textarea"; } 
}

/** A Date editor based on `<input type="date">`, with value.val 
 *  interpreted in the UTC or local time according to the utc property
 *  (default: local time). Its user interface will vary between browsers. */
export function DateBox(p: DateInputAttributes) {
/*  The type system seems broken in TypeScript v2.9 in case you combine
    union types with conditional types. The following test case demos the
    issue, but it seems fixed in the Playground (v3.1?). 
    Workaround: use `any`. Example:

    type Parser<T> = ((input:string) => T|Error);
    function parse<T>(s: string, p: T extends string ? 
                      Parser<T> | undefined : Parser<T>): T
    {
      return p ? p(s) : s as any;
    }
    console.log(parse('123', s => parseInt(s)));
    console.log(parse<number|undefined>('abc', 
                s => (parseInt(s) ? parseInt(s) : undefined))); // ERROR

    Argument of type '(s: string) => number | undefined' is not assignable to parameter of type '((input: string) => Error | undefined) | ((input: string) => number | Error)'.
      ... Type 'undefined' is not assignable to type 'number | Error'.
*/
  var p2 = omit(p, ['utc']) as any;
  p2.type = "date";
  p2.parse = (s:string, oldVal:Date|undefined) => parseDate(s, p.utc, oldVal);
  p2.stringify = (d:Date|undefined) => dateToString(d, p.utc) || "";
     // new Date(d.valueOf() + d.getTimezoneOffset() * 60000).toISOString().substr(0,10)
  return <TextBox<Date|undefined> {...p2}/>;
}

/** Parses a date if it is in the form YYYY-MM-DD, as it will be
 *  if it was produced by `<input type="date"/>`. If a second Date is
 *  provided, the time from that date is preserved in the return
 *  value; otherwise the time is set to noon UTC so that the date
 *  stays the same in all time zones. */
export function parseDate(s: string, utc?: boolean, time?: Date): Date|undefined {
  if (s && s[4] == '-' && s[7] == '-') {
    var y = parseInt(s.slice(0,4)), 
        m = parseInt(s.slice(5,7)),
        d = parseInt(s.slice(8,10));
    if (y == y || m == m || d == d) {
      var r = new Date(time!);
      if (!time) r.setUTCHours(12,0,0,0);
      r.setFullYear(y, m-1, d);
      return r;
    }
  }
  return undefined;
}

function twoDigit(n: number) { return ('0' + n).slice(-2); }

/** Gets the date portion of a date object in the form YYYY-MM-DD, or undefined if the Date was undefined */
export function dateToString(d: Date|undefined, utc?: boolean): string|undefined {
  if (!d) return undefined;
  if (utc) return d.toISOString().substr(0,10);
  return d.getFullYear() + '-' + twoDigit(d.getMonth()+1) + '-' + twoDigit(d.getDate());
}

/** A Date editor based on `<input type="time">`, with p.value.val 
 *  interpreted in the UTC or local time zone according to the value
 *  of the utc property (default: local time). Its user interface will vary 
 *  between browsers. The date (non-time) component is left unchanged,
 *  but if the value.val starts as `undefined`, the current date or 
 *  the value of the day property (if any) is used as the default 
 *  when the user selects a time. */
export function TimeBox(p: TimeInputAttributes) {
  var p2 = omit(p, ['utc']) as any;
  p2.type = "time";
  p2.parse = (input:string, oldValue: Date|undefined) => parse24hTime(input, oldValue, p.utc);
  p2.stringify = (d:Date|undefined) => timeTo24hString(d, p.utc);
  return <TextBox<Date|undefined> {...p2}/>;
}

/** Gets a 24-hour time string suitable for use in `<input type="time"/>` */
export function timeTo24hString(time: Date|undefined, utc?: boolean) {
  if (!time) return "";
  var [h,m] = utc ? [time.getUTCHours(), time.getUTCMinutes()]
                  : [time.getHours(), time.getMinutes()];
  return time ? twoDigit(h) + ":" + twoDigit(m) : "";
}

/** Parses a 24-hour time string like those produced by `<input type="time"/>` */
export function parse24hTime(value: string|undefined, day?: Date, utc?: boolean): Date|undefined {
  if (value && value[2] === ':') {
    var h = parseInt(value.slice(0,2));
    var m = parseInt(value.slice(3));
    if (h >= 0 && h < 24 && m >= 0 && m < 60) {
      var clone = new Date(day || new Date());
      if (utc)
        clone.setUTCHours(h, m, 0, 0);
      else
        clone.setHours(h, m, 0, 0);
      return clone;
    }
  }
  return undefined;
}

/** Wrapper for `<input type="checkbox">` based on `Holder<T>`. Can have a label. */
export function CheckBox(p: InputAttributes<boolean>)
{
  return renderInput(p, "checkbox", LabelAttrs, true, {
    checked: p.value.val,
    onChange: (e: any) => {p.value.val = e.target.checked;}
  });
}

/** Wrapper for `<input type="radio">` based on `Holder<T>`. Can have a label. */
export function Radio<T>(p: RadioAttributes<T>)
{
  return renderInput(p, "radio", LabelAttrsAndIs, true, {
    checked: p.is !== undefined ? p.value.val == p.is : !!p.value.val,
    onChange: (e: any) => {
      if (e.target.checked)
        p.value.val = p.is !== undefined ? p.is : true as any as T;
      else if (p.is === undefined)
        p.value.val = false as any as T;
    }
  });
}

/** Attributes that apply to `<input type="file">` elements. */
export interface FileButtonAttributes extends ButtonAttributes {
  /** Indicates the types of files that the server accepts as a
   *  comma separated list of MIME types and extensions, e.g. 
   *  ".doc,.docx,.xml,application/msword". This provides a hint 
   *  for browsers to guide users towards selecting the correct 
   *  file types. */
  accept?: string;
  /** Indicates whether the user can select more than one file. */
  multiple?: boolean;
  /** Specifies that the user must fill in a value before submitting a form. The :optional and :required CSS pseudo-classes will be applied to the field as appropriate. */
  required?: boolean;
}

export function Button(p: InputAttributesBase)
{
  var p2 = omit(p, LabelAttrs) as any;
  return maybeWrapInLabel(p, React.createElement("button", p2, p.children), false);
}

export function FileButton(p: FileButtonAttributes)
{
  return renderInput(p, "file", LabelAttrs, false);
}

export function Range(p: SliderAttributes) { return Slider(p); }
export function Slider(p: SliderAttributes)
{
  return renderInput(p, "range", LabelAttrs, false, {
    value: p.value.val,
    onChange: (e: any) => { p.value.val = parseFloat(e.target.value); }
  });
}

// The strongly-typed version doesn't work for some reason
//function omit<T, K extends Extract<keyof T,string>>(o: T, names: K[]): Omit<T, K> {
function omit(o: any, names: string[]): any {
  var r: any = {};
  outer:for (var k in o) {
    for (var i = 0; i < names.length; i++)
      if (k === names[i])
        continue outer;
    r[k] = o[k];
  }
  return r;
}
