/*
    ISC License
    Copyright (c) 2022 Mark Albert Willis

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
*/

/* This page is designed with the browser in mind: just one file;
   no exposure to extraneous variables. */

let is, type, dtype;

(function implement_this_file_type_quickly_js()
{
    const typeSymbol = Symbol();
    const toString = Object.prototype.toString;
    let getClassName = function(proto) { return proto.constructor.name; };

    function nativeType(x)
    {
        const s = toString.call(x);
        return s.substring(8, s.length - 1);
    }

    dtype = function(x)
    {
        const t = type(x);
        if(t !== "Object") return t;
        let P = x, n = 0;
        while(P !== null)
        {
            if(P === Object.prototype)
            {
                if(n === 0) return "Object[Prototype]";
                if(n === 1) return "Object";
                return `Object(${n})`;
            }
            else
            {
                const Q = Object.getPrototypeOf(P);
                if((Q === null || P.constructor !== Q.constructor)
                    && typeof(P.constructor) === "function"
                    && P === P.constructor.prototype)
                {
                    const className = getClassName(P);
                    if(n === 0) return `${className}[Prototype]`;
                    if(n === 1) return `${className}[Object]`;
                    return `${className}[Object(${n})]`;
                }
                n++;
                P = Q;
            }
        }
        if(n === 1) return "Null[Object]";
        return `Null[Object(${n})]`;
    }

    function matchAt(string, index, search)
    {
        let b = true;
        const end = Math.min(index + search.length, string.length);
        if (string.length < index + search.length) return false;
        for (let n = index, s = 0; n < end; n++ , s++)
        {
            if (string[n] !== search[s])
            {
                b = false;
                break;
            }
        }
        return b;
    }

    is = (function the_is_object()
    {
        const generatorFunctionProto = Object.getPrototypeOf(function* foo() {});
        // const generatorObjectProto = Object.getPrototypeOf((function* foo() {})()); // no good because it varies.
        const asyncFunctionProto = Object.getPrototypeOf(async function foo(){});
        const mapIteratorProto = Object.getPrototypeOf(new Map()[Symbol.iterator]());
        const setIteratorProto = Object.getPrototypeOf(new Set()[Symbol.iterator]());
        const arrayIteratorProto = Object.getPrototypeOf(new Array()[Symbol.iterator]());
        const stringIteratorProto = Object.getPrototypeOf(new String("")[Symbol.iterator]());
        const typedArrayPrototypes = new WeakSet();
        typedArrayPrototypes.add(Uint8Array.prototype);
        typedArrayPrototypes.add(Int8Array.prototype);
        typedArrayPrototypes.add(Uint16Array.prototype);
        typedArrayPrototypes.add(Int16Array.prototype);
        typedArrayPrototypes.add(Uint32Array.prototype);
        typedArrayPrototypes.add(Int32Array.prototype);
        typedArrayPrototypes.add(Float32Array.prototype);
        typedArrayPrototypes.add(Float64Array.prototype);
        typedArrayPrototypes.add(BigInt64Array.prototype);
        typedArrayPrototypes.add(BigUint64Array.prototype);

        return Object.create(Object.prototype,
        {
            configurable:
            {
                value: function(x, prop)
                {
                    const t = typeof(x);
                    if ((x === null || t !== 'object') && t !== 'function') return false;
                    const pd = Object.getOwnPropertyDescriptor(x, prop);
                    return !!(pd === undefined || pd.configurable );
                }
            },
            writable:
            {
                value:function(x,prop)
                {
                    const t = typeof(x);
                    if ((x === null || t !== 'object') && t !== 'function') return false;
                    const pd = Object.getOwnPropertyDescriptor(x, prop);
                    return !!(pd === undefined || pd.writable);
                }
            },
            enumerable:
            {
                value:function(x,prop)
                {
                    const t = typeof(x);
                    if ((x === null || t !== 'object') && t !== 'function') return false;
                    const pd = Object.getOwnPropertyDescriptor(x, prop);
                    if(pd === undefined) return false;
                    return !!pd.enumerable;
                }
            },
            nodeEnvironment:
            {
                value:function ()
                {
                    return typeof global === 'object'
                        && toString.call(global) === '[object global]';
                }
            },
            browserEnvironment:
            {
                value:function ()
                {
                    return typeof window === "object"
                        && toString.call(window) === '[object Window]';
                }
            },
            domObject:
            {
                value:function (x)
                {
                    if(!this.browserEnvironment()) return false;
                    const nt = toString.call(x).substring(8,12);
                    return  nt === "HTML" && x instanceof HTMLElement;
                }
            },
            boolean:{ value:function(x) { return typeof(x) === 'boolean'; } },
            number: { value:function(x) { return typeof(x) === 'number'; } },
            string: { value:function(x) { return typeof(x) === 'string'; } },
            bigint: { value:function(x) { return typeof(x) === 'bigint'; } },
            symbol: { value:function(x) { return typeof(x) === 'symbol'; } },
            primitive:
            {
                value:function(x)
                {
                    if(x === null) return true;
                    const t = typeof(x);
                    return t !== 'object' && t !== 'function';
                }
            },
            boxedPrimitive:
            {
                value: function(x)
                {
                    const t = type(x);
                    return t === "Boolean" || t === "Number" || t === "String" || t === "boxedSymbol"
                        || t === "boxedBigInt"
                }
            },
            Object:
            {
                value:function(x)
                {
                    if(x === null) return false;
                    const t = typeof(x);
                    return t === 'object' || t === 'function';
                }
            },
            nullObject:
            {
                value:function(x) { return x.__proto__ === undefined; }
            },
            Function:
            {
                value:function (x)
                {
                    if(x === Function.prototype) return false;
                    return typeof(x) === "function";
                }
            },
            arguments:
            {
                value:function (x)
                {
                    return toString.call(x) === "[object Arguments]";
                }
            },
            nativeCode:
            {
                value:function (func)
                {
                    if(typeof func !== "function") return false;
                    const s = func.toString();
                    let n = s.indexOf("{");
                    while(s[++n] !== '}')
                    {
                        if(matchAt(s, n, "[native code]")) return true;
                    }
                    return false;
                }
            },
            ownProperty:
            {
                value:function (x,a) {
                    return this.Object(x) && Object.prototype.hasOwnProperty.call(x, a);
                }
            },
            classPrototype:
            {
                value:function(P)
                {
                    return this.ownProperty(P, "constructor")
                        && typeof(P.constructor) === "function"
                        && P === P.constructor.prototype;
                }
            },
            typedArray:
            {
                value:function(x)
                {
                    return typedArrayPrototypes.has(Object.getPrototypeOf(x));
                }
            },
            errorVariant:
            {
                value:function(x)
                {
                    return toString.call(x) === "[object Error]";
                }
            },
            setIterator:
            {
                value:function(x)
                {
                    if(Object.getPrototypeOf(x) !== setIteratorProto) return false;
                    if(toString.call(x) !== "[object Set Iterator]") return false;
                    return true;
                }
            },
            mapIterator:
            {
                value:function(x)
                {
                    if(Object.getPrototypeOf(x) !== mapIteratorProto) return false;
                    if(toString.call(x) !== "[object Map Iterator]") return false;
                    return true;
                }
            },
            arrayIterator:
            {
                value:function(x)
                {
                    if(Object.getPrototypeOf(x) !== arrayIteratorProto) return false;
                    if(toString.call(x) !== "[object Array Iterator]") return false;
                    return true;
                }
            },
            stringIterator:
            {
                value:function(x)
                {
                    if(Object.getPrototypeOf(x) !== stringIteratorProto) return false;
                    if(toString.call(x) !== "[object String Iterator]") return false;
                    return true;
                }
            },
            generatorFunction:
            {
                value:function(x)
                {
                    if(typeof x !== 'function') return false;
                    if(Object.getPrototypeOf(x) !== generatorFunctionProto) return false;
                    return true;
                }
            },
            asyncFunction:
            {
                value:function(x)
                {
                    if(typeof x !== 'function') return false;
                    if(Object.getPrototypeOf(x) !== asyncFunctionProto) return false;
                    return true;
                }
            },
            generatorObject:
            {
                value:function(x)
                {
                    if (toString.call(x) !== "[object Generator]") return false;
                    return dtype(x) === "Object(4)";
                }
            },
            arrayBufferView: {value:ArrayBuffer.isView },

            boxedSymbol:
            {
                value: function(x)
                {
                    return type(x) === "boxedSymbol";
                }
            },
            boxedBigInt:
            {
                value:function(x)
                {
                    return type(x) === "boxedBigInt";
                }
            }
        });
    })();

    type = (function the_type_object()
    {
        function type(x)
        {
            if (x === null) return "null";
            const tof = typeof(x);
            if (tof !== 'object' && tof !== 'function') return tof;
            const t = x[typeSymbol];
            if(t) return t.call(x);
            const proto = Object.getPrototypeOf(x);
            if(proto === null) return "Object";
            if(x.constructor !== proto.constructor
                && typeof(x.constructor) === "function"
                && x === x.constructor.prototype) return "Object";
            const Klass = proto.constructor;
            if(Klass === undefined) return "Object";
            if(proto === Klass.prototype)
                return Klass.name;
            return "Object";
        }

        function typeExample(x)
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
                || proto === Function.prototype ) return "Object";
            if(x.constructor !== proto.constructor
                && typeof(x.constructor) === "function"
                && x === x.constructor.prototype) return "Object";
            const Klass = proto.constructor;
            if(Klass === undefined) return "Object";
            if(proto === Klass.prototype) return Klass.name;
            return "Object";
        }

        Object.defineProperties(type,
        {
            asInstance:
            {
                value:function(x, className)
                {
                    Object.defineProperty(x, typeSymbol,
                    {
                        value:function()
                        {
                            if(this === x) return className;
                            return "Object";
                        }
                    });
                }
            },
            asClass:
            {
                value:function(Klass)
                {
                    const klassName = Klass.name;

                    Object.defineProperty(Klass.prototype, typeSymbol,
                    {
                        value:function(){return "Object"}
                    });

                    Object.defineProperty(is, klassName,
                    {
                        value:function(x) {return type(x) ===  klassName}
                    });
                }
            },
            thisClass:
            {
                value:function typeThisClass(Klass)
                {
                    const klassName = Klass.name

                    Object.defineProperty(Klass.prototype, typeSymbol,
                    {
                        value:function()
                        {
                            return Object.getPrototypeOf(this) === Klass.prototype? klassName:"Object";
                        },
                    });

                    Object.defineProperty(is, klassName,
                    {
                        value:function(x)
                        {
                            return type(x) === klassName; // Why is this three times as  fast as inlining?
                        }
                    });
                }
            }
        });
        return type;
    })();

    (function type_the_es6_classes()
    {
        // make the built-in classes typable
        type.thisClass(Boolean);
        type.thisClass(Number);
        type.thisClass(String);
        type.thisClass(Date);
        type.thisClass(RegExp);
        type.thisClass(Array);
        type.thisClass(Int8Array);
        type.thisClass(Uint8Array);
        type.thisClass(Uint8ClampedArray);
        type.thisClass(Int16Array);
        type.thisClass(Uint16Array);
        type.thisClass(Int32Array);
        type.thisClass(Uint32Array);
        type.thisClass(Float32Array);
        type.thisClass(Float64Array);
        type.thisClass(BigInt64Array);
        type.thisClass(BigUint64Array);
        type.thisClass(Error);
        type.thisClass(URIError);
        type.thisClass(EvalError);
        type.thisClass(RangeError);
        type.thisClass(ReferenceError);
        type.thisClass(SyntaxError);
        type.thisClass(TypeError);
        type.thisClass(WeakSet);
        type.thisClass(Set);
        type.thisClass(WeakMap);
        type.thisClass(Map);
        type.thisClass(ArrayBuffer);
        type.thisClass(DataView);
        type.thisClass(Promise);

        // Prototyping typeSymbol for BigInt
        // BigInt not defined in older versions of Edge
        if(typeof BigInt === 'function')
        {
            Object.defineProperty(BigInt.prototype, typeSymbol,
            {
                value:function()
                {
                    if(typeof this === 'bigint') return 'bigint';
                    if(Object.getPrototypeOf(this) === BigInt.prototype)
                    {
                        try
                        {
                            BigInt.prototype.valueOf.call(this);
                            return "boxedBigInt";
                        }
                        catch(e) { return "Object"; }
                    }
                    return "Object";
                }
            });
        }

        // Prototyping typeSymbol for Symbol
        if(typeof Symbol === 'function')
        {
            Object.defineProperty(Symbol.prototype, typeSymbol,
            {
                value:function()
                {
                    if(typeof this === 'symbol') return 'symbol';
                    if(Object.getPrototypeOf(this) === Symbol.prototype)
                    {
                        try
                        {
                            Symbol.prototype.valueOf.call(this);
                            return "boxedSymbol";
                        }
                        catch(e) { return "Object"; }
                    }
                    return "Object";
                }
            });
        }

        // Prototyping typeSymbol for Function
        Object.defineProperty(Function.prototype, typeSymbol,
        {
            value:function()
            {
                if(this === Function.prototype) return "Object";
                return typeof(this) === "function" ? "Function":"Object";
            }
        });
    })();

    (function type_the_javascript_extended_classes()
    {
        if(typeof SharedArrayBuffer === 'function') {type.thisClass(SharedArrayBuffer);}
        if(typeof WeakRef === 'function') type.thisClass(WeakRef);
        if(typeof AggregateError === 'function') type.thisClass(AggregateError);
        if(typeof AbortController === 'function') type.thisClass(AbortController);
        if(typeof AbortSignal === 'function') type.thisClass(AbortSignal);
        if(typeof Blob === 'function') type.thisClass(Blob);
        if(typeof Buffer === 'function') type.thisClass(Buffer); //???????????????????????
        if(typeof ByteLengthQueuingStrategy === 'function') type.thisClass(ByteLengthQueuingStrategy);
        if(typeof BroadcastChannel === 'function') type.thisClass(BroadcastChannel);
        if(typeof CompressionStream === 'function') type.thisClass(CompressionStream);
        if(typeof CountQueuingStrategy === 'function') type.thisClass(CountQueuingStrategy);
        if(typeof CryptoKey === 'function') type.thisClass(CryptoKey);
        if(typeof DecompressionStream === 'function') type.thisClass(DecompressionStream);
        if(typeof Event === 'function') type.thisClass(Event);
        if(typeof EventTarget === 'function') type.thisClass(EventTarget);
        if(typeof FormData === 'function') type.thisClass(FormData);
        if(typeof Headers === 'function') type.thisClass(Headers);
        if(typeof MessageChannel === 'function') type.thisClass(MessageChannel);
        if(typeof MessageEvent === 'function') type.thisClass(MessageEvent);
        if(typeof MessagePort === 'function') type.thisClass(MessagePort);
        if(typeof PerformanceEntry === 'function') type.thisClass(PerformanceEntry);
        if(typeof PerformanceMeasure === 'function') type.thisClass(PerformanceMeasure);
        if(typeof PerformanceObserver === 'function') type.thisClass(PerformanceObserver);
        if(typeof PerformanceObserverEntryList === 'function') type.thisClass(PerformanceObserverEntryList);
        if(typeof PerformanceResourceTiming === 'function') type.thisClass(PerformanceResourceTiming);
        if(typeof ReadableByteStreamController === 'function') type.thisClass(ReadableByteStreamController);
        if(typeof ReadableStream === 'function') type.thisClass(ReadableStream);
        if(typeof ReadableStreamBYOBReader === 'function') type.thisClass(ReadableStreamBYOBReader);
        if(typeof ReadableStreamDefaultController === 'function') type.thisClass(ReadableStreamDefaultController);
        if(typeof ReadableStreamDefaultReader === 'function') type.thisClass(ReadableStreamDefaultReader);
        if(typeof TextDecoderStream === 'function') type.thisClass(TextDecoderStream);
        if(typeof TextEncoder === 'function') type.thisClass(TextEncoder);
        if(typeof TextEncoderStream === 'function') type.thisClass(TextEncoderStream);
        if(typeof TransformStream === 'function') type.thisClass(TransformStream);
        if(typeof TransformStreamDefaultController === 'function') type.thisClass(TransformStreamDefaultController);
        if(typeof URL === 'function') type.thisClass(URL);
        if(typeof URLSearchParams === 'function') type.thisClass(URLSearchParams);
        if(typeof WritableStream === 'function') type.thisClass(WritableStream);
        if(typeof WritableStreamDefaultController === 'function') type.thisClass(WritableStreamDefaultController);
        if(typeof WritableStreamDefaultWriter === 'function') type.thisClass(WritableStreamDefaultWriter);
    })();

    (function type_the_node_classes()
    {
        if(!is.nodeEnvironment()) return;

        const protoToClassName = new Map();

        getClassName = function(classPrototype)
        {
            if(protoToClassName.has(classPrototype)) return protoToClassName.get(classPrototype);
            return classPrototype.constructor.name;
        }

        function typeNodeClass(classPrototype, className)
        {
            Object.defineProperty(is, className,
            {
                value:function(x)
                {
                    const t = typeof(x);
                    if ((x === null || t !== 'object') && t !== 'function') return false;
                    return Object.getPrototypeOf(x) === classPrototype;
                }
            });

            if(is.ownProperty(classPrototype, typeSymbol)) return;
            Object.defineProperty(classPrototype, typeSymbol,
            {
                value:function()
                {
                    return Object.getPrototypeOf(this) === classPrototype? className:"Object";
                }
            });

            protoToClassName.set(classPrototype, className);
        }

        function makeTypable(packageName, classNames)
        {
            try
            {
                const packagex = require(packageName);

                for(let i =0; i < classNames.length; i++)
                {
                    const className = classNames[i];
                    if(packagex[className])
                    {
                        typeNodeClass(packagex[className].prototype,`node_${packageName}_${className}`);
                    }
                }
            } catch(e) {}
        }

        const classMap = new Map();
        classMap.set("async_hooks", ["AsyncHook", "AsyncResource", "AsyncLocalStorage"]);
        classMap.set("buffer", ["Buffer", "Blob", "File"]);
        classMap.set("child_process", ["ChildProcess"]);
        classMap.set("diagnostics_channel", ["Channel"]);
        classMap.set("dgram", ["Socket"]);
        classMap.set("events", ["EventEmitter", "EventEmitterAsyncResource",
            "Event","EventTarget", "CustomEvent","NodeEventTarget"]);
        classMap.set("cluster", ["Worker"]);
        classMap.set("console", ["Console"]);
        classMap.set("crypto", ["Certificate", "Cipher", "Decipher", "DiffieHellman",
            "DiffieHellmanGroup", "ECDH", "Hash", "Hmac", "KeyObject", "Sign",
            "Verify", "X509Certificate"]);
        classMap.set("diagnostics_channel", ["Channel"]);
        classMap.set("dns", ["Resolver"]);
        classMap.set("domain", ["Domain"]);
        classMap.set("fs",["ReadStream", "WriteStream", "Dirent",
            "Dir","Stats", "Transform", "StatFs", "StatWatcher", "FileHandle"]);
        classMap.set("http", ["Agent","ClientRequest", "Server",
            "ServerResponse","IncomingMessage", "OutgoingMessage"]);
        classMap.set("http2", ["Http2Session", "ServerHttp2Session", "ClientHttp2Session", "Http2Stream",
            "ClientHttp2Stream",  "ServerHttp2Stream", "Http2Server", "Http2ServerRequest", "Http2ServerResponse"]);
        classMap.set("https", ["Agent", "Server"]);
        classMap.set("inspector", ["Session"]);
        classMap.set("net", ["BlockList","SocketAddress", "Server", "Socket"]);
        classMap.set("perf_hooks", ["PerformanceEntry", "PerformanceMark", "PerformanceNodeEntry",
            "PerformanceNodeTiming", "PerformanceResourceTiming","PerformanceObserver",
            "Histogram", "IntervalHistogram", "RecordableHistogram"]);
        classMap.set("readline", ["InterfaceConstructor", "Interface", ]);
        classMap.set("repl", ["REPLServer"]);
        classMap.set("stream",["Readable", "Writable", "Transform", "Duplex"]);
        classMap.set("string_decoder", ["StringDecoder"]);
        classMap.set("test", ["MockFunctionContext", "MockTracker", "TestsStream", "TestContext", "SuiteContext"]);
        classMap.set("timers",["Immediate", "Timeout"]);
        classMap.set("tls", ["CryptoStream","SecurePair","Server", "TLSSocket"]);
        classMap.set("tty", ["ReadStream","WriteStream"]);
        classMap.set("url", ["URL", "URLSearchParams"]);
        classMap.set("util", ["MIMEType", "MIMEParams", "TextDecoder", "TextEncoder"]);
        classMap.set("v8", ["Serializer", "Deserializer", "DefaultSerializer", "DefaultDeserializer"]);
        classMap.set("vm", ["Script", "Module", "SourceTextModule", "SyntheticModule"]);
        classMap.set("wasi", ["WASI"]);
        classMap.set("worker", ["MessageChannel", "MessagePort", "Worker"]);
        classMap.set("zlib", ["Options", "BrotliOptions", "BrotliCompress", "BrotliDecompress",
            "Deflate", "DeflateRaw", "Gunzip", "Gzip", "Inflate", "InflateRaw", "Unzip", "ZlibBase"]);

        for(const key of classMap.keys())
        {
            makeTypable(key, classMap.get(key));
        }

        /*
            const webcrypto = require("node:crypto").webcrypto;
            if(webcrypto)
            {
                // None of these classes actually exist. webcryto is an empty object.
                const webCryptoClassNames = ["Crypto", "CryptoKey", "CryptoKeyPair", "SubtleCrypto", "AlgorithmIdentifier",
                    "AesCbcParams", "AesCtrParams", "AesGcmParams", "AesGcmParams", "AesKeyGenParams", "EcdhKeyDeriveParams",
                    "EcdsaParams", "EcKeyGenParams", "EcKeyImportParams", "Ed448Params", "HkdfParams", "HmacImportParams",
                    "HmacKeyGenParams", "Pbkdf2Params", "RsaHashedImportParams", "RsaHashedKeyGenParams", "RsaOaepParams",
                    "RsaPssParams"];
                for(const className of webCryptoClassNames)
                {
                    if(webcrypto[className])
                    {
                        typeNodeClass(webcrypto[className].prototype,  `node_webcrypto_${className}`);
                    }
                }
            }
        */
    })();

    (function type_browser_classes()
    {
        if(!is.browserEnvironment()) return;

        Object.defineProperty(Window.prototype, typeSymbol,
        {
            value:function(){ return nativeType(this);}
        });

        Object.defineProperty(HTMLElement.prototype, typeSymbol,
        {
            value:function(){return nativeType(this);}
        });
    })();
})();

if(is.nodeEnvironment())
{
    module.exports.is = is;
    module.exports.type = type;
    module.exports.dtype = dtype;
}
