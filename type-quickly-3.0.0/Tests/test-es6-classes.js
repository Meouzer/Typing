function isNodeEnvironment()
{
    return typeof global === 'object'
        && toString.call(global) === '[object global]';
}
let write;

if(isNodeEnvironment())
{
    const tq =  require('../type-quickly.js');
    global.type = tq.type;
    global.dtype = tq.dtype;
    global.is = tq.is;
    write = console.log;
}
else
{
    global = window;
    write = function(s) { document.write(s +"<br>"); }
}

function claim(b, message)
{
    let frown = `\u2639 \u2639 \u2639 \u2639 \u2639 \u2639 \u2639 \u2639`;
    frown = frown + frown  + frown + frown + frown + frown + frown + frown;

    if(b) write(`\u2713 ${message} is true`)
    else
    {
        write(frown);
        write(frown);
        write(frown);
        write(`\u2639 \u2639 \u2639 \u2639  \u2639 \u2639 \u2639 \u2639 ${message} is false: should be true`);
    }
}

function testPrimitives()
{
    claim(type(undefined) === "undefined", 'type(undefined) === "undefined"' )
    claim(type(null) === "null", 'type(null) === "null"')
    claim(type(true) === "boolean", 'type(true) === "boolean"')
    claim(type("my-string") === "string", 'type("my-string") === "string"')
    claim(type(7) === "number", 'type(7) === "number"')
    claim(type(Symbol()) === "symbol", 'type(Symbol()) === "symbol"')
    claim(type(BigInt(77)) === "bigint", 'type(BigInt(77)) === "bigint"')
    //=====================================================================
    claim(is.boolean(true) === true, "is.boolean(true) === true");
    claim(is.number(7) === true, "is.number(true) === true");
    claim(is.string("true") === true, `is.string("true") === true`);
}
write("+------------------------------+")
write("| Testing Primitives           ")
write("+------------------------------+")
testPrimitives();
write(".");

function TestBigIntAndSymbolObjects()
{
    if(typeof BigInt !== "undefined")
    {
        // Prototype
        claim(type(BigInt.prototype) === "Object",
            'type(BigInt.prototype) === "Object"');
        claim(dtype(BigInt.prototype) === "BigInt[Prototype]",
            'userType(BigInt.prototype) === "BigInt[Prototype]"');

        // Edge Case
        claim(type(Object.create(BigInt.prototype)) === "Object",
            'type(Object.create(BigInt.prototype)) === "Object"');
        claim(dtype(Object.create(BigInt.prototype)) === "BigInt[Object]",
            'dtype(Object.create(BigInt.prototype)) === "BigInt[Object]"');

        // Second Degree Object
        const deg2Obj = Object.create(Object.create(BigInt.prototype));
        claim(type(deg2Obj) === "Object", 'type(deg2Obj) === "Object"');
        claim(dtype(deg2Obj) === "BigInt[Object(2)]", 'dtype(deg2Obj) === "BigInt[Object(2)]"');
    }

    if(typeof Symbol !== "undefined")
    {
        // Prototype
        claim(type(Symbol.prototype) === "Object",
            'type(Symbol.prototype) === "Object"');
        claim(dtype(Symbol.prototype) === "Symbol[Prototype]",
            'dtype(Symbol.prototype) === "Symbol[Prototype]"');

        // Edge Case
        claim(type(Object.create(Symbol.prototype)) === "Object",
            'type(Object.create(Symbol.prototype)) === "Object"');
        claim(dtype(Object.create(Symbol.prototype)) === "Symbol[Object]",
            'dtype(Object.create(Symbol.prototype)) === "Symbol[Object]"');

        // Second Degree Object
        const deg2Obj = Object.create(Object.create(Symbol.prototype));
        claim(type(deg2Obj) === "Object", 'type(deg2Obj) === "Object"');
        claim(dtype(deg2Obj) === "Symbol[Object(2)]", 'dtype(deg2Obj) === "Symbol[Object(2)]"');
    }
}

write("+----------------------------------------------+")
write("| Testing  BigInt and Symbol Objects           ")
write("+----------------------------------------------+")
TestBigIntAndSymbolObjects();
write(".");

