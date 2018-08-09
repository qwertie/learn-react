import * as React from "react";
export * from './hold';

/** A wrapper around a value. */
export type Holder<T> = { val: T; }

export interface InputAttributes<T> extends React.HTMLAttributes<HTMLElement> {
  /** Current value associated with the form element. */
  value: Holder<T>;
  /** If this property is present, the form element will be wrapped in a <label> */
  label?: string;
  /** Class name of the label element, if the label property is used. */
  labelClass?: string;
  /** Styles of the label text (not the label element, but the text inside, which is a span.)
   *  If there is no labelClass and no labelStyle then DefaultLabelStyle is used. */
  labelStyle?: React.CSSProperties;
  /** Prevents the user from interacting with the input. */
  disabled?: boolean;
  /** Prevents the user from modifying the value of the input (without changing the widget's appearance) */
  readOnly?: boolean;
  /** Specifies that the input should have focus when the page loads. */
  autoFocus?: boolean;
  /** The form element that the input element is associated with (its form owner). The value of the attribute must be an id of a <form> element in the same document. If this attribute isn't used, the <input> element is associated with its nearest ancestor <form> element, if any. */
  form?: string;
  /** The name of the control, which is submitted with the control's value as part of the form data. */
  name?: string;
  /** The position of the element in the tabbing navigation order for the current document. */
  tabIndex?: number;
  /** CSS styles. */
  style?: React.CSSProperties;
}

interface CheckBoxAttributes<T> extends InputAttributes<T> {
  
}

/** Attributes supported by TextBox and its underlying HTML input element */
export interface TextInputAttributes<T> extends InputAttributes<T> {
  /** A function that parses the input string into the internal format
   *  expected by the model. This function is called on every keypress. 
   *  If an error is returned, the error message is associated with the 
   *  element using the setCustomValidity() method of HTML5 elements.
   */
  parse?: (userInput:string) => T|Error;
  /** Type of textbox this is (this is the subset of HTML input types 
   *  that use a string value.) For certain types, the browser will
   *  validate the value and reject strings that do not conform to
   *  the expected syntax (by setting value to ""), and/or the browser
   *  will provide its own special editing interface. */
  type?: "text"|"url"|"tel"|"email"|"password"|"number"|"color"|"time"|"date"|"datetime"|"datetime-local"|"month"|"week"|"hidden";
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
  /** The minimum (numeric or date-time) value for this input */
  min?: number|string;
  /** The maximum (numeric or date-time) value for this input */
  max?: number|string;
  /** Works with the min and max attributes to limit the increments at which a numeric or date-time value can be set. If this attribute is not set to any, the control accepts only values at multiples of the step value greater than the minimum. */
  step?: number|"any";
  /** indicates whether the user can enter more than one value. This attribute only applies when the type attribute is "email". */
  multiple?: boolean; 
  /** A regular expression that the control's value is checked against in HTML5 browsers. */
  pattern?: string;
  /** A hint to the user of what can be entered in the control */
  placeholder?: string; 
  /** Specifies that the user must fill in a value before submitting a form. The :optional and :required CSS pseudo-classes will be applied to the field as appropriate. */
  required?: boolean;
}

export var DefaultLabelStyle: React.CSSProperties = {
  display: "inline-block",
  width: "calc(4em + 10%)"
};

/** A React version of `<input type="text">` based on `Holder<T>`
    that supports parsing and possibly invalid input. If T is
    not `string` then the `parse` property is required.
    (unfortunately TypeScript cannot enforce this requirement). 
 */
export class TextBox<T extends {toString: ()=>string}|undefined> extends
  React.Component<TextInputAttributes<T>, {tempInput?:string}>
{
  state = {} as {tempInput?:string};
  render()
  {
    var p = this.props;
    var props2: any = Object.assign({}, p);
    delete props2.parse;
    delete props2.label;
    delete props2.labelStyle;
    delete props2.labelClass;
    props2.value = this.state.tempInput || (p.value.val ? p.value.val.toString() : "");
    props2.onChange = (e: any) => {
      var value: string = e.target.value;
      if (p.parse) {
        var result = p.parse((e.target as any).value);
        if (result instanceof Error) {
          if (e.target.setCustomValidity)  
            e.target.setCustomValidity(result.message);
        } else {
          p.value.val = result;
        }
      } else {
        // If user did not provide a parse function, assume T is string (no way to enforce)
        p.value.val = value as any as T;
      }
    };
    props2.onBlur = (e: any) => { // lost focus
      this.setState({ tempInput: undefined });
    };
    var input = React.createElement("input", props2);
    return !p.label ? input :
      <label className={p.labelClass}>
        <div style={p.labelStyle || p.labelClass ? p.labelStyle : DefaultLabelStyle}>
          {p.label + " "}
        </div>
        {input}
      </label>;
  }
}

/** A React version of <input type="text"> based on Holder<T>
    that supports parsing and possibly invalid input. If T is
    not `string` then the `parse` property is required.
    (unfortunately TypeScript cannot enforce this requirement). 
 */
//export class CheckBox extends React.Component<TextInputAttributes<T>, {tempInput?:string}>
