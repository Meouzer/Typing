# type-robustly 2.0.0 / type-quickly 3.0.0 
### NPMs fastest, most comprehensive, and most correct typing packages for node and the browser

***If you want only the quick rundown, read the *Comprehensive/Usage/Properties-of-is* sections.***
1. See https://github.com/Meouzer/Typing for extensive typing information. This is your definitive typing resource.
2. If you are coding in a node environment only and just want type checkers for the built-in ES6
classes, use of node's `util.types.isKlass(x)` functions is the best option. 
   * This package's type checkers also work in the browser. 
3. The only difference between type-quickly and type-robustly
is that the latter correctly types edge cases of the ES6 built-in classes at the cost of a 57% reduction
in speed. 
   * Even so, type-robustly is still faster than all other competitors save one. That one,
   like all other competitors, is highly limited in what it will correctly type.
 
## Competitors' Technique

Competitors rely on use of `Object.prototype.toString()`, constructor names, or `instanceof` 
with results that do not work unless your world is narrowed down to objects of the form 
`new Klass(...)`, where most of the time Klass is restricted to being a built-in class. 
The `toString()` function has serious problems: it doesn't work for programmer defined 
classes; and across built-in classes it acts in a completely random, add-hoc, and capricious 
manner. 

Competitors use `toString()/constructors/instanceof` to search the first dimension to pin 
down an object to a particular class, say Boolean, but leave the type at `"Boolean"` because
the second dimension is not searched by determining the position of the object in the downward 
inheritance chain of `Boolean.prototype`: is the object `Boolean.prototype` itself, which 
must be typed to `"Object"`? is the object one degree away from `Boolean.prototype` so it 
should be typed to `"Boolean"`? or is it further away, so it should be typed to `"Object"`? 

## Author's Technique

To search along the second dimension, the internal prototype of the object can be examined. 
Even though this idea is obvious, no one has successfully implemented it until now: see the 
*Constructor/Prototype Approach to Typing* appendix to see how it's done.

However, the constructor/prototype technique is slow, and the author came up with something
even better: the prototyping technique, which is lightning fast and avoids all the problematics 
of `toString()` and constructor names. Basically you figure out the best typing function that types
`Boolean.prototype` and all objects derived from it. Then do the same for all other classes 
and fit the small typing functions together inside a function to rule them all.

## Extremely Fast and Correct

This package's combination of speed and correctness blows the competition away with gale 
force winds. Hundreds of tests show this package is 100% correct: See 
https://github.com/Meouzer/Typing -- type-robustly 2.0.0 -- Tests. A number of typing packages 
are compared against type-quickly/type-robustly in following tables. There are other packages, 
but the best were chosen. 

| typing package     | number<br>times<br>faster<br>type-quickly<br>is | types<br>ES6<br>built-in<br>class<br>instances? | types<br>secondary<br>objects? | types<sup>4</sup><br>programmer<br>class<br>instances? |
|--------------------|-------------------------------------------------|-------------------------------------------------|--------------------------------|--------------------------------------------------------|
| type-quickly       | &nbsp;                                          | &#x2705;                                        | &#x2705;                       | &#x2705;                                               |
| type-robustly      | 2.3                                             | &#x2705;                                        | &#x2705;                       | &#x2705;                                               |
| kind-of            | 33                                              | &#10060;<sup>1</sup>                            | &#10060;                       | &#10060;                                               |
| type-detect        | 3.4                                             | &#10060;<sup>1</sup>                            | &#10060;                       | &#10060;                                               |
| types.js           | 24                                              | &#10060;<sup>2</sup>                            | &#10060;                       | &#10060;                                               |
| data-type          | 2.4                                             | &#10060;<sup>2</sup>                            | &#10060;                       | &#10060;                                               |
| whats-the-type     | 15.7                                            | &#x2705;                                        | &#10060;                       | &#x2705;                                               |
| which-builtin-type | 1599                                            | &#x2705;                                        | &#10060;<sup>3</sup>           | &#x2705;                                               |
| just-typeof        | 2.7                                             | &#10060;<sup>1</sup>                            | &#10060;                       | &#10060;                                               |
| type-name          | 4.4                                             | &#x2705;                                        | &#10060;                       | &#x2705;                                               |
| easytype           | 1.7                                             | &#10060;<sup>1</sup>                            | &#10060;                       | &#10060;                                               |

