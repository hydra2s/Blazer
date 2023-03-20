import {JSOX} from '../node_modules/jsox/lib/jsox.mjs';
import {uuidv4, wrap, _LOG_} from "./utils.js";

//
import {ClassRouter} from "./class-router.js";

const objectMapAsync = async (obj, fn) =>
  Object.fromEntries(
    await Promise.all(Object.entries(obj).map(
      async ([k, v], i) => [k, await fn(v, k, i)]
    )
  ))

const objectMap = async (obj, fn) =>
  Object.fromEntries(
    await Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )

//
export class Protocol {
  constructor(handler = null, cmd = null) {
    this.cmd = cmd;
    this.handler = handler;
    this.objects = {};
    this.calls = {};
    this.instances = [OffscreenCanvas];
    if (typeof HTMLCanvasElement != "undefined") { this.instances.push(HTMLCanvasElement); };
    this.sharedCls = [
      ArrayBuffer, 
      // TODO: make explicit proxy support
      OffscreenCanvas, 
      ImageBitmap, 
      MessagePort, 
      ReadableStream, 
      WritableStream, 
      TransformStream, 
      Uint8Array,
      Uint8ClampedArray,
      Int8Array,
      Uint16Array,
      Int16Array,
      // TODO: support for Float16Array
      Uint32Array,
      Int32Array,
      Float32Array,
      Float64Array,
      BigInt64Array,
      BigUint64Array,
      Blob,
      SharedArrayBuffer,
      //AudioData, 
      //VideoFrame,
    ].filter((I)=>{ return typeof I != "undefined"; });
    this.watchers = {
      register: []
    };
    if (!this.cmd?.getProtocol()) { 
      this.cmd?.setProtocol(this);
    };
  }

  instance(...classes) {
    //classes.map(this.instances.push.bind(this.instances));
    this.instances.push(...classes);
  }

  handle(cmdObj, shared) {
    let id = cmdObj.id ? cmdObj.id : uuidv4();
    let pt = this;
    let calls = this.calls;
    calls[id] = Object.assign(calls[id] = {}, {
      id, cmdObj: Object.assign(cmdObj, {id}), promise: new Promise((resolve, reject) => {
        calls[id].resolve = (...args) => {
          delete calls[id]; resolve(...args);
        };
        calls[id].reject = (...args) => {
          delete calls[id]; reject(...args);
        };
      })
    });
    return calls[id];
  }

  setExecutor(exec) {
    let result = (this.exec = exec);
    if (!exec?.getProtocol()) { exec?.setProtocol(this); };
    return result;
  }

  getExecutor() {
    return this.exec;
  }

  setCommandEncoder(cmd) {
    let result = (this.cmd = cmd);
    if (!cmd?.getProtocol) { cmd?.setProtocol(this); };
    return result;
  }

  getCommandEncoder() {
    return this.cmd;
  }

  setClassHandler(handler) {
    return (this.handler = handler);
  }

  getClassHandler() {
    return this.handler;
  }

  on(name, cb) {
    this.watchers[name].push(cb);
  }

  setObject(name, object) {
    return (this.objects[name] = object);
  }

  getObject(name) {
    return this.objects[name];
  }

  setCall(name, call) {
    return (this.calls[name] = call);
  }

  getCall(name) {
    return this.calls[name];
  }

  handleResult(a, shared) {
    // CAUTION: avoid using recursive array references!
    if (a instanceof Array || typeof a == "array") { return a.map(($a)=>this.handleResult($a, shared)); };

    let data = a.data;
    if (a.type == "proxy") {
      let $classNameValue = this.router(a.$className).value;
      if ($classNameValue) {
        // identity as own, and make a direct call (native proxy)
        data = $classNameValue; if (a.$temporary) { $classNameRouter.value = undefined; };
      } else {
        // it probably is foreign proxy
        data = this.proxy(data, {className: a.$className, $classNameValue, temporary: a.$temporary}); // set proxy with origin
      }
    } else
    
    if (shared && a.$shared && typeof data == "number" && data >= 0) {
      return shared[data];
    }
    if (a.type == "object") {
      data = objectMap(data, ($a,k,i)=>this.handleResult($a, shared));
    }

    return data;
  }

  //
  shared(a) {
    return {
      $shared: true,
      $data: a
    };
  }

  async handleArgument(a, payload={}) { a = await a;
    let className = (a?.$origin) ? a.$origin.className : payload.className;
    let temporary = (a?.$origin) ? a.$origin.temporary : payload.temporary;
    let typeOf = typeof a;

    // CAUTION: avoid using recursive array references!
    if (a instanceof Array || typeof a == "array") { const _got_ = await Promise.all((await Promise.all(a)).map(async($a)=>await this.handleArgument(await $a, payload))); return _got_; };

    // SCAR a shared
    if (this.sharedCls.some((I)=>{ return a instanceof I; })) {
      (payload.shared = payload.shared || []).push(a); a = this.shared(a);
    };
    let data = a;

    if (typeOf == "function" || (a?.$isProxy || a?.$isClass)) {
      this.register(data = uuidv4(), a, !payload.temporary);
      typeOf = "proxy";
    } else
    // TODO: explicit serialization support
    // TODO: support proxy methods in objects
    if (a?.$shared) { data = payload.shared ? payload.shared?.indexOf(a.$data) : a.$data; } else
    if (typeOf == "object" && this.instances.some((I)=>{ return a instanceof I; })) {
      this.register(data = uuidv4(), a, !payload.temporary);
      typeOf = "proxy";
    } else 
    if (typeOf == "object") {
      data = await objectMapAsync(data, async ($a,k,i)=>await this.handleArgument($a, payload));
    }
    
    return {
      //...payload,
      type: typeOf,
      temporary: payload.temporary, // for post-handlers
      $className: className, $temporary: temporary, // for argument handlers
      data, $shared: a?.$shared
    }
  }