function testObject()
{
    claim(type(Object.prototype) === "Object", 'type(Object.prototype) === "Object"');
    claim(type(Object.create(Object.prototype)) === "Object",
        'type(Object.create(Object.prototype)) === "Object"');
    claim(type({}) === "Object", 'type({}) === "Object"');
    claim(type(Object.create({})) === "Object", 'type(Object.create({})) === "Object"');
    claim(type(Object.create(null)) === "Object", 'type(Object.create(null)) === "Object"');
    //-------------------------------------------------------------------------------------
    claim(is.Object(Object.prototype) === true, 'is.Object(Object.prototype) === true')
    claim(is.Object(Object.create(Object.prototype)) === true,
        'is.Object(Object.create(Object.prototype)) === true');
    claim(is.Object({}) === true, 'is.Object({}) === true');
    claim(is.Object(Object.create({})) === true, 'is.Object(Object.create({})) === true');
    claim(is.Object(Object.create(null)) === true, 'is.Object(Object.create(null)) === true');
}

write("+-------------------------+")
write("| Testing type() on Object |")
write("+--------------------------+")
testObject();
write('.');

function testFunction()
{
    const x = function(){}
    // Class Instance
    claim(type(x) === "Function", `type(x) === "Function"`);
    claim(dtype(x) === "Function", `dtype(x) === "Function"`);
    claim(is.Function(x) === true, `is.Function(x) === true`);
    write(' ');

    write("Class Prototype")
    claim(type(Function.prototype) === "Object", `type(Function.prototype) === "Object"`);
    claim(dtype(Function.prototype) === `Function[Prototype]`,
        `dtype(${Function.name}.prototype) === Function[Prototype]`);
    claim(is.Function(Function.prototype) === false, `is.Function(Function.prototype) === false`);
    write(' ');

    write("Second Degree Object");
    claim(type(Object.create(x)) === "Object", `type(Object.create(x)) === "Object"`);
    claim(dtype(Object.create(x)) === `Function[Object(2)]`, `dtype(Object.create(x)) === "Function[Object(2)]"`);
    claim(is.Function(Object.create(x)) === false, `is.Function(Object.create(x)) === false`);
    write(' ');

    write("Another Second Degree Object");
    claim(type(Object.create(Object.create(Function.prototype))) ===
        "Object", `type(Object.create(Object.create(Function.prototype))) === "Object"`);
    claim(dtype(Object.create(Object.create(Function.prototype))) === `Function[Object(2)]`,
        `dtype(Object.create(Object.create(Function.prototype))) === "Function[Object(2)]"`);
    claim(is.Function(Object.create(Object.create(Function.prototype))) === false,
        `is.Function(Object.create(Object.create(Function.prototype))) === false`);
    write(' ');

    write("Edge Case");
    claim(type(Object.create(Function.prototype)) === "Object",
        `type(Object.create(Function.prototype)) === "Object"`);
    claim(dtype(Object.create(Function.prototype)) === "Function[Object]",
        `dtype(Object.create(Function.prototype)) === "Function[Object]"`);
    claim(is.Function(Object.create(Function.prototype)) === false,
        `is.Function(Object.create(Function.prototype)) === false`);
    write(' ');

    // number
    claim(is.Function(7) === false, `is.Function(7) === false`);
}

write("+----------------------------------------+")
write("| Testing Function ")
write("+----------------------------------------+")
testFunction();
write(' ');

function Foo(){}
type.thisClass(Foo);

const klasses = [
    Boolean,
    Number,
    String,
    RegExp,
    Date,
    Array,
    WeakSet,
    Map,
    WeakMap,
    Set,
    ArrayBuffer,
    DataView,
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    BigInt64Array,
    BigUint64Array,
    Error,
    EvalError,
    ReferenceError,
    RangeError,
    SyntaxError,
    TypeError,
    URIError,
    Promise,
    Foo
];

