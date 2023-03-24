export class CommandEncoder {
  constructor(pt = null) {
    this.pt = pt;
    if (!this.pt?.getCommandEncoder()) { this.pt?.setCommandEncoder(this); };
  }

  setProtocol(pt) {
    //if (!pt.getExecutor()) { pt.setExecutor(this); };
    let result = (this.pt = pt);
    if (!pt?.getCommandEncoder()) { pt?.setCommandEncoder(this); };
    return result;
  }

  getProtocol() {
    return this.pt;
  }

  setExecutor(exec) {
    let result = (this.exec = exec);
    if (!exec.cmd) { exec?.setCommandEncoder(this); };
    return result;
  }

  getExecutor() {
    return this.exec;
  }

  async set(className, methodName, value) {
    //value = !(typeof methodName == "string" || methodName instanceof String) ? methodName : value;
    //methodName = (typeof methodName == "string" || methodName instanceof String) ? methodName : "";
    let pt = this.pt;
    return { type: "set", result: { className, methodName, argsRaw: await pt.encodeArguments([value]) } };
  }

  delete(className, methodName) {
    methodName = (typeof methodName == "string" || methodName instanceof String) ? methodName : "";
    return { type: "delete", result: { className, methodName } }
  }

  get(className, methodName) {
    methodName = (typeof methodName == "string" || methodName instanceof String) ? methodName : "";
    return { type: "get", result: { className, methodName } }
  }

  async apply(className, methodName, args, thisArg, _shared_) {
    let pt = this.pt;
    args = Array.isArray(methodName) ? methodName : args;
    methodName = (typeof methodName == "string" || methodName instanceof String) ? methodName : "";
    let thisArgRaw = await pt.handleArgument(await pt.makeClass(await thisArg), {shared: _shared_, className, methodName});
    return { type: "apply", result: { className, methodName, thisArgRaw, argsRaw: await pt.encodeArguments(args, _shared_) } };
  }

  async construct(className, args, _shared_) {
    let pt = this.pt;
    return { type: "construct", result: { className, argsRaw: await pt.encodeArguments(args, _shared_) } };
  }
}
