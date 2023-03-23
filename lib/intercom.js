import {Executor} from "./executor.js";
import {Protocol} from "./protocol.js";
import {CommandEncoder} from "./com-enc.js";
import {ClassHandler} from "./class-handler.js";
import {JSOX} from '../node_modules/jsox/lib/jsox.mjs';
import {uuidv4, _LOG_} from "./utils.js";

//
class InterCom {
  constructor(connection, observe = false, pt = null) {
    this.connection = connection;

    // initialize
    if (!pt) {
      let cmd = new CommandEncoder();

      // need protocol for command encoding and execution
      this.pt = new Protocol(new ClassHandler(new Executor(this, cmd)), cmd);
    } else { this.pt = pt; };

    if (observe) { this.observe(); };
  }

  //
  setProtocol(pt) {return (this.pt = pt); };
  setExecutor(exec) {return (this.exec = exec); };

  //
  getProtocol() { return this.pt; };
  getExecutor() { return this.exec; };

  //
  proxy(className, origin={}) {
    return this.pt.proxy(className, origin);
  }

  on(name, cb) {
    return this.pt.on(name, cb);
  }

  async sendAnswer(cmdObj) {
    let existId = await (cmdObj = await cmdObj).id;
    this.connection.send(JSON.stringify(Object.assign(cmdObj, {id: existId ? existId : uuidv4()})));
  }

  async sendRequest(cmdObj) {
    let callObj = await this.pt.handle(cmdObj = await cmdObj);
    let existId = await cmdObj.id;
    
    //
    this.connection.send(JSON.stringify(Object.assign(cmdObj, {id: existId ? existId : uuidv4()})));
    return this.pt.wrapPromise(callObj);
  }

  register(name, object, notify = true) {
    (notify ? this.sendAnswer.bind(this) : ()=>{})(this.pt.register(name, object));
  }

  preHandle(cmdObj) {
    if (cmdObj.result && typeof cmdObj.result == "string") { cmdObj.result = JSOX.parse(decodeURIComponent(escape(atob(cmdObj.result)))); };
    return cmdObj;
  }

  observe() {
    this.connection.on("close", this.pt.close.bind(this.pt));
    this.connection.on("message", async (message, isBinary) => {
      let command = message.data ? message.data : message.toString('utf8');
      let handled = await this.pt.handleEvent(this.preHandle(JSON.parse(command)));
      let {result, exception, error, id, hasResult, hasKey, type} = handled;

      //
      if (type && type != "result" && type != "error" && type != "unknown") 
      {
        const isError = typeof error != "undefined" && error;
        if (isError) console.error(`ERROR!\n${error}`);
        await this.sendAnswer({...handled, type: isError ? "error" : "result",
          result: result ? btoa(unescape(encodeURIComponent(JSOX.stringify(result)))) : ""
        });
      }
    });
  }
};

//
class InterWork {
  constructor(thread, observe = false, pt = null) {
    this.thread = thread;
    this.transfer = [
      ArrayBuffer, 
      MessagePort, 
      ReadableStream, 
      WritableStream, 
      TransformStream
    ].concat([
      typeof OffscreenCanvas != "undefined" ? OffscreenCanvas : undefined,
      typeof ImageBitmap != "undefined" ? ImageBitmap : undefined,
    ]).filter((I)=>{ return typeof I != "undefined"; });

    // initialize
    if (!pt) {
      let cmd = new CommandEncoder();

      // need protocol for command encoding and execution
      this.pt = new Protocol(new ClassHandler(new Executor(this, cmd)), cmd);
    } else { this.pt = pt; };

    if (observe) { this.observe(); };
  }

  //
  setProtocol(pt) {return (this.pt = pt); };
  setExecutor(exec) {return (this.exec = exec); };

  //
  getProtocol() { return this.pt; };
  getExecutor() { return this.exec; };

  //
  shared(a) {
    return this.pt.shared(a);
  }

  //
  unwrap(a) {
    return this.pt.unwrap(a);
  }

  //
  proxy(className, origin={}) {
    return this.pt.proxy(className, origin);
  }

  on(name, cb) {
    return this.pt.on(name, cb);
  }

  async sendAnswer(cmdObj, shared) {
    let existId = await (cmdObj = await cmdObj).id;

    this.thread.postMessage({
        command: Object.assign(cmdObj, {id: existId ? existId : uuidv4()}),
        shared: await Promise.all(shared || [])
    }, (await Promise.all(shared?.map(async (data)=>{ data = await data; const _buffer_ = await data?.buffer; return ( _buffer_ instanceof ArrayBuffer ? _buffer_ : data); })||[])).filter((data)=>{
      return this.transfer.some((I)=> { return data instanceof I; });
    }));
  }

  async sendRequest(cmdObj, shared) {
    let callObj = await this.pt.handle(cmdObj = await cmdObj, shared);
    let existId = await cmdObj.id;
    
    this.thread.postMessage({
        command: Object.assign(cmdObj, {id: existId ? existId : uuidv4()}),
        shared: await Promise.all(shared || [])
    }, (await Promise.all(shared?.map(async (data)=>{ data = await data; const _buffer_ = await data?.buffer; return ( _buffer_ instanceof ArrayBuffer ? _buffer_ : data); })||[])).filter((data)=>{
      return this.transfer.some((I)=> { return data instanceof I; });
    }));
    return (await this.pt.wrapPromise(callObj));
  }

  instance(...classess) {
    this.pt.instance(...classess)
  }

  register(name, object, notify = false) {
    (notify ? this.sendAnswer.bind(this) : ()=>{})(this.pt.register(name, object));
  }

  preHandle(cmdObj) {
    if (cmdObj.result && typeof cmdObj.result == "string") { cmdObj.result = JSOX.parse(decodeURIComponent(escape(atob(cmdObj.result)))); };
    return cmdObj;
  }

  observe() {
    this.thread.addEventListener("close", this.pt.close.bind(this.pt));
    this.thread.addEventListener("message", async (message, isBinary) => {
      let shared = message.data.shared || [];
      let handled = await this.pt.handleEvent(this.preHandle(message.data.command), shared);
      let {result, exception, error, id, hasResult, hasKey, type} = handled;
      
      //
      if (type && type != "result" && type != "error" && type != "unknown") 
      {
        const isError = typeof error != "undefined" && error;
        if (isError) console.error(`ERROR!\n${error}`);
        this.sendAnswer({...handled, type: isError ? "error" : "result",
          result: result ? btoa(unescape(encodeURIComponent(JSOX.stringify(result)))) : ""
        }, shared);
      }
    });
  }
};

//
//export default InterCom;
export { InterCom, InterWork, Protocol, Executor, CommandEncoder };
