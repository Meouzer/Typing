# Typing with Object.prototype.toString.call(x)

Everyone knows that `toString()` has some typing capabilities. The following 
`nativeType()` function extracts typing information from `toString()`.

```
function nativeType(x)
{
    if(x === null) return "null";
    const t = typeof x;
    if(t !== "object" && t !== "function") return t;        
    const s = Object.prototype.toString.call(x);
    return s.substring(8, s.length - 1);
}
```

One curious fact is that if `x` is the arguments list of a function then
`nativeType(x)` is `"Arguments"`.

JavaScript architects clearly knew about the potential typing capabilities of `toString()`, 
so it's a mystery on why they designed it so badly. Things go well but not perfectly 
in ES5, and thereafter `toString()` goes off the rails.

Before going on let's develop some nomenclature. Let Klass be a class.
The *Klass objects* are `Klass.protoytpe` and anything that derives from
it. In particular the Klass objects are

1. The class prototype `Klass.prototype`
2. The *class instance* `new Klass(...)`
3. The *Klass edge case* `Object.create(Klass.prototype)`
4. The secondary Klass objects, which are the remaining objects derived from `Klass.prototpe`.

The class edge case `x` can become a class instance via a call to
`Klass.call(x, ...)` or to `Klass.apply(x,[...])`. If `x` is itself used
as a class prototype, then don't consider it to be the edge case.

## The jobs for nativeType()/toString()

In decreasing order of importance, the jobs for `nativeType()/toString()` follow.

1. Type the class instance correctly to the name of the class
2. Type the edge case correctly to `"Object"`
3. Type the class prototype correctly to `"Object"`
4. Type the secondary objects of the class correctly to `"Object"` 

Now `Array.isArray()`, and node's type checkers such as `util.types.isBoolean()` all 
handle edge cases correctly, e.g., if `edgeCase = Object.create(Array.prototype)` then 
`Array.isArray(edgeCase)` is `false` just as it should be because `edgeCase` is not an 
Array. So let's agree that edge cases should be correctly typed.

The reason the class prototype is further down the list is that typing code can check
for the class prototype and type it to `"Object"`. Similarly, secondary objects are
further down the list because code can check the internal prototype and if it is not 
the class prototype then also type it to `"Object"`.

## Dividing JavaScript Classes into Groups

We divide all classes into four groups depending on how well `nativeType()/toString()` 
works on the class by correctly doing its four jobs. Bad design is clearly evident as
across classes, `toString()` behaves in a completely random, add-hoc, capricious,
and inconsistent manner. 

### Group-1

Group-1 classes are enumerated below. The `nativeType()` function works  
perfectly on these classes: all four jobs of `toString()` are correctly performed.

1. Date
2. RegExp 
3. The typed array classes 
     
```
    // Date is a Group-1 class
    // Some Date objects
    
    const classIntance = Date.now();
    const prototype = Date.prototype;
    const edgeCase = Object.create(Date.prototype);
    const secDegObj_1 = Object.create(x);
    const secDegObj_2 = Object.create(Object.create(Date.prototype));
    
    // All Date objects are correctly typed by toString()
    
    nativeType(classInstance)   "Date"
    nativeType(prototype)       "Object"
    nativeType(edgeCase)        "Object"
    nativeType(secDegObj_1)     "Object"
    nativeType(secDegObj_2)     "Object"
```

This is proof that JavaScript had the full means for correct typing of all objects.
However, because of bad decisions constituting severe negligence, `toString()` 
goes south on other classes. If all classes were Group-1 classes then
the `nativeType()` function would type every JavaScript element correctly without 
exception. 

### Group-2 

Group-2 classes are the Error and Variant-Error classes enumerated below.

1. Error
2. AggregateError
3. EvalError
4. RangeError
5. ReferenceError
6. TypeError
7. SyntaxError
8. URIError

The `nativeType()` function works perfectly well on Error objects. However,
Variant-Error class instances are incorrectly typed to `"Error"`. Otherwise
`toString()` does its four jobs correctly.

So if the native-type of an object is `"Error"`, check the constructor name
to determine the correct type of the object.

In the Edge browser there is no Group-2 class, i.e., the classes listed
above need to be moved to Group-3.

### Group-3

Group-3 classes are the classes where `toString()` is correct except
for incorrectly typing the class prototype to the name of the class.
Group-3 classes are enumerated below.

1. Boolean    
2. Number
3. String
4. Array

### Group-4

All remaining classes in ES6 and beyond ES6 lie in Group-4. Group-4 classes 
are the classes where `toString()` types all class objects to the name of the 
class, i.e., `toString()` makes no distinction between the class instance, 
the class prototype, the edge case, and the secondary class objects. 

The ES6 classes that belong to Group-4 are enumerated below.

