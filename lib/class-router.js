import {ClassHandler} from "./class-handler.js";

//
export class FunctionHandler {
  constructor(self) {
    this.self = self;
  }
  get (target, name) {
    let self = this.self;
    if (name == "call") { return (_this_, ...args)=>{ return target.apply(_this_ || self, args); } } else
    if (name == "apply") { return (_this_, args)=>{ return target.apply(_this_ || self, args); } } else
    if (name == "bind") { return (_this_, ...args)=>{ return target.bind(_this_ || self, ...args); }; } else
    { return target[name]; }
  }
  set (target, name, value) {
    target[name] = value;
  }
  construct(target, args, newTarget) {
    let self = this.self;
    return new target(...args);
  }
  apply(target, thisArg, args) {
    let self = this.self;
    return target.apply(thisArg || self, args);
  }
}

//
export class ClassRouter {
  constructor(parent, objOrName = "", methodNameOrPath = "") {
    this.parent = parent;
    if (methodNameOrPath && typeof methodNameOrPath == "string") {
      // TODO: corrent path
      this.objOrName = objOrName;
      this.methodNameOrPath = methodNameOrPath;
    } else 
    if (objOrName && typeof objOrName == "string") {
      // set true path
      let splitPath = objOrName.split(".");
      this.objOrName = splitPath.shift();
      this.methodNameOrPath = splitPath.join(".");
    } else {
      // default path
      this.objOrName = objOrName || "";
      this.methodNameOrPath = methodNameOrPath;
    }
  }
  get obj() {
    let _this_ = this.parent || {};
    if (typeof this.objOrName == "string") {
      if (this.objOrName == "$type") { return () => "proxy"; };
      if (this.objOrName == "$unwrap") { return () => ({$type: "unwrap", $data: _this_}); };
      if (this.objOrName == "$serialize") { return () => Object.assign({}, _this_); };
    }
  
    //
    let _got_ = (this.objOrName && typeof this.objOrName == "string") ? Reflect.get(_this_, this.objOrName) : this.objOrName;
    //if (!_this_.$registry && typeof _got_ == "function") { _got_ = new Proxy(_got_, new FunctionHandler(_this_)); };
    if (_got_?.$registry) { /*throw new Error("Registry can't to be got directly!");*/ _got_ = {}; };
    return _got_;
  }
  set obj(a) {
    let obj = this.obj;
    if (typeof obj == "object") { Object.assign(obj, a); } else  
    if (typeof this.objOrName == "string") {
      if (typeof a == "undefined") { Reflect.deleteProperty(this.parent || {}, this.objOrName); } else { Reflect.set(this.parent || {}, this.objOrName, a); };
    } else {
      console.error("class is not assignable, no context");
    }
  }
  get objParent() {
    if (this.methodNameOrPath && typeof this.methodNameOrPath == "string") {
      let splitPath = this.methodNameOrPath.split(".");
      return (new ClassRouter(this.obj, splitPath.shift(), splitPath.join("."))).objParent;
    } else {
      return this.parent;
    }
  }
  get delete() {
    if (this.methodNameOrPath && typeof this.methodNameOrPath == "string") {
      let splitPath = this.methodNameOrPath.split(".");
      (new ClassRouter(this.obj, splitPath.shift(), splitPath.join("."))).delete;
    } else {
      this.obj = undefined;
    }
  }
  get value() {
    if (this.methodNameOrPath && typeof this.methodNameOrPath == "string") {
      let splitPath = this.methodNameOrPath.split(".");
      return (new ClassRouter(this.obj, splitPath.shift(), splitPath.join("."))).value;
    } else {
      return this.obj;
    }
  }
  set value(a) {
    if (this.methodNameOrPath && typeof this.methodNameOrPath == "string") {
      let splitPath = this.methodNameOrPath.split(".");
      (new ClassRouter(this.obj, splitPath.shift(), splitPath.join("."))).value = a;
    } else {
      this.obj = a;
    }
  }
};