function testClasses(Klass)
{
    write(' ');
    write(`----- Testing type() on ${Klass.name} -----`);
    let x;
    switch(Klass)
    {
        case Function:
            x= function(){};
            write('x = function(){}')
            break;
        case DataView:
            x = new DataView(new ArrayBuffer(8));
            write('x = new DataView(new ArrayBuffer(8))')
            break;
        case Promise:
            x = new Promise((resolve, reject) => {});
            write('x = new Promise((resolve, reject) => {})');
            break;
        default:
            x = new Klass();
            write(`x = new ${Klass.name}()`);
            break;
    }

    // Class Instance
    claim(type(x) === Klass.name, `type(x) === ${Klass.name}`);
    claim(dtype(x) === Klass.name, `dtype(x) === ${Klass.name}`);
    claim(is[Klass.name](x) === true, `is.${Klass.name}(x) === true`);
    write(' ');

    write("Class Prototype")
    claim(type(Klass.prototype) === "Object", `type(${Klass.name}.prototype) === Object`);
    claim(dtype(Klass.prototype) === `${Klass.name}[Prototype]`,
        `dtype(${Klass.name}.prototype) === ${Klass.name}[Prototype]`);
    claim(is[Klass.name](Klass.prototype) === false, `is.${Klass.name}(${Klass.name}.prototype) === false`);
    write(' ');

    write("Second Degree Object");
    claim(type(Object.create(x)) === "Object", `type(Object.create(x)) === "Object"`);
    claim(dtype(Object.create(x)) === `${Klass.name}[Object(2)]`, `dtype(Object.create(x)) === "${Klass.name}[Object(2)]"`);
    claim(is[Klass.name](Object.create(x)) === false, `is.${Klass.name}(Object.create(x)) === false`);
    write(' ');

    write("Another Second Degree Object");
    claim(type(Object.create(Object.create(Klass.prototype))) ===
        "Object", `type(Object.create(Object.create(${Klass.name}.prototype))) === "Object"`);
    claim(dtype(Object.create(Object.create(Klass.prototype))) === `${Klass.name}[Object(2)]`,
        `dtype(Object.create(Object.create(${Klass.name}.prototype))) === "${Klass.name}[Object(2)]"`);
    claim(is[Klass.name](Object.create(Object.create(Klass.prototype))) === false,
        `is.${Klass.name}(Object.create(Object.create(${Klass.name}.prototype))) === false`);
    write(' ');

    write("Edge Case");
    claim(type(Object.create(Klass.prototype)) === Klass.name,
        `type(Object.create(${Klass.name}.prototype)) === "${Klass.name}"`);
    claim(dtype(Object.create(Klass.prototype)) === Klass.name,
        `dtype(Object.create(${Klass.name}.prototype)) === "${Klass.name}"`);
    claim(is[Klass.name](Object.create(Klass.prototype)) === true,
        `is.${Klass.name}(Object.create(${Klass.name}.prototype)) === true`);
    write(' ');

    // number
    claim(is[Klass.name](7) === false, `is.${Klass.name}(7) === false`);
}

write("+----------------------------------------+")
write("| Testing remaining data types ")
write("+----------------------------------------+")

for(let i = 0; i < klasses.length; i++)
{
    testClasses(klasses[i])
}
write(' ');





write("+----------------------------------------+")
write("| Testing Protocol-1 Class     ")
write("+----------------------------------------+")

function testProtocol1Class()
{
    const MyClass = function()
    {
        type.asInstance(this,"MyClass");
    }

    type.asClass(MyClass);

    const x = new MyClass();

    claim(type(x) === "MyClass", `type(x) === "MyClass"`);
    claim(dtype(x) === "MyClass", `dtype(x) === "MyClass"`);
    claim(is.MyClass(x) === true, `is.MyClass(x) === true`);
    write(' ');

    write("Class Prototype")
    claim(type(MyClass.prototype) === "Object", `type(MyClass.prototype) === "Object"`);
    claim(dtype(MyClass.prototype) === "MyClass[Prototype]",
        `dtype(MyClass.prototype) === "MyClass[Prototype]"`);
    claim(is.MyClass(MyClass.prototype) === false, `is.MyClass(MyClass.prototype) === false`);
    write(' ');

    write("Second Degree Object");
    claim(type(Object.create(x)) === "Object", `type(Object.create(x)) === "Object"`);
    claim(dtype(Object.create(x)) === `MyClass[Object(2)]`, `dtype(Object.create(x)) === "MyClass[Object(2)]"`);
    claim(is.MyClass(Object.create(x)) === false, `is.MyClass(Object.create(x)) === false`);
    write(' ');

    write("Another Second Degree Object");
    claim(type(Object.create(Object.create(MyClass.prototype))) ===
        "Object", `type(Object.create(Object.create(MyClass.prototype))) === "Object"`);
    claim(dtype(Object.create(Object.create(MyClass.prototype))) === `MyClass[Object(2)]`,
        `dtype(Object.create(Object.create(MyClass.prototype))) === "MyClass[Object(2)]"`);
    claim(is.MyClass(Object.create(Object.create(MyClass.prototype))) === false,
        `is.MyClass(Object.create(Object.create(MyClass.prototype))) === false`);
    write(' ');

    write("Edge Case");
    claim(type(Object.create(MyClass.prototype)) === "Object",
        `type(Object.create(MyClass.prototype)) === "Object"`);
    claim(dtype(Object.create(MyClass.prototype)) === "MyClass[Object]",
        `dtype(Object.create(MyClass.prototype)) === "MyClass[Object]"`);
    claim(is.MyClass(Object.create(MyClass.prototype)) === false,
        `is.MyClass(Object.create(MyClass.prototype)) === false`);
    write(' ');

    // number
    claim(is.MyClass(7) === false, `is.MyClass(7) === false`);
}