&#x2705; = yes. &#10060; = no.<br>
(1) variant error classes incorrectly typed.<br>
(2) errors are extensive. possibly designed with only ES5 in mind.<br>
(3) sometimes correct, sometimes not.<br>
(4) example of programmer class instance: `const x = new Foo()` where Foo is a programmer defined class.

Speed comparisons are based on testing each package's typing function on `x = new Boolean(true)`.
Whenever, a competitor slows down on another class due to more complicated logic, type-quickly
will be even faster in comparison because type-quickly does not slow down.

Examples of mistakes that all competitors make is to type `Boolean.prototype` 
or secondary objects such as `Object.create(new Boolean(true))` to `"Boolean"`. 
If you think that doesn't matter, think again: `Array.isArray()` and node's type 
checkers work correctly on the class prototype and all objects derived from it.

## Comprehensive

The type-quickly/type-robustly packages are the most comprehensive typing packages on NPM 
because they alone type everything in ES6 (and more) correctly, including the following 
sometimes overlapping categories.

1. All ES6 = ECMA-2015 classes 
2. Node-Classes: 100+ classes such as node\_buffer\_Buffer, node\_buffer\_Blob, node\_stream.Readable, node\_http.Server; etc.
3. JavaScript Classes beyond ES6: Blob, Headers, ReadableStream, etc.
4. Secondary-objects, which are objects created with `Object.create()`
5. Class prototypes
6. Null-objects, which are objects not deriving from `Object.prototype`, e.g., `Object.create(null)` and its derivations.
7. Programmer defined classes  
   * All objects derived from the class prototype, including the class edge-case (see *The Edge Case* appendix)
8. Edge-cases of built-in ES6 classes (type-robustly only)
9. Windows and DOM objects

| type package       | types<br>secondary<br>objects? | types<br>class<br>prototypes? | types<sup>3</sup><br>programmer<br>defined<br>classes? | types<br>DOM<br>objects? |
|--------------------|--------------------------------|-------------------------------|--------------------------------------------------------|--------------------------|
| type-quickly       | &#x2705;                       | &#x2705;                      | &#x2705;                                               | &#x2705;                 |
| type-robustly      | &#x2705;                       | &#x2705;                      | &#x2705;                                               | &#x2705;                 |
| kind-of            | &#10060;                       | &#10060;                      | &#10060;                                               | &#10060;                 |
| type-detect        | &#10060;                       | &#10060;                      | &#10060;                                               | &#10060;                 |
| types.js           | &#10060;                       | &#x2705;<sup>1</sup>          | &#10060;                                               | &#10060;                 |
| data-type          | &#10060;                       | &#10060;                      | &#10060;                                               | &#10060;                 |
| whats-the-type     | &#10060;                       | &#10060;                      | &#10060;                                               | &#10060;                 |
| which-builtin-type | &#10060;                       | &#10060;<sup>2</sup>          | &#10060;                                               | &#10060;                 |
| just-typeof        | &#10060;                       | &#10060;                      | &#10060;                                               | &#x2705;                 |
| type-name          | &#10060;                       | &#10060;                      | &#10060;                                               | &#x2705;                 |
| easytype           | &#10060;                       | &#10060;                      | &#10060;                                               | &#x2705;                 |

&#x2705; = yes. &#10060; = no.<br>
(1) just one mistake for built-in ES6 classes<br>
(2) sometimes correct, sometimes not<br>
(3) programmer defined classes: class prototype and all objects derived from it must be typed correctly

