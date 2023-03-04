const {dtype, type, is} = require('../type-quickly.js');

function claim(b, message)
{
    if(b) console.log(`\u2713 ${message} is true`)
    else console.log(`\u2639  ${message} is false: should be true`)
}

claim(type(Symbol()) === "symbol", 'type(Symbol()) === "symbol"');
claim(type(Object(Symbol())) === "boxedSymbol", 'type(Object(Symbol())) === "boxedSymbol"');
claim(type(Symbol.prototype) === "Object", 'type(Symbol.prototype) === "Object"');
claim(type(Object.create(Symbol.prototype)) === "Object", 'type(Object.create(Symbol.prototype)) === "Object"');
claim(is.boxedSymbol(Object(Symbol())) === true, 'is.boxedSymbol(Object(Symbol)) === true');
claim(is.boxedSymbol(Symbol()) === false, 'is.boxedSymbol(Symbol()) === false');
claim(is.boxedSymbol(Object.create(Symbol.prototype)) === false,
    'is.boxedSymbol(Object.create(Symbol.prototype)) === false');


claim(type(BigInt(7)) === "bigint", 'type(BigInt(7)) === "bigint"');
claim(type(Object(BigInt(7))) === "boxedBigInt", 'type(Object(BigInt(7))) === "boxedBigInt"');
claim(type(BigInt.prototype) === "Object", 'type(BigInt.prototype) === "Object"');
claim(type(Object.create(BigInt.prototype)) === "Object",
    'type(Object.create(BigInt.prototype)) === "Object"');
claim(is.boxedBigInt(Object(BigInt(7))) === true, 'is.boxedBigInt(Object(BigInt(7))) === true');
claim(is.boxedBigInt(BigInt(7)) === false, 'is.boxedBigInt(BigInt(7)) === false');
claim(is.boxedSymbol(Object.create(BigInt.prototype)) === false,
    'is.boxedSymbol(Object.create(BigInt.prototype)) === false');