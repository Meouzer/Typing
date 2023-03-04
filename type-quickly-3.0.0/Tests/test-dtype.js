const {dtype, type} = require('../type-quickly.js');
const fs = require('fs');
function claim(b, message)
{
    if(b) console.log(`\u2713 ${message} is true`)
    else console.log(`\u2639  ${message} is false: should be true`)
}

function test_dtype()
{
    claim(dtype(Object.prototype) === "Object[Prototype]", 'dtype(Object.prototype) === "Object[Prototype]"' );
    claim(dtype({}) === "Object", 'dtype({}) === "Object"');
    claim(dtype(Object.create({})) === "Object(2)", 'dtype(Object.create({})) === "Object(2)"');
    claim(dtype(Boolean.prototype) === "Boolean[Prototype]", 'dtype(Boolean.prototype) === "Boolean[Prototype]"');
    claim(dtype(new Boolean(true)) === "Boolean", 'dtype(new Boolean(true)) === "Boolean"');
    claim(dtype(Object.create(new Boolean(true))) === "Boolean[Object(2)]",
        'dtype(Object.create(new Boolean(true))) === "Boolean[Object(2)]"');
    claim(dtype(Object.create(Object.create(new Boolean(true)))) === "Boolean[Object(3)]",
        'dtype(Object.create(Object.create(new Boolean(true)))) === "Boolean[Object(3)]"');
    claim(dtype(Object.create(null)) === "Null[Object]", 'dtype(Object.create(null)) === "Null[Object]"');
    claim(dtype(Object.create(Object.create(null))) === "Null[Object(2)]",
        'dtype(Object.create(Object.create(null))) === "Null[Object(2)]"');
    claim(dtype(Object.create(Object.create(Object.create(null)))) === "Null[Object(3)]",
        'dtype(Object.create(Object.create(Object.create(null)))) === "Null[Object(3)]"');
    claim(dtype(Buffer.prototype) === "Buffer[Prototype]", 'dtype(Buffer.prototype) === "Buffer[Prototype]"');
    claim(dtype(Buffer.alloc(8)) === "Buffer", 'dtype(Buffer.alloc(8)) === "Buffer"');
    claim(dtype(Object.create(Buffer.alloc(8))) === "Buffer[Object(2)]",
        'dtype(Object.create(Buffer.alloc(8))) === "Buffer[Object(2)]"')
    const x = new fs.WriteStream("dummy.txt");
    const prototype = fs.WriteStream.prototype;
    claim(dtype(fs.WriteStream.prototype) === "node_fs_WriteStream[Prototype]",
        'dtype(fs.WriteStream.prototype) === "node_fs_WriteStream[Prototype]"');
    claim(dtype(x) === "node_fs_WriteStream", 'dtype(x) === "node_fs_WriteStream"');
    claim(dtype(Object.create(x)) === "node_fs_WriteStream[Object(2)]",
        'dtype(Object.create(x)) === "node_fs_WriteStream[Object(2)]"');
    claim(dtype(Object.create(Object.create(x))) === "node_fs_WriteStream[Object(3)]",
        'dtype(Object.create(Object.create(x))) === "node_fs_WriteStream[Object(3)]"');
    claim(dtype(Function.prototype) === "Function[Prototype]", 'dtype(Function.prototype) === "Function[Prototype]"');
    claim(dtype(function foo(){}) === "Function", 'dtype(function foo(){}) === "Function"');
    claim(dtype(Object.create(Function.prototype)) === "Function[Object]",
        'dtype(Object.create(Function.prototype)) === "Function[Object]"');
    claim(dtype(Object.create(Object.create(Function.prototype))) === "Function[Object(2)]",
        'dtype(Object.create(Object.create(Function.prototype))) === "Function[Object(2)]"');
    claim(dtype(Symbol.prototype) === "Symbol[Prototype]", 'dtype(Symbol.prototype) === "Symbol[Prototype]"');
    claim(dtype(Object.create(Symbol.prototype)) === "Symbol[Object]",
        'dtype(Object.create(Symbol.prototype)) === "Symbol[Object]"');
}

test_dtype();