## Usage
```
Import for Node

const {type, is} = require('type-robustly')
-------------------------------------------------------------------------

Import for Browser

<script src="node_modules/type-robustly/type-robustly.js"  
    type="text/javascript"></script>
    
or copy type-robustly.js anywhere and link to it    
-------------------------------------------------------------------------

ES6 classes:

Boolean; Number; String; Date; RegExp; Array; Int8Array; Uint8Array;
Uint8ClampedArray; Int16Array; Uint16Array; Int32Array; Uint32Array;
Float32Array; Float64Array; BigInt64Array; BigUint64Array; Error;
URIError; EvalError; RangeError; ReferenceError; SyntaxError; TypeError;
WeakSet; Set; WeakMap; Map; ArrayBuffer; DataView; Promise;

// Map objects (Map.prototype or objects deriving from it)

const x = new Map();             
const prototype = Map.prototype;  
const edgeCase = Object.create(Map.prototype);
const secDegObj = Object.create(x);

// They are correctly typed
type(x)             "Map"
type(prototype)     "Object"
type(edgeCase)      "Object"
type(secDegObj)     "Object"

is.Map(x)           true
is.Map(prototype)   false
is.Map(edgeCase)    false
is.Map(secDegObj)   false
------------------------------------------------------------------------

Boxed Primitives

const boxedSymbol = Object(Symbol)
const boxedBigInt = Object(BigInt(7))
const boxedBoolean = new Boolean(true)

type(boxedSymbol)                "boxedSymbol"
type(boxedBigInt)                "boxedBigInt"
type(boxedBoolean)      i        "Boolean"
is.boxedSymbol(boxedSymbol)      true
is.boxedBigInt(boxedBigInt)      true
is.boxedPrimitive(boxedSymbol)   true
is.boxedPrimitive(boxedBoolean)  true

-------------------------------------------------------------------------

JavaScript classes beyond ES6 for node and the browser: some were 
originally defined in node, in which case they are now global in node.  

AggregateError; AbortController; AbortSignal; Blob; 
ByteLengthQueuingStrategy; BroadcastChannel; CompressionStream; 
CountQueuingStrategy; CryptoKey; DecompressionStream; Event; EventTarget; 
FormData; Headers; MessageChannel; MessageEvent; MessagePort; 
PerformanceEntry; PerformanceMeasure; PerformanceObserver; 
PerformanceObserverEntryList; PerformanceResourceTiming; 
ReadableByteStreamController; ReadableStream; ReadableStreamBYOBReader; 
ReadableStreamDefaultController; ReadableStreamDefaultReader; 
SharedArrayBuffer; TextDecoderStream; TextEncoder; TextEncoderStream; 
TransformStream; TransformStreamDefaultController; URL; URLSearchParams; 
WritableStream; WeakRef; WritableStreamDefaultController; 
WritableStreamDefaultWriter;

const x = new Blob();

type(x)                 "Blob" in node and browser
is.Blob(x)              true   in node and browser
is.node_buffer_Blob(x)  true in node environment since
                        Blob is defined at node.buffer.                        
-------------------------------------------------------------------------

Node Environment only. Node classes that are not JavaScript globals.

const fs = require('fs');
const x = new fs.WriteStream("xyz.txt");

type(x)                     "node_fs_WriteStream"
is.node_fs_WriteStream(x)   true

The is.node_fs_WriteStream() function is not available for the browser.
```

### Typing Programmer Defined Classes

Programmer defined classes are correctly typed out of the box assuming the programmer 
always insures the constructor is correct, i.e., `Klass.prototype.constructor` must be 
`Klass`. Internally, the `type(x)` function uses a constructor/prototype technique, which 
is slow. However, if you want to bypass this slowness and make typing a programmer defined class
lightning fast, then there are two typing protocols. Both work even if the constructor is not 
properly set.

