# Typing in JavaScript

Obviously, JavaScript should have a robust typing system, but never had a clear 
typing vision. No attempt was ever made for built-in typing of programmer 
defined classes, while the typing mechanisms for built-in classes are add-hoc 
and broken. Let's be clear, the discussion below shows that JavaScript could 
easily have built-in typing but dropped the ball through bad decisions.

Let's now digress to see what a typing function should do. If Klass is a class 
then the *Klass objects* are `Klass.prototypes` and all objects deriving from it.
Klass objects include the following.

1. The class prototype `Klass.prototype`
2. The *class instance* `new Klass(...)`
3. The *class edge case* `Object.create(Klass.prototype)`
4. The *secondary class objects*, which are the remaining objects deriving from 
   `Klass.prototype`.

A typing function should type everything correctly without exception. In particular,
all Klass objects must be correctly typed. Typing in JavaScript frequently chokes on edge cases 
because in general there is no way to distinguish between edge cases and class instances.

JavaScript leaves typing up to the programmer. Because the mechanisms that JavaScript 
does have are so add-hoc, the programmer must pick up the pieces and try to glue them 
back together. However, there are missing pieces, and because of edge cases, the programmer 
can never write a fully correct typing function.

## toString()

The most promising built-in typing mechanism was `Object.prototype.toString.call(x)`,
which never lived up to its potential after ES5. 

```
    function nativeType(x)
    {
        // missing code here to type primitives
        
        const s = Object.prototype.toString.call(x);
        return s.substring(8, s.length - 1);
    }
```

If JavaScript had been paying just a bit of due dilignece, `nativeType(x)`
would without exception correctly type all objects `x`.

This `nativeType(x)` function correctly types Date, RegExp, objects 
and all error variant, and typed array objects proving 
that JavaScript had the full means for correct typing, but dropped the ball. 
For example, it doesn't correctly type Boolean, Number, String, and Array 
objects because the class prototypes type to `"Boolean"` , `"Number"`,  
`"String"`, and  `"Array"` rather than the correct `"Object`. So even in ES5, 
where `toString()` is at its best, things start to go bad. In ES5, the programmer 
can make a simple corrective adjustment, by testing `x` for being the class prototype, 
and if it is return `"Object"`.

In ES6, things start to go sidewise because `toString()` no longer always
distinguishes between edge cases and class instances. Past ES6, `toString()`
goes completely defunct because it never distinguishes between the class
instance, the edge case, and the class prototype.

## The Construtor-Prototype Technique

Gluing together the pieces of JavaScript's shattered typing system is a two-dimensional
challenge. You first use `toSring()` or constructor names to search the first dimension
and pin down an object to a particular class say Boolean. You then search the second
dimension to determine where in the downward inheritance chain of `Boolean.prototype`
the object is positioned: is the object `Boolean.prototype` itself so it should be typed
to `"Object"`? is the object one degree away from `Boolean.prototpe` so it should be typed
to `"Boolean"`? or is it further away so that it should be typed to `"Object"`?

Searching the second dimension can be done by simply checking the internal prototype
`Object.getPrototypeOf(x)` of an object `x`.  Even though this is a simple idea, no 
typing package on NPM, other than this author's does this as they only search the first 
dimension. The results are disastrous. For example, all competitors on NPM will incorrectly 
type `Boolean.prototype` or a secondary object such as `Object.create(new Boolean(true))` 
to `"Boolean"`. A typing function must correctly type all Boolean objects, sans the edge case, 
correctly. So competitors will only correctly type objects of the form `new Klass(...)`, where 
most of the time `Klass` must be a built-in class.

One reason not to use `toString()` to search the first dimension is that it is incorrect
on the variant error classes. For example, if `x = new RangeError()` then
`toString.call(x)` is `"Error"` not `"RangeError"`. A second reason is
that it is slower than using constructor names. A third reason, is that you will always
be waiting for more shoes to drop when future versions of JavaScript continue to code
`toString()` incorrectly.

So with the ideas that you should
1. use constructor names to search the first dimension
2. use the internal prototype to search the second dimension 
3. correctly type class prototypes
4. correctly type class instances
5. correctly type secondary class objects (objects deriving from the class 
   prototype other than class instances and the edge case).
6. correctly type programmer defined class objects (sans the edge case)

you are forced to come up with something like the following function.

