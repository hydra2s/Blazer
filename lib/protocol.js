import {uuidv4, wrap, _LOG_} from "./utils.js";

//
import {ClassRouter} from "./class-router.js";

//
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
    this.instances = [typeof OffscreenCanvas != "undefined" ? OffscreenCanvas : undefined, Promise].filter((I)=>{ return typeof I != "undefined"; });
    if (typeof HTMLCanvasElement != "undefined") { this.instances.push(HTMLCanvasElement); };
    this.sharedCls = [
      ArrayBuffer, 
      MessagePort, 
      ReadableStream, 
      WritableStream, 
      TransformStream, 
      Uint8Array,
      Uint8ClampedArray,
      Int8Array,
      Uint16Array,
      Int16Array,
      Uint32Array,
      Int32Array,
      Float32Array,
      Float64Array,
      BigInt64Array,
      BigUint64Array,
      Blob,
      //AudioData, 
      //VideoFrame,
    ].concat([
      typeof OffscreenCanvas != "undefined" ? OffscreenCanvas : undefined,
      typeof SharedArrayBuffer != "undefined" ? SharedArrayBuffer : undefined,
      typeof ImageBitmap != "undefined" ? ImageBitmap : undefined,
    ]).filter((I)=>{ return typeof I != "undefined"; });
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
    let data = a?.data;
    if (typeof data != "number" && !data) { return data; };

    if (a.type == "proxy") {
      let $classNameRouter = this.router(a.origin.className);
      let $classNameValue = $classNameRouter.value;
      if ($classNameValue) {
        // identity as own, and make a direct call (native proxy)
        
        data = $classNameValue; if (a.origin.temporary) { $classNameRouter.value = undefined; };
        return data;
      } else {
        // it probably is foreign proxy
        data = this.proxy(data, {className: a.className, methodName: a.methodName, temporary: a.temporary, ...(a.origin||{})}); // set proxy with origin
        return data;
      }
    }
    
    if (a.type == "array" || data instanceof Array) { return data.map(($a)=>this.handleResult($a, shared)); };

    if (a.type == "object") {
      return objectMap(data, ($a,k,i)=>this.handleResult($a, shared));;
    }

    if (a.type == "shared" && shared && typeof data == "number" && data >= 0) {
      return shared[data];
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

  //
  unwrap(a) {
    return {
      $unwrap: true,
      $data: a
    };
  }

  async handleArgument(a, payload={}) { a = await a;
    // CAUTION: avoid using recursive array references!
    
    //
    let data = a;//await this.handleArgument(a, payload);
    let typeOf = typeof a;
    let origin = {};

    //
    if (typeOf != "undefined") {
        // is a shared, except if class instance (should be declared manually)
      const isInstance = this.instances.some((I)=>{ return a instanceof I; });
      const isUnwrap = a?.$unwrap && typeof a?.$unwrap != "function";
      if (!isInstance && this.sharedCls.some((I)=>{ return a instanceof I; })) {
        (payload.shared = payload.shared || []).push(a); a = this.shared(a);
      };

      // TODO: explicit serialization support
      // TODO: support proxy methods in objects
      if (a?.$shared && typeof a.$shared != "function") { 
        typeOf = "shared";
        data = await a.$data;
        data = payload.shared ? payload.shared?.indexOf(data) : data; 
      }

      //
      origin = data?.$origin||origin;

      //
      if (typeOf == "function" || data instanceof Function || (!a?.$shared && typeOf == "object" && isInstance && !isUnwrap) || (data?.$isProxy || data?.$isClass)) {
        typeOf = "proxy"; const _got_ = data; data = uuidv4();
        origin = { className: data, methodName: payload.methodName, temporary: payload.temporary, ...origin };
        this.register(data, _got_, !payload.temporary);
      } else
      if ( isUnwrap ) { data = await a.$data; };

      //
      if (typeOf == "array" || typeOf == "object" && data instanceof Array) { typeOf = "array"; data = await Promise.all((await Promise.all(data)).map(async($a)=>this.handleArgument(await $a, payload))); }
      if (typeOf == "object") { data = await objectMapAsync(data, async($a,k,i)=> await this.handleArgument(await $a, payload)); }
    }

    //
    return {
      className: payload.className, methodName: payload.methodName, temporary: payload.temporary,
      type: typeOf,
      data, origin
    }
  }

  decodeArguments(args, shared) {
    return (args && args != "null" ? (Array.isArray(args) ? args : args) : []).map((a)=>{ return this.handleResult(a, shared); });
  }

  async encodeArguments(args, shared) {
    return await Promise.all(args.map(async (a)=> this.handleArgument(await a, {temporary: true, shared})));
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
    let {type, thisArgRaw, id, temporary, className, methodName, argsRaw, result, error, hasResult} = {
      type: "unknown", temporary: false, thisArgRaw: null, id: "", className: "", methodName: "", argsRaw: [], result: null, error: null, hasResult: false,
      ...json
    };
    type ||= "unknown";

    //
    let args = await Promise.all(argsRaw ? (this.decodeArguments(argsRaw, shared)||[]) : []);
    let thisArg = await (thisArgRaw ? (this.handleResult(thisArgRaw, shared)) : null);
    let hasKey = id in this.calls, callObj = this.calls[id]; delete this.calls[id];
    let classObj = this.router(className, methodName);
    let got = undefined;
    let exception = undefined;
    let fullError = ``;

    // we also return argument lists for handling temporary objects
    if (/*typeof classObj != "undefined"*/classObj || ((type == "result" || type == "error") && callObj) || type == "register") {
      try {
        switch(type) {
          case "result":
            if (hasKey && result) {
              callObj.resolve(this.handleResult(await result, shared));
            }
            hasResult = false;
            break;
          case "error":
            hasResult = false;
            break;
          case "register":
            hasResult = false;
            break;
          case "delete":
            classObj.delete; hasResult = true;
            break;
          case "apply":
            got = await Reflect.apply(classObj.value, thisArg || classObj.objParent, args); if (temporary) { classObj.value = undefined; }; hasResult = true; temporary = true;
            break;
          case "construct":
            got = await this.makeClass(await Reflect.construct(classObj.value, args)); if (temporary) { classObj.value = undefined; }; hasResult = true; temporary = true;
            break;
          case "get":
            got = await classObj.value; if (temporary) { classObj.value = undefined; }; hasResult = true; temporary = true;
            break;
          case "set":
            got = (classObj.value = args[0]); hasResult = true;
            break;
          case "error":
            if (hasKey) {
              fullError = `ERROR!\n
CallId: ${id}\n
Type: ${callObj.type}\n
ClassName: ${callObj.className || className}\n
MethodName: ${callObj.methodName|| methodName}\n
Arguments: ${JSOX.stringify(await Promise.all(callObj.args||[]))}\n
Shared: ${JSOX.stringify(shared||[])}\n
${error}\n
Please, send it to server or user-end developers.
`;
              if (shared) shared.splice(0, shared.length);
              callObj.reject(fullError);
              console.error(fullError);
            }
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
        //console.error(
        error = `
CallId: ${id}\n
Message: ${e.message}\n
Filename: ${e.fileName}\n
LineNumber: ${e.lineNumber}\n
Type: ${type}\n
MethodName: ${e.methodName || methodName}\n
ClassName: ${e.className || className}\n
Arguments: ${JSOX.stringify(await Promise.all(args||[]))}\n
Shared: ${JSOX.stringify(shared||[])}\n
`//);
        if (shared) shared.splice(0, shared.length);
      }
    }

    //
    if (hasResult) {
      if (shared) shared.splice(0, shared.length);
      result = await this.handleArgument(got, {shared, className, methodName, type, temporary});
      //console.log(type, result);
    }

    // on register event
    const watchers = this.watchers["register"];
    if (type == "register" && watchers.length && classObj) {
      watchers.map((cb) => cb(result))
    }

    //
    return {id, type, result, exception, error, hasResult, className, methodName, hasKey, temporary};
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
