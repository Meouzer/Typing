const {type, is, dtype} = require('../type-quickly.js')

const async_hooks = require('async_hooks');
const buffer = require('buffer');
const child_process = require('child_process');
const stream = require('stream');
const http = require('http');
const fs = require('fs');
const events = require('events');
const domain = require('domain');
const net = require('net');

function claim(b, message)
{
    if(b) console.log(`\u2713 ${message} is true`)
    else console.log(`\u2639  ${message} is false: should be true`)
}

function testNodeClass(classInstance, className, classPrototype)
{
    console.log("+------------------------------+")
    console.log(`| Testing ${className}`)
    console.log("+------------------------------+")

    console.log("Class Instance")
    claim(type(classInstance) === className, `type(classInstance) === ${className}`);
    claim(dtype(classInstance) === className, `dtype(classInstance) === ${className}`);
    claim(is[className](classInstance) === true, `is.${className}(classInstance) === true`);
    console.log(' ');

    console.log("Class Prototype")
    claim(type(classPrototype) === "Object", `type(classPrototype) === "Object"`);
    claim(dtype(classPrototype) === `${className}[Prototype]`,
        `dtype(${className}.prototype) === "${className}[Prototype]"`);
    claim(is[className](classPrototype) === false, `is.${className}(${className}.prototype) === false`);
    console.log(' ');

    console.log("Second Degree Object");
    claim(type(Object.create(classInstance)) === "Object",
        `type(Object.create(classInstance)) === "Object"`);
    claim(dtype(Object.create(classInstance)) === `${className}[Object(2)]`,
        `dtype(Object.create(classInstance)) === "${className}[Object(2)]"`);
    claim(is[className](Object.create(classInstance)) === false,
        `is.${className}(Object.create(classInstance)) === false`);
    console.log(' ');

    console.log("Another Second Degree Object");
    claim(type(Object.create(Object.create(classPrototype))) ===
        "Object", `type(Object.create(Object.create(${className}.prototype))) === "Object"`);
    claim(dtype(Object.create(Object.create(classPrototype))) === `${className}[Object(2)]`,
        `dtype(Object.create(Object.create(${className}.prototype))) === "${className}[Object(2)]"`);
    claim(is[className](Object.create(Object.create(classPrototype))) === false,
        `is.${className}(Object.create(Object.create(${className}.prototype))) === false`);
    console.log(' ');

    console.log("Edge Case");
    claim(type(Object.create(classPrototype)) === className,
        `type(Object.create(${className}.prototype)) === "${className}"`);
    claim(dtype(Object.create(classPrototype)) === className,
        `dtype(Object.create(${className}.prototype)) === "${className}"`);
    claim(is[className](Object.create(classPrototype)) === true,
        `is.${className}(Object.create(${className}.prototype)) === true`);
    console.log(' ');

    // number
    claim(is[className](7) === false, `is.${className}(7) === false`);

    console.log(".");
}
/*
console.log("+------------------------------+")
console.log("| Testing Buffer           ")
console.log("+------------------------------+")
testNodeClass(Buffer.alloc(8), "node_Buffer", Buffer.prototype);
console.log(".");
*/

if(async_hooks.AsyncHook) { // not executed
    testNodeClass(async_hooks.createHook(function foo(){}), "node_async_hooks_AsyncHook",
        async_hooks.AsyncHook.prototype)
}
if(async_hooks.AsyncResource) {
    executionAsyncId = async_hooks.executionAsyncId;
    const x = new async_hooks.AsyncResource("type", { triggerAsyncId: executionAsyncId(), requireManualDestroy: false });
    testNodeClass(x, "node_async_hooks_AsyncResource",
        async_hooks.AsyncResource.prototype)
}
if(async_hooks.AsyncLocalStorage)
{
    testNodeClass(new async_hooks.AsyncLocalStorage(), "node_async_hooks_AsyncLocalStorage",
        async_hooks.AsyncLocalStorage.prototype)
}

if(buffer.Buffer) {
    testNodeClass(Buffer.alloc(8), "Buffer", buffer.Buffer.prototype)
}

if(buffer.Blob) {
    testNodeClass(new buffer.Blob(), "Blob", buffer.Blob.prototype);
}

//if(buffer.File) { // not executed
//    testNodeClass(new buffer.File(), "node_buffer_File", buffer.File.prototype);
//}

/*
if(child_process.ChildProcess)
{
    testNodeClass(child_process.spawn('ls', ['-lh', '/usr']), "node_child_process_ChildProcess",
        child_process.ChildProcess.prototype);
}*/