Protocol-1 is preferable since it at no cost handles edge cases of the 
class in the `type()` and `dtype()` functions.

#### ***Protocol-1 for Typing Programmer Defined Classes***

For a programmer defined class Klass, simply write
(1) `type.asInstance(this, "Klass")` inside
the constructor and (2) `type.asClass(Klass)` outside
the constructor. Edge cases are most excellently
handled.
```
function Klass()
{    
    // (1) Make sure type() works correctly on Klass objects:
    // Klass.prototype and all objects derived from it.
    
    type.asInstance(this, "Klass");
}

// If you redefine Klass.prototype, make sure (2)
// succeeds not preceeds it. 

Klass.prototype = ...
    
// (2) Provide an is.Klass() function and make
// sure dtype() handles Klass edge cases. 

type.asClass(Klass)

// Klass objects 
// (Klass.prototpe and objects derived from it)

const x = new Klass()                 
const prototype = Klass.prototype     
const edgeCase = Object.create(Klass.prototype)
const secDegObj = Object.create(x);

// They are typed correctly.

type(x)             "Klass"
type(prototype)     "Object"
type(edgeCase)      "Object"
type(secDegObj)     "Object"

is.Klass(x)          true
is.Klass(prototype)  false
is.Klass(edgeCase)   false
is.Klass(secDegObj)  false  
```
 
#### Protocol-2 for Typing Programmer Defined Classes

Protocol-2 is deprecated unless protocol-1 is unfeasible for some odd reason, e.g., there 
is no access to the inside of the constructor. 

To type a programmer defined class `Klass`, write `type.thisClass(Klass)` outside the 
constructor. Edge cases will be incorrectly typed to `"Klass"` by both `type()` and
`dtype()`.

```
function Klass()
{    
}

// Make sure Klass objects, except for the edge case 
// are type correctly. Again must be written after
// any redefinition Klass.prototype. 

type.thisClass(Klass)

// Klass objects 
const x = new Klass()                 
const prototype = Klass.prototype     
const edgeCase = Object.create(Klass.prototype)
const secDegObj = Object.create(x);

type(x)             "Klass"
type(prototype)     "Object"
type(edgeCase)      "Klass" (incorrect)
type(secDegObj)     "Object"

is.Klass(x)           true
is.Klass(prototype)   false
is.Klass(edgeCase)    true (incorrect)
is.Klass(secDegObj)   false
```

## Exports

| Export      | Description                                                                              |
|-------------|------------------------------------------------------------------------------------------|
| `type(x)`   | Robust and very fast typing function                                                     |
| `is`        | Object whose function properties test for various data types, amongst other capabilities |
| `dtype(x)`  | Details the inheritance chain of `x`. See `dtype(x)` appendix.                           |

## Properties of the `is` Object

