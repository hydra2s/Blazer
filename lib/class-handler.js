import {wrap} from "./utils.js";

//
export class ClassHandler {
  constructor(self) {
    this.self = self;
  }
  get (target, name) {
    let self = this.self;
    if (name == "call") { return (thisArg, ...args)=>{
      return wrap((async()=>{
        if (target.last) { await target.last; }; target.last = null; // await last action
        return (await self.apply(target.className, null, args, thisArg));
      })());
    }; } else
    if (name == "apply") { return (thisArg, args)=>{
      return wrap((async()=>{
        if (target.last) { await target.last; }; target.last = null; // await last action
        return (await self.apply(target.className, null, args, thisArg));
      })());
    }; } else
    if (name == "bind") { return (thisArg, ...args)=>{ return ()=>{ return wrap((async()=>{
        if (target.last) { await target.last; }; target.last = null; // await last action
        return (await self.apply(target.className, null, args, thisArg));
      })());
    }}; } else
    if (name == "$last") { return target.last; } else
    if (name == "then") { return target.then && typeof target.then == "function" ? target.then.bind(target) : null; } else
    if (name == "catch") { return target.catch && typeof target.catch == "function" ? target.catch.bind(target) : null; } else
    if (name == "$isProxy") { return true; } else
    if (name == "$origin") { return target.origin; } else
    if (name == "$className") { return target.className; } else
    if (name == "$temporary") { return target.temporary; } else
    if (name == "$shared") { return false; } else
    {
      return wrap((async()=>{
        if (target.last) { await target.last; }; target.last = null;
        return (await self.get(target.className, name));
      })());
    }
  }
  deleteProperty (target, name) {
    let self = this.self;
    {
      return wrap((async()=>{
        if (target.last) { await target?.last; }; target.last = null;
        return await (target.last = self.delete(target.className, name));
      })());
    }
  }
  set (target, name, value) {
    let self = this.self;
    if (name == "$temporary") { return (target.temporary = !!value); } else
    {
      return wrap((async()=>{
        if (target.last) { await target.last; }; target.last = null; // await last action
        return await (target.last = (self.set(target.className, name, value)));
      })());
    }
  }
  construct(target, args, newTarget) {
    let self = this.self;
    return wrap((async()=>{
      console.warn("we returned a promise to class, please wait it");
      if (target.last) { await target.last; }; target.last = null; // await last action
      return (await self.construct(target.className, args));
    })());
  }
  apply(target, thisArg, args) {
    let self = this.self;
    //if (thisArg) {
    //  console.warn("sorry, you can't call method with `this` context");
    //};
    return wrap((async()=>{
      if (target.last) { await target.last; }; target.last = null; // await last action
      return (await self.apply(target.className, null, args));
    })());
  }
}
