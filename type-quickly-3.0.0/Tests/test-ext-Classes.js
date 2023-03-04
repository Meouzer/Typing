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

    write = function (s) { console.log(s) }
}
else
{
    global = window;
    write = function(s) { document.write(s +"<br>"); }
}

function claim(b, message)
{
    if(b) write(`\u2713 ${message} is true`)
    else write(`\u2639  ${message} is false: should be true`)
}

function classNotFound(className)
{
    write("+-------------------------------------------------------+")
    write(`| The class ${className} is not available in this browser`)
    write("+-------------------------------------------------------+")
}
function testClass(classInstance, Klass)
{
    const classPrototype = Klass.prototype;
    write("+------------------------------+")
    write(`| Testing ${Klass.name}`)
    write("+------------------------------+")

    write("Class Instance")
    claim(type(classInstance) === Klass.name, `type(classInstance) === ${Klass.name}`);
    claim(dtype(classInstance) === Klass.name, `dtype(classInstance) === ${Klass.name}`);
    claim(is[Klass.name](classInstance) === true, `is.${Klass.name}(classInstance) === true`);
    write(' ');

    write("Class Prototype")
    claim(type(classPrototype) === "Object", `type(classPrototype) === "Object"`);
    claim(dtype(classPrototype) === `${Klass.name}[Prototype]`,
        `dtype(${Klass.name}.prototype) === "${Klass.name}[Prototype]"`);
    claim(is[Klass.name](classPrototype) === false, `is.${Klass.name}(${Klass.name}.prototype) === false`);
    write(' ');

    write("Second Degree Object");
    claim(type(Object.create(classInstance)) === "Object",
        `type(Object.create(classInstance)) === "Object"`);
    claim(dtype(Object.create(classInstance)) === `${Klass.name}[Object(2)]`,
        `dtype(Object.create(classInstance)) === "${Klass.name}[Object(2)]"`);
    claim(is[Klass.name](Object.create(classInstance)) === false,
        `is.${Klass.name}(Object.create(classInstance)) === false`);
    write(' ');

    write("Another Second Degree Object");
    claim(type(Object.create(Object.create(classPrototype))) ===
        "Object", `type(Object.create(Object.create(${Klass.name}.prototype))) === "Object"`);
    claim(dtype(Object.create(Object.create(classPrototype))) === `${Klass.name}[Object(2)]`,
        `dtype(Object.create(Object.create(${Klass.name}.prototype))) === "${Klass.name}[Object(2)]"`);
    claim(is[Klass.name](Object.create(Object.create(classPrototype))) === false,
        `is.${Klass.name}(Object.create(Object.create(${Klass.name}.prototype))) === false`);
    write(' ');
    write("Edge Case");
    claim(type(Object.create(classPrototype)) === Klass.name,
        `type(Object.create(${Klass.name}.prototype)) === "${Klass.name}"`);
    claim(dtype(Object.create(classPrototype)) === Klass.name,
        `dtype(Object.create(${Klass.name}.prototype)) === "${Klass.name}"`);
    claim(is[Klass.name](Object.create(classPrototype)) === true,
        `is.${Klass.name}(Object.create(${Klass.name}.prototype)) === true`);
    write(' ');
    // number
    claim(is[Klass.name](7) === false, `is.${Klass.name}(7) === false`);
    write(".");
}

if(global.AggregateError){
    testClass(new global.AggregateError("message"), global.AggregateError);
} else {
    classNotFound("AggregateError");
}

if(global.AbortController){
    testClass(new global.AbortController(), global.AbortController);
} else {
    classNotFound("AbortController");
}

if(global.AbortSignal){
    testClass(global.AbortSignal.abort(), global.AbortSignal);
} else {
    classNotFound("AbortSignal");
}

if(global.Blob){
    testClass(new global.Blob(), global.Blob);
} else {
    classNotFound("Blob");
}

if(global.ByteLengthQueuingStrategy){
    testClass(new global.ByteLengthQueuingStrategy({highWaterMark: 1 * 1024}),
        global.ByteLengthQueuingStrategy);
} else {
    classNotFound("ByteLengthQueuingStrategy");
}

if(global.BroadcastChannel){
    testClass(new global.BroadcastChannel("notify"), global.BroadcastChannel);
} else {
    classNotFound("BroadcastChannel");
}