if(stream.Readable){
    testNodeClass(new stream.Readable() , "node_stream_Readable", stream.Readable.prototype);
}
if(stream.Writable) {
    testNodeClass(new stream.Writable() , "node_stream_Writable", stream.Writable.prototype);
}
if(stream.Transform) {
    testNodeClass(new stream.Transform() , "node_stream_Transform", stream.Transform.prototype);
}
if(stream.Duplex) {
    testNodeClass(new stream.Duplex() , "node_stream_Duplex", stream.Duplex.prototype);
}
if(http.Server) {
    testNodeClass(new http.createServer() , "node_http_Server", http.Server.prototype);
}
if(fs.ReadStream) {
    testNodeClass(new fs.ReadStream("dummy.txt") , "node_fs_ReadStream", fs.ReadStream.prototype);
}
if(fs.WriteStream) {
    testNodeClass(new fs.WriteStream("dummy.txt") , "node_fs_WriteStream", fs.WriteStream.prototype);
}
if(fs.Dirent) {
    //testNodeClass(new fs.Dirent("dummy.txt") , "node_fs_Dirent", fs.Dirent.prototype);
}
if(fs.Dir) {
    //testNodeClass(new fs.Dir("dummy.txt") , "node_fs_Dir", fs.Dir.prototype);
}
if(fs.Stats) {
    //testNodeClass(new fs.Stats("dummy.txt") , "node_fs_Stats", fs.Stats.prototype);
}
if(fs.Transform) {
    //testNodeClass(new fs.Transform("dummy.txt") , "node_fs_Transform", fs.Transform.prototype);
}
if(fs.StatFs) {
    //testNodeClass(new fs.StatFs("dummy.txt") , "node_fs_StatFs", fs.StatFs.prototype);
}
if(fs.StatWatcher) {
    //testNodeClass(new fs.StatWatcher("dummy.txt") , "node_fs_StatWatcher", fs.StatWatcher.prototype);
}
if(fs.FileHandle) {
    //testNodeClass(new fs.FileHandle("dummy.txt") , "node_fs_FileHandle", fs.FileHandle.prototype);
}



/*
console.log("+------------------------------+")
console.log("| Testing EventEmitter")
console.log("+------------------------------+")
const {EventEmitter } = require('node:events');
testNodeClass(new EventEmitter() , "node_events_EventEmitter", EventEmitter.prototype);
console.log(".");


console.log("+------------------------------+")
console.log("| Testing Domain")
console.log("+------------------------------+")
const {Domain } = require('node:domain');
testNodeClass(new Domain() , "node_Domain", Domain.prototype);
console.log(".");
*/


// stream.Readable
// stream.Writable
// stream.Transform
// fs.ReadStream
// fs.WriteStream
// fs.StatFs
// fs.Stats
// fs.StatWatcher
// fs.FSWatcher
// fs.Dirent
// fs.Dir


// Class:FileHandle


// http.Server
// node.domain
// node.buffer
// node:child_process
// Class: Worker
// node:console
// const { Certificate } = await import('node:crypto');

// Class: Cipher
// Class: Decipher
// Class: DiffieHellman
// Class: DiffieHellmanGroup
// Class: ECDH
// Class: Hash
// Class: Hmac
// Class: KeyObject
// Class: Sign
// Class: Verify
// Class: X509Certificate
// Class: Channel
// const { Resolver } = require('node:dns');


//console.log(require('errors'))


//

// Class: Error
// new Error(message[, options])
// Error.captureStackTrace(targetObject[, constructorOpt])
// Error.stackTraceLimit
// error.cause
// error.code
// error.message
// error.stack
// Class: AssertionError
// Class: RangeError
// Class: ReferenceError
// Class: SyntaxError
// Class: SystemError
// error.address
// error.code

// Class: CustomEvent
// Class: NodeEventTarget

// Class: EventEmitter

// new EventTarget();
//


// const ac = new AbortController();
// Class: AbortSignal

// Class: Blob
// Class: Buffer
// Class: ByteLengthQueuingStrategy
// Class: CompressionStream
// Class: CountQueuingStrategy


// Class: DecompressionStream
// Class FormData
// Class Headers
// Class: ReadableByteStreamController
// Class: ReadableStream
// Class: ReadableStreamBYOBReader
// Class: ReadableStreamBYOBRequest
// Class: ReadableStreamDefaultController
// Class: ReadableStreamDefaultReader
// Class: TextDecoderStream

// Class: TextEncoderStream
// Class: TransformStream
// Class: TransformStreamDefaultController


// WebAssembly
// Class: WritableStream
// Class: WritableStreamDefaultController
// Class: WritableStreamDefaultWriter


/*
const assert = require('assert');
console.log(assert.AssertionError);
*/
//console.log(SystemError)