```
function type(x)
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

This function presumes that the programmer correctly set constructors, i.e.,
that `Klass.prototype.constructor` must be `Klass`. Sans edge cases, the
function is fully correct, and no you can't make it simpler.

The complexity of this typing function, and its slowness, is proof of the add-hoc 
and limited nature of JavaScript's built-in capabilities. Anyway, this function rocks 
NPM's typing world once because it is fully correct sans edge cases. But this author 
rocks it a second time, because there is something even better, something also correct 
but very fast.

## The Prototyping Technique

The author's *prototyping technique* avoids all the problems with `toString()`,
and constructor names. Basically you figure out the best typing function that types
all Boolean objects, recall this is `Boolean.prototype` and all objects derived from it. 
Then do the same for all other classes and fit the small typing functions together inside 
a function to rule them all. The prototyping technique is lightning fast, making this author's 
typing packages the fastest on NPM.

So the author ends up with two NPM typing packages type-quickly and type-robustly.
The first makes little attempt to handle edge cases, while the second handles
edge cases whenever JavaScript makes this possible. It is possible in ES6
because `toString()` sometimes makes the distinction between edge cases
and class instances, and for the times it doesn't, one may call required class methods,
in an innocuous manner, to see if they work. However, beyond ES6 it is not
possible because `toString()` completely fails and there are no innocuous 
methods to call.

For example, suppose the internal prototype of `x` is `Map.prototype`. You
know `x` is either a class instance `new Map()` or the edge case `Object.create(Map.prototype)`, but
you want to know which. Use of `toString()` is no good because it does not distinguish
between the class instance and the edge case. So one is forced to call
`Map.prototype.has.call(x,{})` to make the distinction by seeing whether an
exception is thrown or not. The `has()` method is called through the prototype
to avoid spoofing, e.g., a `has()` method could be written directly on the edge
case in an attempt to spoof.

The type-quickly and type-robustly packages are the fastest, most comprehensive,
and most correct typing packages on NPM. Type-robustly is 57% slower than
type-quickly but is still faster than all other NPM competitors save one, while that
one, like all other competitors, is highly incorrect.

## The Typing Conspiracy

The Illuminati, whose headquarters are at the Denver
international airport, seek total domination in the new world order. Many
intrepid souls have attempted to infiltrate the organization to expose their
nefarious plans.  Once such source, before he was elimated by the Illuminati
technical oversight committee, discovered that the Illuminati has compromised
JavaScript by inserting powerful yet secretive typing code <sup>1</sup>, apparantly
with the full knowledge and consent of the JavaScript committee, which is ironic
since the committee has tried its best in the past to avoid correct typing. So now
JavaScript has hidden typing mechanisms that are not publically available! This 
should frighten you: what else is JavaScript hiding? Hearings must be held to
to get to the bottom of why correct typing is only for the powerful elite. Laws must
be passed to make sure JavaScript behaves with full transparency. JavaScript committee
members must be compelled to testify through the threat of incarceration.

1. For example, 
   *  Node's `util.types.isMap(x)` function is 1000 times faster than anything
      the programmer can write when `x` is the Map edge case `Object.create(Map.prototype)`.
      That's because the programmer can correctly type the edge case of Map only by
      catching an exception on a method call, while clearly Node has something much better.
   *  Node's `util.types.isDate(x)` is 10+ times faster than anything the programmer can write when
      `x` is the Date edge case: the programmer must use `toString(x)` to detect the edge case. 
   * Sans the edge case, `Object.getPrototypeOf(x) === Map.prototype` is the fastest test that the
      programmer can come up with to detect a class instance of Map, yet `util.types.isMap(x)`
      is nearly twice as fast. Likewise `Array.isArray()` is at least 4 times as fast as anything
      the programmer can come up with.

## Built in Type Checkers

JavaScript architects eventually were forced to admit that detection of edge cases was 
important after all. That is, the `Array.isArray()` function and Node's type checkers 
do not produce false positives on edge cases or on class prototpes for that matter. 
For example, if `edgeCase = Object.create(Array.prototype)` then `Array.isArray(edgeCase)` 
is `false` as it should be. This is a tacit admission that the design of `toString()` is 
seriously flawed as it frequently does not distinguish between class instances and edge cases
(and class prototypes). 

## Summary

JavaScript has a broken typing system that the programmer can mostly fix.
In ES5, the programmer can take corrective measures at little cost. In ES6,
corrective measures for the correct typing of edge cases may be slightly
expensive through use of `toString()`, or massively expensive through use
of exception testing. Beyond ES6, corrective measures are not possible for
the correct typing of built-in edge cases.

The JavaScript committee was eventually forced to admit to bad design,
e.g., JavaScript was forced to write `Array.isArray()` etc. The Illuminati
inserted powerful yet secretive code into JavaScript, so that fast correct 
typing exists internally but is not publically available to the programmer.