testProtocol1Class()
write(' ');

write("+----------------------------------------+")
write("| Testing Protocol-1 Null Class ")
write("+----------------------------------------+")

function testProtocol1NullClass()
{
    const MyNullClass = function()
    {
        type.asInstance(this,"MyNullClass");
    }

    MyNullClass.prototype = Object.create(null);
    MyNullClass.prototype.constructor = MyNullClass;

    type.asClass(MyNullClass);
    const x = new MyNullClass();


    claim(type(x) === "MyNullClass", `type(x) === "MyNullClass"`);
    claim(dtype(x) === "MyNullClass", `dtype(x) === "MyNullClass"`);
    claim(is.MyNullClass(x) === true, `is.MyNullClass(x) === true`);
    write(' ');

    write("Class Prototype")
    claim(type(MyNullClass.prototype) === "Object", `type(MyNullClass.prototype) === "Object"`);
    claim(dtype(MyNullClass.prototype) === "MyNullClass[Prototype]",
        `dtype(MyClass.prototype) === "MyNullClass[Prototype]"`);
    claim(is.MyNullClass(MyNullClass.prototype) === false, `is.MyNullClass(MyNullClass.prototype) === false`);
    write(' ');

    write("Second Degree Object");
    claim(type(Object.create(x)) === "Object", `type(Object.create(x)) === "Object"`);
    claim(dtype(Object.create(x)) === `MyNullClass[Object(2)]`, `dtype(Object.create(x)) === "MyNullClass[Object(2)]"`);
    claim(is.MyNullClass(Object.create(x)) === false, `is.MyNullClass(Object.create(x)) === false`);
    write(' ');

    write("Another Second Degree Object");
    claim(type(Object.create(Object.create(MyNullClass.prototype))) ===
        "Object", `type(Object.create(Object.create(MyNullClass.prototype))) === "Object"`);
    claim(dtype(Object.create(Object.create(MyNullClass.prototype))) === `MyNullClass[Object(2)]`,
        `dtype(Object.create(Object.create(MyNullClass.prototype))) === "MyNullClass[Object(2)]"`);
    claim(is.MyClass(Object.create(Object.create(MyNullClass.prototype))) === false,
        `is.MyNullClass(Object.create(Object.create(MyNullClass.prototype))) === false`);
    write(' ');

    write("Edge Case");
    claim(type(Object.create(MyNullClass.prototype)) === "Object",
        `type(Object.create(MyNullClass.prototype)) === "Object"`);
    claim(dtype(Object.create(MyNullClass.prototype)) === "MyNullClass[Object]",
        `dtype(Object.create(MyNullClass.prototype)) === "MyNullClass[Object]"`);
    claim(is.MyNullClass(Object.create(MyNullClass.prototype)) === false,
        `is.MyNullClass(Object.create(MyNullClass.prototype)) === false`);
    write(' ');

    // number
    claim(is.MyNullClass(7) === false, `is.MyNullClass(7) === false`);
}

testProtocol1NullClass()

