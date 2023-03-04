const {is} = require('../type-quickly.js');

function claim(b, message)
{
    if(b) console.log(`\u2713 ${message} is true`)
    else console.log(`\u2639  ${message} is false: should be true`)
}

const map_iterator = new Map()[Symbol.iterator]();
claim(is.mapIterator(map_iterator), "is.mapIterator(map_iterator)");
claim(is.setIterator(map_iterator) === false, "is.setIterator(map_iterator) === false");
const set_iterator = new Set()[Symbol.iterator]();
claim(is.setIterator(set_iterator), "is.setIterator(set_iterator)")
claim(is.mapIterator(set_iterator) === false, "is.mapIterator(set_iterator) === false");
const array_iterator = new Array([])[Symbol.iterator]();
claim(is.arrayIterator(array_iterator), "is.arrayIterator(array_iterator)");
claim(is.generatorFunction(function* foo(){}), "is.generatorFunction(function* foo(){})")
claim(is.asyncFunction(async function foo(){}), "is.asyncFunction(async function foo(){})")
const generator = (function* foo(){})();
claim(is.generatorObject(generator), "is.generatorObject(generator)");
claim(is.generatorObject(Object.create(generator)) === false,
    "is.generatorObject(Object.create(generator)) === false");

const args = (function foo()
{
    return arguments;
})()

claim(is.arguments(args), "is.arguments(args)")
claim(is.arguments(Object.create(args)) === false, "is.arguments(Object.create(args)) === false")