| Test                           | Description                                                                               |
|--------------------------------|-------------------------------------------------------------------------------------------|
| non typing                     ||
| `is.configurable(x,prop)`      | is the property `prop` of `x` configurable? returns true if property not existent on `x`. |
| `is.writable(x,prop)`          | is the property `prop` of `x` writable? returns true if property not existent on `x`.     |
| `is.enumerable(x,prop)`        | is the property `prop` of `x` enumerable? returns false if property not existent on `x`.  |
| `is.ownProperty(x,p)`          | is p a property directly defined on x?                                                    |
| `is.nodeEnvironment()`         | is running in Node.js as opposed to Browser?                                              |
| `is.browserEnvironment()`      | is running in Browser as opposed to Node.js?                                              |
| `is.nativeCode(func)`          | is func a built-in JavaScript function or method?<br>(built-ins have native code)         |
| typing                         ||
| `is.domObject(x)`              | is x a document or DOM object?                                                            |
| `is.nullObject(x)`             | is `x` a null-object?                                                                     |
| `is.arguments(x)`              | is x a function's arguments list?                                                         |
| `is.classPrototype(x)`         | is x a function's prototype?                                                              |
| `is.Object(x)`                 | is x an object?                                                                           |
| `is.primitive(x)`              | is x a primitive?                                                                         |
| `is.boxedPrimitive(x)`         | is x a Boolean, Number, String, boxed symbol, or boxed bigint?                            |
| `is.errorVariant(x)`           | is x a class instance of Error or other variant Error class?                              |
| `is.typedArray(x)`             | is x a class instance of a typed array class?                                             |
| `is.boolean(x)`                | is `x` a boolean?                                                                         |
| `is.number(x)`                 | is `x` a number?                                                                          |
| `is.string(x)`                 | is `x` a string?                                                                          |
| `is.bigint(x)`                 | is `x` a bigint?                                                                          |
| `is.boxedBigInt(x)`            | is `x` a boxed bigint? , e.g., like Object(BigInt(7))                                     |
| `is.symbol(x)`                 | is `x` a symbol?                                                                          |
| `is.boxedSymbol(x)`            | is `x` a boxed symbol? , e.g., like Object(Symbol())                                      |
| `is.Function(x)`               | is `x` a function?                                                                        |
| `is.mapIterator(x)`            | is `x` a Map iterator?                                                                    |
| `is.setIterator(x)`            | is `x` a Set iterator?                                                                    |
| `is.arrayIterator(x)`          | is `x` an Array iterator?                                                                 |
| `is.stringIterator(x)`         | is `x` a String iterator?                                                                 |
| `is.generatorFunction(x)`      | is `x` a generator function?                                                              |
| `is.generatorObject(x)`        | is `x` a generator object?                                                                |
| `is.asyncFunction(x)`          | is `x` an async function?                                                                 |
| `is.arrayBufferView(x)`        | wrapper around ArrayBuffer.isView(x)                                                      |
| **is.Klass (x)**               | is `x` a class instance of Klass? Klass may be a built-in or programmer defined class.    | 
| **is.node\_abc\_..._Klass(x)** | is `x` a class instance of the node class whose complete path is node\_abc\_..._Klass?    |

Note the difference between `is.boolean(x)` and `is.Boolean(x)`, which check for
the primitive boolean and class instance of Boolean  respectively. Also boxed
symbols and boxed bigints type to `"boxedSymbol"` and `"boxedBigInt"` respectively. 

Concerning `is.ownProperty(x,p)`, this function works correctly even if `x` is a null-object. 
`x.hasownProperty(p)` fails if `x` is a null-object because `hasOwnProperty` is defined on
`Object.prototype` from which `x` does not inherit.

# Appendices

## Browser Support

The IE11 browser is not supported as it is too out of date and is now defunct.
Testing has passed in Chrome, Edge, Firefox, and Opera.

## The definitive typing Function `dtype(x)`

This typing function gives the most detail possible by describing the inheritance chain of `x`.
This function requires enforcement of the constructor protocol: that `Klass.prototype.constructor` is `Klass` 
for each programmer defined class Klass. 

| Expression                      | Meaning                                                                   |
|---------------------------------|---------------------------------------------------------------------------|
| x is a Klass-object of degree n | `x` is n steps away from Klass.prototype                                  |
| x is an object of degree n      | `x` is n steps away from Object.prototype                                 |
| x is a null object of degree n  | `x` does not inherit from `Object.prototpe` and is n steps away from null |

Of course, stepping is done in the inheritance chain of `x`.

| `dtype(x)`            | x                                                                    |
|-----------------------|----------------------------------------------------------------------|
| `"Klass[Prototype]"`  | `x` is `Klass.prototype`                                             |
| `"Klass"`             | `x` is a class instance of Klass                                     |
| `"Klass[Object]"`     | `x` is a Klass object of degree 1, but not a class instance of Klass |
| `"Klass[Object(n)]"`  | `x` is a Klass object of degree n = 2,3,....                         |
| `"Null[Object]"`      | `x` is a null-object of degree 1                                     |
| `"Null[Object(n)]"`   | `x` is a null-object of degree n = 2,3,...                           |
| `"Object[Prototype]"` | `x` is `Object.prototpe`                                             |
| `"Object"`            | `x` is an object of degree 1                                         |
| `"Object(n)"`         | `x` is an object of degree n = 2,3,...                               |

