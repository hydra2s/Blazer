import {JSOX} from '../node_modules/jsox/lib/jsox.mjs';
import {uuidv4, wrap} from "./utils.js";

//
import {ClassRouter} from "./class-router.js";

//
export class Protocol {
  constructor(handler = null, cmd = null) {
    this.cmd = cmd;
    this.handler = handler;
    this.objects = {};
    this.calls = {};
    this.watchers = {
      register: []
    };
    if (!this.cmd?.getProtocol()) { 
      this.cmd?.setProtocol(this);
    };
  }

  handle(cmdObj) {
    let id = cmdObj.id ? cmdObj.id : uuidv4();
    let pt = this;
    let calls = this.calls;
    calls[id] = {};
    calls[id] = Object.assign(calls[id], {
      id, cmdObj: Object.assign(cmdObj, {id}), promise: new Promise((resolve, reject) => {
        calls[id].resolve = (...args) => {
          resolve(...args);
          delete calls[id];
        };
        calls[id].reject = (...args) => {
          reject(...args);
          delete calls[id];
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

  handleResult(a) {
    let data = a.data;
    if (a.type == "proxy") {
      let $classNameValue = this.router(a.$className).value;
      if ($classNameValue) {
        // identity as own, and make a direct call (native proxy)
        data = $classNameValue; if (a.$temporary) { $classNameRouter.value = undefined; };
      } else {
        // it probably is foreign proxy
        data = this.proxy(data, {className: a.$className, temporary: a.$temporary}); // set proxy with origin
      }
    }
    return data;
  }

  handleArgument(a, payload={}) {
    let className = (a?.$origin) ? a.$origin.className : payload.className;
    let temporary = (a?.$origin) ? a.$origin.temporary : payload.temporary;
    let typeOf = typeof a;
    let data = a;
    if (typeOf == "function" || (a?.$isProxy || a?.$isClass)) {
      this.register(data = uuidv4(), a, !payload.temporary);
      typeOf = "proxy";
    };
    if (typeOf == "object") {};
    return {
      ...payload,
      type: typeOf,
      temporary: payload.temporary, // for post-handlers
      $className: className, $temporary: temporary, // for argument handlers
      data
    }
  }

  decodeArguments(args) {
    return (args && args != "null" ? (Array.isArray(args) ? args : JSOX.parse(args)) : []).map((a)=>{ return this.handleResult(a); });
  }

  encodeArguments(args) {
    return JSOX.stringify(args.map((a)=>{ return this.handleArgument(a, {temporary: true}); }));
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

  register(className, object, notify = true) {
    this.objects[className] = object;
    return {type: "register", result: {className}};
  };

  async handleEvent(json) {
    let {type, thisArgRaw, id, className, methodName, argsRaw, result, error, hasResult} = JSOX.parse(json);
    let args = argsRaw ? this.decodeArguments(argsRaw) : null;
    let thisArg = thisArgRaw ? (this.handleResult(thisArgRaw)) : null;
    let callObj = this.calls[id];
    let classObj = this.router(className, methodName);
    let got = undefined;
    let temporary = false;
    let exception = undefined;

    // we also return argument lists for handling temporary objects
    try {
      switch(type) {
        case "delete":
          classObj.delete; hasResult = true;
          break;
        case "apply":
          got = await Reflect.apply(classObj.value, thisArg || classObj.objParent, args); hasResult = true;
          break;
        case "construct":
          got = this.makeClass(await Reflect.construct(classObj.value, args)); hasResult = true;
          break;
        case "get":
          got = await classObj.value; hasResult = true;
          break;
        case "set":
          got = (classObj.value = args[0]); hasResult = true;
          break;
        case "result":
          if (hasResult) {
            callObj.resolve(this.handleResult(result));
          } else {
            callObj.reject(result);
          }
          hasResult = false;
          break;
        default:
          hasResult = false;
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

    if (hasResult) {
      result = this.handleArgument(got);
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
    }

    // on register event
    if (type == "register") {
      this.watchers["register"].forEach((cb) => {
        cb(result);
      })
    }

    return {id, result, exception, error, hasResult, className, methodName};
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