1. ArrayBuffer
2. DataView
3. Map
4. WeakMap
5. Set
6. WeakSet

## Typing in ES5

The ES5 classes are Date, RegExp, Error, Number, String, Boolean,
Array, and Function.

```
function typeES5(x) // for the browser
{
    // handle null    
    if (x === null) return null;
    
    // handle other primitives    
    const t = typeof x;
    if (t != 'object' && t != 'function') return t;
    
    // handle ES5 classes    
    var className = nativeType(x);
    if(className == "Arguments") return "Object";
    
    // check for the class prototype
    if(x === window[className].prototype) return "Object"
    
    // className will be the name of the class on class instances
    // but "Object" on class edge cases and secondary class objects
    
    return className;
} 
```
During the reign of ES5 = ECMAScript-2009, `nativeType(x)` and consequently `typeES5(x)`
were immutable, meaning that there was nothing one could do to `x` to change the value 
of nativeType(x) or typeES5(x). However, past ES5, changing the internal prototype
of `x` might change the value.

Out of the box, the above function doesn't type objects of programmer defined classes.
However, to make it work for a programmer defined class see the following example.

```
function Klass()
{
    Object.defineProperty(this, Symbol.toStringTag, 
    {
        if(this === x) return "Klass";
        return "Object"
    });
}

const classIntance = new Klass();
const prototype = Klass.prototype;
const edgeCase = Object.create(Klass.prototype);
const secDegObj_1 = Object.create(classIntance);
const secDegObj_2 = Object.create(Object.create(classIntance.prototype));

// They are correctly typed by both the nativeType() and
// typeES5() functions

nativeType(classInstance)   "Klass"
nativeType(prototype)       "Object"
nativeType(edgeCase)        "Object"
nativeType(secDegObj_1)     "Object"
nativeType(secDegObj_2)     "Object"
```

## Typing in ES6

The `toString()` function will not type the edge cases of the ES6 classes that 
belong to Group-4. However, by coincidence these classes have innocuous methods
that can be tested. For example suppose you know `x` is either a Map class instance
or a Map edge case but don't know which, then the code will tell you which one.

```
function is_x_a_class_instance()
{
    try
    {
        Map.prototype.has.call(x, {});
        return true
    }
    catch(e)
    {
        return false
    }
}
```

You call the innocuous method `has()` through the prototype because otherwise the function 
could be spoofed by writing a `has()` method directly on `x`. You can use this technique 
on the other ES6 classes in Group-4.

The unavoidable downside is that if `x` is the edge case then an exception is thrown,
which causes an error to be constructed, which causes the call stack to be traced, 
which causes a truly massive slowdown in code.

## Typing Beyond ES6

All classes beyond ES6 lie in Group-4, and there are no innocuous methods to test,
whence fully correct typing, i.e, typing that correctly types edge cases, is not
possible.

## Some Final Typing Functions using toString()

Basically if you want to write a direct typing function whose primary mechanism
is `toString()` and is also correct without exception when it's possible to be
correct, then you are going to write a truly horrible typing function. 
By direct we mean the author's prototyping technique or some other technique
that isolates code to each individual class is not used. More on the prototyping 
technique later. And no, I don't think you can do better, but feel free to prove otherwise.

The main point of the following typing examples is to prove just how bad
`toString()` actually is. You have to go through contortions to type
as correctly as JavaScript allows.

### Example 1

The following typing function illustrates the ideas in this article. 
It will correctly type the ES5/ES6 built in class objects. If  
somehow you manage to improve on this function, it will still be 
very inefficient because you still have to do everything this
function does.

```
function type(x) 
{
    if(x === null) return "null";
    const t = typeof x;
    if(t !== "object" && t !== "function") return t;   
    
    const nt = nativeType(x);
    switch(nt)
    {
        // Handle argument lists of functions
        
        case "Arguments:
            return "Object";
        
        // Handle Group-1 classes    
        
        case "Date":
        case "RegExp":        
        case "BigInt64Array":
            return nt;
        
        // Handle Group-2 classes
        
        case "Error":
            return Object.getPrototpeOf(x).constructor.name;
            
        // Handle Group-3 classes
        
        case "Boolean":
        case "Number":
        case "String":
        case "Array":
            if(x === window[nt].prototype) return "Object"
            return nt;
                      
        // Handle ES6 Group-4 clases 
        
        case "Map":
            if(x === Map.prototype) return "Object"
            if(Object.getPrototypeOf(x) === Map.prototpe)
            {
               try
                {
                    Map.prototype.has.call(x, {});
                    return "Map"
                }
                catch(e)
                {
                    return "Object"
                } 
            }    
            return "Object"
        case "WeakMap:
            Ditto;
        case "Set:
            Ditto;
        case "WeakSet:
            Ditto;   
        case "ArrayBuffer:
            Ditto;       
        case "DataView:
            Ditto;   
            
         // Handle all other Group-4 classes.  
         // Both class instances and class edge cases will
         // type to the name of the class. Recall there is 
         // no way to detect the edge case and correctly type 
         // it to "Object"
             
         default:
            const Klass = window[nt];
            if(x === Klass.prototype) return "Object";
            if(Object.getPrototypeOf(x)) === Klass.prototype
                return "Klass"
            return "Object";                           
    }        
}
```