Since the inheritance chain of `x` may contain more than one class prototype, 
where classes are to include the imaginary Object class and the imaginary Null class, 
the specificity rule applies: `dtype(x)` is required to be the most informative choice:
the nearest class prototype is used.

If typing protocol-1 is followed, then the edge  case is correctly typed 
to `Klass[Object]`. 

```
const {dtype} = require('type-robustly');

function Klass()
{        
}

// make sure constructor protocol is followed: that
// the following is true.    
Klass.prototype.constructor === Klass

// Klass objects
const instance = new Klass();
const prototype = Klass.prototype;
const edgeCase = Object.create(Klass.prototype);
const deg2Obj = Object.create(Object.create(Klass.prototype);
const deg3Obj = Object.create(Object.create(instance);

dtype(instance)     "Klass"
dtype(prototype)    "Klass[prototype]"
dtype(edgeCase)     "Klass[Object]"     (typing protocol-1 followed)
dtype(edgeCase)     "Klass" (incorrect) (typing protocol-1 not followed)
dtype(deg2Obj)      "Klass[Object(2)]"
dtype(deg3Obj)      "Klass[Object(3)]"        
```

## Constructor/Prototype Approach to Typing

A constructor/prototype approach to typing works as long as programmers make 
sure class constructors are set correctly: `Klass.prototype.constructor` should 
be `Klass`. A typing function must type class prototypes and all objects deriving 
from class prototypes, sans edge cases, correctly.

```
function typeIt(x)
{
    if (x === null) return "null";
    const tof = typeof(x);
    if(tof === 'function')
    {
        if(x === Function.prototype) return "Object";
        return "Function";
    }
    if (tof !== 'object') return tof;
    const proto = Object.getPrototypeOf(x);
    if(proto === null) return "Object"
    if(proto === BigInt.prototype || proto === Symbol.prototype 
        || proto === Function.prototype) return "Object";
    if(x.constructor !== proto.constructor
        && typeof(x.constructor) === "function"
        && x === x.constructor.prototype) return "Object";
    const Klass = proto.constructor;
    if(Klass === undefined) return "Object";
    if(proto === Klass.prototype) return Klass.name;
    return "Object";
}
```

And no, as far as using constructors and protoyptes as the main typing mechanism, you can't
do better or simpler than this function. 

## The Edge Case

The edge case of a class `Klass` is `edgeCase = Object.create(Klass.prototype)`
that isn't to be used as a class prototype itself nor to be modified to become
a class instance of `Klass` via a call to `Klass.call(x,...)` or `Klass.apply(x,[...])`.

Because of edge cases it is not possible to write a typing function that is fully correct.
For the most part, typing functions have no choice but to type edge cases of built-in classes
to the name of the class because the class edge case can not be distinguished from the
class instance.

However, for all ES6 classes, except for Promise, the class edge case can be correctly 
typed either because `toString()` makes the distinction between the class edge case and 
the class instance or because there is an innocuous method that can be tested to make
the distinction.

The only JavaScript classes beyond ES6 for which it is possible to correctly type the class
edge case are AggregateError, WeakRef, and Blob. That leaves 26 JavaScript classes for
which it is not possible to correctly type the class edge case. For all 100+ node classes
it is not possible to correctly type the class edge case.

Anyway, type-robustly is NPMs only typing package that is fully correct when it is 
possible to be correct. Type-quickly is NPMs second most correct typing package,
but makes no attempt to correctly type class edge cases except to correctly type
boxed Symbols and boxed BigInts. All other packages are highly incorrect because 
they incorrectly type class prototypes and secondary class objects.


