const {type, is, dtype} = require('../type-quickly.js');

function claim(b, message)
{
    if(b) console.log(`\u2713 ${message} is true`)
    else console.log(`\u2639  ${message} is false: should be true`)
}

const write = console.log;

function test_1()
{
    function Foo(){}
    function Bax(){}
    Foo.prototype = Object.create(Bax.prototype);
    Foo.prototype.constructor = Foo;
    const tricky = new Foo();
    tricky.constructor = function try_to_trick(){};
    claim(type(new Foo()) === 'Foo', "type(new Foo()) === 'Foo'");
    claim(dtype(new Foo()) === 'Foo', "dtype(new Foo()) === 'Foo'");
    claim(type(tricky) === 'Foo', "type(tricky) === 'Foo'");
    claim(dtype(tricky) === 'Foo', "dtype(tricky) === 'Foo'");
    claim(type(Foo.prototype) === 'Object', "type(Foo.prototype) === 'Object'");
    claim(type(Object.create(new Foo())) === 'Object', "type(Object.create(new Foo())) === 'Object'");
    claim(type(Object.create(tricky)) === 'Object', "type(Object.create(tricky)) === 'Object'");

    claim(dtype(Object.create(tricky)) === "Foo[Object(2)]", 'dtype(Object.create(tricky)) === "Foo[Object(2)]"');
    claim(dtype(Object.create(new Foo())) === "Foo[Object(2)]", 'dtype(Object.create(new Foo())) === "Foo[Object(2)]"');

    type.thisClass(Foo);
    claim(is.Foo(new Foo()) === true, "is.Foo(new Foo()) === true");
    claim(is.Foo(tricky) === true, "is.Foo(tricky) === true");
    claim(is.Foo(Foo.prototype) === false, "is.Foo(Foo.prototype) === false");
    claim(is.Foo(Object.create(new Foo())) === false, "is.Foo(Object.create(new Foo())) === false");
}

test_1();

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

write("+----------------------------------------+")
write("| Testing Protocol-1 Class     ")
write("+----------------------------------------+")
testProtocol1Class()
write(' ');



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

write("+----------------------------------------+")
write("| Testing Protocol-1 Null Class ")
write("+----------------------------------------+")
testProtocol1NullClass()