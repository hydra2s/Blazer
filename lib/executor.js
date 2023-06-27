import {wrap} from "./utils.js";

//
export class Executor {
  constructor(wsc = null, cmd = null) {
    this.wsc = wsc;
    this.cmd = cmd;
    this.wsc?.setExecutor(this);
    this.cmd?.setExecutor(this);
  }

  setCommandEncoder(cmd) {
    if (!cmd?.getExecutor()) { cmd?.setExecutor(this); };
    return (this.cmd = cmd);
  };

  getCommandEncoder() {
    return this.cmd;
  };

  set(className, methodName, value) {
    let wsc = this.wsc;
    let cmd = this.cmd;
    return wrap(wsc.sendRequest(cmd.set(className, methodName, value)));
  }

  delete(className, methodName) {
    let wsc = this.wsc;
    let cmd = this.cmd;
    return wrap(wsc.sendRequest(cmd.delete(className, methodName)));
  }

  get(className, methodName) {
    let wsc = this.wsc;
    let cmd = this.cmd;
    return wrap(wsc.sendRequest(cmd.get(className, methodName)));
  }

  apply(className, methodName, args, thisArg) {
    let wsc = this.wsc;
    let cmd = this.cmd;
    let shared = args.filter((pre)=>pre?.$type == "shared").map((pre)=>pre.$data);
    return wrap(wsc.sendRequest(cmd.apply(className, methodName, args, thisArg, shared), shared));
  }

  construct(className, args) {
    let wsc = this.wsc;
    let cmd = this.cmd;
    let shared = args.filter((pre)=>pre?.$type == "shared").map((pre)=>pre.$data);
    return wrap(wsc.sendRequest(cmd.construct(className, args, shared), shared));
  }

  getShared() {
    
  }
}