  decodeArguments(args, shared) {
    return (args && args != "null" ? (Array.isArray(args) ? args : JSOX.parse(args)) : []).map((a)=>{ return this.handleResult(a, shared); });
  }

  async encodeArguments(args, shared) {
    return JSOX.stringify(await Promise.all(args.map((a)=>this.handleArgument(a, {temporary: true, shared}))));
  }

  makeClass(classNameOrProxy) {
    let router = this.router(classNameOrProxy);
    let classObj = router.value;
    if (typeof classObj == "object") {
      classObj.$isClass = true;
    };
    return classNameOrProxy;
  }

  makeTemporary(classNameOrProxy) {
    let router = this.router(classNameOrProxy);
    let proxy = router.value;
    if (proxy.$isProxy) { proxy.origin.$temporary = true; };
    return classNameOrProxy;
  }

  proxy(className, origin={}) {
    // make promise for proxy
    let obj = function(...args) {
      console.error("For Proxy, isn't it?");
    };
    Object.assign(obj, { origin: {...origin, className: origin.className||className}, className, last: null, temporary: false });
    return (new Proxy(obj, this.handler));
  }

  // we use join(".") and split(".") on names, be carefully
  router(classObjOrClassName, methodNameOrPath = "") {
    return new ClassRouter(this.objects, classObjOrClassName, methodNameOrPath);
  }

  register(className, object) {
    this.objects[className] = object;
    return {type: "register", result: {className}};
  };

  async handleEvent(json, shared) {
    let {type, thisArgRaw, id, className, methodName, argsRaw, result, error, hasResult} = {
      type: "unknown", thisArgRaw: null, id: "", className: "", methodName: "", argsRaw: [], result: null, error: null, hasResult: false,
      ...JSOX.parse(json)
    }
    let args = argsRaw ? this.decodeArguments(argsRaw, shared) : null;
    let thisArg = thisArgRaw ? (this.handleResult(thisArgRaw, shared)) : null;
    let hasKey = id in this.calls, callObj = this.calls[id]; delete this.calls[id];
    let classObj = this.router(className, methodName);
    let got = undefined;
    let temporary = false;
    let exception = undefined;

    // we also return argument lists for handling temporary objects
    
    //if (type) console.log(type, classObj.value);

      try {
        switch(type) {
          case "delete":
            classObj.delete; hasResult = true;
            break;
          case "apply":
            got = await Reflect.apply(classObj.value, thisArg || classObj.objParent, await Promise.all(args)); hasResult = true;
            break;
          case "construct":
            got = await this.makeClass(await Reflect.construct(classObj.value, await Promise.all(args))); hasResult = true;
            break;
          case "get":
            got = await classObj.value; hasResult = true;
            break;
          case "set":
            got = (classObj.value = await args[0]); hasResult = true;
            break;
          case "result":
            if (callObj && result) {
              callObj.resolve(this.handleResult(result, shared));
            }
            hasResult = false;
            break;
          case "error":
            hasResult = false;
            break;
          case "register":
            hasResult = false;
            break;
          default:
            //if (callObj) {
              //callObj.resolve(this.handleResult(null, shared));
            //}
            hasResult = false;
            //return {};
        }
      } catch(e) {
        hasResult = false;
        exception = e;
        error = `
  Message: ${e.message}\n
  Filename: ${e.fileName}\n
  LineNumber: ${e.lineNumber}\n
  MethodName: ${e.methodName}\n
  ClassName: ${e.className}\n
  `;
      }
    
    //
    if (hasResult) {
      result = await this.handleArgument(got, {shared});
      //console.log(type, result);
      type = null;
    }

    // present full debug info
    if (type == "error" && callObj) {
      let fullError = `ERROR!\n
CallId: ${id}\n
Type: ${callObj.type}\n
ClassName: ${callObj.className}\n
MethodName: ${callObj.methodName}\n
Arguments: ${callObj.args}\n
${error}\n
Please, send it to server or user-end developers.
`;
      callObj.reject(fullError);
      console.error(fullError);
      return {};
    }

    // on register event
    if (type == "register") {
      this.watchers["register"].forEach((cb) => {
        cb(result);
      })
    }

    return {id, type, result, exception, error, hasResult, className, methodName, hasKey};
  }



  wrapPromise(callObj) {
    return wrap(callObj.promise);
  }

  close(reason, details) {
    for (let id in this.calls) {
      let callObj = this.calls[id];
      let error = `DISCONNECTED!\n
CallId ${id}\n
Type ${callObj.type}\n
ClassName ${callObj.className}\n
MethodName ${callObj.methodName}\n
Arguments ${callObj.args}\n
Reason ${reason}\n
Details: ${details}\n
Please, notify server developers, or try to reload webpage.
`;
      callObj.reject(error);
      console.error(error);
    }
  }
};