### Example 2

The following is a really horrible looking typing function for typing the built-in
ES5/ES6 classes. However, it works perfectly fine. Thank you very much!

```
function type_grungy(x)
{
    if (x === null) return "null";
    if (typeof(x) != 'object' && typeof(x) != 'function') return typeof(x);

    const t = nativeType(x);
    if(t == "Arguments") return "Object";

    if(x == window[t].prototype || x.__proto__ == Object.prototype
        || x.__proto__ == undefined || t == "BigInt" || t == "Symbol")
            return "Object";

    if (t == "Error") return (x == x.constructor.prototype)?
        "Object" : x.__proto__.constructor.name;

    if(QuirksInstance[t]) return QuirksInstance[t](x)? t : "Object";

    // For IE11
    const ct = x.__proto__.constructor.name;
    if(QuirksInstance[ct]) return QuirksInstance[ct](x)? ct : "Object";

    return t;
}

const QuirksInstance =
{
    // Code below is not optimal, because one should first
    // check the internal prototype. 
    
    ArrayBuffer:function (x) {
        try { ArrayBuffer.prototype.slice.call(x,0,0)}
        catch (e) { return false; }   
        return true;  // x is a class instance of ArrayBuffer
    },
    DataView: function (x) {
        try { DataView.prototype.getUint8.call(x,0)}
        catch (e) { return false;}
        return true;
    },
    Map: function (x) {
        try { Map.prototype.has.call(x,{})}
        catch (e) { return false; }
        return true;
    },
    Set:function (x) {
        try {Set.prototype.has.call(x,{});}
        catch (e) { return false;}
        return true;
    },
    WeakMap:function(x)
    {
        try { WeakMap.prototype.has.call(x,"key"); }
        catch (e) { return false; }
        return true;
    },
    WeakSet:function(x){
        try {WeakSet.prototype.has.call(x,"value");}
        catch (e) { return false;}
        return true;
    }
} 
```

You have literally been given all the information you need to figure out how this
function works. Good luck. 

### Example-3

OK! The author decided not to include his third example, which is fully correct. 
Feel free to write your own, or prove you can come up with something better. 
Again, you must be fully correct when it's possible to be correct.

## The Prototyping Technique

The author looked at all the shenanigans one must write if using `toString()` directly 
in a single monolithic typing function and said there's got to be something better. 

The killer idea is to figure out the best typing function that types `Boolean.prototype` 
and all objects derived from it. Then do the same for all other classes and fit the small 
typing functions together inside a function to rule them all.

So we write a method directly on `Boolean.prototype` that correctly types all Boolean
objects, recall this means `Boolean.prototype` and all objects derived from it.
The method shouldn't be a string property since this would pollute `Boolean.prototype` 
properties causing possible conflicts with other libraries. However, using symbols as 
properties circumvents this conflict and is one of the reasons that symbols were 
invented.

```
const typeSymbol = Symbol();

Object.defineProperty(Boolean.prototype, typeSymbol,
{
    value:function()
    {
        if(this === Boolean.prototype) return "Object";
        return nativeType(this);
    }
});
	
or another way

Object.defineProperty(Boolean.prototype, typeSymbol,
{
    value:function()
    {
        if(Object.getPrototypeOf(this) === Boolean.prototype)
        {
            return nativeType(x)
        }
        return "Object"
    }
});
```

Define typeSymbol on other class prototypes keeping in mind the particular 
peculiarities of `toString()` for that class, and you get the following 
especially simple typing function. What's great about it is that it is
lightning fast, making this author's typing packages the fastest on NPM.
Also, it is fully correct when it is possible to be correct.

```
function type(x)
{
    if (x === null) return "null";
    const tof = typeof(x);
    if (tof !== 'object' && tof !== 'function') return tof;
    const t = x[typeSymbol];
    if(t) return t.call(x);
    
    // now write fall back code for when the typeSymbol
    // is not defined. Hint: don't use toString().
}
```

The fall-back code is shown in the 01-typing-in-JavaScript.md article,
section *The Constructor-Prototype Technique*. 

## Summary

`Object.prototype.toString()` is poorly designed. A monolithic typing function whose
primary mechanism is `toString()` is going to be nasty. `toString()` is useful in 
distinguishing between class instances and class edge cases for ES5 classes and some 
ES6 classes. This usefulness doesn't extend past ES6.