if(global.CompressionStream){
    testClass(new global.CompressionStream("gzip"), global.CompressionStream);
} else { classNotFound("CompressionStream"); }

// alert(SubtleCrypto)

// SubtleCrypto.generateKey("RSASSA-PKCS1-v1_5", false, []);


/*if(window.CryptoKey){
    testBrowserClass(new CryptoKey(), window.CryptoKey);
} else { classNotFound("CryptoKey"); } // to debug
// SubtleCrypto.generateKey("RSASSA-PKCS1-v1_5", false, [])*/


if(global.DecompressionStream){
    testClass(new global.DecompressionStream("gzip"), global.DecompressionStream);
} else { classNotFound("DecompressionStream"); }

if(global.CountQueuingStrategy){
    testClass(new global.CountQueuingStrategy({ highWaterMark: 1 }), global.CountQueuingStrategy);
} else { classNotFound("CountQueuingStrategy"); }

if(global.Event){
    testClass(new global.Event("hello"), global.Event);
} else { classNotFound("Event"); }

if(global.EventTarget){
    testClass(new global.EventTarget(), global.EventTarget);
} else { classNotFound("EventTarget"); }

if(global.FormData){
    testClass(new global.FormData(), global.FormData);
} else { classNotFound("FormData"); }

if(global.Headers){
    testClass(new global.Headers(), global.Headers);
} else { classNotFound("Headers"); }

if(global.MessageChannel){
    testClass(new global.MessageChannel(), global.MessageChannel);
} else { classNotFound("MessageChannel"); }

if(global.MessageEvent){
    testClass(new global.MessageEvent("message"), global.MessageEvent);
} else { classNotFound("MessageEvent"); }

if(global.MessagePort)
{
    testClass( new MessageChannel().port1, global.MessagePort)
} else { classNotFound("MessagePort"); }

// PerformanceEntry
// PerformanceMark
// PerformanceMeasure
// PerformanceObserver
// PerformanceObserverEntryList
// PerformanceResourceTiming
// ReadableByteStreamController
// ReadableByteStreamController

if(global.ReadableStream){
    testClass(new global.ReadableStream("Test-ES6.html"), global.ReadableStream);
} else { classNotFound("ReadableStream"); }


/*
if(global.ReadableStreamBYOBReader){
    testClass(new global.ReadableStreamBYOBReader(new global.ReadableStream("Test-ES6.html")),
        global.ReadableStreamBYOBReader);
} else { classNotFound("ReadableStreamBYOBReader"); }
*/

// ReadableStreamDefaultController

if(global.ReadableStreamDefaultReader){
    testClass(new global.ReadableStreamDefaultReader(new global.ReadableStream("dummy.txt")),
        global.ReadableStreamDefaultReader);
} else { classNotFound("ReadableStreamDefaultReader"); }


if(global.TextDecoderStream){
    testClass(new global.TextDecoderStream("utf8"), global.TextDecoderStream);
} else { classNotFound("TextDecoderStream"); }

if(global.TextEncoder){
    testClass(new global.TextEncoder(), global.TextEncoder);
} else { classNotFound("TextEncoder"); }

if(global.TextEncoderStream){
    testClass(new global.TextEncoderStream(), global.TextEncoderStream);
} else { classNotFound("TextEncoderStream"); }

if(global.TransformStream){
    testClass(new global.TransformStream(), global.TransformStream);
} else { classNotFound("TransformStream"); }

// TransformStreamDefaultController

if(global.URL){
    testClass(new global.URL("http:\\meouzer.com"), global.URL);
} else { classNotFound("URL"); }

if(global.URLSearchParams){
    testClass(new global.URLSearchParams(), global.URLSearchParams);
} else { classNotFound("URLSearchParams"); }

if(global.WritableStream){
    testClass(new global.WritableStream("Test-ES6.html"), global.WritableStream);
} else { classNotFound("WritableStream");}

// WritableStreamDefaultController

if(global.WritableStreamDefaultWriter){
    testClass(new global.WritableStreamDefaultWriter(new global.WritableStream("Test-ES6.html")),
        global.WritableStreamDefaultWriter);
} else { classNotFound("WritableStreamDefaultWriter");}

if(global.SharedArrayBuffer)
{
    testClass(new global.SharedArrayBuffer(new global.SharedArrayBuffer(8)),
        global.SharedArrayBuffer);
}else { classNotFound("SharedArrayBuffer");}
