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
    let existId = await cmdObj.id;
    this.connection.send(JSOX.stringify(Object.assign(cmdObj, {id: existId ? existId : uuidv4()})));
  }

  async sendRequest(cmdObj) {
    let callObj = this.pt.handle(cmdObj);
    let existId = await cmdObj.id;
    this.connection.send(JSOX.stringify(Object.assign(cmdObj, {id: existId ? existId : uuidv4()})));
    return (await this.pt.wrapPromise(callObj));
  }

  register(name, object, notify = true) {
    (notify ? this.sendAnswer.bind(this) : ()=>{})(this.pt.register(name, object));
  }

  observe() {
    this.connection.on("message", async (message, isBinary) => {
      let json = message.data ? message.data : message.toString('utf8');
      let handled = await this.pt.handleEvent(json);
      let {result, exception, error, hasResult} = handled;

      // send result
      if (hasResult) {
        this.sendAnswer({type: "result", ...handled});
      }

      //
      if (typeof error != "undefined" && error) {
        //throw exception;
        console.error(`ERROR!\n${error}`);
        this.sendAnswer({type: "error", ...handled });
      }
    });

    this.connection.on("close", this.pt.close.bind(this.pt));
  }
};

//
class WorkCom {
  constructor(thread, observe = false, pt = null) {
    this.thread = thread;

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
    return {
      $shared: true,
      $data: a
    };
  }

  //
  proxy(className, origin={}) {
    return this.pt.proxy(className, origin);
  }

  on(name, cb) {
    return this.pt.on(name, cb);
  }

  async sendAnswer(cmdObj, shared) {
    let existId = await cmdObj.id;
    let transfer = shared?.map((data)=>{return (data?.buffer instanceof ArrayBuffer ? data.buffer : data); })?.filter((data)=>{
        return data instanceof ArrayBuffer || 
            data instanceof OffscreenCanvas ||
            data instanceof ImageBitmap || 
            data instanceof MessagePort || 
            data instanceof ReadableStream || 
            data instanceof WritableStream || 
            data instanceof TransformStream || 
            data instanceof AudioData || 
            data instanceof VideoFrame /*|| 
            data instanceof RTCDataChannel*/;
    });
    this.thread.postMessage({
        command: JSOX.stringify(Object.assign(cmdObj, {id: existId ? existId : uuidv4()})),
        shared
    }, transfer);
  }

  async sendRequest(cmdObj, shared) {
    let callObj = this.pt.handle(cmdObj, shared);
    let existId = await cmdObj.id;
    let transfer = shared?.map((data)=>{return (data?.buffer instanceof ArrayBuffer ? data.buffer : data); })?.filter((data)=>{
        return data instanceof ArrayBuffer || 
            data instanceof OffscreenCanvas ||
            data instanceof ImageBitmap || 
            data instanceof MessagePort || 
            data instanceof ReadableStream || 
            data instanceof WritableStream || 
            data instanceof TransformStream || 
            data instanceof AudioData || 
            data instanceof VideoFrame /*|| 
            data instanceof RTCDataChannel*/;
    });
    this.thread.postMessage({
        command: JSOX.stringify(Object.assign(cmdObj, {id: existId ? existId : uuidv4()})),
        shared
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
    this.thread.addEventListener("message", async (message, isBinary) => {
      let handled = await this.pt.handleEvent(message.data.command, message.data.shared);
      let {result, exception, error, hasResult} = handled;

      // send result
      if (hasResult) {
        this.sendAnswer({type: "result", ...handled}, message.data.shared);
      }

      //
      if (typeof error != "undefined" && error) {
        //throw exception;
        console.error(`ERROR!\n${error}`);
        this.sendAnswer({type: "error", ...handled }, message.data.shared);
      }
    });

    this.thread.addEventListener("close", this.pt.close.bind(this.pt));
  }
};

//
//export default InterCom;
export { InterCom, WorkCom, Protocol, Executor, CommandEncoder };
