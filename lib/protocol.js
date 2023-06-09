import {uuidv4, wrap, _LOG_} from "./utils.js";

//
import {ClassRouter} from "./class-router.js";
import {JSOX} from '../deps/jsox.mjs';

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

const aSet = async(A) => {
  if (A) {
    const P = await Promise.all(A.map(async (v,k)=>[await v,k]));
    for (const [V,I] of P) { A[I] = V; };
  }
  return A;
}

//
class ObjectRegistry {
  constructor() {
  }

  get(M, name) {
    if (name == "$registry") { return true; };
    return M.has(name) ? M.get(name).deref() : undefined;
  }

  set(M, name, obj) {
    if (typeof name != "string") { return false; };
    return M.set(name, new WeakRef(obj));
  }

  delete(M, name) {
    if (typeof name != "string") { return false; };
    if (M.has(name)) {
      //M.get(name).delete();
      return M.delete(name);
    }
    return true;
  }

  get $registry() { return true; }
}

//
export class Protocol {
  constructor(handler = null, cmd = null) {
    this.cmd = cmd;
    this.handler = handler;
    this.objects = new Proxy(new Map(), new ObjectRegistry());
    this.calls = {};
    this.instances = [
      typeof OffscreenCanvas != "undefined" ? OffscreenCanvas : undefined, 
      typeof OffscreenCanvasRenderingContext2D != "undefined" ? OffscreenCanvasRenderingContext2D : undefined, 
    Promise, ObjectRegistry].filter((I)=>{ return typeof I != "undefined"; });
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
    if (a.typeOf == "proxy") {
      let $classNameRouter = this.router(a.origin.id, "");
      let $classNameValue = $classNameRouter.value;
      if ($classNameValue) {
        // identity as own, and make a direct call (native proxy)
        data = $classNameValue; if (a.origin.temporary) { $classNameRouter.value = undefined; };
        return data;
      }
      // it probably is foreign proxy
      return this.proxy(data, {id: a.id, className: a.className, methodName: a.methodName, temporary: a.temporary, ...(a.origin||{})}); // set proxy with origin
    }

    if (a.typeOf == "array" || data instanceof Array) { return data.map(($a)=>this.handleResult($a, shared)); };

    if (a.typeOf == "object") {
      return objectMap(data, ($a,k,i)=>this.handleResult($a, shared));;
    }

    if (a.typeOf == "shared" && shared && typeof data == "number" && data >= 0) {
      return shared[data];
    }

    if (a.typeOf == "remote") { let _eval_ = undefined; eval(`_eval_ = ${data};`); return (...args)=>{ return _eval_ ? _eval_(...args) : undefined; }; };

    return data;
  }

  //
  remote(fn) {
    return new Proxy(fn, {
      get(target, name) {
        if (name == "$type") { return "eval"; };
        if (name == "$data") { return fn; };
        return undefined;
      },
      apply(target, _this_, args) {
        return target.apply(_this_, args);
      }
    });
  }

  //
  shared(a) {
    return {
      $type: "shared",
      $data: a
    };
  }

