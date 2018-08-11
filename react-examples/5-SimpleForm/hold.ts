
/** A wrapper around a value. */
export type Holder<T> = {
  val: T;
}

/** Maps an interface to a collection of Holders. For example,
 *  `Holders<{ foo: number, bar: string }>` means 
 *  `{ foo: Holder<number>, bar: Holder<string> }`. */
export type Holders<Model> = {
  // "-?" avoids the default behavior that `foo?:T` maps to 
  // `foo?:Holder<T|undefined>` instead of `foo:Holder<T|undefined>`
  [P in keyof Model]-?: Holder<Model[P]>;
}

/** A helper function that bundles a getter and setter into a Holder object.
 *  For example, `hold(model, "foo").val` returns the value of `model.foo`, 
 *  and `hold(model, "foo").val = "newVal"` changes the value of `model.foo`
 *  to "newVal". If a third argument `onChange` is provided, it is called 
 *  before (or instead of) updating the model. For example, the following 
 *  code creates a reference called `foo` so that if you write 
 *  `foo.val = "YES"`, the callback executes `this.setState({ foo: "YES" })`:
 *  
 *      var onChange = (attr:any, newVal:any) => {
 *        this.setState({ [attr]: newVal });
 *      };
 *      var foo = hold(this.state, "foo", onChange);
 * 
 *  @param model An object that contains a property you want to bind.
 *  @param attr  The name of a property of `model` that you want to bind.
 *  @param onChange A function that will be called later, when the return
 *         value's `val` property is changed. The first argument is the
 *         value of `attr` (usually a string), and the second argument is
 *         the value assigned to the Holder's val. `onChange` can return
 *         `true` to cause the default change behavior, i.e. 
 *         `model[attr] = newValue`.
 */
export function hold<T, Attr extends keyof T>(model: T, attr: Attr, onChange: ((attr: Attr, newValue: T[Attr]) => void|boolean) | undefined): Holder<T[Attr]>
{
  class Hold<T, Attr extends keyof T> implements Holder<T[Attr]>
  {
    constructor(public model: T, public attr: Attr, public onChange?: (attr:Attr, newValue:T[Attr])=>void|boolean) {}
    get val() {
      return this.model[this.attr];
    }
    set val(newValue: any) {
      if (!this.onChange || this.onChange(this.attr, newValue))
        this.model[this.attr] = newValue;
    }
  }
  return new Hold(model, attr, onChange);
}

/**
 * A helper function for using `hold()` a component's state in React. 
 * If you write 
 * 
 *     var hstate = holdState<ThisClass>(this);
 *     var foo = hstate("foo");
 *     var bar = hstate("bar");
 * 
 * where ThisClass is the type of this (TypeScript fails to infer it),
 * it is equivalent to
 * 
 *     var onChange = (attr:any, newVal:any) => {
 *       this.setState({ [attr]: newVal });
 *     };
 *     var foo = hold(this.state, "foo", onChange);
 *     var bar = hold(this.state, "bar", onChange);
 */
export function holdState<This extends {state: State, setState: (s:any/*Readonly<Partial<State>>*/)=>any}, State=This["state"]>
  (component: This): <Attr extends keyof State>(attr: Attr) => Holder<State[Attr]>
{
  return function<Attr extends keyof State>(attr: Attr) {
    return hold(component.state, attr, (a: Attr, newValue: State[Attr]) => {
      console.log("component.setState for "+a);
      component.setState({ [a]: newValue });
    });
  };
}

/** Given an object and a list of property names, constructs a new 
 *  object with a Holder wrapping each property of the object. */
export function holdProps<T, Props extends keyof T>
  (model: T, propNames: Props[], onChange: ((attr: Props, newValue: T[Props]) => void|boolean) | undefined):
  { [P in Props]-?: Holder<T[P]> }
{
  return propNames.reduce((out,k) => (out[k] = hold(model, k, onChange), out),
    {} as { [P in Props]-?: Holder<T[P]> });
}

/** Given an object, constructs a new object with a Holder wrapping each 
 *  enumerable property of the original object. */
export function holdAllProps<T>(model: T, onChange: (<A extends keyof T>(attr: A, newValue: T[A]) => void|boolean) | undefined): Holders<T>
{
  return holdProps(model, Object.keys(model) as (keyof T)[], onChange);
}
