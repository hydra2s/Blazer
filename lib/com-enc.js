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

  set(className, methodName, value) {
    //value = !(typeof methodName == "string" || methodName instanceof String) ? methodName : value;
    //methodName = (typeof methodName == "string" || methodName instanceof String) ? methodName : "";
    let pt = this.pt;
    return { type: "set", className, methodName, argsRaw: pt.encodeArguments([value]) };
  }

  delete(className, methodName) {
    methodName = (typeof methodName == "string" || methodName instanceof String) ? methodName : "";
    return { type: "delete", className, methodName }
  }

  get(className, methodName) {
    methodName = (typeof methodName == "string" || methodName instanceof String) ? methodName : "";
    return { type: "get", className, methodName }
  }

  apply(className, methodName, args, thisArg) {
    let pt = this.pt;
    args = Array.isArray(methodName) ? methodName : args;
    methodName = (typeof methodName == "string" || methodName instanceof String) ? methodName : "";
    let thisArgRaw = pt.handleArgument(pt.makeClass(thisArg));
    return { type: "apply", className, methodName, thisArgRaw, argsRaw: pt.encodeArguments(args) };
  }

  construct(className, args) {
    let pt = this.pt;
    return { type: "construct", className, argsRaw: pt.encodeArguments(args) };
  }
}