function test_Class_Protocol_Not_Followed()
{
    write("+-----------------------------------------+")
    write("| test_Class_Protocol_Not_Followed()      |")
    write("+-----------------------------------------+")

    function MyClass()
    {

    }

    function Foo(){}

    MyClass.prototype = Object.create(Foo.prototype);
    MyClass.prototype.constructor = MyClass;

    // Class instance
    claim(type(new MyClass()) === "MyClass", 'type(new MyClass()) === "MyClass"');
    claim(dtype(new MyClass()) === "MyClass", 'dtype(new MyClass()) === "MyClass"')
    write('.')

    // Class edge-case
    claim(type(Object.create(MyClass.prototype)) === "MyClass",
        'type(Object.create(MyClass.prototype)) === "MyClass"');
    claim(dtype(Object.create(MyClass.prototype)) === "MyClass",
        'dtype(Object.create(MyClass.prototype)) === "MyClass"')
    write('.')

    // Class Prototype
    claim(type(MyClass.prototype) === "Object",
        'type(MyClass.prototype) === "Object"');
    claim(dtype(MyClass.prototype) === "MyClass[Prototype]",
        'dtype(MyClass.prototype) === "MyClass[Prototype]"')
    write('.')

    // degree 2
    claim(type(Object.create(new MyClass())) === "Object", 'type(Object.create(new MyClass())) === "Object"');
    claim(dtype(Object.create(new MyClass())) === "MyClass[Object(2)]", 'dtype(Object.create(new MyClass())) === "MyClass[Object(2)]');
    //claim(!is.MyClass(Object.create(new MyClass)), '!is.MyClass(Object.create(new MyClass))');
    write('.')
}
test_Class_Protocol_Not_Followed()

/*
function test_Class_Protocol_Not_Followed_Constructor_Not_Set()
{
    console.log("+------------------------------------------------------------+")
    console.log("| test_Class_Protocol_Not_Followed_Constructor_Not_Set()     |")
    console.log("+------------------------------------------------------------+")

    function Foo(){}

    function MyClass()
    {
        ////this[Symbol.toStringTag] = "MyNullClass" protocol not followed
    }

    MyClass.prototype = Object.create(Foo.prototype);

    //// MyClass.prototype.constructor = MyClass; constructor not set
    ////typeUserClass(MyClass) protocol not followed

    // Class instance
    claim(type(new MyClass()) === "Object", 'type(new MyClass()) === "Object"')
    claim(userType(new MyClass()) === "Object", 'userType(new MyClass()) === "Object"')
    claim(dtype(new MyClass()) === "Foo[Object(2)]", 'dtype(new MyClass()) === "Foo[Object(2)]"')
    console.log('.')

    // Class edge-case
    claim(type(Object.create(MyClass.prototype)) === "Object",
        'type(Object.create(MyClass.prototype)) === "Object"')
    claim(userType(Object.create(MyClass.prototype)) === "Object",
        'userType(Object.create(MyClass.prototype)) === "Object"')
    claim(dtype(Object.create(MyClass.prototype)) === "Foo[Object(2)]",
        'dtype(Object.create(MyClass.prototype)) === "Foo[Object(2)]"')
    console.log('.')

    // Class Prototype
    claim(type(MyClass.prototype) === "Object",
        'type(MyClass.prototype) === "Object"')
    claim(userType(MyClass.prototype) === "Foo",
        'userType(MyClass.prototype) === "Foo"')
    claim(dtype(MyClass.prototype) === "Foo[Object]",
        'dtype(MyClass.prototype) === "Foo[Object]"')
    console.log('.')

    // degree 2
    claim(type(Object.create(new MyClass())) === "Object", 'type(Object.create(new MyClass())) === "Object"');
    claim(userType(Object.create(new MyClass())) === "Object", 'userType(Object.create(new MyClass())) === "Object"');
    claim(dtype(Object.create(new MyClass())) === "Foo[Object(3)]", 'dtype(Object.create(new MyClass())) === "Foo[Object(3)]');
    //claim(!is.MyClass(Object.create(new MyClass)), '!is.MyClass(Object.create(new MyClass))');
    console.log('.')
}

test_Class_Protocol_Not_Followed_Constructor_Not_Set()
*/