  //
  unwrap(a) {
    return {
      $type: "unwrap",
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
    if (typeOf != "undefined" && a !== null) {
      // is a shared, except if class instance (should be declared manually)
      const isInstance = this.instances.some((I)=>{ return a instanceof I; });
      const isUnwrap = a?.$type == "unwrap";
      if (!isInstance && this.sharedCls.some((I)=>{ return a instanceof I; })) {
        (payload.shared = payload.shared || []).push(a); a = this.shared(a);
      }

      // TODO: explicit serialization support
      // TODO: support proxy methods in objects
      if (a?.$type == "shared") { 
        typeOf = "shared";
        data = await a.$data;
        data = payload.shared ? payload.shared?.indexOf(data) : data; 
      }

      //
      if (a?.$type == "eval" && typeof a.$data == "function") { 
        typeOf = "remote";
        data = `${await a.$data}`;
      }

      //
      if (typeOf == "function" || data instanceof Function || ((!a?.$type == "shared" || typeOf == "object") && isInstance && !isUnwrap) || (data?.$type == "proxy" || data?.$type == "class")) {
        const _got_ = data;
        if (payload.temporary || this.instances.indexOf(_got_) >= 0 || (_got_?.$type == "proxy" || _got_?.$type == "class")) {
          origin = { id: payload.id = data = uuidv4(), className: data || payload.className, methodName: payload.methodName = "", temporary: payload.temporary, ...(_got_?.$origin||origin) };
          this.register(data, _got_, !payload.temporary);
        } else {
          origin = { id: payload.id = data = payload.className+"."+payload.methodName, className: payload.className, methodName: payload.methodName, temporary: (payload.temporary = false), ...(_got_?.$origin||origin) };
        }
        typeOf = "proxy";
      } else
      if ( isUnwrap ) { data = await a.$data; };

      //
      if (typeOf == "array" || typeOf == "object" && data instanceof Array) { typeOf = "array"; data = await Promise.all((await Promise.all(data)).map(async($a)=>this.handleArgument(await $a, payload))); }
      if (typeOf == "object") { data = await objectMapAsync(data, async($a,k,i)=> await this.handleArgument(await $a, payload)); }
    } else {
      typeOf = "undefined";
    }

    //
    return {
      id: payload.id, className: payload.className, methodName: payload.methodName, temporary: payload.temporary,
      typeOf, data, origin
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
      classObj.$type = "class";
    };
    return classNameOrProxy;
  }

  makeTemporary(classNameOrProxy) {
    let router = this.router(classNameOrProxy);
    let proxy = router.value;
    if (proxy.$type == "proxy") { proxy.origin.$temporary = true; };
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
  }

  async handleEvent({id, type, result, shared}) {
    let {thisArgRaw, temporary, className, methodName, argsRaw, error} = {
      temporary: false, thisArgRaw: null, className: "", methodName: "", argsRaw: [], error: null,
      ...result
    };
    type ||= "unknown";

    //
    const classObj = this.router(className, methodName);
    const isRetrive = type && type != "unknown" && (type == "result" || type == "error" || type == "register");
    const isOperate = type && type != "unknown" && !isRetrive;
    const hasKey = id in this.calls;
    let hasResult = false;
    let got = {};

    // we also return argument lists for handling temporary objects
    if ((isRetrive && hasKey) || (isOperate && classObj)) {
      const callObj = this.calls[id]; delete this.calls[id];
      const args = async () => (await Promise.all(this.decodeArguments((await Promise.all(argsRaw||callObj?.args||[]))||[], await aSet(shared))||[]));
      let exception = undefined;

      //
      try {
        switch(type) {
          case "error":
            if (hasKey && typeof error != "undefined" && error) {
              const fullError = `ERROR!\n
CallId: ${id}\n
Type: ${callObj.type}\n
ClassName: ${callObj.className || className}\n
MethodName: ${callObj.methodName|| methodName}\n
Arguments: ${JSOX.stringify((await args())||[])}\n
Shared: ${JSOX.stringify((await aSet(shared))||[])}\n
${error}\n
Please, send it to server or user-end developers.
`;
              callObj.reject(fullError);
              console.error(fullError);
              if (shared) shared.splice(0, shared.length);
            }
            break;
          case "result":
            if (hasKey && typeof result != "undefined") {
              callObj.resolve(this.handleResult(await result, await aSet(shared)));
              if (shared) shared.splice(0, shared.length);
            }
            break;
          case "register":
            break;
          case "delete":
            classObj.delete; hasResult = true;
            if (shared) shared.splice(0, shared.length);
            break;
          case "apply":
            got = await Reflect.apply(await classObj.value, (await this.handleResult(await thisArgRaw, await aSet(shared))) || (await classObj.objParent), await args()); if (temporary) { classObj.value = undefined; }; hasResult = true; temporary = true;
            if (shared) shared.splice(0, shared.length);
            break;
          case "construct":
            got = await this.makeClass(await Reflect.construct(await classObj.value, await args())); if (temporary) { classObj.value = undefined; }; hasResult = true; temporary = true;
            if (shared) shared.splice(0, shared.length);
            break;
          case "get":
            got = await classObj.value; if (temporary) { classObj.value = undefined; }; hasResult = true; temporary = !(await classObj.objParent);
            if (shared) shared.splice(0, shared.length);
            break;
          case "set":
            got = (classObj.value = (await args())[0]); hasResult = true;
            if (shared) shared.splice(0, shared.length);
            break;
          default:
        }
        if (got?.$registry) { got = {}; hasResult = true; };
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
Arguments: ${JSOX.stringify(await args())}\n
Shared: ${JSOX.stringify(await aSet(shared))}\n
`//);
        if (shared) shared.splice(0, shared.length);
      }

      //
      if (hasResult) { result = await this.handleArgument(got, {...result, temporary, shared: await aSet(shared)}); }
    }

    // on register event
    const watchers = this.watchers["register"];
    if (type == "register" && watchers.length && classObj) {
      watchers.map((cb) => cb(result))
    }

    //
    return {...(result||{}), error, hasResult, hasKey, isOperate, temporary};
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
