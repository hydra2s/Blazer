import {Executor} from "./executor.js";
import {Protocol} from "./protocol.js";
import {CommandEncoder} from "./com-enc.js";
import {ClassHandler} from "./class-handler.js";
import {JSOX} from '../node_modules/jsox/lib/jsox.mjs';
import {uuidv4} from "./utils.js";

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
    this.connection.send(JSOX.stringify(Object.assign(cmdObj, {id: existId ? existId : uuidv4()})));
  }

  async sendRequest(cmdObj) {
    let callObj = this.pt.handle(cmdObj = await cmdObj);
    let existId = await cmdObj.id;
    
    this.connection.send(JSOX.stringify(Object.assign(cmdObj, {id: existId ? existId : uuidv4()})));
    return await this.pt.wrapPromise(callObj);
  }

  register(name, object, notify = true) {
    (notify ? this.sendAnswer.bind(this) : ()=>{})(this.pt.register(name, object));
  }

  observe() {
    this.connection.on("close", this.pt.close.bind(this.pt));
    this.connection.on("message", async (message, isBinary) => {
      let command = message.data ? message.data : message.toString('utf8');
      let handled = await this.pt.handleEvent(command);
      let {result, exception, error, id, hasResult, hasKey, type} = handled;

      //
      const isError = typeof error != "undefined" && error;
      if (hasKey || (type != "result" && type != "error")) 
      {
        if (isError) console.error(`ERROR!\n${error}`);
        this.sendAnswer({...handled, type: isError ? "error" : "result"});
      }
    });
  }
};

//
class InterWork {
  constructor(thread, observe = false, pt = null) {
    this.thread = thread;
    this.transfer = [ArrayBuffer, OffscreenCanvas, ImageBitmap, MessagePort, ReadableStream, WritableStream, TransformStream].filter((I)=>{ return typeof I != "undefined"; });

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
  proxy(className, origin={}) {
    return this.pt.proxy(className, origin);
  }

  on(name, cb) {
    return this.pt.on(name, cb);
  }

  async sendAnswer(cmdObj, shared) {
    let existId = await (cmdObj = await cmdObj).id;
    let transfer = shared?.map((data)=>{return (data?.buffer instanceof ArrayBuffer ? data.buffer : data); })?.filter((data)=>{
        return this.transfer.some((I)=> { return data instanceof I; });
    });
    this.thread.postMessage({
        command: JSOX.stringify(Object.assign(cmdObj, {id: existId ? existId : uuidv4()})),
        shared: shared || []
    }, transfer);
  }

  async sendRequest(cmdObj, shared) {
    let callObj = this.pt.handle(cmdObj = await cmdObj, shared);
    let existId = await cmdObj.id;
    let transfer = shared?.map((data)=>{return (data?.buffer instanceof ArrayBuffer ? data.buffer : data); })?.filter((data)=>{
        return this.transfer.some((I)=> { return data instanceof I; });
    });
    
    this.thread.postMessage({
        command: JSOX.stringify(Object.assign(cmdObj, {id: existId ? existId : uuidv4()})),
        shared: shared || []
    }, transfer);
    return (await this.pt.wrapPromise(callObj));
  }

  instance(...classess) {
    this.pt.instance(...classess)
  }

  register(name, object, notify = false) {
    (notify ? this.sendAnswer.bind(this) : ()=>{})(this.pt.register(name, object));
  }

  observe() {
    this.thread.addEventListener("close", this.pt.close.bind(this.pt));
    this.thread.addEventListener("message", async (message, isBinary) => {
      let shared = message.data.shared || [];
      let handled = await this.pt.handleEvent(message.data.command, shared);
      let {result, exception, error, id, hasResult, hasKey, type} = handled;

      //
      const isError = typeof error != "undefined" && error;
      if (hasKey || (type != "result" && type != "error")) 
      {
        if (isError) console.error(`ERROR!\n${error}`);
        this.sendAnswer({...handled, type: isError ? "error" : "result"}, shared);
      }
    });
  }
};

//
//export default InterCom;
export { InterCom, InterWork, Protocol, Executor, CommandEncoder };
