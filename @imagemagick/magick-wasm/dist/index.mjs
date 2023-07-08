var kr = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.Activate = 1] = "Activate", r[r.Associate = 2] = "Associate", r[r.Background = 3] = "Background", r[r.Copy = 4] = "Copy", r[r.Deactivate = 5] = "Deactivate", r[r.Discrete = 6] = "Discrete", r[r.Disassociate = 7] = "Disassociate", r[r.Extract = 8] = "Extract", r[r.Off = 9] = "Off", r[r.On = 10] = "On", r[r.Opaque = 11] = "Opaque", r[r.Remove = 12] = "Remove", r[r.Set = 13] = "Set", r[r.Shape = 14] = "Shape", r[r.Transparent = 15] = "Transparent", r))(kr || {}), Zs = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.Kapur = 1] = "Kapur", r[r.OTSU = 2] = "OTSU", r[r.Triangle = 3] = "Triangle", r))(Zs || {});
function Os(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var vr = { exports: {} };
(function(r, i) {
  var u = (() => {
    var f = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0;
    return typeof __filename < "u" && (f = f || __filename), function(p = {}) {
      var e = typeof p < "u" ? p : {}, w, S;
      e.ready = new Promise(function(t, n) {
        w = t, S = n;
      });
      var E = Object.assign({}, e), B = "./this.program", Q = (t, n) => {
        throw n;
      }, ue = typeof window == "object", ge = typeof importScripts == "function", le = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string", re = "";
      function Cr(t) {
        return e.locateFile ? e.locateFile(t, re) : re + t;
      }
      var Ke, Qe, ft;
      if (le) {
        var jt = require("fs"), Yt = require("path");
        ge ? re = Yt.dirname(re) + "/" : re = __dirname + "/", Ke = (t, n) => (t = kt(t) ? new URL(t) : Yt.normalize(t), jt.readFileSync(t, n ? void 0 : "utf8")), ft = (t) => {
          var n = Ke(t, !0);
          return n.buffer || (n = new Uint8Array(n)), n;
        }, Qe = (t, n, a) => {
          t = kt(t) ? new URL(t) : Yt.normalize(t), jt.readFile(t, function(s, o) {
            s ? a(s) : n(o.buffer);
          });
        }, !e.thisProgram && process.argv.length > 1 && (B = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2), Q = (t, n) => {
          throw process.exitCode = t, n;
        }, e.inspect = function() {
          return "[Emscripten Module object]";
        };
      } else
        (ue || ge) && (ge ? re = self.location.href : typeof document < "u" && document.currentScript && (re = document.currentScript.src), f && (re = f), re.indexOf("blob:") !== 0 ? re = re.substr(0, re.replace(/[?#].*/, "").lastIndexOf("/") + 1) : re = "", Ke = (t) => {
          var n = new XMLHttpRequest();
          return n.open("GET", t, !1), n.send(null), n.responseText;
        }, ge && (ft = (t) => {
          var n = new XMLHttpRequest();
          return n.open("GET", t, !1), n.responseType = "arraybuffer", n.send(null), new Uint8Array(n.response);
        }), Qe = (t, n, a) => {
          var s = new XMLHttpRequest();
          s.open("GET", t, !0), s.responseType = "arraybuffer", s.onload = () => {
            if (s.status == 200 || s.status == 0 && s.response) {
              n(s.response);
              return;
            }
            a();
          }, s.onerror = a, s.send(null);
        });
      var $t = e.print || console.log.bind(console), Pe = e.printErr || console.warn.bind(console);
      Object.assign(e, E), E = null, e.arguments && e.arguments, e.thisProgram && (B = e.thisProgram), e.quit && (Q = e.quit);
      var Je;
      e.wasmBinary && (Je = e.wasmBinary);
      var Pr = e.noExitRuntime || !0;
      typeof WebAssembly != "object" && ye("no native wasm support detected");
      var mt, pt = !1, Ze;
      function dt(t, n) {
        t || ye(n);
      }
      var V, ee, te, He, k, T, ht, yt;
      function pn() {
        var t = mt.buffer;
        e.HEAP8 = V = new Int8Array(t), e.HEAP16 = te = new Int16Array(t), e.HEAP32 = k = new Int32Array(t), e.HEAPU8 = ee = new Uint8Array(t), e.HEAPU16 = He = new Uint16Array(t), e.HEAPU32 = T = new Uint32Array(t), e.HEAPF32 = ht = new Float32Array(t), e.HEAPF64 = yt = new Float64Array(t);
      }
      var dn, hn = [], yn = [], wn = [], br = 0;
      function kn() {
        return Pr || br > 0;
      }
      function Gr() {
        if (e.preRun)
          for (typeof e.preRun == "function" && (e.preRun = [e.preRun]); e.preRun.length; )
            Ar(e.preRun.shift());
        Xt(hn);
      }
      function Er() {
        !e.noFSInit && !_.init.initialized && _.init(), _.ignorePermissions = !1, J.root = _.mount(J, {}, null), Xt(yn);
      }
      function Rr() {
        if (e.postRun)
          for (typeof e.postRun == "function" && (e.postRun = [e.postRun]); e.postRun.length; )
            Lr(e.postRun.shift());
        Xt(wn);
      }
      function Ar(t) {
        hn.unshift(t);
      }
      function Tr(t) {
        yn.unshift(t);
      }
      function Lr(t) {
        wn.unshift(t);
      }
      var Te = 0, Oe = null;
      function Gu(t) {
        return t;
      }
      function wt(t) {
        Te++, e.monitorRunDependencies && e.monitorRunDependencies(Te);
      }
      function et(t) {
        if (Te--, e.monitorRunDependencies && e.monitorRunDependencies(Te), Te == 0 && Oe) {
          var n = Oe;
          Oe = null, n();
        }
      }
      function ye(t) {
        e.onAbort && e.onAbort(t), t = "Aborted(" + t + ")", Pe(t), pt = !0, Ze = 1, t += ". Build with -sASSERTIONS for more info.";
        var n = new WebAssembly.RuntimeError(t);
        throw S(n), n;
      }
      var Wr = "data:application/octet-stream;base64,";
      function vn(t) {
        return t.startsWith(Wr);
      }
      function kt(t) {
        return t.startsWith("file://");
      }
      var Fe;
      Fe = "magick.wasm", vn(Fe) || (Fe = Cr(Fe));
      function Sn(t) {
        try {
          if (t == Fe && Je)
            return new Uint8Array(Je);
          if (ft)
            return ft(t);
          throw "both async and sync fetching of the wasm failed";
        } catch (n) {
          ye(n);
        }
      }
      function Br(t) {
        if (!Je && (ue || ge)) {
          if (typeof fetch == "function" && !kt(t))
            return fetch(t, { credentials: "same-origin" }).then(function(n) {
              if (!n.ok)
                throw "failed to load wasm binary file at '" + t + "'";
              return n.arrayBuffer();
            }).catch(function() {
              return Sn(t);
            });
          if (Qe)
            return new Promise(function(n, a) {
              Qe(t, function(s) {
                n(new Uint8Array(s));
              }, a);
            });
        }
        return Promise.resolve().then(function() {
          return Sn(t);
        });
      }
      function In(t, n, a) {
        return Br(t).then(function(s) {
          return WebAssembly.instantiate(s, n);
        }).then(function(s) {
          return s;
        }).then(a, function(s) {
          Pe("failed to asynchronously prepare wasm: " + s), ye(s);
        });
      }
      function xr(t, n, a, s) {
        return !t && typeof WebAssembly.instantiateStreaming == "function" && !vn(n) && !kt(n) && !le && typeof fetch == "function" ? fetch(n, { credentials: "same-origin" }).then(function(o) {
          var l = WebAssembly.instantiateStreaming(o, a);
          return l.then(s, function(c) {
            return Pe("wasm streaming compile failed: " + c), Pe("falling back to ArrayBuffer instantiation"), In(n, a, s);
          });
        }) : In(n, a, s);
      }
      function Nr() {
        var t = { a: Ss };
        function n(s, o) {
          var l = s.exports;
          return e.asm = l, mt = e.asm.fb, pn(), dn = e.asm.zb, Tr(e.asm.gb), et(), l;
        }
        wt();
        function a(s) {
          n(s.instance);
        }
        if (e.instantiateWasm)
          try {
            return e.instantiateWasm(t, n);
          } catch (s) {
            Pe("Module.instantiateWasm callback failed with error: " + s), S(s);
          }
        return xr(Je, Fe, t, a).catch(S), {};
      }
      var G, x;
      function Mn(t) {
        this.name = "ExitStatus", this.message = "Program terminated with exit(" + t + ")", this.status = t;
      }
      function Xt(t) {
        for (; t.length > 0; )
          t.shift()(e);
      }
      function zr(t, n = "i8") {
        switch (n.endsWith("*") && (n = "*"), n) {
          case "i1":
            return V[t >> 0];
          case "i8":
            return V[t >> 0];
          case "i16":
            return te[t >> 1];
          case "i32":
            return k[t >> 2];
          case "i64":
            return k[t >> 2];
          case "float":
            return ht[t >> 2];
          case "double":
            return yt[t >> 3];
          case "*":
            return T[t >> 2];
          default:
            ye("invalid type for getValue: " + n);
        }
      }
      function Hr(t, n, a = "i8") {
        switch (a.endsWith("*") && (a = "*"), a) {
          case "i1":
            V[t >> 0] = n;
            break;
          case "i8":
            V[t >> 0] = n;
            break;
          case "i16":
            te[t >> 1] = n;
            break;
          case "i32":
            k[t >> 2] = n;
            break;
          case "i64":
            x = [n >>> 0, (G = n, +Math.abs(G) >= 1 ? G > 0 ? (Math.min(+Math.floor(G / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((G - +(~~G >>> 0)) / 4294967296) >>> 0 : 0)], k[t >> 2] = x[0], k[t + 4 >> 2] = x[1];
            break;
          case "float":
            ht[t >> 2] = n;
            break;
          case "double":
            yt[t >> 3] = n;
            break;
          case "*":
            T[t >> 2] = n;
            break;
          default:
            ye("invalid type for setValue: " + a);
        }
      }
      var vt = [];
      function K(t) {
        var n = vt[t];
        return n || (t >= vt.length && (vt.length = t + 1), vt[t] = n = dn.get(t)), n;
      }
      function Fr(t, n) {
        K(t)(n);
      }
      var Ue = 0;
      function Dn(t) {
        this.excPtr = t, this.ptr = t - 24, this.set_type = function(n) {
          T[this.ptr + 4 >> 2] = n;
        }, this.get_type = function() {
          return T[this.ptr + 4 >> 2];
        }, this.set_destructor = function(n) {
          T[this.ptr + 8 >> 2] = n;
        }, this.get_destructor = function() {
          return T[this.ptr + 8 >> 2];
        }, this.set_caught = function(n) {
          n = n ? 1 : 0, V[this.ptr + 12 >> 0] = n;
        }, this.get_caught = function() {
          return V[this.ptr + 12 >> 0] != 0;
        }, this.set_rethrown = function(n) {
          n = n ? 1 : 0, V[this.ptr + 13 >> 0] = n;
        }, this.get_rethrown = function() {
          return V[this.ptr + 13 >> 0] != 0;
        }, this.init = function(n, a) {
          this.set_adjusted_ptr(0), this.set_type(n), this.set_destructor(a);
        }, this.set_adjusted_ptr = function(n) {
          T[this.ptr + 16 >> 2] = n;
        }, this.get_adjusted_ptr = function() {
          return T[this.ptr + 16 >> 2];
        }, this.get_exception_ptr = function() {
          var n = lr(this.get_type());
          if (n)
            return T[this.excPtr >> 2];
          var a = this.get_adjusted_ptr();
          return a !== 0 ? a : this.excPtr;
        };
      }
      function Ur(t) {
        throw Ue || (Ue = t), Ue;
      }
      function jr() {
        var t = Ue;
        if (!t)
          return ct(0), 0;
        var n = new Dn(t);
        n.set_adjusted_ptr(t);
        var a = n.get_type();
        if (!a)
          return ct(0), t;
        for (var s = 0; s < arguments.length; s++) {
          var o = arguments[s];
          if (o === 0 || o === a)
            break;
          var l = n.ptr + 16;
          if (_r(o, a, l))
            return ct(o), t;
        }
        return ct(a), t;
      }
      var Yr = jr;
      function $r(t, n, a) {
        var s = new Dn(t);
        throw s.init(n, a), Ue = t, Ue;
      }
      var U = { isAbs: (t) => t.charAt(0) === "/", splitPath: (t) => {
        var n = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return n.exec(t).slice(1);
      }, normalizeArray: (t, n) => {
        for (var a = 0, s = t.length - 1; s >= 0; s--) {
          var o = t[s];
          o === "." ? t.splice(s, 1) : o === ".." ? (t.splice(s, 1), a++) : a && (t.splice(s, 1), a--);
        }
        if (n)
          for (; a; a--)
            t.unshift("..");
        return t;
      }, normalize: (t) => {
        var n = U.isAbs(t), a = t.substr(-1) === "/";
        return t = U.normalizeArray(t.split("/").filter((s) => !!s), !n).join("/"), !t && !n && (t = "."), t && a && (t += "/"), (n ? "/" : "") + t;
      }, dirname: (t) => {
        var n = U.splitPath(t), a = n[0], s = n[1];
        return !a && !s ? "." : (s && (s = s.substr(0, s.length - 1)), a + s);
      }, basename: (t) => {
        if (t === "/")
          return "/";
        t = U.normalize(t), t = t.replace(/\/$/, "");
        var n = t.lastIndexOf("/");
        return n === -1 ? t : t.substr(n + 1);
      }, join: function() {
        var t = Array.prototype.slice.call(arguments);
        return U.normalize(t.join("/"));
      }, join2: (t, n) => U.normalize(t + "/" + n) };
      function Xr() {
        if (typeof crypto == "object" && typeof crypto.getRandomValues == "function")
          return (s) => crypto.getRandomValues(s);
        if (le)
          try {
            var t = require("crypto"), n = t.randomFillSync;
            if (n)
              return (s) => t.randomFillSync(s);
            var a = t.randomBytes;
            return (s) => (s.set(a(s.byteLength)), s);
          } catch {
          }
        ye("initRandomDevice");
      }
      function qt(t) {
        return (qt = Xr())(t);
      }
      var we = { resolve: function() {
        for (var t = "", n = !1, a = arguments.length - 1; a >= -1 && !n; a--) {
          var s = a >= 0 ? arguments[a] : _.cwd();
          if (typeof s != "string")
            throw new TypeError("Arguments to path.resolve must be strings");
          if (!s)
            return "";
          t = s + "/" + t, n = U.isAbs(s);
        }
        return t = U.normalizeArray(t.split("/").filter((o) => !!o), !n).join("/"), (n ? "/" : "") + t || ".";
      }, relative: (t, n) => {
        t = we.resolve(t).substr(1), n = we.resolve(n).substr(1);
        function a(h) {
          for (var v = 0; v < h.length && h[v] === ""; v++)
            ;
          for (var C = h.length - 1; C >= 0 && h[C] === ""; C--)
            ;
          return v > C ? [] : h.slice(v, C - v + 1);
        }
        for (var s = a(t.split("/")), o = a(n.split("/")), l = Math.min(s.length, o.length), c = l, g = 0; g < l; g++)
          if (s[g] !== o[g]) {
            c = g;
            break;
          }
        for (var d = [], g = c; g < s.length; g++)
          d.push("..");
        return d = d.concat(o.slice(c)), d.join("/");
      } };
      function Le(t) {
        for (var n = 0, a = 0; a < t.length; ++a) {
          var s = t.charCodeAt(a);
          s <= 127 ? n++ : s <= 2047 ? n += 2 : s >= 55296 && s <= 57343 ? (n += 4, ++a) : n += 3;
        }
        return n;
      }
      function Vt(t, n, a, s) {
        if (!(s > 0))
          return 0;
        for (var o = a, l = a + s - 1, c = 0; c < t.length; ++c) {
          var g = t.charCodeAt(c);
          if (g >= 55296 && g <= 57343) {
            var d = t.charCodeAt(++c);
            g = 65536 + ((g & 1023) << 10) | d & 1023;
          }
          if (g <= 127) {
            if (a >= l)
              break;
            n[a++] = g;
          } else if (g <= 2047) {
            if (a + 1 >= l)
              break;
            n[a++] = 192 | g >> 6, n[a++] = 128 | g & 63;
          } else if (g <= 65535) {
            if (a + 2 >= l)
              break;
            n[a++] = 224 | g >> 12, n[a++] = 128 | g >> 6 & 63, n[a++] = 128 | g & 63;
          } else {
            if (a + 3 >= l)
              break;
            n[a++] = 240 | g >> 18, n[a++] = 128 | g >> 12 & 63, n[a++] = 128 | g >> 6 & 63, n[a++] = 128 | g & 63;
          }
        }
        return n[a] = 0, a - o;
      }
      function St(t, n, a) {
        var s = a > 0 ? a : Le(t) + 1, o = new Array(s), l = Vt(t, o, 0, o.length);
        return n && (o.length = l), o;
      }
      var We = { ttys: [], init: function() {
      }, shutdown: function() {
      }, register: function(t, n) {
        We.ttys[t] = { input: [], output: [], ops: n }, _.registerDevice(t, We.stream_ops);
      }, stream_ops: { open: function(t) {
        var n = We.ttys[t.node.rdev];
        if (!n)
          throw new _.ErrnoError(43);
        t.tty = n, t.seekable = !1;
      }, close: function(t) {
        t.tty.ops.fsync(t.tty);
      }, fsync: function(t) {
        t.tty.ops.fsync(t.tty);
      }, read: function(t, n, a, s, o) {
        if (!t.tty || !t.tty.ops.get_char)
          throw new _.ErrnoError(60);
        for (var l = 0, c = 0; c < s; c++) {
          var g;
          try {
            g = t.tty.ops.get_char(t.tty);
          } catch {
            throw new _.ErrnoError(29);
          }
          if (g === void 0 && l === 0)
            throw new _.ErrnoError(6);
          if (g == null)
            break;
          l++, n[a + c] = g;
        }
        return l && (t.node.timestamp = Date.now()), l;
      }, write: function(t, n, a, s, o) {
        if (!t.tty || !t.tty.ops.put_char)
          throw new _.ErrnoError(60);
        try {
          for (var l = 0; l < s; l++)
            t.tty.ops.put_char(t.tty, n[a + l]);
        } catch {
          throw new _.ErrnoError(29);
        }
        return s && (t.node.timestamp = Date.now()), l;
      } }, default_tty_ops: { get_char: function(t) {
        if (!t.input.length) {
          var n = null;
          if (le) {
            var a = 256, s = Buffer.alloc(a), o = 0;
            try {
              o = jt.readSync(process.stdin.fd, s, 0, a, -1);
            } catch (l) {
              if (l.toString().includes("EOF"))
                o = 0;
              else
                throw l;
            }
            o > 0 ? n = s.slice(0, o).toString("utf-8") : n = null;
          } else
            typeof window < "u" && typeof window.prompt == "function" ? (n = window.prompt("Input: "), n !== null && (n += `
`)) : typeof readline == "function" && (n = readline(), n !== null && (n += `
`));
          if (!n)
            return null;
          t.input = St(n, !0);
        }
        return t.input.shift();
      }, put_char: function(t, n) {
        n === null || n === 10 ? ($t(je(t.output, 0)), t.output = []) : n != 0 && t.output.push(n);
      }, fsync: function(t) {
        t.output && t.output.length > 0 && ($t(je(t.output, 0)), t.output = []);
      } }, default_tty1_ops: { put_char: function(t, n) {
        n === null || n === 10 ? (Pe(je(t.output, 0)), t.output = []) : n != 0 && t.output.push(n);
      }, fsync: function(t) {
        t.output && t.output.length > 0 && (Pe(je(t.output, 0)), t.output = []);
      } } };
      function Kt(t, n) {
        return ee.fill(0, t, t + n), t;
      }
      function qr(t, n) {
        return Math.ceil(t / n) * n;
      }
      function Cn(t) {
        t = qr(t, 65536);
        var n = ur(65536, t);
        return n ? Kt(n, t) : 0;
      }
      var L = { ops_table: null, mount: function(t) {
        return L.createNode(null, "/", 16895, 0);
      }, createNode: function(t, n, a, s) {
        if (_.isBlkdev(a) || _.isFIFO(a))
          throw new _.ErrnoError(63);
        L.ops_table || (L.ops_table = { dir: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr, lookup: L.node_ops.lookup, mknod: L.node_ops.mknod, rename: L.node_ops.rename, unlink: L.node_ops.unlink, rmdir: L.node_ops.rmdir, readdir: L.node_ops.readdir, symlink: L.node_ops.symlink }, stream: { llseek: L.stream_ops.llseek } }, file: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr }, stream: { llseek: L.stream_ops.llseek, read: L.stream_ops.read, write: L.stream_ops.write, allocate: L.stream_ops.allocate, mmap: L.stream_ops.mmap, msync: L.stream_ops.msync } }, link: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr, readlink: L.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr }, stream: _.chrdev_stream_ops } });
        var o = _.createNode(t, n, a, s);
        return _.isDir(o.mode) ? (o.node_ops = L.ops_table.dir.node, o.stream_ops = L.ops_table.dir.stream, o.contents = {}) : _.isFile(o.mode) ? (o.node_ops = L.ops_table.file.node, o.stream_ops = L.ops_table.file.stream, o.usedBytes = 0, o.contents = null) : _.isLink(o.mode) ? (o.node_ops = L.ops_table.link.node, o.stream_ops = L.ops_table.link.stream) : _.isChrdev(o.mode) && (o.node_ops = L.ops_table.chrdev.node, o.stream_ops = L.ops_table.chrdev.stream), o.timestamp = Date.now(), t && (t.contents[n] = o, t.timestamp = o.timestamp), o;
      }, getFileDataAsTypedArray: function(t) {
        return t.contents ? t.contents.subarray ? t.contents.subarray(0, t.usedBytes) : new Uint8Array(t.contents) : new Uint8Array(0);
      }, expandFileStorage: function(t, n) {
        var a = t.contents ? t.contents.length : 0;
        if (!(a >= n)) {
          var s = 1024 * 1024;
          n = Math.max(n, a * (a < s ? 2 : 1.125) >>> 0), a != 0 && (n = Math.max(n, 256));
          var o = t.contents;
          t.contents = new Uint8Array(n), t.usedBytes > 0 && t.contents.set(o.subarray(0, t.usedBytes), 0);
        }
      }, resizeFileStorage: function(t, n) {
        if (t.usedBytes != n)
          if (n == 0)
            t.contents = null, t.usedBytes = 0;
          else {
            var a = t.contents;
            t.contents = new Uint8Array(n), a && t.contents.set(a.subarray(0, Math.min(n, t.usedBytes))), t.usedBytes = n;
          }
      }, node_ops: { getattr: function(t) {
        var n = {};
        return n.dev = _.isChrdev(t.mode) ? t.id : 1, n.ino = t.id, n.mode = t.mode, n.nlink = 1, n.uid = 0, n.gid = 0, n.rdev = t.rdev, _.isDir(t.mode) ? n.size = 4096 : _.isFile(t.mode) ? n.size = t.usedBytes : _.isLink(t.mode) ? n.size = t.link.length : n.size = 0, n.atime = new Date(t.timestamp), n.mtime = new Date(t.timestamp), n.ctime = new Date(t.timestamp), n.blksize = 4096, n.blocks = Math.ceil(n.size / n.blksize), n;
      }, setattr: function(t, n) {
        n.mode !== void 0 && (t.mode = n.mode), n.timestamp !== void 0 && (t.timestamp = n.timestamp), n.size !== void 0 && L.resizeFileStorage(t, n.size);
      }, lookup: function(t, n) {
        throw _.genericErrors[44];
      }, mknod: function(t, n, a, s) {
        return L.createNode(t, n, a, s);
      }, rename: function(t, n, a) {
        if (_.isDir(t.mode)) {
          var s;
          try {
            s = _.lookupNode(n, a);
          } catch {
          }
          if (s)
            for (var o in s.contents)
              throw new _.ErrnoError(55);
        }
        delete t.parent.contents[t.name], t.parent.timestamp = Date.now(), t.name = a, n.contents[a] = t, n.timestamp = t.parent.timestamp, t.parent = n;
      }, unlink: function(t, n) {
        delete t.contents[n], t.timestamp = Date.now();
      }, rmdir: function(t, n) {
        var a = _.lookupNode(t, n);
        for (var s in a.contents)
          throw new _.ErrnoError(55);
        delete t.contents[n], t.timestamp = Date.now();
      }, readdir: function(t) {
        var n = [".", ".."];
        for (var a in t.contents)
          t.contents.hasOwnProperty(a) && n.push(a);
        return n;
      }, symlink: function(t, n, a) {
        var s = L.createNode(t, n, 41471, 0);
        return s.link = a, s;
      }, readlink: function(t) {
        if (!_.isLink(t.mode))
          throw new _.ErrnoError(28);
        return t.link;
      } }, stream_ops: { read: function(t, n, a, s, o) {
        var l = t.node.contents;
        if (o >= t.node.usedBytes)
          return 0;
        var c = Math.min(t.node.usedBytes - o, s);
        if (c > 8 && l.subarray)
          n.set(l.subarray(o, o + c), a);
        else
          for (var g = 0; g < c; g++)
            n[a + g] = l[o + g];
        return c;
      }, write: function(t, n, a, s, o, l) {
        if (n.buffer === V.buffer && (l = !1), !s)
          return 0;
        var c = t.node;
        if (c.timestamp = Date.now(), n.subarray && (!c.contents || c.contents.subarray)) {
          if (l)
            return c.contents = n.subarray(a, a + s), c.usedBytes = s, s;
          if (c.usedBytes === 0 && o === 0)
            return c.contents = n.slice(a, a + s), c.usedBytes = s, s;
          if (o + s <= c.usedBytes)
            return c.contents.set(n.subarray(a, a + s), o), s;
        }
        if (L.expandFileStorage(c, o + s), c.contents.subarray && n.subarray)
          c.contents.set(n.subarray(a, a + s), o);
        else
          for (var g = 0; g < s; g++)
            c.contents[o + g] = n[a + g];
        return c.usedBytes = Math.max(c.usedBytes, o + s), s;
      }, llseek: function(t, n, a) {
        var s = n;
        if (a === 1 ? s += t.position : a === 2 && _.isFile(t.node.mode) && (s += t.node.usedBytes), s < 0)
          throw new _.ErrnoError(28);
        return s;
      }, allocate: function(t, n, a) {
        L.expandFileStorage(t.node, n + a), t.node.usedBytes = Math.max(t.node.usedBytes, n + a);
      }, mmap: function(t, n, a, s, o) {
        if (!_.isFile(t.node.mode))
          throw new _.ErrnoError(43);
        var l, c, g = t.node.contents;
        if (!(o & 2) && g.buffer === V.buffer)
          c = !1, l = g.byteOffset;
        else {
          if ((a > 0 || a + n < g.length) && (g.subarray ? g = g.subarray(a, a + n) : g = Array.prototype.slice.call(g, a, a + n)), c = !0, l = Cn(n), !l)
            throw new _.ErrnoError(48);
          V.set(g, l);
        }
        return { ptr: l, allocated: c };
      }, msync: function(t, n, a, s, o) {
        return L.stream_ops.write(t, n, 0, s, a, !1), 0;
      } } };
      function Vr(t, n, a, s) {
        var o = s ? "" : "al " + t;
        Qe(t, (l) => {
          dt(l, 'Loading data file "' + t + '" failed (no arrayBuffer).'), n(new Uint8Array(l)), o && et();
        }, (l) => {
          if (a)
            a();
          else
            throw 'Loading data file "' + t + '" failed.';
        }), o && wt();
      }
      var _ = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: !1, ignorePermissions: !0, ErrnoError: null, genericErrors: {}, filesystems: null, syncFSRequests: 0, lookupPath: (t, n = {}) => {
        if (t = we.resolve(t), !t)
          return { path: "", node: null };
        var a = { follow_mount: !0, recurse_count: 0 };
        if (n = Object.assign(a, n), n.recurse_count > 8)
          throw new _.ErrnoError(32);
        for (var s = t.split("/").filter((C) => !!C), o = _.root, l = "/", c = 0; c < s.length; c++) {
          var g = c === s.length - 1;
          if (g && n.parent)
            break;
          if (o = _.lookupNode(o, s[c]), l = U.join2(l, s[c]), _.isMountpoint(o) && (!g || g && n.follow_mount) && (o = o.mounted.root), !g || n.follow)
            for (var d = 0; _.isLink(o.mode); ) {
              var h = _.readlink(l);
              l = we.resolve(U.dirname(l), h);
              var v = _.lookupPath(l, { recurse_count: n.recurse_count + 1 });
              if (o = v.node, d++ > 40)
                throw new _.ErrnoError(32);
            }
        }
        return { path: l, node: o };
      }, getPath: (t) => {
        for (var n; ; ) {
          if (_.isRoot(t)) {
            var a = t.mount.mountpoint;
            return n ? a[a.length - 1] !== "/" ? a + "/" + n : a + n : a;
          }
          n = n ? t.name + "/" + n : t.name, t = t.parent;
        }
      }, hashName: (t, n) => {
        for (var a = 0, s = 0; s < n.length; s++)
          a = (a << 5) - a + n.charCodeAt(s) | 0;
        return (t + a >>> 0) % _.nameTable.length;
      }, hashAddNode: (t) => {
        var n = _.hashName(t.parent.id, t.name);
        t.name_next = _.nameTable[n], _.nameTable[n] = t;
      }, hashRemoveNode: (t) => {
        var n = _.hashName(t.parent.id, t.name);
        if (_.nameTable[n] === t)
          _.nameTable[n] = t.name_next;
        else
          for (var a = _.nameTable[n]; a; ) {
            if (a.name_next === t) {
              a.name_next = t.name_next;
              break;
            }
            a = a.name_next;
          }
      }, lookupNode: (t, n) => {
        var a = _.mayLookup(t);
        if (a)
          throw new _.ErrnoError(a, t);
        for (var s = _.hashName(t.id, n), o = _.nameTable[s]; o; o = o.name_next) {
          var l = o.name;
          if (o.parent.id === t.id && l === n)
            return o;
        }
        return _.lookup(t, n);
      }, createNode: (t, n, a, s) => {
        var o = new _.FSNode(t, n, a, s);
        return _.hashAddNode(o), o;
      }, destroyNode: (t) => {
        _.hashRemoveNode(t);
      }, isRoot: (t) => t === t.parent, isMountpoint: (t) => !!t.mounted, isFile: (t) => (t & 61440) === 32768, isDir: (t) => (t & 61440) === 16384, isLink: (t) => (t & 61440) === 40960, isChrdev: (t) => (t & 61440) === 8192, isBlkdev: (t) => (t & 61440) === 24576, isFIFO: (t) => (t & 61440) === 4096, isSocket: (t) => (t & 49152) === 49152, flagModes: { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }, modeStringToFlags: (t) => {
        var n = _.flagModes[t];
        if (typeof n > "u")
          throw new Error("Unknown file open mode: " + t);
        return n;
      }, flagsToPermissionString: (t) => {
        var n = ["r", "w", "rw"][t & 3];
        return t & 512 && (n += "w"), n;
      }, nodePermissions: (t, n) => _.ignorePermissions ? 0 : n.includes("r") && !(t.mode & 292) || n.includes("w") && !(t.mode & 146) || n.includes("x") && !(t.mode & 73) ? 2 : 0, mayLookup: (t) => {
        var n = _.nodePermissions(t, "x");
        return n || (t.node_ops.lookup ? 0 : 2);
      }, mayCreate: (t, n) => {
        try {
          var a = _.lookupNode(t, n);
          return 20;
        } catch {
        }
        return _.nodePermissions(t, "wx");
      }, mayDelete: (t, n, a) => {
        var s;
        try {
          s = _.lookupNode(t, n);
        } catch (l) {
          return l.errno;
        }
        var o = _.nodePermissions(t, "wx");
        if (o)
          return o;
        if (a) {
          if (!_.isDir(s.mode))
            return 54;
          if (_.isRoot(s) || _.getPath(s) === _.cwd())
            return 10;
        } else if (_.isDir(s.mode))
          return 31;
        return 0;
      }, mayOpen: (t, n) => t ? _.isLink(t.mode) ? 32 : _.isDir(t.mode) && (_.flagsToPermissionString(n) !== "r" || n & 512) ? 31 : _.nodePermissions(t, _.flagsToPermissionString(n)) : 44, MAX_OPEN_FDS: 4096, nextfd: (t = 0, n = _.MAX_OPEN_FDS) => {
        for (var a = t; a <= n; a++)
          if (!_.streams[a])
            return a;
        throw new _.ErrnoError(33);
      }, getStream: (t) => _.streams[t], createStream: (t, n, a) => {
        _.FSStream || (_.FSStream = function() {
          this.shared = {};
        }, _.FSStream.prototype = {}, Object.defineProperties(_.FSStream.prototype, { object: { get: function() {
          return this.node;
        }, set: function(o) {
          this.node = o;
        } }, isRead: { get: function() {
          return (this.flags & 2097155) !== 1;
        } }, isWrite: { get: function() {
          return (this.flags & 2097155) !== 0;
        } }, isAppend: { get: function() {
          return this.flags & 1024;
        } }, flags: { get: function() {
          return this.shared.flags;
        }, set: function(o) {
          this.shared.flags = o;
        } }, position: { get: function() {
          return this.shared.position;
        }, set: function(o) {
          this.shared.position = o;
        } } })), t = Object.assign(new _.FSStream(), t);
        var s = _.nextfd(n, a);
        return t.fd = s, _.streams[s] = t, t;
      }, closeStream: (t) => {
        _.streams[t] = null;
      }, chrdev_stream_ops: { open: (t) => {
        var n = _.getDevice(t.node.rdev);
        t.stream_ops = n.stream_ops, t.stream_ops.open && t.stream_ops.open(t);
      }, llseek: () => {
        throw new _.ErrnoError(70);
      } }, major: (t) => t >> 8, minor: (t) => t & 255, makedev: (t, n) => t << 8 | n, registerDevice: (t, n) => {
        _.devices[t] = { stream_ops: n };
      }, getDevice: (t) => _.devices[t], getMounts: (t) => {
        for (var n = [], a = [t]; a.length; ) {
          var s = a.pop();
          n.push(s), a.push.apply(a, s.mounts);
        }
        return n;
      }, syncfs: (t, n) => {
        typeof t == "function" && (n = t, t = !1), _.syncFSRequests++, _.syncFSRequests > 1 && Pe("warning: " + _.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work");
        var a = _.getMounts(_.root.mount), s = 0;
        function o(c) {
          return _.syncFSRequests--, n(c);
        }
        function l(c) {
          if (c)
            return l.errored ? void 0 : (l.errored = !0, o(c));
          ++s >= a.length && o(null);
        }
        a.forEach((c) => {
          if (!c.type.syncfs)
            return l(null);
          c.type.syncfs(c, t, l);
        });
      }, mount: (t, n, a) => {
        var s = a === "/", o = !a, l;
        if (s && _.root)
          throw new _.ErrnoError(10);
        if (!s && !o) {
          var c = _.lookupPath(a, { follow_mount: !1 });
          if (a = c.path, l = c.node, _.isMountpoint(l))
            throw new _.ErrnoError(10);
          if (!_.isDir(l.mode))
            throw new _.ErrnoError(54);
        }
        var g = { type: t, opts: n, mountpoint: a, mounts: [] }, d = t.mount(g);
        return d.mount = g, g.root = d, s ? _.root = d : l && (l.mounted = g, l.mount && l.mount.mounts.push(g)), d;
      }, unmount: (t) => {
        var n = _.lookupPath(t, { follow_mount: !1 });
        if (!_.isMountpoint(n.node))
          throw new _.ErrnoError(28);
        var a = n.node, s = a.mounted, o = _.getMounts(s);
        Object.keys(_.nameTable).forEach((c) => {
          for (var g = _.nameTable[c]; g; ) {
            var d = g.name_next;
            o.includes(g.mount) && _.destroyNode(g), g = d;
          }
        }), a.mounted = null;
        var l = a.mount.mounts.indexOf(s);
        a.mount.mounts.splice(l, 1);
      }, lookup: (t, n) => t.node_ops.lookup(t, n), mknod: (t, n, a) => {
        var s = _.lookupPath(t, { parent: !0 }), o = s.node, l = U.basename(t);
        if (!l || l === "." || l === "..")
          throw new _.ErrnoError(28);
        var c = _.mayCreate(o, l);
        if (c)
          throw new _.ErrnoError(c);
        if (!o.node_ops.mknod)
          throw new _.ErrnoError(63);
        return o.node_ops.mknod(o, l, n, a);
      }, create: (t, n) => (n = n !== void 0 ? n : 438, n &= 4095, n |= 32768, _.mknod(t, n, 0)), mkdir: (t, n) => (n = n !== void 0 ? n : 511, n &= 1023, n |= 16384, _.mknod(t, n, 0)), mkdirTree: (t, n) => {
        for (var a = t.split("/"), s = "", o = 0; o < a.length; ++o)
          if (a[o]) {
            s += "/" + a[o];
            try {
              _.mkdir(s, n);
            } catch (l) {
              if (l.errno != 20)
                throw l;
            }
          }
      }, mkdev: (t, n, a) => (typeof a > "u" && (a = n, n = 438), n |= 8192, _.mknod(t, n, a)), symlink: (t, n) => {
        if (!we.resolve(t))
          throw new _.ErrnoError(44);
        var a = _.lookupPath(n, { parent: !0 }), s = a.node;
        if (!s)
          throw new _.ErrnoError(44);
        var o = U.basename(n), l = _.mayCreate(s, o);
        if (l)
          throw new _.ErrnoError(l);
        if (!s.node_ops.symlink)
          throw new _.ErrnoError(63);
        return s.node_ops.symlink(s, o, t);
      }, rename: (t, n) => {
        var a = U.dirname(t), s = U.dirname(n), o = U.basename(t), l = U.basename(n), c, g, d;
        if (c = _.lookupPath(t, { parent: !0 }), g = c.node, c = _.lookupPath(n, { parent: !0 }), d = c.node, !g || !d)
          throw new _.ErrnoError(44);
        if (g.mount !== d.mount)
          throw new _.ErrnoError(75);
        var h = _.lookupNode(g, o), v = we.relative(t, s);
        if (v.charAt(0) !== ".")
          throw new _.ErrnoError(28);
        if (v = we.relative(n, a), v.charAt(0) !== ".")
          throw new _.ErrnoError(55);
        var C;
        try {
          C = _.lookupNode(d, l);
        } catch {
        }
        if (h !== C) {
          var D = _.isDir(h.mode), P = _.mayDelete(g, o, D);
          if (P)
            throw new _.ErrnoError(P);
          if (P = C ? _.mayDelete(d, l, D) : _.mayCreate(d, l), P)
            throw new _.ErrnoError(P);
          if (!g.node_ops.rename)
            throw new _.ErrnoError(63);
          if (_.isMountpoint(h) || C && _.isMountpoint(C))
            throw new _.ErrnoError(10);
          if (d !== g && (P = _.nodePermissions(g, "w"), P))
            throw new _.ErrnoError(P);
          _.hashRemoveNode(h);
          try {
            g.node_ops.rename(h, d, l);
          } catch (R) {
            throw R;
          } finally {
            _.hashAddNode(h);
          }
        }
      }, rmdir: (t) => {
        var n = _.lookupPath(t, { parent: !0 }), a = n.node, s = U.basename(t), o = _.lookupNode(a, s), l = _.mayDelete(a, s, !0);
        if (l)
          throw new _.ErrnoError(l);
        if (!a.node_ops.rmdir)
          throw new _.ErrnoError(63);
        if (_.isMountpoint(o))
          throw new _.ErrnoError(10);
        a.node_ops.rmdir(a, s), _.destroyNode(o);
      }, readdir: (t) => {
        var n = _.lookupPath(t, { follow: !0 }), a = n.node;
        if (!a.node_ops.readdir)
          throw new _.ErrnoError(54);
        return a.node_ops.readdir(a);
      }, unlink: (t) => {
        var n = _.lookupPath(t, { parent: !0 }), a = n.node;
        if (!a)
          throw new _.ErrnoError(44);
        var s = U.basename(t), o = _.lookupNode(a, s), l = _.mayDelete(a, s, !1);
        if (l)
          throw new _.ErrnoError(l);
        if (!a.node_ops.unlink)
          throw new _.ErrnoError(63);
        if (_.isMountpoint(o))
          throw new _.ErrnoError(10);
        a.node_ops.unlink(a, s), _.destroyNode(o);
      }, readlink: (t) => {
        var n = _.lookupPath(t), a = n.node;
        if (!a)
          throw new _.ErrnoError(44);
        if (!a.node_ops.readlink)
          throw new _.ErrnoError(28);
        return we.resolve(_.getPath(a.parent), a.node_ops.readlink(a));
      }, stat: (t, n) => {
        var a = _.lookupPath(t, { follow: !n }), s = a.node;
        if (!s)
          throw new _.ErrnoError(44);
        if (!s.node_ops.getattr)
          throw new _.ErrnoError(63);
        return s.node_ops.getattr(s);
      }, lstat: (t) => _.stat(t, !0), chmod: (t, n, a) => {
        var s;
        if (typeof t == "string") {
          var o = _.lookupPath(t, { follow: !a });
          s = o.node;
        } else
          s = t;
        if (!s.node_ops.setattr)
          throw new _.ErrnoError(63);
        s.node_ops.setattr(s, { mode: n & 4095 | s.mode & -4096, timestamp: Date.now() });
      }, lchmod: (t, n) => {
        _.chmod(t, n, !0);
      }, fchmod: (t, n) => {
        var a = _.getStream(t);
        if (!a)
          throw new _.ErrnoError(8);
        _.chmod(a.node, n);
      }, chown: (t, n, a, s) => {
        var o;
        if (typeof t == "string") {
          var l = _.lookupPath(t, { follow: !s });
          o = l.node;
        } else
          o = t;
        if (!o.node_ops.setattr)
          throw new _.ErrnoError(63);
        o.node_ops.setattr(o, { timestamp: Date.now() });
      }, lchown: (t, n, a) => {
        _.chown(t, n, a, !0);
      }, fchown: (t, n, a) => {
        var s = _.getStream(t);
        if (!s)
          throw new _.ErrnoError(8);
        _.chown(s.node, n, a);
      }, truncate: (t, n) => {
        if (n < 0)
          throw new _.ErrnoError(28);
        var a;
        if (typeof t == "string") {
          var s = _.lookupPath(t, { follow: !0 });
          a = s.node;
        } else
          a = t;
        if (!a.node_ops.setattr)
          throw new _.ErrnoError(63);
        if (_.isDir(a.mode))
          throw new _.ErrnoError(31);
        if (!_.isFile(a.mode))
          throw new _.ErrnoError(28);
        var o = _.nodePermissions(a, "w");
        if (o)
          throw new _.ErrnoError(o);
        a.node_ops.setattr(a, { size: n, timestamp: Date.now() });
      }, ftruncate: (t, n) => {
        var a = _.getStream(t);
        if (!a)
          throw new _.ErrnoError(8);
        if (!(a.flags & 2097155))
          throw new _.ErrnoError(28);
        _.truncate(a.node, n);
      }, utime: (t, n, a) => {
        var s = _.lookupPath(t, { follow: !0 }), o = s.node;
        o.node_ops.setattr(o, { timestamp: Math.max(n, a) });
      }, open: (t, n, a) => {
        if (t === "")
          throw new _.ErrnoError(44);
        n = typeof n == "string" ? _.modeStringToFlags(n) : n, a = typeof a > "u" ? 438 : a, n & 64 ? a = a & 4095 | 32768 : a = 0;
        var s;
        if (typeof t == "object")
          s = t;
        else {
          t = U.normalize(t);
          try {
            var o = _.lookupPath(t, { follow: !(n & 131072) });
            s = o.node;
          } catch {
          }
        }
        var l = !1;
        if (n & 64)
          if (s) {
            if (n & 128)
              throw new _.ErrnoError(20);
          } else
            s = _.mknod(t, a, 0), l = !0;
        if (!s)
          throw new _.ErrnoError(44);
        if (_.isChrdev(s.mode) && (n &= -513), n & 65536 && !_.isDir(s.mode))
          throw new _.ErrnoError(54);
        if (!l) {
          var c = _.mayOpen(s, n);
          if (c)
            throw new _.ErrnoError(c);
        }
        n & 512 && !l && _.truncate(s, 0), n &= -131713;
        var g = _.createStream({ node: s, path: _.getPath(s), flags: n, seekable: !0, position: 0, stream_ops: s.stream_ops, ungotten: [], error: !1 });
        return g.stream_ops.open && g.stream_ops.open(g), e.logReadFiles && !(n & 1) && (_.readFiles || (_.readFiles = {}), t in _.readFiles || (_.readFiles[t] = 1)), g;
      }, close: (t) => {
        if (_.isClosed(t))
          throw new _.ErrnoError(8);
        t.getdents && (t.getdents = null);
        try {
          t.stream_ops.close && t.stream_ops.close(t);
        } catch (n) {
          throw n;
        } finally {
          _.closeStream(t.fd);
        }
        t.fd = null;
      }, isClosed: (t) => t.fd === null, llseek: (t, n, a) => {
        if (_.isClosed(t))
          throw new _.ErrnoError(8);
        if (!t.seekable || !t.stream_ops.llseek)
          throw new _.ErrnoError(70);
        if (a != 0 && a != 1 && a != 2)
          throw new _.ErrnoError(28);
        return t.position = t.stream_ops.llseek(t, n, a), t.ungotten = [], t.position;
      }, read: (t, n, a, s, o) => {
        if (s < 0 || o < 0)
          throw new _.ErrnoError(28);
        if (_.isClosed(t))
          throw new _.ErrnoError(8);
        if ((t.flags & 2097155) === 1)
          throw new _.ErrnoError(8);
        if (_.isDir(t.node.mode))
          throw new _.ErrnoError(31);
        if (!t.stream_ops.read)
          throw new _.ErrnoError(28);
        var l = typeof o < "u";
        if (!l)
          o = t.position;
        else if (!t.seekable)
          throw new _.ErrnoError(70);
        var c = t.stream_ops.read(t, n, a, s, o);
        return l || (t.position += c), c;
      }, write: (t, n, a, s, o, l) => {
        if (s < 0 || o < 0)
          throw new _.ErrnoError(28);
        if (_.isClosed(t))
          throw new _.ErrnoError(8);
        if (!(t.flags & 2097155))
          throw new _.ErrnoError(8);
        if (_.isDir(t.node.mode))
          throw new _.ErrnoError(31);
        if (!t.stream_ops.write)
          throw new _.ErrnoError(28);
        t.seekable && t.flags & 1024 && _.llseek(t, 0, 2);
        var c = typeof o < "u";
        if (!c)
          o = t.position;
        else if (!t.seekable)
          throw new _.ErrnoError(70);
        var g = t.stream_ops.write(t, n, a, s, o, l);
        return c || (t.position += g), g;
      }, allocate: (t, n, a) => {
        if (_.isClosed(t))
          throw new _.ErrnoError(8);
        if (n < 0 || a <= 0)
          throw new _.ErrnoError(28);
        if (!(t.flags & 2097155))
          throw new _.ErrnoError(8);
        if (!_.isFile(t.node.mode) && !_.isDir(t.node.mode))
          throw new _.ErrnoError(43);
        if (!t.stream_ops.allocate)
          throw new _.ErrnoError(138);
        t.stream_ops.allocate(t, n, a);
      }, mmap: (t, n, a, s, o) => {
        if (s & 2 && !(o & 2) && (t.flags & 2097155) !== 2)
          throw new _.ErrnoError(2);
        if ((t.flags & 2097155) === 1)
          throw new _.ErrnoError(2);
        if (!t.stream_ops.mmap)
          throw new _.ErrnoError(43);
        return t.stream_ops.mmap(t, n, a, s, o);
      }, msync: (t, n, a, s, o) => t.stream_ops.msync ? t.stream_ops.msync(t, n, a, s, o) : 0, munmap: (t) => 0, ioctl: (t, n, a) => {
        if (!t.stream_ops.ioctl)
          throw new _.ErrnoError(59);
        return t.stream_ops.ioctl(t, n, a);
      }, readFile: (t, n = {}) => {
        if (n.flags = n.flags || 0, n.encoding = n.encoding || "binary", n.encoding !== "utf8" && n.encoding !== "binary")
          throw new Error('Invalid encoding type "' + n.encoding + '"');
        var a, s = _.open(t, n.flags), o = _.stat(t), l = o.size, c = new Uint8Array(l);
        return _.read(s, c, 0, l, 0), n.encoding === "utf8" ? a = je(c, 0) : n.encoding === "binary" && (a = c), _.close(s), a;
      }, writeFile: (t, n, a = {}) => {
        a.flags = a.flags || 577;
        var s = _.open(t, a.flags, a.mode);
        if (typeof n == "string") {
          var o = new Uint8Array(Le(n) + 1), l = Vt(n, o, 0, o.length);
          _.write(s, o, 0, l, void 0, a.canOwn);
        } else if (ArrayBuffer.isView(n))
          _.write(s, n, 0, n.byteLength, void 0, a.canOwn);
        else
          throw new Error("Unsupported data type");
        _.close(s);
      }, cwd: () => _.currentPath, chdir: (t) => {
        var n = _.lookupPath(t, { follow: !0 });
        if (n.node === null)
          throw new _.ErrnoError(44);
        if (!_.isDir(n.node.mode))
          throw new _.ErrnoError(54);
        var a = _.nodePermissions(n.node, "x");
        if (a)
          throw new _.ErrnoError(a);
        _.currentPath = n.path;
      }, createDefaultDirectories: () => {
        _.mkdir("/tmp"), _.mkdir("/home"), _.mkdir("/home/web_user");
      }, createDefaultDevices: () => {
        _.mkdir("/dev"), _.registerDevice(_.makedev(1, 3), { read: () => 0, write: (s, o, l, c, g) => c }), _.mkdev("/dev/null", _.makedev(1, 3)), We.register(_.makedev(5, 0), We.default_tty_ops), We.register(_.makedev(6, 0), We.default_tty1_ops), _.mkdev("/dev/tty", _.makedev(5, 0)), _.mkdev("/dev/tty1", _.makedev(6, 0));
        var t = new Uint8Array(1024), n = 0, a = () => (n === 0 && (n = qt(t).byteLength), t[--n]);
        _.createDevice("/dev", "random", a), _.createDevice("/dev", "urandom", a), _.mkdir("/dev/shm"), _.mkdir("/dev/shm/tmp");
      }, createSpecialDirectories: () => {
        _.mkdir("/proc");
        var t = _.mkdir("/proc/self");
        _.mkdir("/proc/self/fd"), _.mount({ mount: () => {
          var n = _.createNode(t, "fd", 16895, 73);
          return n.node_ops = { lookup: (a, s) => {
            var o = +s, l = _.getStream(o);
            if (!l)
              throw new _.ErrnoError(8);
            var c = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => l.path } };
            return c.parent = c, c;
          } }, n;
        } }, {}, "/proc/self/fd");
      }, createStandardStreams: () => {
        e.stdin ? _.createDevice("/dev", "stdin", e.stdin) : _.symlink("/dev/tty", "/dev/stdin"), e.stdout ? _.createDevice("/dev", "stdout", null, e.stdout) : _.symlink("/dev/tty", "/dev/stdout"), e.stderr ? _.createDevice("/dev", "stderr", null, e.stderr) : _.symlink("/dev/tty1", "/dev/stderr"), _.open("/dev/stdin", 0), _.open("/dev/stdout", 1), _.open("/dev/stderr", 1);
      }, ensureErrnoError: () => {
        _.ErrnoError || (_.ErrnoError = function(n, a) {
          this.name = "ErrnoError", this.node = a, this.setErrno = function(s) {
            this.errno = s;
          }, this.setErrno(n), this.message = "FS error";
        }, _.ErrnoError.prototype = new Error(), _.ErrnoError.prototype.constructor = _.ErrnoError, [44].forEach((t) => {
          _.genericErrors[t] = new _.ErrnoError(t), _.genericErrors[t].stack = "<generic error, no stack>";
        }));
      }, staticInit: () => {
        _.ensureErrnoError(), _.nameTable = new Array(4096), _.mount(L, {}, "/"), _.createDefaultDirectories(), _.createDefaultDevices(), _.createSpecialDirectories(), _.filesystems = { MEMFS: L };
      }, init: (t, n, a) => {
        _.init.initialized = !0, _.ensureErrnoError(), e.stdin = t || e.stdin, e.stdout = n || e.stdout, e.stderr = a || e.stderr, _.createStandardStreams();
      }, quit: () => {
        _.init.initialized = !1;
        for (var t = 0; t < _.streams.length; t++) {
          var n = _.streams[t];
          n && _.close(n);
        }
      }, getMode: (t, n) => {
        var a = 0;
        return t && (a |= 365), n && (a |= 146), a;
      }, findObject: (t, n) => {
        var a = _.analyzePath(t, n);
        return a.exists ? a.object : null;
      }, analyzePath: (t, n) => {
        try {
          var a = _.lookupPath(t, { follow: !n });
          t = a.path;
        } catch {
        }
        var s = { isRoot: !1, exists: !1, error: 0, name: null, path: null, object: null, parentExists: !1, parentPath: null, parentObject: null };
        try {
          var a = _.lookupPath(t, { parent: !0 });
          s.parentExists = !0, s.parentPath = a.path, s.parentObject = a.node, s.name = U.basename(t), a = _.lookupPath(t, { follow: !n }), s.exists = !0, s.path = a.path, s.object = a.node, s.name = a.node.name, s.isRoot = a.path === "/";
        } catch (o) {
          s.error = o.errno;
        }
        return s;
      }, createPath: (t, n, a, s) => {
        t = typeof t == "string" ? t : _.getPath(t);
        for (var o = n.split("/").reverse(); o.length; ) {
          var l = o.pop();
          if (l) {
            var c = U.join2(t, l);
            try {
              _.mkdir(c);
            } catch {
            }
            t = c;
          }
        }
        return c;
      }, createFile: (t, n, a, s, o) => {
        var l = U.join2(typeof t == "string" ? t : _.getPath(t), n), c = _.getMode(s, o);
        return _.create(l, c);
      }, createDataFile: (t, n, a, s, o, l) => {
        var c = n;
        t && (t = typeof t == "string" ? t : _.getPath(t), c = n ? U.join2(t, n) : t);
        var g = _.getMode(s, o), d = _.create(c, g);
        if (a) {
          if (typeof a == "string") {
            for (var h = new Array(a.length), v = 0, C = a.length; v < C; ++v)
              h[v] = a.charCodeAt(v);
            a = h;
          }
          _.chmod(d, g | 146);
          var D = _.open(d, 577);
          _.write(D, a, 0, a.length, 0, l), _.close(D), _.chmod(d, g);
        }
        return d;
      }, createDevice: (t, n, a, s) => {
        var o = U.join2(typeof t == "string" ? t : _.getPath(t), n), l = _.getMode(!!a, !!s);
        _.createDevice.major || (_.createDevice.major = 64);
        var c = _.makedev(_.createDevice.major++, 0);
        return _.registerDevice(c, { open: (g) => {
          g.seekable = !1;
        }, close: (g) => {
          s && s.buffer && s.buffer.length && s(10);
        }, read: (g, d, h, v, C) => {
          for (var D = 0, P = 0; P < v; P++) {
            var R;
            try {
              R = a();
            } catch {
              throw new _.ErrnoError(29);
            }
            if (R === void 0 && D === 0)
              throw new _.ErrnoError(6);
            if (R == null)
              break;
            D++, d[h + P] = R;
          }
          return D && (g.node.timestamp = Date.now()), D;
        }, write: (g, d, h, v, C) => {
          for (var D = 0; D < v; D++)
            try {
              s(d[h + D]);
            } catch {
              throw new _.ErrnoError(29);
            }
          return v && (g.node.timestamp = Date.now()), D;
        } }), _.mkdev(o, l, c);
      }, forceLoadFile: (t) => {
        if (t.isDevice || t.isFolder || t.link || t.contents)
          return !0;
        if (typeof XMLHttpRequest < "u")
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        if (Ke)
          try {
            t.contents = St(Ke(t.url), !0), t.usedBytes = t.contents.length;
          } catch {
            throw new _.ErrnoError(29);
          }
        else
          throw new Error("Cannot load without read() or XMLHttpRequest.");
      }, createLazyFile: (t, n, a, s, o) => {
        function l() {
          this.lengthKnown = !1, this.chunks = [];
        }
        if (l.prototype.get = function(P) {
          if (!(P > this.length - 1 || P < 0)) {
            var R = P % this.chunkSize, N = P / this.chunkSize | 0;
            return this.getter(N)[R];
          }
        }, l.prototype.setDataGetter = function(P) {
          this.getter = P;
        }, l.prototype.cacheLength = function() {
          var P = new XMLHttpRequest();
          if (P.open("HEAD", a, !1), P.send(null), !(P.status >= 200 && P.status < 300 || P.status === 304))
            throw new Error("Couldn't load " + a + ". Status: " + P.status);
          var R = Number(P.getResponseHeader("Content-length")), N, X = (N = P.getResponseHeader("Accept-Ranges")) && N === "bytes", q = (N = P.getResponseHeader("Content-Encoding")) && N === "gzip", I = 1024 * 1024;
          X || (I = R);
          var b = (F, ae) => {
            if (F > ae)
              throw new Error("invalid range (" + F + ", " + ae + ") or no bytes requested!");
            if (ae > R - 1)
              throw new Error("only " + R + " bytes available! programmer error!");
            var Z = new XMLHttpRequest();
            if (Z.open("GET", a, !1), R !== I && Z.setRequestHeader("Range", "bytes=" + F + "-" + ae), Z.responseType = "arraybuffer", Z.overrideMimeType && Z.overrideMimeType("text/plain; charset=x-user-defined"), Z.send(null), !(Z.status >= 200 && Z.status < 300 || Z.status === 304))
              throw new Error("Couldn't load " + a + ". Status: " + Z.status);
            return Z.response !== void 0 ? new Uint8Array(Z.response || []) : St(Z.responseText || "", !0);
          }, H = this;
          H.setDataGetter((F) => {
            var ae = F * I, Z = (F + 1) * I - 1;
            if (Z = Math.min(Z, R - 1), typeof H.chunks[F] > "u" && (H.chunks[F] = b(ae, Z)), typeof H.chunks[F] > "u")
              throw new Error("doXHR failed!");
            return H.chunks[F];
          }), (q || !R) && (I = R = 1, R = this.getter(0).length, I = R, $t("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = R, this._chunkSize = I, this.lengthKnown = !0;
        }, typeof XMLHttpRequest < "u") {
          if (!ge)
            throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
          var c = new l();
          Object.defineProperties(c, { length: { get: function() {
            return this.lengthKnown || this.cacheLength(), this._length;
          } }, chunkSize: { get: function() {
            return this.lengthKnown || this.cacheLength(), this._chunkSize;
          } } });
          var g = { isDevice: !1, contents: c };
        } else
          var g = { isDevice: !1, url: a };
        var d = _.createFile(t, n, g, s, o);
        g.contents ? d.contents = g.contents : g.url && (d.contents = null, d.url = g.url), Object.defineProperties(d, { usedBytes: { get: function() {
          return this.contents.length;
        } } });
        var h = {}, v = Object.keys(d.stream_ops);
        v.forEach((D) => {
          var P = d.stream_ops[D];
          h[D] = function() {
            return _.forceLoadFile(d), P.apply(null, arguments);
          };
        });
        function C(D, P, R, N, X) {
          var q = D.node.contents;
          if (X >= q.length)
            return 0;
          var I = Math.min(q.length - X, N);
          if (q.slice)
            for (var b = 0; b < I; b++)
              P[R + b] = q[X + b];
          else
            for (var b = 0; b < I; b++)
              P[R + b] = q.get(X + b);
          return I;
        }
        return h.read = (D, P, R, N, X) => (_.forceLoadFile(d), C(D, P, R, N, X)), h.mmap = (D, P, R, N, X) => {
          _.forceLoadFile(d);
          var q = Cn(P);
          if (!q)
            throw new _.ErrnoError(48);
          return C(D, V, q, P, R), { ptr: q, allocated: !0 };
        }, d.stream_ops = h, d;
      }, createPreloadedFile: (t, n, a, s, o, l, c, g, d, h) => {
        var v = n ? we.resolve(U.join2(t, n)) : t;
        function C(D) {
          function P(R) {
            h && h(), g || _.createDataFile(t, n, R, s, o, d), l && l(), et();
          }
          Browser.handledByPreloadPlugin(D, v, P, () => {
            c && c(), et();
          }) || P(D);
        }
        wt(), typeof a == "string" ? Vr(a, (D) => C(D), c) : C(a);
      } }, Pn = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0;
      function je(t, n, a) {
        for (var s = n + a, o = n; t[o] && !(o >= s); )
          ++o;
        if (o - n > 16 && t.buffer && Pn)
          return Pn.decode(t.subarray(n, o));
        for (var l = ""; n < o; ) {
          var c = t[n++];
          if (!(c & 128)) {
            l += String.fromCharCode(c);
            continue;
          }
          var g = t[n++] & 63;
          if ((c & 224) == 192) {
            l += String.fromCharCode((c & 31) << 6 | g);
            continue;
          }
          var d = t[n++] & 63;
          if ((c & 240) == 224 ? c = (c & 15) << 12 | g << 6 | d : c = (c & 7) << 18 | g << 12 | d << 6 | t[n++] & 63, c < 65536)
            l += String.fromCharCode(c);
          else {
            var h = c - 65536;
            l += String.fromCharCode(55296 | h >> 10, 56320 | h & 1023);
          }
        }
        return l;
      }
      function ke(t, n) {
        return t ? je(ee, t, n) : "";
      }
      var A = { DEFAULT_POLLMASK: 5, calculateAt: function(t, n, a) {
        if (U.isAbs(n))
          return n;
        var s;
        if (t === -100)
          s = _.cwd();
        else {
          var o = A.getStreamFromFD(t);
          s = o.path;
        }
        if (n.length == 0) {
          if (!a)
            throw new _.ErrnoError(44);
          return s;
        }
        return U.join2(s, n);
      }, doStat: function(t, n, a) {
        try {
          var s = t(n);
        } catch (g) {
          if (g && g.node && U.normalize(n) !== U.normalize(_.getPath(g.node)))
            return -54;
          throw g;
        }
        k[a >> 2] = s.dev, k[a + 8 >> 2] = s.ino, k[a + 12 >> 2] = s.mode, T[a + 16 >> 2] = s.nlink, k[a + 20 >> 2] = s.uid, k[a + 24 >> 2] = s.gid, k[a + 28 >> 2] = s.rdev, x = [s.size >>> 0, (G = s.size, +Math.abs(G) >= 1 ? G > 0 ? (Math.min(+Math.floor(G / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((G - +(~~G >>> 0)) / 4294967296) >>> 0 : 0)], k[a + 40 >> 2] = x[0], k[a + 44 >> 2] = x[1], k[a + 48 >> 2] = 4096, k[a + 52 >> 2] = s.blocks;
        var o = s.atime.getTime(), l = s.mtime.getTime(), c = s.ctime.getTime();
        return x = [Math.floor(o / 1e3) >>> 0, (G = Math.floor(o / 1e3), +Math.abs(G) >= 1 ? G > 0 ? (Math.min(+Math.floor(G / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((G - +(~~G >>> 0)) / 4294967296) >>> 0 : 0)], k[a + 56 >> 2] = x[0], k[a + 60 >> 2] = x[1], T[a + 64 >> 2] = o % 1e3 * 1e3, x = [Math.floor(l / 1e3) >>> 0, (G = Math.floor(l / 1e3), +Math.abs(G) >= 1 ? G > 0 ? (Math.min(+Math.floor(G / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((G - +(~~G >>> 0)) / 4294967296) >>> 0 : 0)], k[a + 72 >> 2] = x[0], k[a + 76 >> 2] = x[1], T[a + 80 >> 2] = l % 1e3 * 1e3, x = [Math.floor(c / 1e3) >>> 0, (G = Math.floor(c / 1e3), +Math.abs(G) >= 1 ? G > 0 ? (Math.min(+Math.floor(G / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((G - +(~~G >>> 0)) / 4294967296) >>> 0 : 0)], k[a + 88 >> 2] = x[0], k[a + 92 >> 2] = x[1], T[a + 96 >> 2] = c % 1e3 * 1e3, x = [s.ino >>> 0, (G = s.ino, +Math.abs(G) >= 1 ? G > 0 ? (Math.min(+Math.floor(G / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((G - +(~~G >>> 0)) / 4294967296) >>> 0 : 0)], k[a + 104 >> 2] = x[0], k[a + 108 >> 2] = x[1], 0;
      }, doMsync: function(t, n, a, s, o) {
        if (!_.isFile(n.node.mode))
          throw new _.ErrnoError(43);
        if (s & 2)
          return 0;
        var l = ee.slice(t, t + a);
        _.msync(n, l, o, a, s);
      }, varargs: void 0, get: function() {
        A.varargs += 4;
        var t = k[A.varargs - 4 >> 2];
        return t;
      }, getStr: function(t) {
        var n = ke(t);
        return n;
      }, getStreamFromFD: function(t) {
        var n = _.getStream(t);
        if (!n)
          throw new _.ErrnoError(8);
        return n;
      } };
      function Kr(t, n) {
        try {
          return t = A.getStr(t), _.chmod(t, n), 0;
        } catch (a) {
          if (typeof _ > "u" || a.name !== "ErrnoError")
            throw a;
          return -a.errno;
        }
      }
      var J = { mount: function(t) {
        return e.websocket = e.websocket && typeof e.websocket == "object" ? e.websocket : {}, e.websocket._callbacks = {}, e.websocket.on = function(n, a) {
          return typeof a == "function" && (this._callbacks[n] = a), this;
        }, e.websocket.emit = function(n, a) {
          typeof this._callbacks[n] == "function" && this._callbacks[n].call(this, a);
        }, _.createNode(null, "/", 16895, 0);
      }, createSocket: function(t, n, a) {
        n &= -526337;
        var s = n == 1;
        if (s && a && a != 6)
          throw new _.ErrnoError(66);
        var o = { family: t, type: n, protocol: a, server: null, error: null, peers: {}, pending: [], recv_queue: [], sock_ops: J.websocket_sock_ops }, l = J.nextname(), c = _.createNode(J.root, l, 49152, 0);
        c.sock = o;
        var g = _.createStream({ path: l, node: c, flags: 2, seekable: !1, stream_ops: J.stream_ops });
        return o.stream = g, o;
      }, getSocket: function(t) {
        var n = _.getStream(t);
        return !n || !_.isSocket(n.node.mode) ? null : n.node.sock;
      }, stream_ops: { poll: function(t) {
        var n = t.node.sock;
        return n.sock_ops.poll(n);
      }, ioctl: function(t, n, a) {
        var s = t.node.sock;
        return s.sock_ops.ioctl(s, n, a);
      }, read: function(t, n, a, s, o) {
        var l = t.node.sock, c = l.sock_ops.recvmsg(l, s);
        return c ? (n.set(c.buffer, a), c.buffer.length) : 0;
      }, write: function(t, n, a, s, o) {
        var l = t.node.sock;
        return l.sock_ops.sendmsg(l, n, a, s);
      }, close: function(t) {
        var n = t.node.sock;
        n.sock_ops.close(n);
      } }, nextname: function() {
        return J.nextname.current || (J.nextname.current = 0), "socket[" + J.nextname.current++ + "]";
      }, websocket_sock_ops: { createPeer: function(t, n, a) {
        var s;
        if (typeof n == "object" && (s = n, n = null, a = null), s)
          if (s._socket)
            n = s._socket.remoteAddress, a = s._socket.remotePort;
          else {
            var o = /ws[s]?:\/\/([^:]+):(\d+)/.exec(s.url);
            if (!o)
              throw new Error("WebSocket URL must be in the format ws(s)://address:port");
            n = o[1], a = parseInt(o[2], 10);
          }
        else
          try {
            var l = e.websocket && typeof e.websocket == "object", c = "ws:#".replace("#", "//");
            if (l && typeof e.websocket.url == "string" && (c = e.websocket.url), c === "ws://" || c === "wss://") {
              var g = n.split("/");
              c = c + g[0] + ":" + a + "/" + g.slice(1).join("/");
            }
            var d = "binary";
            l && typeof e.websocket.subprotocol == "string" && (d = e.websocket.subprotocol);
            var h = void 0;
            d !== "null" && (d = d.replace(/^ +| +$/g, "").split(/ *, */), h = d), l && e.websocket.subprotocol === null && (d = "null", h = void 0);
            var v;
            le ? v = require("ws") : v = WebSocket, s = new v(c, h), s.binaryType = "arraybuffer";
          } catch {
            throw new _.ErrnoError(23);
          }
        var C = { addr: n, port: a, socket: s, dgram_send_queue: [] };
        return J.websocket_sock_ops.addPeer(t, C), J.websocket_sock_ops.handlePeerEvents(t, C), t.type === 2 && typeof t.sport < "u" && C.dgram_send_queue.push(new Uint8Array([255, 255, 255, 255, "p".charCodeAt(0), "o".charCodeAt(0), "r".charCodeAt(0), "t".charCodeAt(0), (t.sport & 65280) >> 8, t.sport & 255])), C;
      }, getPeer: function(t, n, a) {
        return t.peers[n + ":" + a];
      }, addPeer: function(t, n) {
        t.peers[n.addr + ":" + n.port] = n;
      }, removePeer: function(t, n) {
        delete t.peers[n.addr + ":" + n.port];
      }, handlePeerEvents: function(t, n) {
        var a = !0, s = function() {
          e.websocket.emit("open", t.stream.fd);
          try {
            for (var l = n.dgram_send_queue.shift(); l; )
              n.socket.send(l), l = n.dgram_send_queue.shift();
          } catch {
            n.socket.close();
          }
        };
        function o(l) {
          if (typeof l == "string") {
            var c = new TextEncoder();
            l = c.encode(l);
          } else {
            if (dt(l.byteLength !== void 0), l.byteLength == 0)
              return;
            l = new Uint8Array(l);
          }
          var g = a;
          if (a = !1, g && l.length === 10 && l[0] === 255 && l[1] === 255 && l[2] === 255 && l[3] === 255 && l[4] === "p".charCodeAt(0) && l[5] === "o".charCodeAt(0) && l[6] === "r".charCodeAt(0) && l[7] === "t".charCodeAt(0)) {
            var d = l[8] << 8 | l[9];
            J.websocket_sock_ops.removePeer(t, n), n.port = d, J.websocket_sock_ops.addPeer(t, n);
            return;
          }
          t.recv_queue.push({ addr: n.addr, port: n.port, data: l }), e.websocket.emit("message", t.stream.fd);
        }
        le ? (n.socket.on("open", s), n.socket.on("message", function(l, c) {
          c && o(new Uint8Array(l).buffer);
        }), n.socket.on("close", function() {
          e.websocket.emit("close", t.stream.fd);
        }), n.socket.on("error", function(l) {
          t.error = 14, e.websocket.emit("error", [t.stream.fd, t.error, "ECONNREFUSED: Connection refused"]);
        })) : (n.socket.onopen = s, n.socket.onclose = function() {
          e.websocket.emit("close", t.stream.fd);
        }, n.socket.onmessage = function(c) {
          o(c.data);
        }, n.socket.onerror = function(l) {
          t.error = 14, e.websocket.emit("error", [t.stream.fd, t.error, "ECONNREFUSED: Connection refused"]);
        });
      }, poll: function(t) {
        if (t.type === 1 && t.server)
          return t.pending.length ? 65 : 0;
        var n = 0, a = t.type === 1 ? J.websocket_sock_ops.getPeer(t, t.daddr, t.dport) : null;
        return (t.recv_queue.length || !a || a && a.socket.readyState === a.socket.CLOSING || a && a.socket.readyState === a.socket.CLOSED) && (n |= 65), (!a || a && a.socket.readyState === a.socket.OPEN) && (n |= 4), (a && a.socket.readyState === a.socket.CLOSING || a && a.socket.readyState === a.socket.CLOSED) && (n |= 16), n;
      }, ioctl: function(t, n, a) {
        switch (n) {
          case 21531:
            var s = 0;
            return t.recv_queue.length && (s = t.recv_queue[0].data.length), k[a >> 2] = s, 0;
          default:
            return 28;
        }
      }, close: function(t) {
        if (t.server) {
          try {
            t.server.close();
          } catch {
          }
          t.server = null;
        }
        for (var n = Object.keys(t.peers), a = 0; a < n.length; a++) {
          var s = t.peers[n[a]];
          try {
            s.socket.close();
          } catch {
          }
          J.websocket_sock_ops.removePeer(t, s);
        }
        return 0;
      }, bind: function(t, n, a) {
        if (typeof t.saddr < "u" || typeof t.sport < "u")
          throw new _.ErrnoError(28);
        if (t.saddr = n, t.sport = a, t.type === 2) {
          t.server && (t.server.close(), t.server = null);
          try {
            t.sock_ops.listen(t, 0);
          } catch (s) {
            if (s.name !== "ErrnoError" || s.errno !== 138)
              throw s;
          }
        }
      }, connect: function(t, n, a) {
        if (t.server)
          throw new _.ErrnoError(138);
        if (typeof t.daddr < "u" && typeof t.dport < "u") {
          var s = J.websocket_sock_ops.getPeer(t, t.daddr, t.dport);
          if (s)
            throw s.socket.readyState === s.socket.CONNECTING ? new _.ErrnoError(7) : new _.ErrnoError(30);
        }
        var o = J.websocket_sock_ops.createPeer(t, n, a);
        throw t.daddr = o.addr, t.dport = o.port, new _.ErrnoError(26);
      }, listen: function(t, n) {
        if (!le)
          throw new _.ErrnoError(138);
        if (t.server)
          throw new _.ErrnoError(28);
        var a = require("ws").Server, s = t.saddr;
        t.server = new a({ host: s, port: t.sport }), e.websocket.emit("listen", t.stream.fd), t.server.on("connection", function(o) {
          if (t.type === 1) {
            var l = J.createSocket(t.family, t.type, t.protocol), c = J.websocket_sock_ops.createPeer(l, o);
            l.daddr = c.addr, l.dport = c.port, t.pending.push(l), e.websocket.emit("connection", l.stream.fd);
          } else
            J.websocket_sock_ops.createPeer(t, o), e.websocket.emit("connection", t.stream.fd);
        }), t.server.on("close", function() {
          e.websocket.emit("close", t.stream.fd), t.server = null;
        }), t.server.on("error", function(o) {
          t.error = 23, e.websocket.emit("error", [t.stream.fd, t.error, "EHOSTUNREACH: Host is unreachable"]);
        });
      }, accept: function(t) {
        if (!t.server || !t.pending.length)
          throw new _.ErrnoError(28);
        var n = t.pending.shift();
        return n.stream.flags = t.stream.flags, n;
      }, getname: function(t, n) {
        var a, s;
        if (n) {
          if (t.daddr === void 0 || t.dport === void 0)
            throw new _.ErrnoError(53);
          a = t.daddr, s = t.dport;
        } else
          a = t.saddr || 0, s = t.sport || 0;
        return { addr: a, port: s };
      }, sendmsg: function(t, n, a, s, o, l) {
        if (t.type === 2) {
          if ((o === void 0 || l === void 0) && (o = t.daddr, l = t.dport), o === void 0 || l === void 0)
            throw new _.ErrnoError(17);
        } else
          o = t.daddr, l = t.dport;
        var c = J.websocket_sock_ops.getPeer(t, o, l);
        if (t.type === 1) {
          if (!c || c.socket.readyState === c.socket.CLOSING || c.socket.readyState === c.socket.CLOSED)
            throw new _.ErrnoError(53);
          if (c.socket.readyState === c.socket.CONNECTING)
            throw new _.ErrnoError(6);
        }
        ArrayBuffer.isView(n) && (a += n.byteOffset, n = n.buffer);
        var g;
        if (g = n.slice(a, a + s), t.type === 2 && (!c || c.socket.readyState !== c.socket.OPEN))
          return (!c || c.socket.readyState === c.socket.CLOSING || c.socket.readyState === c.socket.CLOSED) && (c = J.websocket_sock_ops.createPeer(t, o, l)), c.dgram_send_queue.push(g), s;
        try {
          return c.socket.send(g), s;
        } catch {
          throw new _.ErrnoError(28);
        }
      }, recvmsg: function(t, n) {
        if (t.type === 1 && t.server)
          throw new _.ErrnoError(53);
        var a = t.recv_queue.shift();
        if (!a) {
          if (t.type === 1) {
            var s = J.websocket_sock_ops.getPeer(t, t.daddr, t.dport);
            if (!s)
              throw new _.ErrnoError(53);
            if (s.socket.readyState === s.socket.CLOSING || s.socket.readyState === s.socket.CLOSED)
              return null;
            throw new _.ErrnoError(6);
          }
          throw new _.ErrnoError(6);
        }
        var o = a.data.byteLength || a.data.length, l = a.data.byteOffset || 0, c = a.data.buffer || a.data, g = Math.min(n, o), d = { buffer: new Uint8Array(c, l, g), addr: a.addr, port: a.port };
        if (t.type === 1 && g < o) {
          var h = o - g;
          a.data = new Uint8Array(c, l + g, h), t.recv_queue.unshift(a);
        }
        return d;
      } } };
      function It(t) {
        var n = J.getSocket(t);
        if (!n)
          throw new _.ErrnoError(8);
        return n;
      }
      function bn(t) {
        return k[ir() >> 2] = t, t;
      }
      function Qt(t) {
        return (t & 255) + "." + (t >> 8 & 255) + "." + (t >> 16 & 255) + "." + (t >> 24 & 255);
      }
      function Gn(t) {
        var n = "", a = 0, s = 0, o = 0, l = 0, c = 0, g = 0, d = [t[0] & 65535, t[0] >> 16, t[1] & 65535, t[1] >> 16, t[2] & 65535, t[2] >> 16, t[3] & 65535, t[3] >> 16], h = !0, v = "";
        for (g = 0; g < 5; g++)
          if (d[g] !== 0) {
            h = !1;
            break;
          }
        if (h) {
          if (v = Qt(d[6] | d[7] << 16), d[5] === -1)
            return n = "::ffff:", n += v, n;
          if (d[5] === 0)
            return n = "::", v === "0.0.0.0" && (v = ""), v === "0.0.0.1" && (v = "1"), n += v, n;
        }
        for (a = 0; a < 8; a++)
          d[a] === 0 && (a - o > 1 && (c = 0), o = a, c++), c > s && (s = c, l = a - s + 1);
        for (a = 0; a < 8; a++) {
          if (s > 1 && d[a] === 0 && a >= l && a < l + s) {
            a === l && (n += ":", l === 0 && (n += ":"));
            continue;
          }
          n += Number(_n(d[a] & 65535)).toString(16), n += a < 7 ? ":" : "";
        }
        return n;
      }
      function Qr(t, n) {
        var a = te[t >> 1], s = _n(He[t + 2 >> 1]), o;
        switch (a) {
          case 2:
            if (n !== 16)
              return { errno: 28 };
            o = k[t + 4 >> 2], o = Qt(o);
            break;
          case 10:
            if (n !== 28)
              return { errno: 28 };
            o = [k[t + 8 >> 2], k[t + 12 >> 2], k[t + 16 >> 2], k[t + 20 >> 2]], o = Gn(o);
            break;
          default:
            return { errno: 5 };
        }
        return { family: a, addr: o, port: s };
      }
      function Mt(t) {
        for (var n = t.split("."), a = 0; a < 4; a++) {
          var s = Number(n[a]);
          if (isNaN(s))
            return null;
          n[a] = s;
        }
        return (n[0] | n[1] << 8 | n[2] << 16 | n[3] << 24) >>> 0;
      }
      function Dt(t) {
        return parseInt(t);
      }
      function Jt(t) {
        var n, a, s, o, l = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i, c = [];
        if (!l.test(t))
          return null;
        if (t === "::")
          return [0, 0, 0, 0, 0, 0, 0, 0];
        for (t.startsWith("::") ? t = t.replace("::", "Z:") : t = t.replace("::", ":Z:"), t.indexOf(".") > 0 ? (t = t.replace(new RegExp("[.]", "g"), ":"), n = t.split(":"), n[n.length - 4] = Dt(n[n.length - 4]) + Dt(n[n.length - 3]) * 256, n[n.length - 3] = Dt(n[n.length - 2]) + Dt(n[n.length - 1]) * 256, n = n.slice(0, n.length - 2)) : n = t.split(":"), s = 0, o = 0, a = 0; a < n.length; a++)
          if (typeof n[a] == "string")
            if (n[a] === "Z") {
              for (o = 0; o < 8 - n.length + 1; o++)
                c[a + o] = 0;
              s = o - 1;
            } else
              c[a + s] = Wt(parseInt(n[a], 16));
          else
            c[a + s] = n[a];
        return [c[1] << 16 | c[0], c[3] << 16 | c[2], c[5] << 16 | c[4], c[7] << 16 | c[6]];
      }
      var fe = { address_map: { id: 1, addrs: {}, names: {} }, lookup_name: function(t) {
        var n = Mt(t);
        if (n !== null || (n = Jt(t), n !== null))
          return t;
        var a;
        if (fe.address_map.addrs[t])
          a = fe.address_map.addrs[t];
        else {
          var s = fe.address_map.id++;
          dt(s < 65535, "exceeded max address mappings of 65535"), a = "172.29." + (s & 255) + "." + (s & 65280), fe.address_map.names[a] = t, fe.address_map.addrs[t] = a;
        }
        return a;
      }, lookup_addr: function(t) {
        return fe.address_map.names[t] ? fe.address_map.names[t] : null;
      } };
      function En(t, n, a) {
        if (a && t === 0)
          return null;
        var s = Qr(t, n);
        if (s.errno)
          throw new _.ErrnoError(s.errno);
        return s.addr = fe.lookup_addr(s.addr) || s.addr, s;
      }
      function Jr(t, n, a, s, o, l) {
        try {
          var c = It(t), g = En(n, a);
          return c.sock_ops.connect(c, g.addr, g.port), 0;
        } catch (d) {
          if (typeof _ > "u" || d.name !== "ErrnoError")
            throw d;
          return -d.errno;
        }
      }
      function Zr(t) {
        try {
          var n = A.getStreamFromFD(t);
          return _.createStream(n, 0).fd;
        } catch (a) {
          if (typeof _ > "u" || a.name !== "ErrnoError")
            throw a;
          return -a.errno;
        }
      }
      function Or(t, n, a, s) {
        try {
          if (n = A.getStr(n), n = A.calculateAt(t, n), a & -8)
            return -28;
          var o = _.lookupPath(n, { follow: !0 }), l = o.node;
          if (!l)
            return -44;
          var c = "";
          return a & 4 && (c += "r"), a & 2 && (c += "w"), a & 1 && (c += "x"), c && _.nodePermissions(l, c) ? -2 : 0;
        } catch (g) {
          if (typeof _ > "u" || g.name !== "ErrnoError")
            throw g;
          return -g.errno;
        }
      }
      function tt(t, n) {
        return n + 2097152 >>> 0 < 4194305 - !!t ? (t >>> 0) + n * 4294967296 : NaN;
      }
      function ea(t, n, a, s, o, l) {
        try {
          var c = tt(a, s);
          if (isNaN(c))
            return -61;
          var g = tt(o, l);
          if (isNaN(g))
            return -61;
          var d = A.getStreamFromFD(t);
          return _.allocate(d, c, g), 0;
        } catch (h) {
          if (typeof _ > "u" || h.name !== "ErrnoError")
            throw h;
          return -h.errno;
        }
      }
      function ta(t, n) {
        try {
          return _.fchmod(t, n), 0;
        } catch (a) {
          if (typeof _ > "u" || a.name !== "ErrnoError")
            throw a;
          return -a.errno;
        }
      }
      function na(t, n, a) {
        A.varargs = a;
        try {
          var s = A.getStreamFromFD(t);
          switch (n) {
            case 0: {
              var o = A.get();
              if (o < 0)
                return -28;
              var l;
              return l = _.createStream(s, o), l.fd;
            }
            case 1:
            case 2:
              return 0;
            case 3:
              return s.flags;
            case 4: {
              var o = A.get();
              return s.flags |= o, 0;
            }
            case 5: {
              var o = A.get(), c = 0;
              return te[o + c >> 1] = 2, 0;
            }
            case 6:
            case 7:
              return 0;
            case 16:
            case 8:
              return -28;
            case 9:
              return bn(28), -1;
            default:
              return -28;
          }
        } catch (g) {
          if (typeof _ > "u" || g.name !== "ErrnoError")
            throw g;
          return -g.errno;
        }
      }
      function ra(t, n) {
        try {
          var a = A.getStreamFromFD(t);
          return A.doStat(_.stat, a.path, n);
        } catch (s) {
          if (typeof _ > "u" || s.name !== "ErrnoError")
            throw s;
          return -s.errno;
        }
      }
      function Ye(t, n, a) {
        return Vt(t, ee, n, a);
      }
      function aa(t, n) {
        try {
          if (n === 0)
            return -28;
          var a = _.cwd(), s = Le(a) + 1;
          return n < s ? -68 : (Ye(a, t, n), s);
        } catch (o) {
          if (typeof _ > "u" || o.name !== "ErrnoError")
            throw o;
          return -o.errno;
        }
      }
      function ia(t, n, a) {
        try {
          var s = A.getStreamFromFD(t);
          s.getdents || (s.getdents = _.readdir(s.path));
          for (var o = 280, l = 0, c = _.llseek(s, 0, 1), g = Math.floor(c / o); g < s.getdents.length && l + o <= a; ) {
            var d, h, v = s.getdents[g];
            if (v === ".")
              d = s.node.id, h = 4;
            else if (v === "..") {
              var C = _.lookupPath(s.path, { parent: !0 });
              d = C.node.id, h = 4;
            } else {
              var D = _.lookupNode(s.node, v);
              d = D.id, h = _.isChrdev(D.mode) ? 2 : _.isDir(D.mode) ? 4 : _.isLink(D.mode) ? 10 : 8;
            }
            x = [d >>> 0, (G = d, +Math.abs(G) >= 1 ? G > 0 ? (Math.min(+Math.floor(G / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((G - +(~~G >>> 0)) / 4294967296) >>> 0 : 0)], k[n + l >> 2] = x[0], k[n + l + 4 >> 2] = x[1], x = [(g + 1) * o >>> 0, (G = (g + 1) * o, +Math.abs(G) >= 1 ? G > 0 ? (Math.min(+Math.floor(G / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((G - +(~~G >>> 0)) / 4294967296) >>> 0 : 0)], k[n + l + 8 >> 2] = x[0], k[n + l + 12 >> 2] = x[1], te[n + l + 16 >> 1] = 280, V[n + l + 18 >> 0] = h, Ye(v, n + l + 19, 256), l += o, g += 1;
          }
          return _.llseek(s, g * o, 0), l;
        } catch (P) {
          if (typeof _ > "u" || P.name !== "ErrnoError")
            throw P;
          return -P.errno;
        }
      }
      function sa(t, n, a, s, o, l) {
        try {
          var c = It(t);
          return n === 1 && a === 4 ? (k[s >> 2] = c.error, k[o >> 2] = 4, c.error = null, 0) : -50;
        } catch (g) {
          if (typeof _ > "u" || g.name !== "ErrnoError")
            throw g;
          return -g.errno;
        }
      }
      function ua(t, n, a) {
        A.varargs = a;
        try {
          var s = A.getStreamFromFD(t);
          switch (n) {
            case 21509:
            case 21505:
              return s.tty ? 0 : -59;
            case 21510:
            case 21511:
            case 21512:
            case 21506:
            case 21507:
            case 21508:
              return s.tty ? 0 : -59;
            case 21519: {
              if (!s.tty)
                return -59;
              var o = A.get();
              return k[o >> 2] = 0, 0;
            }
            case 21520:
              return s.tty ? -28 : -59;
            case 21531: {
              var o = A.get();
              return _.ioctl(s, n, o);
            }
            case 21523:
              return s.tty ? 0 : -59;
            case 21524:
              return s.tty ? 0 : -59;
            default:
              return -28;
          }
        } catch (l) {
          if (typeof _ > "u" || l.name !== "ErrnoError")
            throw l;
          return -l.errno;
        }
      }
      function oa(t, n) {
        try {
          return t = A.getStr(t), A.doStat(_.lstat, t, n);
        } catch (a) {
          if (typeof _ > "u" || a.name !== "ErrnoError")
            throw a;
          return -a.errno;
        }
      }
      function _a(t, n, a, s) {
        try {
          n = A.getStr(n);
          var o = s & 256, l = s & 4096;
          return s = s & -6401, n = A.calculateAt(t, n, l), A.doStat(o ? _.lstat : _.stat, n, a);
        } catch (c) {
          if (typeof _ > "u" || c.name !== "ErrnoError")
            throw c;
          return -c.errno;
        }
      }
      function la(t, n, a, s) {
        A.varargs = s;
        try {
          n = A.getStr(n), n = A.calculateAt(t, n);
          var o = s ? A.get() : 0;
          return _.open(n, a, o).fd;
        } catch (l) {
          if (typeof _ > "u" || l.name !== "ErrnoError")
            throw l;
          return -l.errno;
        }
      }
      function ca(t, n, a) {
        try {
          for (var s = 0, o = 0; o < n; o++) {
            var l = t + 8 * o, c = k[l >> 2], g = te[l + 4 >> 1], d = 32, h = _.getStream(c);
            h && (d = A.DEFAULT_POLLMASK, h.stream_ops.poll && (d = h.stream_ops.poll(h))), d &= g | 8 | 16, d && s++, te[l + 6 >> 1] = d;
          }
          return s;
        } catch (v) {
          if (typeof _ > "u" || v.name !== "ErrnoError")
            throw v;
          return -v.errno;
        }
      }
      function ga(t, n, a, s) {
        try {
          if (n = A.getStr(n), n = A.calculateAt(t, n), s <= 0)
            return -28;
          var o = _.readlink(n), l = Math.min(s, Le(o)), c = V[a + l];
          return Ye(o, a, s + 1), V[a + l] = c, l;
        } catch (g) {
          if (typeof _ > "u" || g.name !== "ErrnoError")
            throw g;
          return -g.errno;
        }
      }
      function Rn(t, n, a, s, o) {
        switch (n) {
          case 2:
            a = Mt(a), Kt(t, 16), o && (k[o >> 2] = 16), te[t >> 1] = n, k[t + 4 >> 2] = a, te[t + 2 >> 1] = Wt(s);
            break;
          case 10:
            a = Jt(a), Kt(t, 28), o && (k[o >> 2] = 28), k[t >> 2] = n, k[t + 8 >> 2] = a[0], k[t + 12 >> 2] = a[1], k[t + 16 >> 2] = a[2], k[t + 20 >> 2] = a[3], te[t + 2 >> 1] = Wt(s);
            break;
          default:
            return 5;
        }
        return 0;
      }
      function fa(t, n, a, s, o, l) {
        try {
          var c = It(t), g = c.sock_ops.recvmsg(c, a);
          if (!g)
            return 0;
          if (o)
            var d = Rn(o, c.family, fe.lookup_name(g.addr), g.port, l);
          return ee.set(g.buffer, n), g.buffer.byteLength;
        } catch (h) {
          if (typeof _ > "u" || h.name !== "ErrnoError")
            throw h;
          return -h.errno;
        }
      }
      function ma(t) {
        try {
          return t = A.getStr(t), _.rmdir(t), 0;
        } catch (n) {
          if (typeof _ > "u" || n.name !== "ErrnoError")
            throw n;
          return -n.errno;
        }
      }
      function pa(t, n, a, s, o, l) {
        try {
          var c = It(t), g = En(o, l, !0);
          return g ? c.sock_ops.sendmsg(c, V, n, a, g.addr, g.port) : _.write(c.stream, V, n, a);
        } catch (d) {
          if (typeof _ > "u" || d.name !== "ErrnoError")
            throw d;
          return -d.errno;
        }
      }
      function da(t, n, a) {
        try {
          var s = J.createSocket(t, n, a);
          return s.stream.fd;
        } catch (o) {
          if (typeof _ > "u" || o.name !== "ErrnoError")
            throw o;
          return -o.errno;
        }
      }
      function ha(t, n) {
        try {
          return t = A.getStr(t), A.doStat(_.stat, t, n);
        } catch (a) {
          if (typeof _ > "u" || a.name !== "ErrnoError")
            throw a;
          return -a.errno;
        }
      }
      function ya(t, n) {
        try {
          return t = A.getStr(t), n = A.getStr(n), _.symlink(t, n), 0;
        } catch (a) {
          if (typeof _ > "u" || a.name !== "ErrnoError")
            throw a;
          return -a.errno;
        }
      }
      function wa(t, n, a) {
        try {
          return n = A.getStr(n), n = A.calculateAt(t, n), a === 0 ? _.unlink(n) : a === 512 ? _.rmdir(n) : ye("Invalid flags passed to unlinkat"), 0;
        } catch (s) {
          if (typeof _ > "u" || s.name !== "ErrnoError")
            throw s;
          return -s.errno;
        }
      }
      var Ct = {};
      function An(t) {
        for (; t.length; ) {
          var n = t.pop(), a = t.pop();
          a(n);
        }
      }
      function nt(t) {
        return this.fromWireType(k[t >> 2]);
      }
      var $e = {}, Be = {}, Pt = {}, ka = 48, va = 57;
      function Zt(t) {
        if (t === void 0)
          return "_unknown";
        t = t.replace(/[^a-zA-Z0-9_]/g, "$");
        var n = t.charCodeAt(0);
        return n >= ka && n <= va ? "_" + t : t;
      }
      function bt(t, n) {
        return t = Zt(t), { [t]: function() {
          return n.apply(this, arguments);
        } }[t];
      }
      function Ot(t, n) {
        var a = bt(n, function(s) {
          this.name = n, this.message = s;
          var o = new Error(s).stack;
          o !== void 0 && (this.stack = this.toString() + `
` + o.replace(/^Error(:[^\n]*)?\n/, ""));
        });
        return a.prototype = Object.create(t.prototype), a.prototype.constructor = a, a.prototype.toString = function() {
          return this.message === void 0 ? this.name : this.name + ": " + this.message;
        }, a;
      }
      var Tn = void 0;
      function Gt(t) {
        throw new Tn(t);
      }
      function en(t, n, a) {
        t.forEach(function(g) {
          Pt[g] = n;
        });
        function s(g) {
          var d = a(g);
          d.length !== t.length && Gt("Mismatched type converter count");
          for (var h = 0; h < t.length; ++h)
            me(t[h], d[h]);
        }
        var o = new Array(n.length), l = [], c = 0;
        n.forEach((g, d) => {
          Be.hasOwnProperty(g) ? o[d] = Be[g] : (l.push(g), $e.hasOwnProperty(g) || ($e[g] = []), $e[g].push(() => {
            o[d] = Be[g], ++c, c === l.length && s(o);
          }));
        }), l.length === 0 && s(o);
      }
      function Sa(t) {
        var n = Ct[t];
        delete Ct[t];
        var a = n.rawConstructor, s = n.rawDestructor, o = n.fields, l = o.map((c) => c.getterReturnType).concat(o.map((c) => c.setterArgumentType));
        en([t], l, (c) => {
          var g = {};
          return o.forEach((d, h) => {
            var v = d.fieldName, C = c[h], D = d.getter, P = d.getterContext, R = c[h + o.length], N = d.setter, X = d.setterContext;
            g[v] = { read: (q) => C.fromWireType(D(P, q)), write: (q, I) => {
              var b = [];
              N(X, q, R.toWireType(b, I)), An(b);
            } };
          }), [{ name: n.name, fromWireType: function(d) {
            var h = {};
            for (var v in g)
              h[v] = g[v].read(d);
            return s(d), h;
          }, toWireType: function(d, h) {
            for (var v in g)
              if (!(v in h))
                throw new TypeError('Missing field:  "' + v + '"');
            var C = a();
            for (v in g)
              g[v].write(C, h[v]);
            return d !== null && d.push(s, C), C;
          }, argPackAdvance: 8, readValueFromPointer: nt, destructorFunction: s }];
        });
      }
      function Ia(t, n, a, s, o) {
      }
      function Et(t) {
        switch (t) {
          case 1:
            return 0;
          case 2:
            return 1;
          case 4:
            return 2;
          case 8:
            return 3;
          default:
            throw new TypeError("Unknown type size: " + t);
        }
      }
      function Ma() {
        for (var t = new Array(256), n = 0; n < 256; ++n)
          t[n] = String.fromCharCode(n);
        Ln = t;
      }
      var Ln = void 0;
      function ne(t) {
        for (var n = "", a = t; ee[a]; )
          n += Ln[ee[a++]];
        return n;
      }
      var rt = void 0;
      function z(t) {
        throw new rt(t);
      }
      function me(t, n, a = {}) {
        if (!("argPackAdvance" in n))
          throw new TypeError("registerType registeredInstance requires argPackAdvance");
        var s = n.name;
        if (t || z('type "' + s + '" must have a positive integer typeid pointer'), Be.hasOwnProperty(t)) {
          if (a.ignoreDuplicateRegistrations)
            return;
          z("Cannot register type '" + s + "' twice");
        }
        if (Be[t] = n, delete Pt[t], $e.hasOwnProperty(t)) {
          var o = $e[t];
          delete $e[t], o.forEach((l) => l());
        }
      }
      function Da(t, n, a, s, o) {
        var l = Et(a);
        n = ne(n), me(t, { name: n, fromWireType: function(c) {
          return !!c;
        }, toWireType: function(c, g) {
          return g ? s : o;
        }, argPackAdvance: 8, readValueFromPointer: function(c) {
          var g;
          if (a === 1)
            g = V;
          else if (a === 2)
            g = te;
          else if (a === 4)
            g = k;
          else
            throw new TypeError("Unknown boolean type size: " + n);
          return this.fromWireType(g[c >> l]);
        }, destructorFunction: null });
      }
      function Ca(t) {
        if (!(this instanceof be) || !(t instanceof be))
          return !1;
        for (var n = this.$$.ptrType.registeredClass, a = this.$$.ptr, s = t.$$.ptrType.registeredClass, o = t.$$.ptr; n.baseClass; )
          a = n.upcast(a), n = n.baseClass;
        for (; s.baseClass; )
          o = s.upcast(o), s = s.baseClass;
        return n === s && a === o;
      }
      function Pa(t) {
        return { count: t.count, deleteScheduled: t.deleteScheduled, preservePointerOnDelete: t.preservePointerOnDelete, ptr: t.ptr, ptrType: t.ptrType, smartPtr: t.smartPtr, smartPtrType: t.smartPtrType };
      }
      function tn(t) {
        function n(a) {
          return a.$$.ptrType.registeredClass.name;
        }
        z(n(t) + " instance already deleted");
      }
      var nn = !1;
      function Wn(t) {
      }
      function ba(t) {
        t.smartPtr ? t.smartPtrType.rawDestructor(t.smartPtr) : t.ptrType.registeredClass.rawDestructor(t.ptr);
      }
      function Bn(t) {
        t.count.value -= 1;
        var n = t.count.value === 0;
        n && ba(t);
      }
      function xn(t, n, a) {
        if (n === a)
          return t;
        if (a.baseClass === void 0)
          return null;
        var s = xn(t, n, a.baseClass);
        return s === null ? null : a.downcast(s);
      }
      var Nn = {};
      function Ga() {
        return Object.keys(st).length;
      }
      function Ea() {
        var t = [];
        for (var n in st)
          st.hasOwnProperty(n) && t.push(st[n]);
        return t;
      }
      var at = [];
      function rn() {
        for (; at.length; ) {
          var t = at.pop();
          t.$$.deleteScheduled = !1, t.delete();
        }
      }
      var it = void 0;
      function Ra(t) {
        it = t, at.length && it && it(rn);
      }
      function Aa() {
        e.getInheritedInstanceCount = Ga, e.getLiveInheritedInstances = Ea, e.flushPendingDeletes = rn, e.setDelayFunction = Ra;
      }
      var st = {};
      function Ta(t, n) {
        for (n === void 0 && z("ptr should not be undefined"); t.baseClass; )
          n = t.upcast(n), t = t.baseClass;
        return n;
      }
      function La(t, n) {
        return n = Ta(t, n), st[n];
      }
      function Rt(t, n) {
        (!n.ptrType || !n.ptr) && Gt("makeClassHandle requires ptr and ptrType");
        var a = !!n.smartPtrType, s = !!n.smartPtr;
        return a !== s && Gt("Both smartPtrType and smartPtr must be specified"), n.count = { value: 1 }, ut(Object.create(t, { $$: { value: n } }));
      }
      function Wa(t) {
        var n = this.getPointee(t);
        if (!n)
          return this.destructor(t), null;
        var a = La(this.registeredClass, n);
        if (a !== void 0) {
          if (a.$$.count.value === 0)
            return a.$$.ptr = n, a.$$.smartPtr = t, a.clone();
          var s = a.clone();
          return this.destructor(t), s;
        }
        function o() {
          return this.isSmartPointer ? Rt(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: n, smartPtrType: this, smartPtr: t }) : Rt(this.registeredClass.instancePrototype, { ptrType: this, ptr: t });
        }
        var l = this.registeredClass.getActualType(n), c = Nn[l];
        if (!c)
          return o.call(this);
        var g;
        this.isConst ? g = c.constPointerType : g = c.pointerType;
        var d = xn(n, this.registeredClass, g.registeredClass);
        return d === null ? o.call(this) : this.isSmartPointer ? Rt(g.registeredClass.instancePrototype, { ptrType: g, ptr: d, smartPtrType: this, smartPtr: t }) : Rt(g.registeredClass.instancePrototype, { ptrType: g, ptr: d });
      }
      function ut(t) {
        return typeof FinalizationRegistry > "u" ? (ut = (n) => n, t) : (nn = new FinalizationRegistry((n) => {
          Bn(n.$$);
        }), ut = (n) => {
          var a = n.$$, s = !!a.smartPtr;
          if (s) {
            var o = { $$: a };
            nn.register(n, o, n);
          }
          return n;
        }, Wn = (n) => nn.unregister(n), ut(t));
      }
      function Ba() {
        if (this.$$.ptr || tn(this), this.$$.preservePointerOnDelete)
          return this.$$.count.value += 1, this;
        var t = ut(Object.create(Object.getPrototypeOf(this), { $$: { value: Pa(this.$$) } }));
        return t.$$.count.value += 1, t.$$.deleteScheduled = !1, t;
      }
      function xa() {
        this.$$.ptr || tn(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && z("Object already scheduled for deletion"), Wn(this), Bn(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
      }
      function Na() {
        return !this.$$.ptr;
      }
      function za() {
        return this.$$.ptr || tn(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && z("Object already scheduled for deletion"), at.push(this), at.length === 1 && it && it(rn), this.$$.deleteScheduled = !0, this;
      }
      function Ha() {
        be.prototype.isAliasOf = Ca, be.prototype.clone = Ba, be.prototype.delete = xa, be.prototype.isDeleted = Na, be.prototype.deleteLater = za;
      }
      function be() {
      }
      function Fa(t, n, a) {
        if (t[n].overloadTable === void 0) {
          var s = t[n];
          t[n] = function() {
            return t[n].overloadTable.hasOwnProperty(arguments.length) || z("Function '" + a + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + t[n].overloadTable + ")!"), t[n].overloadTable[arguments.length].apply(this, arguments);
          }, t[n].overloadTable = [], t[n].overloadTable[s.argCount] = s;
        }
      }
      function an(t, n, a) {
        e.hasOwnProperty(t) ? ((a === void 0 || e[t].overloadTable !== void 0 && e[t].overloadTable[a] !== void 0) && z("Cannot register public name '" + t + "' twice"), Fa(e, t, t), e.hasOwnProperty(a) && z("Cannot register multiple overloads of a function with the same number of arguments (" + a + ")!"), e[t].overloadTable[a] = n) : (e[t] = n, a !== void 0 && (e[t].numArguments = a));
      }
      function Ua(t, n, a, s, o, l, c, g) {
        this.name = t, this.constructor = n, this.instancePrototype = a, this.rawDestructor = s, this.baseClass = o, this.getActualType = l, this.upcast = c, this.downcast = g, this.pureVirtualFunctions = [];
      }
      function sn(t, n, a) {
        for (; n !== a; )
          n.upcast || z("Expected null or instance of " + a.name + ", got an instance of " + n.name), t = n.upcast(t), n = n.baseClass;
        return t;
      }
      function ja(t, n) {
        if (n === null)
          return this.isReference && z("null is not a valid " + this.name), 0;
        n.$$ || z('Cannot pass "' + un(n) + '" as a ' + this.name), n.$$.ptr || z("Cannot pass deleted object as a pointer of type " + this.name);
        var a = n.$$.ptrType.registeredClass, s = sn(n.$$.ptr, a, this.registeredClass);
        return s;
      }
      function Ya(t, n) {
        var a;
        if (n === null)
          return this.isReference && z("null is not a valid " + this.name), this.isSmartPointer ? (a = this.rawConstructor(), t !== null && t.push(this.rawDestructor, a), a) : 0;
        n.$$ || z('Cannot pass "' + un(n) + '" as a ' + this.name), n.$$.ptr || z("Cannot pass deleted object as a pointer of type " + this.name), !this.isConst && n.$$.ptrType.isConst && z("Cannot convert argument of type " + (n.$$.smartPtrType ? n.$$.smartPtrType.name : n.$$.ptrType.name) + " to parameter type " + this.name);
        var s = n.$$.ptrType.registeredClass;
        if (a = sn(n.$$.ptr, s, this.registeredClass), this.isSmartPointer)
          switch (n.$$.smartPtr === void 0 && z("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
            case 0:
              n.$$.smartPtrType === this ? a = n.$$.smartPtr : z("Cannot convert argument of type " + (n.$$.smartPtrType ? n.$$.smartPtrType.name : n.$$.ptrType.name) + " to parameter type " + this.name);
              break;
            case 1:
              a = n.$$.smartPtr;
              break;
            case 2:
              if (n.$$.smartPtrType === this)
                a = n.$$.smartPtr;
              else {
                var o = n.clone();
                a = this.rawShare(a, pe.toHandle(function() {
                  o.delete();
                })), t !== null && t.push(this.rawDestructor, a);
              }
              break;
            default:
              z("Unsupporting sharing policy");
          }
        return a;
      }
      function $a(t, n) {
        if (n === null)
          return this.isReference && z("null is not a valid " + this.name), 0;
        n.$$ || z('Cannot pass "' + un(n) + '" as a ' + this.name), n.$$.ptr || z("Cannot pass deleted object as a pointer of type " + this.name), n.$$.ptrType.isConst && z("Cannot convert argument of type " + n.$$.ptrType.name + " to parameter type " + this.name);
        var a = n.$$.ptrType.registeredClass, s = sn(n.$$.ptr, a, this.registeredClass);
        return s;
      }
      function Xa(t) {
        return this.rawGetPointee && (t = this.rawGetPointee(t)), t;
      }
      function qa(t) {
        this.rawDestructor && this.rawDestructor(t);
      }
      function Va(t) {
        t !== null && t.delete();
      }
      function Ka() {
        ve.prototype.getPointee = Xa, ve.prototype.destructor = qa, ve.prototype.argPackAdvance = 8, ve.prototype.readValueFromPointer = nt, ve.prototype.deleteObject = Va, ve.prototype.fromWireType = Wa;
      }
      function ve(t, n, a, s, o, l, c, g, d, h, v) {
        this.name = t, this.registeredClass = n, this.isReference = a, this.isConst = s, this.isSmartPointer = o, this.pointeeType = l, this.sharingPolicy = c, this.rawGetPointee = g, this.rawConstructor = d, this.rawShare = h, this.rawDestructor = v, !o && n.baseClass === void 0 ? s ? (this.toWireType = ja, this.destructorFunction = null) : (this.toWireType = $a, this.destructorFunction = null) : this.toWireType = Ya;
      }
      function zn(t, n, a) {
        e.hasOwnProperty(t) || Gt("Replacing nonexistant public symbol"), e[t].overloadTable !== void 0 && a !== void 0 ? e[t].overloadTable[a] = n : (e[t] = n, e[t].argCount = a);
      }
      function Qa(t, n, a) {
        var s = e["dynCall_" + t];
        return a && a.length ? s.apply(null, [n].concat(a)) : s.call(null, n);
      }
      function Ja(t, n, a) {
        if (t.includes("j"))
          return Qa(t, n, a);
        var s = K(n).apply(null, a);
        return s;
      }
      function Za(t, n) {
        var a = [];
        return function() {
          return a.length = 0, Object.assign(a, arguments), Ja(t, n, a);
        };
      }
      function Se(t, n) {
        t = ne(t);
        function a() {
          return t.includes("j") ? Za(t, n) : K(n);
        }
        var s = a();
        return typeof s != "function" && z("unknown function pointer with signature " + t + ": " + n), s;
      }
      var Hn = void 0;
      function Fn(t) {
        var n = sr(t), a = ne(n);
        return Ie(n), a;
      }
      function Un(t, n) {
        var a = [], s = {};
        function o(l) {
          if (!s[l] && !Be[l]) {
            if (Pt[l]) {
              Pt[l].forEach(o);
              return;
            }
            a.push(l), s[l] = !0;
          }
        }
        throw n.forEach(o), new Hn(t + ": " + a.map(Fn).join([", "]));
      }
      function Oa(t, n, a, s, o, l, c, g, d, h, v, C, D) {
        v = ne(v), l = Se(o, l), g && (g = Se(c, g)), h && (h = Se(d, h)), D = Se(C, D);
        var P = Zt(v);
        an(P, function() {
          Un("Cannot construct " + v + " due to unbound types", [s]);
        }), en([t, n, a], s ? [s] : [], function(R) {
          R = R[0];
          var N, X;
          s ? (N = R.registeredClass, X = N.instancePrototype) : X = be.prototype;
          var q = bt(P, function() {
            if (Object.getPrototypeOf(this) !== I)
              throw new rt("Use 'new' to construct " + v);
            if (b.constructor_body === void 0)
              throw new rt(v + " has no accessible constructor");
            var Z = b.constructor_body[arguments.length];
            if (Z === void 0)
              throw new rt("Tried to invoke ctor of " + v + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(b.constructor_body).toString() + ") parameters instead!");
            return Z.apply(this, arguments);
          }), I = Object.create(X, { constructor: { value: q } });
          q.prototype = I;
          var b = new Ua(v, q, I, D, N, l, g, h), H = new ve(v, b, !0, !1, !1), F = new ve(v + "*", b, !1, !1, !1), ae = new ve(v + " const*", b, !1, !0, !1);
          return Nn[t] = { pointerType: F, constPointerType: ae }, zn(P, q), [H, F, ae];
        });
      }
      function ei() {
        this.allocated = [void 0], this.freelist = [], this.get = function(t) {
          return this.allocated[t];
        }, this.allocate = function(t) {
          let n = this.freelist.pop() || this.allocated.length;
          return this.allocated[n] = t, n;
        }, this.free = function(t) {
          this.allocated[t] = void 0, this.freelist.push(t);
        };
      }
      var oe = new ei();
      function jn(t) {
        t >= oe.reserved && --oe.get(t).refcount === 0 && oe.free(t);
      }
      function ti() {
        for (var t = 0, n = oe.reserved; n < oe.allocated.length; ++n)
          oe.allocated[n] !== void 0 && ++t;
        return t;
      }
      function ni() {
        oe.allocated.push({ value: void 0 }, { value: null }, { value: !0 }, { value: !1 }), oe.reserved = oe.allocated.length, e.count_emval_handles = ti;
      }
      var pe = { toValue: (t) => (t || z("Cannot use deleted val. handle = " + t), oe.get(t).value), toHandle: (t) => {
        switch (t) {
          case void 0:
            return 1;
          case null:
            return 2;
          case !0:
            return 3;
          case !1:
            return 4;
          default:
            return oe.allocate({ refcount: 1, value: t });
        }
      } };
      function ri(t, n) {
        n = ne(n), me(t, { name: n, fromWireType: function(a) {
          var s = pe.toValue(a);
          return jn(a), s;
        }, toWireType: function(a, s) {
          return pe.toHandle(s);
        }, argPackAdvance: 8, readValueFromPointer: nt, destructorFunction: null });
      }
      function ai(t, n, a) {
        switch (n) {
          case 0:
            return function(s) {
              var o = a ? V : ee;
              return this.fromWireType(o[s]);
            };
          case 1:
            return function(s) {
              var o = a ? te : He;
              return this.fromWireType(o[s >> 1]);
            };
          case 2:
            return function(s) {
              var o = a ? k : T;
              return this.fromWireType(o[s >> 2]);
            };
          default:
            throw new TypeError("Unknown integer type: " + t);
        }
      }
      function ii(t, n, a, s) {
        var o = Et(a);
        n = ne(n);
        function l() {
        }
        l.values = {}, me(t, { name: n, constructor: l, fromWireType: function(c) {
          return this.constructor.values[c];
        }, toWireType: function(c, g) {
          return g.value;
        }, argPackAdvance: 8, readValueFromPointer: ai(n, o, s), destructorFunction: null }), an(n, l);
      }
      function Yn(t, n) {
        var a = Be[t];
        return a === void 0 && z(n + " has unknown type " + Fn(t)), a;
      }
      function si(t, n, a) {
        var s = Yn(t, "enum");
        n = ne(n);
        var o = s.constructor, l = Object.create(s.constructor.prototype, { value: { value: a }, constructor: { value: bt(s.name + "_" + n, function() {
        }) } });
        o.values[a] = l, o[n] = l;
      }
      function un(t) {
        if (t === null)
          return "null";
        var n = typeof t;
        return n === "object" || n === "array" || n === "function" ? t.toString() : "" + t;
      }
      function ui(t, n) {
        switch (n) {
          case 2:
            return function(a) {
              return this.fromWireType(ht[a >> 2]);
            };
          case 3:
            return function(a) {
              return this.fromWireType(yt[a >> 3]);
            };
          default:
            throw new TypeError("Unknown float type: " + t);
        }
      }
      function oi(t, n, a) {
        var s = Et(a);
        n = ne(n), me(t, { name: n, fromWireType: function(o) {
          return o;
        }, toWireType: function(o, l) {
          return l;
        }, argPackAdvance: 8, readValueFromPointer: ui(n, s), destructorFunction: null });
      }
      function _i(t, n) {
        if (!(t instanceof Function))
          throw new TypeError("new_ called with constructor type " + typeof t + " which is not a function");
        var a = bt(t.name || "unknownFunctionName", function() {
        });
        a.prototype = t.prototype;
        var s = new a(), o = t.apply(s, n);
        return o instanceof Object ? o : s;
      }
      function li(t, n, a, s, o, l) {
        var c = n.length;
        c < 2 && z("argTypes array size mismatch! Must at least get return value and 'this' types!");
        for (var g = n[1] !== null && a !== null, d = !1, h = 1; h < n.length; ++h)
          if (n[h] !== null && n[h].destructorFunction === void 0) {
            d = !0;
            break;
          }
        for (var v = n[0].name !== "void", C = "", D = "", h = 0; h < c - 2; ++h)
          C += (h !== 0 ? ", " : "") + "arg" + h, D += (h !== 0 ? ", " : "") + "arg" + h + "Wired";
        var P = "return function " + Zt(t) + "(" + C + `) {
if (arguments.length !== ` + (c - 2) + `) {
throwBindingError('function ` + t + " called with ' + arguments.length + ' arguments, expected " + (c - 2) + ` args!');
}
`;
        d && (P += `var destructors = [];
`);
        var R = d ? "destructors" : "null", N = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"], X = [z, s, o, An, n[0], n[1]];
        g && (P += "var thisWired = classParam.toWireType(" + R + `, this);
`);
        for (var h = 0; h < c - 2; ++h)
          P += "var arg" + h + "Wired = argType" + h + ".toWireType(" + R + ", arg" + h + "); // " + n[h + 2].name + `
`, N.push("argType" + h), X.push(n[h + 2]);
        if (g && (D = "thisWired" + (D.length > 0 ? ", " : "") + D), P += (v || l ? "var rv = " : "") + "invoker(fn" + (D.length > 0 ? ", " : "") + D + `);
`, d)
          P += `runDestructors(destructors);
`;
        else
          for (var h = g ? 1 : 2; h < n.length; ++h) {
            var q = h === 1 ? "thisWired" : "arg" + (h - 2) + "Wired";
            n[h].destructorFunction !== null && (P += q + "_dtor(" + q + "); // " + n[h].name + `
`, N.push(q + "_dtor"), X.push(n[h].destructorFunction));
          }
        return v && (P += `var ret = retType.fromWireType(rv);
return ret;
`), P += `}
`, N.push(P), _i(Function, N).apply(null, X);
      }
      function ci(t, n) {
        for (var a = [], s = 0; s < t; s++)
          a.push(T[n + s * 4 >> 2]);
        return a;
      }
      function gi(t, n, a, s, o, l, c) {
        var g = ci(n, a);
        t = ne(t), o = Se(s, o), an(t, function() {
          Un("Cannot call " + t + " due to unbound types", g);
        }, n - 1), en([], g, function(d) {
          var h = [d[0], null].concat(d.slice(1));
          return zn(t, li(t, h, null, o, l, c), n - 1), [];
        });
      }
      function fi(t, n, a) {
        switch (n) {
          case 0:
            return a ? function(o) {
              return V[o];
            } : function(o) {
              return ee[o];
            };
          case 1:
            return a ? function(o) {
              return te[o >> 1];
            } : function(o) {
              return He[o >> 1];
            };
          case 2:
            return a ? function(o) {
              return k[o >> 2];
            } : function(o) {
              return T[o >> 2];
            };
          default:
            throw new TypeError("Unknown integer type: " + t);
        }
      }
      function mi(t, n, a, s, o) {
        n = ne(n);
        var l = Et(a), c = (C) => C;
        if (s === 0) {
          var g = 32 - 8 * a;
          c = (C) => C << g >>> g;
        }
        var d = n.includes("unsigned"), h = (C, D) => {
        }, v;
        d ? v = function(C, D) {
          return h(D, this.name), D >>> 0;
        } : v = function(C, D) {
          return h(D, this.name), D;
        }, me(t, { name: n, fromWireType: c, toWireType: v, argPackAdvance: 8, readValueFromPointer: fi(n, l, s !== 0), destructorFunction: null });
      }
      function pi(t, n, a) {
        var s = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], o = s[n];
        function l(c) {
          c = c >> 2;
          var g = T, d = g[c], h = g[c + 1];
          return new o(g.buffer, h, d);
        }
        a = ne(a), me(t, { name: a, fromWireType: l, argPackAdvance: 8, readValueFromPointer: l }, { ignoreDuplicateRegistrations: !0 });
      }
      function di(t, n) {
        n = ne(n);
        var a = n === "std::string";
        me(t, { name: n, fromWireType: function(s) {
          var o = T[s >> 2], l = s + 4, c;
          if (a)
            for (var g = l, d = 0; d <= o; ++d) {
              var h = l + d;
              if (d == o || ee[h] == 0) {
                var v = h - g, C = ke(g, v);
                c === void 0 ? c = C : (c += String.fromCharCode(0), c += C), g = h + 1;
              }
            }
          else {
            for (var D = new Array(o), d = 0; d < o; ++d)
              D[d] = String.fromCharCode(ee[l + d]);
            c = D.join("");
          }
          return Ie(s), c;
        }, toWireType: function(s, o) {
          o instanceof ArrayBuffer && (o = new Uint8Array(o));
          var l, c = typeof o == "string";
          c || o instanceof Uint8Array || o instanceof Uint8ClampedArray || o instanceof Int8Array || z("Cannot pass non-string to std::string"), a && c ? l = Le(o) : l = o.length;
          var g = Xe(4 + l + 1), d = g + 4;
          if (T[g >> 2] = l, a && c)
            Ye(o, d, l + 1);
          else if (c)
            for (var h = 0; h < l; ++h) {
              var v = o.charCodeAt(h);
              v > 255 && (Ie(d), z("String has UTF-16 code units that do not fit in 8 bits")), ee[d + h] = v;
            }
          else
            for (var h = 0; h < l; ++h)
              ee[d + h] = o[h];
          return s !== null && s.push(Ie, g), g;
        }, argPackAdvance: 8, readValueFromPointer: nt, destructorFunction: function(s) {
          Ie(s);
        } });
      }
      var $n = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0;
      function hi(t, n) {
        for (var a = t, s = a >> 1, o = s + n / 2; !(s >= o) && He[s]; )
          ++s;
        if (a = s << 1, a - t > 32 && $n)
          return $n.decode(ee.subarray(t, a));
        for (var l = "", c = 0; !(c >= n / 2); ++c) {
          var g = te[t + c * 2 >> 1];
          if (g == 0)
            break;
          l += String.fromCharCode(g);
        }
        return l;
      }
      function yi(t, n, a) {
        if (a === void 0 && (a = 2147483647), a < 2)
          return 0;
        a -= 2;
        for (var s = n, o = a < t.length * 2 ? a / 2 : t.length, l = 0; l < o; ++l) {
          var c = t.charCodeAt(l);
          te[n >> 1] = c, n += 2;
        }
        return te[n >> 1] = 0, n - s;
      }
      function wi(t) {
        return t.length * 2;
      }
      function ki(t, n) {
        for (var a = 0, s = ""; !(a >= n / 4); ) {
          var o = k[t + a * 4 >> 2];
          if (o == 0)
            break;
          if (++a, o >= 65536) {
            var l = o - 65536;
            s += String.fromCharCode(55296 | l >> 10, 56320 | l & 1023);
          } else
            s += String.fromCharCode(o);
        }
        return s;
      }
      function vi(t, n, a) {
        if (a === void 0 && (a = 2147483647), a < 4)
          return 0;
        for (var s = n, o = s + a - 4, l = 0; l < t.length; ++l) {
          var c = t.charCodeAt(l);
          if (c >= 55296 && c <= 57343) {
            var g = t.charCodeAt(++l);
            c = 65536 + ((c & 1023) << 10) | g & 1023;
          }
          if (k[n >> 2] = c, n += 4, n + 4 > o)
            break;
        }
        return k[n >> 2] = 0, n - s;
      }
      function Si(t) {
        for (var n = 0, a = 0; a < t.length; ++a) {
          var s = t.charCodeAt(a);
          s >= 55296 && s <= 57343 && ++a, n += 4;
        }
        return n;
      }
      function Ii(t, n, a) {
        a = ne(a);
        var s, o, l, c, g;
        n === 2 ? (s = hi, o = yi, c = wi, l = () => He, g = 1) : n === 4 && (s = ki, o = vi, c = Si, l = () => T, g = 2), me(t, { name: a, fromWireType: function(d) {
          for (var h = T[d >> 2], v = l(), C, D = d + 4, P = 0; P <= h; ++P) {
            var R = d + 4 + P * n;
            if (P == h || v[R >> g] == 0) {
              var N = R - D, X = s(D, N);
              C === void 0 ? C = X : (C += String.fromCharCode(0), C += X), D = R + n;
            }
          }
          return Ie(d), C;
        }, toWireType: function(d, h) {
          typeof h != "string" && z("Cannot pass non-string to C++ string type " + a);
          var v = c(h), C = Xe(4 + v + n);
          return T[C >> 2] = v >> g, o(h, C + 4, v + n), d !== null && d.push(Ie, C), C;
        }, argPackAdvance: 8, readValueFromPointer: nt, destructorFunction: function(d) {
          Ie(d);
        } });
      }
      function Mi(t, n, a, s, o, l) {
        Ct[t] = { name: ne(n), rawConstructor: Se(a, s), rawDestructor: Se(o, l), fields: [] };
      }
      function Di(t, n, a, s, o, l, c, g, d, h) {
        Ct[t].fields.push({ fieldName: ne(n), getterReturnType: a, getter: Se(s, o), getterContext: l, setterArgumentType: c, setter: Se(g, d), setterContext: h });
      }
      function Ci(t, n) {
        n = ne(n), me(t, { isVoid: !0, name: n, argPackAdvance: 0, fromWireType: function() {
        }, toWireType: function(a, s) {
        } });
      }
      function Pi(t) {
        do {
          var n = T[t >> 2];
          t += 4;
          var a = T[t >> 2];
          t += 4;
          var s = T[t >> 2];
          t += 4;
          var o = ke(n);
          _.createPath("/", U.dirname(o), !0, !0), _.createDataFile(o, null, V.subarray(s, s + a), !0, !0, !0);
        } while (T[t >> 2]);
      }
      var bi = !0;
      function Gi() {
        return bi;
      }
      function Ei() {
        throw 1 / 0;
      }
      function Ri(t) {
        t > 4 && (oe.get(t).refcount += 1);
      }
      function Ai() {
        return pe.toHandle([]);
      }
      var Ti = {};
      function Li(t) {
        var n = Ti[t];
        return n === void 0 ? ne(t) : n;
      }
      function Wi(t) {
        return pe.toHandle(Li(t));
      }
      function Bi() {
        return pe.toHandle({});
      }
      function xi(t, n, a) {
        t = pe.toValue(t), n = pe.toValue(n), a = pe.toValue(a), t[n] = a;
      }
      function Ni(t, n) {
        t = Yn(t, "_emval_take_value");
        var a = t.readValueFromPointer(n);
        return pe.toHandle(a);
      }
      function Xn(t) {
        return T[t >> 2] + k[t + 4 >> 2] * 4294967296;
      }
      function zi(t, n) {
        var a = new Date(Xn(t) * 1e3);
        k[n >> 2] = a.getUTCSeconds(), k[n + 4 >> 2] = a.getUTCMinutes(), k[n + 8 >> 2] = a.getUTCHours(), k[n + 12 >> 2] = a.getUTCDate(), k[n + 16 >> 2] = a.getUTCMonth(), k[n + 20 >> 2] = a.getUTCFullYear() - 1900, k[n + 24 >> 2] = a.getUTCDay();
        var s = Date.UTC(a.getUTCFullYear(), 0, 1, 0, 0, 0, 0), o = (a.getTime() - s) / (1e3 * 60 * 60 * 24) | 0;
        k[n + 28 >> 2] = o;
      }
      function ot(t) {
        return t % 4 === 0 && (t % 100 !== 0 || t % 400 === 0);
      }
      var Hi = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], Fi = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
      function qn(t) {
        var n = ot(t.getFullYear()), a = n ? Hi : Fi, s = a[t.getMonth()] + t.getDate() - 1;
        return s;
      }
      function Ui(t, n) {
        var a = new Date(Xn(t) * 1e3);
        k[n >> 2] = a.getSeconds(), k[n + 4 >> 2] = a.getMinutes(), k[n + 8 >> 2] = a.getHours(), k[n + 12 >> 2] = a.getDate(), k[n + 16 >> 2] = a.getMonth(), k[n + 20 >> 2] = a.getFullYear() - 1900, k[n + 24 >> 2] = a.getDay();
        var s = qn(a) | 0;
        k[n + 28 >> 2] = s, k[n + 36 >> 2] = -(a.getTimezoneOffset() * 60);
        var o = new Date(a.getFullYear(), 0, 1), l = new Date(a.getFullYear(), 6, 1).getTimezoneOffset(), c = o.getTimezoneOffset(), g = (l != c && a.getTimezoneOffset() == Math.min(c, l)) | 0;
        k[n + 32 >> 2] = g;
      }
      function ji(t) {
        var n = new Date(k[t + 20 >> 2] + 1900, k[t + 16 >> 2], k[t + 12 >> 2], k[t + 8 >> 2], k[t + 4 >> 2], k[t >> 2], 0), a = k[t + 32 >> 2], s = n.getTimezoneOffset(), o = new Date(n.getFullYear(), 0, 1), l = new Date(n.getFullYear(), 6, 1).getTimezoneOffset(), c = o.getTimezoneOffset(), g = Math.min(c, l);
        if (a < 0)
          k[t + 32 >> 2] = +(l != c && g == s);
        else if (a > 0 != (g == s)) {
          var d = Math.max(c, l), h = a > 0 ? g : d;
          n.setTime(n.getTime() + (h - s) * 6e4);
        }
        k[t + 24 >> 2] = n.getDay();
        var v = qn(n) | 0;
        return k[t + 28 >> 2] = v, k[t >> 2] = n.getSeconds(), k[t + 4 >> 2] = n.getMinutes(), k[t + 8 >> 2] = n.getHours(), k[t + 12 >> 2] = n.getDate(), k[t + 16 >> 2] = n.getMonth(), k[t + 20 >> 2] = n.getYear(), n.getTime() / 1e3 | 0;
      }
      function Yi(t, n, a, s, o, l, c) {
        try {
          var g = A.getStreamFromFD(s), d = _.mmap(g, t, o, n, a), h = d.ptr;
          return k[l >> 2] = d.allocated, T[c >> 2] = h, 0;
        } catch (v) {
          if (typeof _ > "u" || v.name !== "ErrnoError")
            throw v;
          return -v.errno;
        }
      }
      function $i(t, n, a, s, o, l) {
        try {
          var c = A.getStreamFromFD(o);
          a & 2 && A.doMsync(t, c, n, s, l), _.munmap(c);
        } catch (g) {
          if (typeof _ > "u" || g.name !== "ErrnoError")
            throw g;
          return -g.errno;
        }
      }
      var _t = {};
      function Vn(t) {
        if (t instanceof Mn || t == "unwind")
          return Ze;
        Q(1, t);
      }
      function Kn(t) {
        Ze = t, kn() || (e.onExit && e.onExit(t), pt = !0), Q(t, new Mn(t));
      }
      function Xi(t, n) {
        Ze = t, Kn(t);
      }
      var Qn = Xi;
      function qi() {
        if (!kn())
          try {
            Qn(Ze);
          } catch (t) {
            Vn(t);
          }
      }
      function Vi(t) {
        if (!pt)
          try {
            t(), qi();
          } catch (n) {
            Vn(n);
          }
      }
      var At;
      le ? At = () => {
        var t = process.hrtime();
        return t[0] * 1e3 + t[1] / 1e6;
      } : At = () => performance.now();
      function Ki(t, n) {
        if (_t[t] && (clearTimeout(_t[t].id), delete _t[t]), !n)
          return 0;
        var a = setTimeout(() => {
          delete _t[t], Vi(() => or(t, At()));
        }, n);
        return _t[t] = { id: a, timeout_ms: n }, 0;
      }
      function Jn(t) {
        var n = Le(t) + 1, a = Xe(n);
        return a && Ye(t, a, n), a;
      }
      function Qi(t, n, a) {
        var s = (/* @__PURE__ */ new Date()).getFullYear(), o = new Date(s, 0, 1), l = new Date(s, 6, 1), c = o.getTimezoneOffset(), g = l.getTimezoneOffset(), d = Math.max(c, g);
        T[t >> 2] = d * 60, k[n >> 2] = +(c != g);
        function h(R) {
          var N = R.toTimeString().match(/\(([A-Za-z ]+)\)$/);
          return N ? N[1] : "GMT";
        }
        var v = h(o), C = h(l), D = Jn(v), P = Jn(C);
        g < c ? (T[a >> 2] = D, T[a + 4 >> 2] = P) : (T[a >> 2] = P, T[a + 4 >> 2] = D);
      }
      function Ji() {
        ye("");
      }
      function Zi() {
        return Date.now();
      }
      function Zn() {
        return 2147483648;
      }
      function Oi() {
        return Zn();
      }
      function es(t, n, a) {
        ee.copyWithin(t, n, n + a);
      }
      function ts(t) {
        var n = mt.buffer;
        try {
          return mt.grow(t - n.byteLength + 65535 >>> 16), pn(), 1;
        } catch {
        }
      }
      function ns(t) {
        var n = ee.length;
        t = t >>> 0;
        var a = Zn();
        if (t > a)
          return !1;
        let s = (d, h) => d + (h - d % h) % h;
        for (var o = 1; o <= 4; o *= 2) {
          var l = n * (1 + 0.2 / o);
          l = Math.min(l, t + 100663296);
          var c = Math.min(a, s(Math.max(t, l), 65536)), g = ts(c);
          if (g)
            return !0;
        }
        return !1;
      }
      var on = {};
      function rs() {
        return B || "./this.program";
      }
      function lt() {
        if (!lt.strings) {
          var t = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", n = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: t, _: rs() };
          for (var a in on)
            on[a] === void 0 ? delete n[a] : n[a] = on[a];
          var s = [];
          for (var a in n)
            s.push(a + "=" + n[a]);
          lt.strings = s;
        }
        return lt.strings;
      }
      function as(t, n) {
        for (var a = 0; a < t.length; ++a)
          V[n++ >> 0] = t.charCodeAt(a);
        V[n >> 0] = 0;
      }
      function is(t, n) {
        var a = 0;
        return lt().forEach(function(s, o) {
          var l = n + a;
          T[t + o * 4 >> 2] = l, as(s, l), a += s.length + 1;
        }), 0;
      }
      function ss(t, n) {
        var a = lt();
        T[t >> 2] = a.length;
        var s = 0;
        return a.forEach(function(o) {
          s += o.length + 1;
        }), T[n >> 2] = s, 0;
      }
      function us(t) {
        try {
          var n = A.getStreamFromFD(t);
          return _.close(n), 0;
        } catch (a) {
          if (typeof _ > "u" || a.name !== "ErrnoError")
            throw a;
          return a.errno;
        }
      }
      function os(t, n) {
        try {
          var a = 0, s = 0, o = 0, l = A.getStreamFromFD(t), c = l.tty ? 2 : _.isDir(l.mode) ? 3 : _.isLink(l.mode) ? 7 : 4;
          return V[n >> 0] = c, te[n + 2 >> 1] = o, x = [a >>> 0, (G = a, +Math.abs(G) >= 1 ? G > 0 ? (Math.min(+Math.floor(G / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((G - +(~~G >>> 0)) / 4294967296) >>> 0 : 0)], k[n + 8 >> 2] = x[0], k[n + 12 >> 2] = x[1], x = [s >>> 0, (G = s, +Math.abs(G) >= 1 ? G > 0 ? (Math.min(+Math.floor(G / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((G - +(~~G >>> 0)) / 4294967296) >>> 0 : 0)], k[n + 16 >> 2] = x[0], k[n + 20 >> 2] = x[1], 0;
        } catch (g) {
          if (typeof _ > "u" || g.name !== "ErrnoError")
            throw g;
          return g.errno;
        }
      }
      function On(t, n, a, s) {
        for (var o = 0, l = 0; l < a; l++) {
          var c = T[n >> 2], g = T[n + 4 >> 2];
          n += 8;
          var d = _.read(t, V, c, g, s);
          if (d < 0)
            return -1;
          if (o += d, d < g)
            break;
          typeof s < "u" && (s += d);
        }
        return o;
      }
      function _s(t, n, a, s, o, l) {
        try {
          var c = tt(s, o);
          if (isNaN(c))
            return 61;
          var g = A.getStreamFromFD(t), d = On(g, n, a, c);
          return T[l >> 2] = d, 0;
        } catch (h) {
          if (typeof _ > "u" || h.name !== "ErrnoError")
            throw h;
          return h.errno;
        }
      }
      function er(t, n, a, s) {
        for (var o = 0, l = 0; l < a; l++) {
          var c = T[n >> 2], g = T[n + 4 >> 2];
          n += 8;
          var d = _.write(t, V, c, g, s);
          if (d < 0)
            return -1;
          o += d, typeof s < "u" && (s += d);
        }
        return o;
      }
      function ls(t, n, a, s, o, l) {
        try {
          var c = tt(s, o);
          if (isNaN(c))
            return 61;
          var g = A.getStreamFromFD(t), d = er(g, n, a, c);
          return T[l >> 2] = d, 0;
        } catch (h) {
          if (typeof _ > "u" || h.name !== "ErrnoError")
            throw h;
          return h.errno;
        }
      }
      function cs(t, n, a, s) {
        try {
          var o = A.getStreamFromFD(t), l = On(o, n, a);
          return T[s >> 2] = l, 0;
        } catch (c) {
          if (typeof _ > "u" || c.name !== "ErrnoError")
            throw c;
          return c.errno;
        }
      }
      function gs(t, n, a, s, o) {
        try {
          var l = tt(n, a);
          if (isNaN(l))
            return 61;
          var c = A.getStreamFromFD(t);
          return _.llseek(c, l, s), x = [c.position >>> 0, (G = c.position, +Math.abs(G) >= 1 ? G > 0 ? (Math.min(+Math.floor(G / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((G - +(~~G >>> 0)) / 4294967296) >>> 0 : 0)], k[o >> 2] = x[0], k[o + 4 >> 2] = x[1], c.getdents && l === 0 && s === 0 && (c.getdents = null), 0;
        } catch (g) {
          if (typeof _ > "u" || g.name !== "ErrnoError")
            throw g;
          return g.errno;
        }
      }
      function fs(t) {
        try {
          var n = A.getStreamFromFD(t);
          return n.stream_ops && n.stream_ops.fsync ? n.stream_ops.fsync(n) : 0;
        } catch (a) {
          if (typeof _ > "u" || a.name !== "ErrnoError")
            throw a;
          return a.errno;
        }
      }
      function ms(t, n, a, s) {
        try {
          var o = A.getStreamFromFD(t), l = er(o, n, a);
          return T[s >> 2] = l, 0;
        } catch (c) {
          if (typeof _ > "u" || c.name !== "ErrnoError")
            throw c;
          return c.errno;
        }
      }
      function ps(t, n, a, s) {
        var o = 0, l = 0, c = 0, g = 0, d = 0, h = 0, v;
        function C(D, P, R, N, X, q) {
          var I, b, H, F;
          return b = D === 10 ? 28 : 16, X = D === 10 ? Gn(X) : Qt(X), I = Xe(b), F = Rn(I, D, X, q), dt(!F), H = Xe(32), k[H + 4 >> 2] = D, k[H + 8 >> 2] = P, k[H + 12 >> 2] = R, k[H + 24 >> 2] = N, T[H + 20 >> 2] = I, D === 10 ? k[H + 16 >> 2] = 28 : k[H + 16 >> 2] = 16, k[H + 28 >> 2] = 0, H;
        }
        if (a && (c = k[a >> 2], g = k[a + 4 >> 2], d = k[a + 8 >> 2], h = k[a + 12 >> 2]), d && !h && (h = d === 2 ? 17 : 6), !d && h && (d = h === 17 ? 2 : 1), h === 0 && (h = 6), d === 0 && (d = 1), !t && !n)
          return -2;
        if (c & -1088 || a !== 0 && k[a >> 2] & 2 && !t)
          return -1;
        if (c & 32)
          return -2;
        if (d !== 0 && d !== 1 && d !== 2)
          return -7;
        if (g !== 0 && g !== 2 && g !== 10)
          return -6;
        if (n && (n = ke(n), l = parseInt(n, 10), isNaN(l)))
          return c & 1024 ? -2 : -8;
        if (!t)
          return g === 0 && (g = 2), c & 1 || (g === 2 ? o = Bt(2130706433) : o = [0, 0, 0, 1]), v = C(g, d, h, null, o, l), T[s >> 2] = v, 0;
        if (t = ke(t), o = Mt(t), o !== null)
          if (g === 0 || g === 2)
            g = 2;
          else if (g === 10 && c & 8)
            o = [0, 0, Bt(65535), o], g = 10;
          else
            return -2;
        else if (o = Jt(t), o !== null)
          if (g === 0 || g === 10)
            g = 10;
          else
            return -2;
        return o != null ? (v = C(g, d, h, t, o, l), T[s >> 2] = v, 0) : c & 4 ? -2 : (t = fe.lookup_name(t), o = Mt(t), g === 0 ? g = 2 : g === 10 && (o = [0, 0, Bt(65535), o]), v = C(g, d, h, null, o, l), T[s >> 2] = v, 0);
      }
      function ds(t, n) {
        return qt(ee.subarray(t, t + n)), 0;
      }
      function hs(t, n) {
        for (var a = 0, s = 0; s <= n; a += t[s++])
          ;
        return a;
      }
      var tr = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], nr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      function ys(t, n) {
        for (var a = new Date(t.getTime()); n > 0; ) {
          var s = ot(a.getFullYear()), o = a.getMonth(), l = (s ? tr : nr)[o];
          if (n > l - a.getDate())
            n -= l - a.getDate() + 1, a.setDate(1), o < 11 ? a.setMonth(o + 1) : (a.setMonth(0), a.setFullYear(a.getFullYear() + 1));
          else
            return a.setDate(a.getDate() + n), a;
        }
        return a;
      }
      function ws(t, n) {
        V.set(t, n);
      }
      function rr(t, n, a, s) {
        var o = k[s + 40 >> 2], l = { tm_sec: k[s >> 2], tm_min: k[s + 4 >> 2], tm_hour: k[s + 8 >> 2], tm_mday: k[s + 12 >> 2], tm_mon: k[s + 16 >> 2], tm_year: k[s + 20 >> 2], tm_wday: k[s + 24 >> 2], tm_yday: k[s + 28 >> 2], tm_isdst: k[s + 32 >> 2], tm_gmtoff: k[s + 36 >> 2], tm_zone: o ? ke(o) : "" }, c = ke(a), g = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" };
        for (var d in g)
          c = c.replace(new RegExp(d, "g"), g[d]);
        var h = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], v = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        function C(I, b, H) {
          for (var F = typeof I == "number" ? I.toString() : I || ""; F.length < b; )
            F = H[0] + F;
          return F;
        }
        function D(I, b) {
          return C(I, b, "0");
        }
        function P(I, b) {
          function H(ae) {
            return ae < 0 ? -1 : ae > 0 ? 1 : 0;
          }
          var F;
          return (F = H(I.getFullYear() - b.getFullYear())) === 0 && (F = H(I.getMonth() - b.getMonth())) === 0 && (F = H(I.getDate() - b.getDate())), F;
        }
        function R(I) {
          switch (I.getDay()) {
            case 0:
              return new Date(I.getFullYear() - 1, 11, 29);
            case 1:
              return I;
            case 2:
              return new Date(I.getFullYear(), 0, 3);
            case 3:
              return new Date(I.getFullYear(), 0, 2);
            case 4:
              return new Date(I.getFullYear(), 0, 1);
            case 5:
              return new Date(I.getFullYear() - 1, 11, 31);
            case 6:
              return new Date(I.getFullYear() - 1, 11, 30);
          }
        }
        function N(I) {
          var b = ys(new Date(I.tm_year + 1900, 0, 1), I.tm_yday), H = new Date(b.getFullYear(), 0, 4), F = new Date(b.getFullYear() + 1, 0, 4), ae = R(H), Z = R(F);
          return P(ae, b) <= 0 ? P(Z, b) <= 0 ? b.getFullYear() + 1 : b.getFullYear() : b.getFullYear() - 1;
        }
        var X = { "%a": function(I) {
          return h[I.tm_wday].substring(0, 3);
        }, "%A": function(I) {
          return h[I.tm_wday];
        }, "%b": function(I) {
          return v[I.tm_mon].substring(0, 3);
        }, "%B": function(I) {
          return v[I.tm_mon];
        }, "%C": function(I) {
          var b = I.tm_year + 1900;
          return D(b / 100 | 0, 2);
        }, "%d": function(I) {
          return D(I.tm_mday, 2);
        }, "%e": function(I) {
          return C(I.tm_mday, 2, " ");
        }, "%g": function(I) {
          return N(I).toString().substring(2);
        }, "%G": function(I) {
          return N(I);
        }, "%H": function(I) {
          return D(I.tm_hour, 2);
        }, "%I": function(I) {
          var b = I.tm_hour;
          return b == 0 ? b = 12 : b > 12 && (b -= 12), D(b, 2);
        }, "%j": function(I) {
          return D(I.tm_mday + hs(ot(I.tm_year + 1900) ? tr : nr, I.tm_mon - 1), 3);
        }, "%m": function(I) {
          return D(I.tm_mon + 1, 2);
        }, "%M": function(I) {
          return D(I.tm_min, 2);
        }, "%n": function() {
          return `
`;
        }, "%p": function(I) {
          return I.tm_hour >= 0 && I.tm_hour < 12 ? "AM" : "PM";
        }, "%S": function(I) {
          return D(I.tm_sec, 2);
        }, "%t": function() {
          return "	";
        }, "%u": function(I) {
          return I.tm_wday || 7;
        }, "%U": function(I) {
          var b = I.tm_yday + 7 - I.tm_wday;
          return D(Math.floor(b / 7), 2);
        }, "%V": function(I) {
          var b = Math.floor((I.tm_yday + 7 - (I.tm_wday + 6) % 7) / 7);
          if ((I.tm_wday + 371 - I.tm_yday - 2) % 7 <= 2 && b++, b) {
            if (b == 53) {
              var F = (I.tm_wday + 371 - I.tm_yday) % 7;
              F != 4 && (F != 3 || !ot(I.tm_year)) && (b = 1);
            }
          } else {
            b = 52;
            var H = (I.tm_wday + 7 - I.tm_yday - 1) % 7;
            (H == 4 || H == 5 && ot(I.tm_year % 400 - 1)) && b++;
          }
          return D(b, 2);
        }, "%w": function(I) {
          return I.tm_wday;
        }, "%W": function(I) {
          var b = I.tm_yday + 7 - (I.tm_wday + 6) % 7;
          return D(Math.floor(b / 7), 2);
        }, "%y": function(I) {
          return (I.tm_year + 1900).toString().substring(2);
        }, "%Y": function(I) {
          return I.tm_year + 1900;
        }, "%z": function(I) {
          var b = I.tm_gmtoff, H = b >= 0;
          return b = Math.abs(b) / 60, b = b / 60 * 100 + b % 60, (H ? "+" : "-") + ("0000" + b).slice(-4);
        }, "%Z": function(I) {
          return I.tm_zone;
        }, "%%": function() {
          return "%";
        } };
        c = c.replace(/%%/g, "\0\0");
        for (var d in X)
          c.includes(d) && (c = c.replace(new RegExp(d, "g"), X[d](l)));
        c = c.replace(/\0\0/g, "%");
        var q = St(c, !1);
        return q.length > n ? 0 : (ws(q, t), q.length - 1);
      }
      function ks(t, n, a, s, o) {
        return rr(t, n, a, s);
      }
      function vs(t) {
        if (le) {
          if (!t)
            return 1;
          var n = ke(t);
          if (!n.length)
            return 0;
          var a = require("child_process"), s = a.spawnSync(n, [], { shell: !0, stdio: "inherit" }), o = (c, g) => c << 8 | g;
          if (s.status === null) {
            var l = (c) => {
              switch (c) {
                case "SIGHUP":
                  return 1;
                case "SIGINT":
                  return 2;
                case "SIGQUIT":
                  return 3;
                case "SIGFPE":
                  return 8;
                case "SIGKILL":
                  return 9;
                case "SIGALRM":
                  return 14;
                case "SIGTERM":
                  return 15;
              }
              return 2;
            };
            return o(0, l(s.signal));
          }
          return o(s.status, 0);
        }
        return t ? (bn(52), -1) : 0;
      }
      var ar = function(t, n, a, s) {
        t || (t = this), this.parent = t, this.mount = t.mount, this.mounted = null, this.id = _.nextInode++, this.name = n, this.mode = a, this.node_ops = {}, this.stream_ops = {}, this.rdev = s;
      }, Tt = 365, Lt = 146;
      Object.defineProperties(ar.prototype, { read: { get: function() {
        return (this.mode & Tt) === Tt;
      }, set: function(t) {
        t ? this.mode |= Tt : this.mode &= ~Tt;
      } }, write: { get: function() {
        return (this.mode & Lt) === Lt;
      }, set: function(t) {
        t ? this.mode |= Lt : this.mode &= ~Lt;
      } }, isFolder: { get: function() {
        return _.isDir(this.mode);
      } }, isDevice: { get: function() {
        return _.isChrdev(this.mode);
      } } }), _.FSNode = ar, _.staticInit(), e.FS_createPath = _.createPath, e.FS_createDataFile = _.createDataFile, e.FS_createPreloadedFile = _.createPreloadedFile, e.FS_unlink = _.unlink, e.FS_createLazyFile = _.createLazyFile, e.FS_createDevice = _.createDevice, Tn = e.InternalError = Ot(Error, "InternalError"), Ma(), rt = e.BindingError = Ot(Error, "BindingError"), Ha(), Aa(), Ka(), Hn = e.UnboundTypeError = Ot(Error, "UnboundTypeError"), ni();
      var Ss = { ka: Fr, E: Yr, a: $r, D: Ur, Aa: Kr, aa: Jr, za: Zr, Ba: Or, Va: ea, wa: ta, q: na, O: ra, ra: aa, ja: ia, $: sa, Da: ua, ta: oa, ua: _a, F: la, la: ca, ia: ga, _: fa, ha: ma, Z: pa, db: da, va: ha, ga: ya, M: wa, Na: Sa, Xa: Ia, Ha: Da, J: Oa, Ga: ri, v: ii, f: si, R: oi, r: gi, s: mi, o: pi, Q: di, H: Ii, Oa: Mi, T: Di, Ia: Ci, Ja: Pi, xa: Gi, ca: Ei, n: jn, I: Ri, Ma: Ai, w: Wi, S: Bi, u: xi, p: Ni, oa: zi, pa: Ui, qa: ji, ma: Yi, na: $i, cb: Ki, ea: Qi, c: Ji, A: Zi, fa: Oi, z: At, ya: es, da: ns, Ea: is, Fa: ss, y: Qn, x: us, N: os, Ua: _s, Ta: ls, P: cs, Wa: gs, sa: fs, G: ms, Pa: ps, eb: ds, Sa: Ws, B: Es, e: Cs, d: Ds, h: Ms, g: As, Y: Ls, b: Rs, X: Ns, m: Ts, W: zs, Ka: $s, Za: Qs, ab: qs, $a: Vs, Ya: Js, bb: Xs, K: Bs, l: Ps, j: bs, V: Hs, U: Fs, i: Is, k: Gs, t: xs, Qa: js, La: Ys, Ra: Us, _a: Ks, Ca: Kn, L: rr, ba: ks, C: vs };
      Nr(), e._MagickColor_Create = function() {
        return (e._MagickColor_Create = e.asm.hb).apply(null, arguments);
      }, e._MagickColor_Dispose = function() {
        return (e._MagickColor_Dispose = e.asm.ib).apply(null, arguments);
      }, e._MagickColor_Count_Get = function() {
        return (e._MagickColor_Count_Get = e.asm.jb).apply(null, arguments);
      }, e._MagickColor_Red_Get = function() {
        return (e._MagickColor_Red_Get = e.asm.kb).apply(null, arguments);
      }, e._MagickColor_Red_Set = function() {
        return (e._MagickColor_Red_Set = e.asm.lb).apply(null, arguments);
      }, e._MagickColor_Green_Get = function() {
        return (e._MagickColor_Green_Get = e.asm.mb).apply(null, arguments);
      }, e._MagickColor_Green_Set = function() {
        return (e._MagickColor_Green_Set = e.asm.nb).apply(null, arguments);
      }, e._MagickColor_Blue_Get = function() {
        return (e._MagickColor_Blue_Get = e.asm.ob).apply(null, arguments);
      }, e._MagickColor_Blue_Set = function() {
        return (e._MagickColor_Blue_Set = e.asm.pb).apply(null, arguments);
      }, e._MagickColor_Alpha_Get = function() {
        return (e._MagickColor_Alpha_Get = e.asm.qb).apply(null, arguments);
      }, e._MagickColor_Alpha_Set = function() {
        return (e._MagickColor_Alpha_Set = e.asm.rb).apply(null, arguments);
      }, e._MagickColor_Black_Get = function() {
        return (e._MagickColor_Black_Get = e.asm.sb).apply(null, arguments);
      }, e._MagickColor_Black_Set = function() {
        return (e._MagickColor_Black_Set = e.asm.tb).apply(null, arguments);
      }, e._MagickColor_IsCMYK_Get = function() {
        return (e._MagickColor_IsCMYK_Get = e.asm.ub).apply(null, arguments);
      }, e._MagickColor_IsCMYK_Set = function() {
        return (e._MagickColor_IsCMYK_Set = e.asm.vb).apply(null, arguments);
      }, e._MagickColor_Clone = function() {
        return (e._MagickColor_Clone = e.asm.wb).apply(null, arguments);
      }, e._MagickColor_FuzzyEquals = function() {
        return (e._MagickColor_FuzzyEquals = e.asm.xb).apply(null, arguments);
      }, e._MagickColor_Initialize = function() {
        return (e._MagickColor_Initialize = e.asm.yb).apply(null, arguments);
      }, e._MagickColorCollection_DisposeList = function() {
        return (e._MagickColorCollection_DisposeList = e.asm.Ab).apply(null, arguments);
      }, e._MagickColorCollection_GetInstance = function() {
        return (e._MagickColorCollection_GetInstance = e.asm.Bb).apply(null, arguments);
      }, e._DrawingWand_Create = function() {
        return (e._DrawingWand_Create = e.asm.Cb).apply(null, arguments);
      }, e._DrawingWand_Dispose = function() {
        return (e._DrawingWand_Dispose = e.asm.Db).apply(null, arguments);
      }, e._DrawingWand_Affine = function() {
        return (e._DrawingWand_Affine = e.asm.Eb).apply(null, arguments);
      }, e._DrawingWand_Alpha = function() {
        return (e._DrawingWand_Alpha = e.asm.Fb).apply(null, arguments);
      }, e._DrawingWand_Arc = function() {
        return (e._DrawingWand_Arc = e.asm.Gb).apply(null, arguments);
      }, e._DrawingWand_Bezier = function() {
        return (e._DrawingWand_Bezier = e.asm.Hb).apply(null, arguments);
      }, e._DrawingWand_BorderColor = function() {
        return (e._DrawingWand_BorderColor = e.asm.Ib).apply(null, arguments);
      }, e._DrawingWand_Circle = function() {
        return (e._DrawingWand_Circle = e.asm.Jb).apply(null, arguments);
      }, e._DrawingWand_ClipPath = function() {
        return (e._DrawingWand_ClipPath = e.asm.Kb).apply(null, arguments);
      }, e._DrawingWand_ClipRule = function() {
        return (e._DrawingWand_ClipRule = e.asm.Lb).apply(null, arguments);
      }, e._DrawingWand_ClipUnits = function() {
        return (e._DrawingWand_ClipUnits = e.asm.Mb).apply(null, arguments);
      }, e._DrawingWand_Color = function() {
        return (e._DrawingWand_Color = e.asm.Nb).apply(null, arguments);
      }, e._DrawingWand_Composite = function() {
        return (e._DrawingWand_Composite = e.asm.Ob).apply(null, arguments);
      }, e._DrawingWand_Density = function() {
        return (e._DrawingWand_Density = e.asm.Pb).apply(null, arguments);
      }, e._DrawingWand_Ellipse = function() {
        return (e._DrawingWand_Ellipse = e.asm.Qb).apply(null, arguments);
      }, e._DrawingWand_FillColor = function() {
        return (e._DrawingWand_FillColor = e.asm.Rb).apply(null, arguments);
      }, e._DrawingWand_FillOpacity = function() {
        return (e._DrawingWand_FillOpacity = e.asm.Sb).apply(null, arguments);
      }, e._DrawingWand_FillPatternUrl = function() {
        return (e._DrawingWand_FillPatternUrl = e.asm.Tb).apply(null, arguments);
      }, e._DrawingWand_FillRule = function() {
        return (e._DrawingWand_FillRule = e.asm.Ub).apply(null, arguments);
      }, e._DrawingWand_Font = function() {
        return (e._DrawingWand_Font = e.asm.Vb).apply(null, arguments);
      }, e._DrawingWand_FontFamily = function() {
        return (e._DrawingWand_FontFamily = e.asm.Wb).apply(null, arguments);
      }, e._DrawingWand_FontPointSize = function() {
        return (e._DrawingWand_FontPointSize = e.asm.Xb).apply(null, arguments);
      }, e._DrawingWand_FontTypeMetrics = function() {
        return (e._DrawingWand_FontTypeMetrics = e.asm.Yb).apply(null, arguments);
      }, e._TypeMetric_Create = function() {
        return (e._TypeMetric_Create = e.asm.Zb).apply(null, arguments);
      }, e._DrawingWand_Gravity = function() {
        return (e._DrawingWand_Gravity = e.asm._b).apply(null, arguments);
      }, e._DrawingWand_Line = function() {
        return (e._DrawingWand_Line = e.asm.$b).apply(null, arguments);
      }, e._DrawingWand_PathArcAbs = function() {
        return (e._DrawingWand_PathArcAbs = e.asm.ac).apply(null, arguments);
      }, e._DrawingWand_PathArcRel = function() {
        return (e._DrawingWand_PathArcRel = e.asm.bc).apply(null, arguments);
      }, e._DrawingWand_PathClose = function() {
        return (e._DrawingWand_PathClose = e.asm.cc).apply(null, arguments);
      }, e._DrawingWand_PathCurveToAbs = function() {
        return (e._DrawingWand_PathCurveToAbs = e.asm.dc).apply(null, arguments);
      }, e._DrawingWand_PathCurveToRel = function() {
        return (e._DrawingWand_PathCurveToRel = e.asm.ec).apply(null, arguments);
      }, e._DrawingWand_PathFinish = function() {
        return (e._DrawingWand_PathFinish = e.asm.fc).apply(null, arguments);
      }, e._DrawingWand_PathLineToAbs = function() {
        return (e._DrawingWand_PathLineToAbs = e.asm.gc).apply(null, arguments);
      }, e._DrawingWand_PathLineToHorizontalAbs = function() {
        return (e._DrawingWand_PathLineToHorizontalAbs = e.asm.hc).apply(null, arguments);
      }, e._DrawingWand_PathLineToHorizontalRel = function() {
        return (e._DrawingWand_PathLineToHorizontalRel = e.asm.ic).apply(null, arguments);
      }, e._DrawingWand_PathLineToRel = function() {
        return (e._DrawingWand_PathLineToRel = e.asm.jc).apply(null, arguments);
      }, e._DrawingWand_PathLineToVerticalAbs = function() {
        return (e._DrawingWand_PathLineToVerticalAbs = e.asm.kc).apply(null, arguments);
      }, e._DrawingWand_PathLineToVerticalRel = function() {
        return (e._DrawingWand_PathLineToVerticalRel = e.asm.lc).apply(null, arguments);
      }, e._DrawingWand_PathMoveToAbs = function() {
        return (e._DrawingWand_PathMoveToAbs = e.asm.mc).apply(null, arguments);
      }, e._DrawingWand_PathMoveToRel = function() {
        return (e._DrawingWand_PathMoveToRel = e.asm.nc).apply(null, arguments);
      }, e._DrawingWand_PathQuadraticCurveToAbs = function() {
        return (e._DrawingWand_PathQuadraticCurveToAbs = e.asm.oc).apply(null, arguments);
      }, e._DrawingWand_PathQuadraticCurveToRel = function() {
        return (e._DrawingWand_PathQuadraticCurveToRel = e.asm.pc).apply(null, arguments);
      }, e._DrawingWand_PathSmoothCurveToAbs = function() {
        return (e._DrawingWand_PathSmoothCurveToAbs = e.asm.qc).apply(null, arguments);
      }, e._DrawingWand_PathSmoothCurveToRel = function() {
        return (e._DrawingWand_PathSmoothCurveToRel = e.asm.rc).apply(null, arguments);
      }, e._DrawingWand_PathSmoothQuadraticCurveToAbs = function() {
        return (e._DrawingWand_PathSmoothQuadraticCurveToAbs = e.asm.sc).apply(null, arguments);
      }, e._DrawingWand_PathSmoothQuadraticCurveToRel = function() {
        return (e._DrawingWand_PathSmoothQuadraticCurveToRel = e.asm.tc).apply(null, arguments);
      }, e._DrawingWand_PathStart = function() {
        return (e._DrawingWand_PathStart = e.asm.uc).apply(null, arguments);
      }, e._DrawingWand_Point = function() {
        return (e._DrawingWand_Point = e.asm.vc).apply(null, arguments);
      }, e._DrawingWand_Polygon = function() {
        return (e._DrawingWand_Polygon = e.asm.wc).apply(null, arguments);
      }, e._DrawingWand_Polyline = function() {
        return (e._DrawingWand_Polyline = e.asm.xc).apply(null, arguments);
      }, e._DrawingWand_PopClipPath = function() {
        return (e._DrawingWand_PopClipPath = e.asm.yc).apply(null, arguments);
      }, e._DrawingWand_PopGraphicContext = function() {
        return (e._DrawingWand_PopGraphicContext = e.asm.zc).apply(null, arguments);
      }, e._DrawingWand_PopPattern = function() {
        return (e._DrawingWand_PopPattern = e.asm.Ac).apply(null, arguments);
      }, e._DrawingWand_PushClipPath = function() {
        return (e._DrawingWand_PushClipPath = e.asm.Bc).apply(null, arguments);
      }, e._DrawingWand_PushGraphicContext = function() {
        return (e._DrawingWand_PushGraphicContext = e.asm.Cc).apply(null, arguments);
      }, e._DrawingWand_PushPattern = function() {
        return (e._DrawingWand_PushPattern = e.asm.Dc).apply(null, arguments);
      }, e._DrawingWand_Rectangle = function() {
        return (e._DrawingWand_Rectangle = e.asm.Ec).apply(null, arguments);
      }, e._DrawingWand_Render = function() {
        return (e._DrawingWand_Render = e.asm.Fc).apply(null, arguments);
      }, e._DrawingWand_Rotation = function() {
        return (e._DrawingWand_Rotation = e.asm.Gc).apply(null, arguments);
      }, e._DrawingWand_RoundRectangle = function() {
        return (e._DrawingWand_RoundRectangle = e.asm.Hc).apply(null, arguments);
      }, e._DrawingWand_Scaling = function() {
        return (e._DrawingWand_Scaling = e.asm.Ic).apply(null, arguments);
      }, e._DrawingWand_SkewX = function() {
        return (e._DrawingWand_SkewX = e.asm.Jc).apply(null, arguments);
      }, e._DrawingWand_SkewY = function() {
        return (e._DrawingWand_SkewY = e.asm.Kc).apply(null, arguments);
      }, e._DrawingWand_StrokeAntialias = function() {
        return (e._DrawingWand_StrokeAntialias = e.asm.Lc).apply(null, arguments);
      }, e._DrawingWand_StrokeColor = function() {
        return (e._DrawingWand_StrokeColor = e.asm.Mc).apply(null, arguments);
      }, e._DrawingWand_StrokeDashArray = function() {
        return (e._DrawingWand_StrokeDashArray = e.asm.Nc).apply(null, arguments);
      }, e._DrawingWand_StrokeDashOffset = function() {
        return (e._DrawingWand_StrokeDashOffset = e.asm.Oc).apply(null, arguments);
      }, e._DrawingWand_StrokeLineCap = function() {
        return (e._DrawingWand_StrokeLineCap = e.asm.Pc).apply(null, arguments);
      }, e._DrawingWand_StrokeLineJoin = function() {
        return (e._DrawingWand_StrokeLineJoin = e.asm.Qc).apply(null, arguments);
      }, e._DrawingWand_StrokeMiterLimit = function() {
        return (e._DrawingWand_StrokeMiterLimit = e.asm.Rc).apply(null, arguments);
      }, e._DrawingWand_StrokeOpacity = function() {
        return (e._DrawingWand_StrokeOpacity = e.asm.Sc).apply(null, arguments);
      }, e._DrawingWand_StrokePatternUrl = function() {
        return (e._DrawingWand_StrokePatternUrl = e.asm.Tc).apply(null, arguments);
      }, e._DrawingWand_StrokeWidth = function() {
        return (e._DrawingWand_StrokeWidth = e.asm.Uc).apply(null, arguments);
      }, e._DrawingWand_Text = function() {
        return (e._DrawingWand_Text = e.asm.Vc).apply(null, arguments);
      }, e._DrawingWand_TextAlignment = function() {
        return (e._DrawingWand_TextAlignment = e.asm.Wc).apply(null, arguments);
      }, e._DrawingWand_TextAntialias = function() {
        return (e._DrawingWand_TextAntialias = e.asm.Xc).apply(null, arguments);
      }, e._DrawingWand_TextDecoration = function() {
        return (e._DrawingWand_TextDecoration = e.asm.Yc).apply(null, arguments);
      }, e._DrawingWand_TextDirection = function() {
        return (e._DrawingWand_TextDirection = e.asm.Zc).apply(null, arguments);
      }, e._DrawingWand_TextEncoding = function() {
        return (e._DrawingWand_TextEncoding = e.asm._c).apply(null, arguments);
      }, e._DrawingWand_TextInterlineSpacing = function() {
        return (e._DrawingWand_TextInterlineSpacing = e.asm.$c).apply(null, arguments);
      }, e._DrawingWand_TextInterwordSpacing = function() {
        return (e._DrawingWand_TextInterwordSpacing = e.asm.ad).apply(null, arguments);
      }, e._DrawingWand_TextKerning = function() {
        return (e._DrawingWand_TextKerning = e.asm.bd).apply(null, arguments);
      }, e._DrawingWand_TextUnderColor = function() {
        return (e._DrawingWand_TextUnderColor = e.asm.cd).apply(null, arguments);
      }, e._DrawingWand_Translation = function() {
        return (e._DrawingWand_Translation = e.asm.dd).apply(null, arguments);
      }, e._DrawingWand_Viewbox = function() {
        return (e._DrawingWand_Viewbox = e.asm.ed).apply(null, arguments);
      }, e._PointInfoCollection_Create = function() {
        return (e._PointInfoCollection_Create = e.asm.fd).apply(null, arguments);
      }, e._PointInfoCollection_Dispose = function() {
        return (e._PointInfoCollection_Dispose = e.asm.gd).apply(null, arguments);
      }, e._PointInfoCollection_GetX = function() {
        return (e._PointInfoCollection_GetX = e.asm.hd).apply(null, arguments);
      }, e._PointInfoCollection_GetY = function() {
        return (e._PointInfoCollection_GetY = e.asm.id).apply(null, arguments);
      }, e._PointInfoCollection_Set = function() {
        return (e._PointInfoCollection_Set = e.asm.jd).apply(null, arguments);
      }, e._MagickExceptionHelper_Description = function() {
        return (e._MagickExceptionHelper_Description = e.asm.kd).apply(null, arguments);
      }, e._MagickExceptionHelper_Dispose = function() {
        return (e._MagickExceptionHelper_Dispose = e.asm.ld).apply(null, arguments);
      }, e._MagickExceptionHelper_Related = function() {
        return (e._MagickExceptionHelper_Related = e.asm.md).apply(null, arguments);
      }, e._MagickExceptionHelper_RelatedCount = function() {
        return (e._MagickExceptionHelper_RelatedCount = e.asm.nd).apply(null, arguments);
      }, e._MagickExceptionHelper_Message = function() {
        return (e._MagickExceptionHelper_Message = e.asm.od).apply(null, arguments);
      }, e._MagickExceptionHelper_Severity = function() {
        return (e._MagickExceptionHelper_Severity = e.asm.pd).apply(null, arguments);
      }, e._PdfInfo_PageCount = function() {
        return (e._PdfInfo_PageCount = e.asm.qd).apply(null, arguments);
      }, e._Environment_Initialize = function() {
        return (e._Environment_Initialize = e.asm.rd).apply(null, arguments);
      }, e._Environment_GetEnv = function() {
        return (e._Environment_GetEnv = e.asm.sd).apply(null, arguments);
      }, e._Environment_SetEnv = function() {
        return (e._Environment_SetEnv = e.asm.td).apply(null, arguments);
      }, e._MagickMemory_Relinquish = function() {
        return (e._MagickMemory_Relinquish = e.asm.ud).apply(null, arguments);
      }, e._Magick_Delegates_Get = function() {
        return (e._Magick_Delegates_Get = e.asm.vd).apply(null, arguments);
      }, e._Magick_Features_Get = function() {
        return (e._Magick_Features_Get = e.asm.wd).apply(null, arguments);
      }, e._Magick_ImageMagickVersion_Get = function() {
        return (e._Magick_ImageMagickVersion_Get = e.asm.xd).apply(null, arguments);
      }, e._Magick_GetFonts = function() {
        return (e._Magick_GetFonts = e.asm.yd).apply(null, arguments);
      }, e._Magick_GetFontFamily = function() {
        return (e._Magick_GetFontFamily = e.asm.zd).apply(null, arguments);
      }, e._Magick_GetFontName = function() {
        return (e._Magick_GetFontName = e.asm.Ad).apply(null, arguments);
      }, e._Magick_DisposeFonts = function() {
        return (e._Magick_DisposeFonts = e.asm.Bd).apply(null, arguments);
      }, e._Magick_SetDefaultFontFile = function() {
        return (e._Magick_SetDefaultFontFile = e.asm.Cd).apply(null, arguments);
      }, e._Magick_SetRandomSeed = function() {
        return (e._Magick_SetRandomSeed = e.asm.Dd).apply(null, arguments);
      }, e._Magick_SetLogDelegate = function() {
        return (e._Magick_SetLogDelegate = e.asm.Ed).apply(null, arguments);
      }, e._Magick_SetLogEvents = function() {
        return (e._Magick_SetLogEvents = e.asm.Fd).apply(null, arguments);
      }, e._Magick_SetOpenCLEnabled = function() {
        return (e._Magick_SetOpenCLEnabled = e.asm.Gd).apply(null, arguments);
      }, e._MagickFormatInfo_CreateList = function() {
        return (e._MagickFormatInfo_CreateList = e.asm.Hd).apply(null, arguments);
      }, e._MagickFormatInfo_DisposeList = function() {
        return (e._MagickFormatInfo_DisposeList = e.asm.Id).apply(null, arguments);
      }, e._MagickFormatInfo_CanReadMultithreaded_Get = function() {
        return (e._MagickFormatInfo_CanReadMultithreaded_Get = e.asm.Jd).apply(null, arguments);
      }, e._MagickFormatInfo_CanWriteMultithreaded_Get = function() {
        return (e._MagickFormatInfo_CanWriteMultithreaded_Get = e.asm.Kd).apply(null, arguments);
      }, e._MagickFormatInfo_Description_Get = function() {
        return (e._MagickFormatInfo_Description_Get = e.asm.Ld).apply(null, arguments);
      }, e._MagickFormatInfo_Format_Get = function() {
        return (e._MagickFormatInfo_Format_Get = e.asm.Md).apply(null, arguments);
      }, e._MagickFormatInfo_MimeType_Get = function() {
        return (e._MagickFormatInfo_MimeType_Get = e.asm.Nd).apply(null, arguments);
      }, e._MagickFormatInfo_Module_Get = function() {
        return (e._MagickFormatInfo_Module_Get = e.asm.Od).apply(null, arguments);
      }, e._MagickFormatInfo_SupportsMultipleFrames_Get = function() {
        return (e._MagickFormatInfo_SupportsMultipleFrames_Get = e.asm.Pd).apply(null, arguments);
      }, e._MagickFormatInfo_SupportsReading_Get = function() {
        return (e._MagickFormatInfo_SupportsReading_Get = e.asm.Qd).apply(null, arguments);
      }, e._MagickFormatInfo_SupportsWriting_Get = function() {
        return (e._MagickFormatInfo_SupportsWriting_Get = e.asm.Rd).apply(null, arguments);
      }, e._MagickFormatInfo_GetInfo = function() {
        return (e._MagickFormatInfo_GetInfo = e.asm.Sd).apply(null, arguments);
      }, e._MagickFormatInfo_GetInfoByName = function() {
        return (e._MagickFormatInfo_GetInfoByName = e.asm.Td).apply(null, arguments);
      }, e._MagickFormatInfo_GetInfoWithBlob = function() {
        return (e._MagickFormatInfo_GetInfoWithBlob = e.asm.Ud).apply(null, arguments);
      }, e._MagickFormatInfo_Unregister = function() {
        return (e._MagickFormatInfo_Unregister = e.asm.Vd).apply(null, arguments);
      }, e._MagickImage_Create = function() {
        return (e._MagickImage_Create = e.asm.Wd).apply(null, arguments);
      }, e._MagickImage_Dispose = function() {
        return (e._MagickImage_Dispose = e.asm.Xd).apply(null, arguments);
      }, e._MagickImage_AnimationDelay_Get = function() {
        return (e._MagickImage_AnimationDelay_Get = e.asm.Yd).apply(null, arguments);
      }, e._MagickImage_AnimationDelay_Set = function() {
        return (e._MagickImage_AnimationDelay_Set = e.asm.Zd).apply(null, arguments);
      }, e._MagickImage_AnimationIterations_Get = function() {
        return (e._MagickImage_AnimationIterations_Get = e.asm._d).apply(null, arguments);
      }, e._MagickImage_AnimationIterations_Set = function() {
        return (e._MagickImage_AnimationIterations_Set = e.asm.$d).apply(null, arguments);
      }, e._MagickImage_AnimationTicksPerSecond_Get = function() {
        return (e._MagickImage_AnimationTicksPerSecond_Get = e.asm.ae).apply(null, arguments);
      }, e._MagickImage_AnimationTicksPerSecond_Set = function() {
        return (e._MagickImage_AnimationTicksPerSecond_Set = e.asm.be).apply(null, arguments);
      }, e._MagickImage_BackgroundColor_Get = function() {
        return (e._MagickImage_BackgroundColor_Get = e.asm.ce).apply(null, arguments);
      }, e._MagickImage_BackgroundColor_Set = function() {
        return (e._MagickImage_BackgroundColor_Set = e.asm.de).apply(null, arguments);
      }, e._MagickImage_BaseHeight_Get = function() {
        return (e._MagickImage_BaseHeight_Get = e.asm.ee).apply(null, arguments);
      }, e._MagickImage_BaseWidth_Get = function() {
        return (e._MagickImage_BaseWidth_Get = e.asm.fe).apply(null, arguments);
      }, e._MagickImage_BlackPointCompensation_Get = function() {
        return (e._MagickImage_BlackPointCompensation_Get = e.asm.ge).apply(null, arguments);
      }, e._MagickImage_BlackPointCompensation_Set = function() {
        return (e._MagickImage_BlackPointCompensation_Set = e.asm.he).apply(null, arguments);
      }, e._MagickImage_BorderColor_Get = function() {
        return (e._MagickImage_BorderColor_Get = e.asm.ie).apply(null, arguments);
      }, e._MagickImage_BorderColor_Set = function() {
        return (e._MagickImage_BorderColor_Set = e.asm.je).apply(null, arguments);
      }, e._MagickImage_BoundingBox_Get = function() {
        return (e._MagickImage_BoundingBox_Get = e.asm.ke).apply(null, arguments);
      }, e._MagickRectangle_Create = function() {
        return (e._MagickRectangle_Create = e.asm.le).apply(null, arguments);
      }, e._MagickImage_ChannelCount_Get = function() {
        return (e._MagickImage_ChannelCount_Get = e.asm.me).apply(null, arguments);
      }, e._MagickImage_ChromaBluePrimary_Get = function() {
        return (e._MagickImage_ChromaBluePrimary_Get = e.asm.ne).apply(null, arguments);
      }, e._PrimaryInfo_Create = function() {
        return (e._PrimaryInfo_Create = e.asm.oe).apply(null, arguments);
      }, e._MagickImage_ChromaBluePrimary_Set = function() {
        return (e._MagickImage_ChromaBluePrimary_Set = e.asm.pe).apply(null, arguments);
      }, e._MagickImage_ChromaGreenPrimary_Get = function() {
        return (e._MagickImage_ChromaGreenPrimary_Get = e.asm.qe).apply(null, arguments);
      }, e._MagickImage_ChromaGreenPrimary_Set = function() {
        return (e._MagickImage_ChromaGreenPrimary_Set = e.asm.re).apply(null, arguments);
      }, e._MagickImage_ChromaRedPrimary_Get = function() {
        return (e._MagickImage_ChromaRedPrimary_Get = e.asm.se).apply(null, arguments);
      }, e._MagickImage_ChromaRedPrimary_Set = function() {
        return (e._MagickImage_ChromaRedPrimary_Set = e.asm.te).apply(null, arguments);
      }, e._MagickImage_ChromaWhitePoint_Get = function() {
        return (e._MagickImage_ChromaWhitePoint_Get = e.asm.ue).apply(null, arguments);
      }, e._MagickImage_ChromaWhitePoint_Set = function() {
        return (e._MagickImage_ChromaWhitePoint_Set = e.asm.ve).apply(null, arguments);
      }, e._MagickImage_ClassType_Get = function() {
        return (e._MagickImage_ClassType_Get = e.asm.we).apply(null, arguments);
      }, e._MagickImage_ClassType_Set = function() {
        return (e._MagickImage_ClassType_Set = e.asm.xe).apply(null, arguments);
      }, e._QuantizeSettings_Create = function() {
        return (e._QuantizeSettings_Create = e.asm.ye).apply(null, arguments);
      }, e._QuantizeSettings_Dispose = function() {
        return (e._QuantizeSettings_Dispose = e.asm.ze).apply(null, arguments);
      }, e._MagickImage_ColorFuzz_Get = function() {
        return (e._MagickImage_ColorFuzz_Get = e.asm.Ae).apply(null, arguments);
      }, e._MagickImage_ColorFuzz_Set = function() {
        return (e._MagickImage_ColorFuzz_Set = e.asm.Be).apply(null, arguments);
      }, e._MagickImage_ColormapSize_Get = function() {
        return (e._MagickImage_ColormapSize_Get = e.asm.Ce).apply(null, arguments);
      }, e._MagickImage_ColormapSize_Set = function() {
        return (e._MagickImage_ColormapSize_Set = e.asm.De).apply(null, arguments);
      }, e._MagickImage_ColorSpace_Get = function() {
        return (e._MagickImage_ColorSpace_Get = e.asm.Ee).apply(null, arguments);
      }, e._MagickImage_ColorSpace_Set = function() {
        return (e._MagickImage_ColorSpace_Set = e.asm.Fe).apply(null, arguments);
      }, e._MagickImage_ColorType_Get = function() {
        return (e._MagickImage_ColorType_Get = e.asm.Ge).apply(null, arguments);
      }, e._MagickImage_ColorType_Set = function() {
        return (e._MagickImage_ColorType_Set = e.asm.He).apply(null, arguments);
      }, e._MagickImage_Compose_Get = function() {
        return (e._MagickImage_Compose_Get = e.asm.Ie).apply(null, arguments);
      }, e._MagickImage_Compose_Set = function() {
        return (e._MagickImage_Compose_Set = e.asm.Je).apply(null, arguments);
      }, e._MagickImage_Compression_Get = function() {
        return (e._MagickImage_Compression_Get = e.asm.Ke).apply(null, arguments);
      }, e._MagickImage_Compression_Set = function() {
        return (e._MagickImage_Compression_Set = e.asm.Le).apply(null, arguments);
      }, e._MagickImage_Depth_Get = function() {
        return (e._MagickImage_Depth_Get = e.asm.Me).apply(null, arguments);
      }, e._MagickImage_Depth_Set = function() {
        return (e._MagickImage_Depth_Set = e.asm.Ne).apply(null, arguments);
      }, e._MagickImage_EncodingGeometry_Get = function() {
        return (e._MagickImage_EncodingGeometry_Get = e.asm.Oe).apply(null, arguments);
      }, e._MagickImage_Endian_Get = function() {
        return (e._MagickImage_Endian_Get = e.asm.Pe).apply(null, arguments);
      }, e._MagickImage_Endian_Set = function() {
        return (e._MagickImage_Endian_Set = e.asm.Qe).apply(null, arguments);
      }, e._MagickImage_FileName_Get = function() {
        return (e._MagickImage_FileName_Get = e.asm.Re).apply(null, arguments);
      }, e._MagickImage_FileName_Set = function() {
        return (e._MagickImage_FileName_Set = e.asm.Se).apply(null, arguments);
      }, e._MagickImage_FilterType_Get = function() {
        return (e._MagickImage_FilterType_Get = e.asm.Te).apply(null, arguments);
      }, e._MagickImage_FilterType_Set = function() {
        return (e._MagickImage_FilterType_Set = e.asm.Ue).apply(null, arguments);
      }, e._MagickImage_Format_Get = function() {
        return (e._MagickImage_Format_Get = e.asm.Ve).apply(null, arguments);
      }, e._MagickImage_Format_Set = function() {
        return (e._MagickImage_Format_Set = e.asm.We).apply(null, arguments);
      }, e._MagickImage_Gamma_Get = function() {
        return (e._MagickImage_Gamma_Get = e.asm.Xe).apply(null, arguments);
      }, e._MagickImage_GifDisposeMethod_Get = function() {
        return (e._MagickImage_GifDisposeMethod_Get = e.asm.Ye).apply(null, arguments);
      }, e._MagickImage_GifDisposeMethod_Set = function() {
        return (e._MagickImage_GifDisposeMethod_Set = e.asm.Ze).apply(null, arguments);
      }, e._MagickImage_Interpolate_Get = function() {
        return (e._MagickImage_Interpolate_Get = e.asm._e).apply(null, arguments);
      }, e._MagickImage_Interpolate_Set = function() {
        return (e._MagickImage_Interpolate_Set = e.asm.$e).apply(null, arguments);
      }, e._MagickImage_HasAlpha_Get = function() {
        return (e._MagickImage_HasAlpha_Get = e.asm.af).apply(null, arguments);
      }, e._MagickImage_HasAlpha_Set = function() {
        return (e._MagickImage_HasAlpha_Set = e.asm.bf).apply(null, arguments);
      }, e._MagickImage_Height_Get = function() {
        return (e._MagickImage_Height_Get = e.asm.cf).apply(null, arguments);
      }, e._MagickImage_Interlace_Get = function() {
        return (e._MagickImage_Interlace_Get = e.asm.df).apply(null, arguments);
      }, e._MagickImage_Interlace_Set = function() {
        return (e._MagickImage_Interlace_Set = e.asm.ef).apply(null, arguments);
      }, e._MagickImage_IsOpaque_Get = function() {
        return (e._MagickImage_IsOpaque_Get = e.asm.ff).apply(null, arguments);
      }, e._MagickImage_MatteColor_Get = function() {
        return (e._MagickImage_MatteColor_Get = e.asm.gf).apply(null, arguments);
      }, e._MagickImage_MatteColor_Set = function() {
        return (e._MagickImage_MatteColor_Set = e.asm.hf).apply(null, arguments);
      }, e._MagickImage_MeanErrorPerPixel_Get = function() {
        return (e._MagickImage_MeanErrorPerPixel_Get = e.asm.jf).apply(null, arguments);
      }, e._MagickImage_NormalizedMaximumError_Get = function() {
        return (e._MagickImage_NormalizedMaximumError_Get = e.asm.kf).apply(null, arguments);
      }, e._MagickImage_NormalizedMeanError_Get = function() {
        return (e._MagickImage_NormalizedMeanError_Get = e.asm.lf).apply(null, arguments);
      }, e._MagickImage_Orientation_Get = function() {
        return (e._MagickImage_Orientation_Get = e.asm.mf).apply(null, arguments);
      }, e._MagickImage_Orientation_Set = function() {
        return (e._MagickImage_Orientation_Set = e.asm.nf).apply(null, arguments);
      }, e._MagickImage_RenderingIntent_Get = function() {
        return (e._MagickImage_RenderingIntent_Get = e.asm.of).apply(null, arguments);
      }, e._MagickImage_RenderingIntent_Set = function() {
        return (e._MagickImage_RenderingIntent_Set = e.asm.pf).apply(null, arguments);
      }, e._MagickImage_Page_Get = function() {
        return (e._MagickImage_Page_Get = e.asm.qf).apply(null, arguments);
      }, e._MagickImage_Page_Set = function() {
        return (e._MagickImage_Page_Set = e.asm.rf).apply(null, arguments);
      }, e._MagickImage_Quality_Get = function() {
        return (e._MagickImage_Quality_Get = e.asm.sf).apply(null, arguments);
      }, e._MagickImage_Quality_Set = function() {
        return (e._MagickImage_Quality_Set = e.asm.tf).apply(null, arguments);
      }, e._MagickImage_ResolutionUnits_Get = function() {
        return (e._MagickImage_ResolutionUnits_Get = e.asm.uf).apply(null, arguments);
      }, e._MagickImage_ResolutionUnits_Set = function() {
        return (e._MagickImage_ResolutionUnits_Set = e.asm.vf).apply(null, arguments);
      }, e._MagickImage_ResolutionX_Get = function() {
        return (e._MagickImage_ResolutionX_Get = e.asm.wf).apply(null, arguments);
      }, e._MagickImage_ResolutionX_Set = function() {
        return (e._MagickImage_ResolutionX_Set = e.asm.xf).apply(null, arguments);
      }, e._MagickImage_ResolutionY_Get = function() {
        return (e._MagickImage_ResolutionY_Get = e.asm.yf).apply(null, arguments);
      }, e._MagickImage_ResolutionY_Set = function() {
        return (e._MagickImage_ResolutionY_Set = e.asm.zf).apply(null, arguments);
      }, e._MagickImage_Signature_Get = function() {
        return (e._MagickImage_Signature_Get = e.asm.Af).apply(null, arguments);
      }, e._MagickImage_TotalColors_Get = function() {
        return (e._MagickImage_TotalColors_Get = e.asm.Bf).apply(null, arguments);
      }, e._MagickImage_VirtualPixelMethod_Get = function() {
        return (e._MagickImage_VirtualPixelMethod_Get = e.asm.Cf).apply(null, arguments);
      }, e._MagickImage_VirtualPixelMethod_Set = function() {
        return (e._MagickImage_VirtualPixelMethod_Set = e.asm.Df).apply(null, arguments);
      }, e._MagickImage_Width_Get = function() {
        return (e._MagickImage_Width_Get = e.asm.Ef).apply(null, arguments);
      }, e._MagickImage_AdaptiveBlur = function() {
        return (e._MagickImage_AdaptiveBlur = e.asm.Ff).apply(null, arguments);
      }, e._MagickImage_AdaptiveResize = function() {
        return (e._MagickImage_AdaptiveResize = e.asm.Gf).apply(null, arguments);
      }, e._MagickImage_AdaptiveSharpen = function() {
        return (e._MagickImage_AdaptiveSharpen = e.asm.Hf).apply(null, arguments);
      }, e._MagickImage_AdaptiveThreshold = function() {
        return (e._MagickImage_AdaptiveThreshold = e.asm.If).apply(null, arguments);
      }, e._MagickImage_AddNoise = function() {
        return (e._MagickImage_AddNoise = e.asm.Jf).apply(null, arguments);
      }, e._MagickImage_AffineTransform = function() {
        return (e._MagickImage_AffineTransform = e.asm.Kf).apply(null, arguments);
      }, e._MagickImage_Annotate = function() {
        return (e._MagickImage_Annotate = e.asm.Lf).apply(null, arguments);
      }, e._MagickImage_AnnotateGravity = function() {
        return (e._MagickImage_AnnotateGravity = e.asm.Mf).apply(null, arguments);
      }, e._MagickImage_AutoGamma = function() {
        return (e._MagickImage_AutoGamma = e.asm.Nf).apply(null, arguments);
      }, e._MagickImage_AutoLevel = function() {
        return (e._MagickImage_AutoLevel = e.asm.Of).apply(null, arguments);
      }, e._MagickImage_AutoOrient = function() {
        return (e._MagickImage_AutoOrient = e.asm.Pf).apply(null, arguments);
      }, e._MagickImage_AutoThreshold = function() {
        return (e._MagickImage_AutoThreshold = e.asm.Qf).apply(null, arguments);
      }, e._MagickImage_BilateralBlur = function() {
        return (e._MagickImage_BilateralBlur = e.asm.Rf).apply(null, arguments);
      }, e._MagickImage_BlackThreshold = function() {
        return (e._MagickImage_BlackThreshold = e.asm.Sf).apply(null, arguments);
      }, e._MagickImage_BlueShift = function() {
        return (e._MagickImage_BlueShift = e.asm.Tf).apply(null, arguments);
      }, e._MagickImage_Blur = function() {
        return (e._MagickImage_Blur = e.asm.Uf).apply(null, arguments);
      }, e._MagickImage_Border = function() {
        return (e._MagickImage_Border = e.asm.Vf).apply(null, arguments);
      }, e._MagickImage_BrightnessContrast = function() {
        return (e._MagickImage_BrightnessContrast = e.asm.Wf).apply(null, arguments);
      }, e._MagickImage_CannyEdge = function() {
        return (e._MagickImage_CannyEdge = e.asm.Xf).apply(null, arguments);
      }, e._MagickImage_ChannelOffset = function() {
        return (e._MagickImage_ChannelOffset = e.asm.Yf).apply(null, arguments);
      }, e._MagickImage_Charcoal = function() {
        return (e._MagickImage_Charcoal = e.asm.Zf).apply(null, arguments);
      }, e._MagickImage_Chop = function() {
        return (e._MagickImage_Chop = e.asm._f).apply(null, arguments);
      }, e._MagickImage_Clahe = function() {
        return (e._MagickImage_Clahe = e.asm.$f).apply(null, arguments);
      }, e._MagickImage_Clamp = function() {
        return (e._MagickImage_Clamp = e.asm.ag).apply(null, arguments);
      }, e._MagickImage_ClipPath = function() {
        return (e._MagickImage_ClipPath = e.asm.bg).apply(null, arguments);
      }, e._MagickImage_Clone = function() {
        return (e._MagickImage_Clone = e.asm.cg).apply(null, arguments);
      }, e._MagickImage_CloneArea = function() {
        return (e._MagickImage_CloneArea = e.asm.dg).apply(null, arguments);
      }, e._MagickImage_Clut = function() {
        return (e._MagickImage_Clut = e.asm.eg).apply(null, arguments);
      }, e._MagickImage_ColorDecisionList = function() {
        return (e._MagickImage_ColorDecisionList = e.asm.fg).apply(null, arguments);
      }, e._MagickImage_Colorize = function() {
        return (e._MagickImage_Colorize = e.asm.gg).apply(null, arguments);
      }, e._MagickImage_ColorMatrix = function() {
        return (e._MagickImage_ColorMatrix = e.asm.hg).apply(null, arguments);
      }, e._MagickImage_ColorThreshold = function() {
        return (e._MagickImage_ColorThreshold = e.asm.ig).apply(null, arguments);
      }, e._MagickImage_Compare = function() {
        return (e._MagickImage_Compare = e.asm.jg).apply(null, arguments);
      }, e._MagickImage_CompareDistortion = function() {
        return (e._MagickImage_CompareDistortion = e.asm.kg).apply(null, arguments);
      }, e._MagickImage_Composite = function() {
        return (e._MagickImage_Composite = e.asm.lg).apply(null, arguments);
      }, e._MagickImage_CompositeGravity = function() {
        return (e._MagickImage_CompositeGravity = e.asm.mg).apply(null, arguments);
      }, e._MagickImage_ConnectedComponents = function() {
        return (e._MagickImage_ConnectedComponents = e.asm.ng).apply(null, arguments);
      }, e._MagickImage_Contrast = function() {
        return (e._MagickImage_Contrast = e.asm.og).apply(null, arguments);
      }, e._MagickImage_ContrastStretch = function() {
        return (e._MagickImage_ContrastStretch = e.asm.pg).apply(null, arguments);
      }, e._MagickImage_ConvexHull = function() {
        return (e._MagickImage_ConvexHull = e.asm.qg).apply(null, arguments);
      }, e._MagickImage_Convolve = function() {
        return (e._MagickImage_Convolve = e.asm.rg).apply(null, arguments);
      }, e._MagickImage_CopyPixels = function() {
        return (e._MagickImage_CopyPixels = e.asm.sg).apply(null, arguments);
      }, e._MagickImage_Crop = function() {
        return (e._MagickImage_Crop = e.asm.tg).apply(null, arguments);
      }, e._MagickImage_CropToTiles = function() {
        return (e._MagickImage_CropToTiles = e.asm.ug).apply(null, arguments);
      }, e._MagickImage_CycleColormap = function() {
        return (e._MagickImage_CycleColormap = e.asm.vg).apply(null, arguments);
      }, e._MagickImage_Decipher = function() {
        return (e._MagickImage_Decipher = e.asm.wg).apply(null, arguments);
      }, e._MagickImage_Deskew = function() {
        return (e._MagickImage_Deskew = e.asm.xg).apply(null, arguments);
      }, e._MagickImage_Despeckle = function() {
        return (e._MagickImage_Despeckle = e.asm.yg).apply(null, arguments);
      }, e._MagickImage_DetermineBitDepth = function() {
        return (e._MagickImage_DetermineBitDepth = e.asm.zg).apply(null, arguments);
      }, e._MagickImage_DetermineColorType = function() {
        return (e._MagickImage_DetermineColorType = e.asm.Ag).apply(null, arguments);
      }, e._MagickImage_Distort = function() {
        return (e._MagickImage_Distort = e.asm.Bg).apply(null, arguments);
      }, e._MagickImage_Edge = function() {
        return (e._MagickImage_Edge = e.asm.Cg).apply(null, arguments);
      }, e._MagickImage_Emboss = function() {
        return (e._MagickImage_Emboss = e.asm.Dg).apply(null, arguments);
      }, e._MagickImage_Encipher = function() {
        return (e._MagickImage_Encipher = e.asm.Eg).apply(null, arguments);
      }, e._MagickImage_Enhance = function() {
        return (e._MagickImage_Enhance = e.asm.Fg).apply(null, arguments);
      }, e._MagickImage_Equalize = function() {
        return (e._MagickImage_Equalize = e.asm.Gg).apply(null, arguments);
      }, e._MagickImage_Equals = function() {
        return (e._MagickImage_Equals = e.asm.Hg).apply(null, arguments);
      }, e._MagickImage_EvaluateFunction = function() {
        return (e._MagickImage_EvaluateFunction = e.asm.Ig).apply(null, arguments);
      }, e._MagickImage_EvaluateGeometry = function() {
        return (e._MagickImage_EvaluateGeometry = e.asm.Jg).apply(null, arguments);
      }, e._MagickImage_EvaluateOperator = function() {
        return (e._MagickImage_EvaluateOperator = e.asm.Kg).apply(null, arguments);
      }, e._MagickImage_Extent = function() {
        return (e._MagickImage_Extent = e.asm.Lg).apply(null, arguments);
      }, e._MagickImage_Flip = function() {
        return (e._MagickImage_Flip = e.asm.Mg).apply(null, arguments);
      }, e._MagickImage_FloodFill = function() {
        return (e._MagickImage_FloodFill = e.asm.Ng).apply(null, arguments);
      }, e._MagickImage_Flop = function() {
        return (e._MagickImage_Flop = e.asm.Og).apply(null, arguments);
      }, e._MagickImage_FontTypeMetrics = function() {
        return (e._MagickImage_FontTypeMetrics = e.asm.Pg).apply(null, arguments);
      }, e._MagickImage_FormatExpression = function() {
        return (e._MagickImage_FormatExpression = e.asm.Qg).apply(null, arguments);
      }, e._MagickImage_Frame = function() {
        return (e._MagickImage_Frame = e.asm.Rg).apply(null, arguments);
      }, e._MagickImage_Fx = function() {
        return (e._MagickImage_Fx = e.asm.Sg).apply(null, arguments);
      }, e._MagickImage_GammaCorrect = function() {
        return (e._MagickImage_GammaCorrect = e.asm.Tg).apply(null, arguments);
      }, e._MagickImage_GaussianBlur = function() {
        return (e._MagickImage_GaussianBlur = e.asm.Ug).apply(null, arguments);
      }, e._MagickImage_GetArtifact = function() {
        return (e._MagickImage_GetArtifact = e.asm.Vg).apply(null, arguments);
      }, e._MagickImage_GetAttribute = function() {
        return (e._MagickImage_GetAttribute = e.asm.Wg).apply(null, arguments);
      }, e._MagickImage_GetColormapColor = function() {
        return (e._MagickImage_GetColormapColor = e.asm.Xg).apply(null, arguments);
      }, e._MagickImage_GetNext = function() {
        return (e._MagickImage_GetNext = e.asm.Yg).apply(null, arguments);
      }, e._MagickImage_GetNextArtifactName = function() {
        return (e._MagickImage_GetNextArtifactName = e.asm.Zg).apply(null, arguments);
      }, e._MagickImage_GetNextAttributeName = function() {
        return (e._MagickImage_GetNextAttributeName = e.asm._g).apply(null, arguments);
      }, e._MagickImage_GetNextProfileName = function() {
        return (e._MagickImage_GetNextProfileName = e.asm.$g).apply(null, arguments);
      }, e._MagickImage_GetProfile = function() {
        return (e._MagickImage_GetProfile = e.asm.ah).apply(null, arguments);
      }, e._MagickImage_GetReadMask = function() {
        return (e._MagickImage_GetReadMask = e.asm.bh).apply(null, arguments);
      }, e._MagickImage_GetWriteMask = function() {
        return (e._MagickImage_GetWriteMask = e.asm.ch).apply(null, arguments);
      }, e._MagickImage_Grayscale = function() {
        return (e._MagickImage_Grayscale = e.asm.dh).apply(null, arguments);
      }, e._MagickImage_HaldClut = function() {
        return (e._MagickImage_HaldClut = e.asm.eh).apply(null, arguments);
      }, e._MagickImage_HasChannel = function() {
        return (e._MagickImage_HasChannel = e.asm.fh).apply(null, arguments);
      }, e._MagickImage_HasProfile = function() {
        return (e._MagickImage_HasProfile = e.asm.gh).apply(null, arguments);
      }, e._MagickImage_Histogram = function() {
        return (e._MagickImage_Histogram = e.asm.hh).apply(null, arguments);
      }, e._MagickImage_HoughLine = function() {
        return (e._MagickImage_HoughLine = e.asm.ih).apply(null, arguments);
      }, e._MagickImage_Implode = function() {
        return (e._MagickImage_Implode = e.asm.jh).apply(null, arguments);
      }, e._MagickImage_ImportPixels = function() {
        return (e._MagickImage_ImportPixels = e.asm.kh).apply(null, arguments);
      }, e._MagickImage_Integral = function() {
        return (e._MagickImage_Integral = e.asm.lh).apply(null, arguments);
      }, e._MagickImage_InterpolativeResize = function() {
        return (e._MagickImage_InterpolativeResize = e.asm.mh).apply(null, arguments);
      }, e._MagickImage_Kmeans = function() {
        return (e._MagickImage_Kmeans = e.asm.nh).apply(null, arguments);
      }, e._MagickImage_Kuwahara = function() {
        return (e._MagickImage_Kuwahara = e.asm.oh).apply(null, arguments);
      }, e._MagickImage_Level = function() {
        return (e._MagickImage_Level = e.asm.ph).apply(null, arguments);
      }, e._MagickImage_LevelColors = function() {
        return (e._MagickImage_LevelColors = e.asm.qh).apply(null, arguments);
      }, e._MagickImage_Levelize = function() {
        return (e._MagickImage_Levelize = e.asm.rh).apply(null, arguments);
      }, e._MagickImage_LinearStretch = function() {
        return (e._MagickImage_LinearStretch = e.asm.sh).apply(null, arguments);
      }, e._MagickImage_LiquidRescale = function() {
        return (e._MagickImage_LiquidRescale = e.asm.th).apply(null, arguments);
      }, e._MagickImage_LocalContrast = function() {
        return (e._MagickImage_LocalContrast = e.asm.uh).apply(null, arguments);
      }, e._MagickImage_Magnify = function() {
        return (e._MagickImage_Magnify = e.asm.vh).apply(null, arguments);
      }, e._MagickImage_Map = function() {
        return (e._MagickImage_Map = e.asm.wh).apply(null, arguments);
      }, e._MagickImage_MeanShift = function() {
        return (e._MagickImage_MeanShift = e.asm.xh).apply(null, arguments);
      }, e._MagickImage_Minify = function() {
        return (e._MagickImage_Minify = e.asm.yh).apply(null, arguments);
      }, e._MagickImage_MinimumBoundingBox = function() {
        return (e._MagickImage_MinimumBoundingBox = e.asm.zh).apply(null, arguments);
      }, e._MagickImage_Modulate = function() {
        return (e._MagickImage_Modulate = e.asm.Ah).apply(null, arguments);
      }, e._MagickImage_Moments = function() {
        return (e._MagickImage_Moments = e.asm.Bh).apply(null, arguments);
      }, e._MagickImage_Morphology = function() {
        return (e._MagickImage_Morphology = e.asm.Ch).apply(null, arguments);
      }, e._MagickImage_MotionBlur = function() {
        return (e._MagickImage_MotionBlur = e.asm.Dh).apply(null, arguments);
      }, e._MagickImage_Negate = function() {
        return (e._MagickImage_Negate = e.asm.Eh).apply(null, arguments);
      }, e._MagickImage_Normalize = function() {
        return (e._MagickImage_Normalize = e.asm.Fh).apply(null, arguments);
      }, e._MagickImage_OilPaint = function() {
        return (e._MagickImage_OilPaint = e.asm.Gh).apply(null, arguments);
      }, e._MagickImage_Opaque = function() {
        return (e._MagickImage_Opaque = e.asm.Hh).apply(null, arguments);
      }, e._MagickImage_OrderedDither = function() {
        return (e._MagickImage_OrderedDither = e.asm.Ih).apply(null, arguments);
      }, e._MagickImage_Perceptible = function() {
        return (e._MagickImage_Perceptible = e.asm.Jh).apply(null, arguments);
      }, e._MagickImage_PerceptualHash = function() {
        return (e._MagickImage_PerceptualHash = e.asm.Kh).apply(null, arguments);
      }, e._MagickImage_Quantize = function() {
        return (e._MagickImage_Quantize = e.asm.Lh).apply(null, arguments);
      }, e._MagickImage_Polaroid = function() {
        return (e._MagickImage_Polaroid = e.asm.Mh).apply(null, arguments);
      }, e._MagickImage_Posterize = function() {
        return (e._MagickImage_Posterize = e.asm.Nh).apply(null, arguments);
      }, e._MagickImage_RaiseOrLower = function() {
        return (e._MagickImage_RaiseOrLower = e.asm.Oh).apply(null, arguments);
      }, e._MagickImage_RandomThreshold = function() {
        return (e._MagickImage_RandomThreshold = e.asm.Ph).apply(null, arguments);
      }, e._MagickImage_RangeThreshold = function() {
        return (e._MagickImage_RangeThreshold = e.asm.Qh).apply(null, arguments);
      }, e._MagickImage_ReadBlob = function() {
        return (e._MagickImage_ReadBlob = e.asm.Rh).apply(null, arguments);
      }, e._MagickImage_ReadFile = function() {
        return (e._MagickImage_ReadFile = e.asm.Sh).apply(null, arguments);
      }, e._MagickImage_ReadPixels = function() {
        return (e._MagickImage_ReadPixels = e.asm.Th).apply(null, arguments);
      }, e._MagickImage_ReadStream = function() {
        return (e._MagickImage_ReadStream = e.asm.Uh).apply(null, arguments);
      }, e._MagickImage_RegionMask = function() {
        return (e._MagickImage_RegionMask = e.asm.Vh).apply(null, arguments);
      }, e._MagickImage_RemoveArtifact = function() {
        return (e._MagickImage_RemoveArtifact = e.asm.Wh).apply(null, arguments);
      }, e._MagickImage_RemoveAttribute = function() {
        return (e._MagickImage_RemoveAttribute = e.asm.Xh).apply(null, arguments);
      }, e._MagickImage_RemoveProfile = function() {
        return (e._MagickImage_RemoveProfile = e.asm.Yh).apply(null, arguments);
      }, e._MagickImage_ResetArtifactIterator = function() {
        return (e._MagickImage_ResetArtifactIterator = e.asm.Zh).apply(null, arguments);
      }, e._MagickImage_ResetAttributeIterator = function() {
        return (e._MagickImage_ResetAttributeIterator = e.asm._h).apply(null, arguments);
      }, e._MagickImage_ResetProfileIterator = function() {
        return (e._MagickImage_ResetProfileIterator = e.asm.$h).apply(null, arguments);
      }, e._MagickImage_Resample = function() {
        return (e._MagickImage_Resample = e.asm.ai).apply(null, arguments);
      }, e._MagickImage_Resize = function() {
        return (e._MagickImage_Resize = e.asm.bi).apply(null, arguments);
      }, e._MagickImage_Roll = function() {
        return (e._MagickImage_Roll = e.asm.ci).apply(null, arguments);
      }, e._MagickImage_Rotate = function() {
        return (e._MagickImage_Rotate = e.asm.di).apply(null, arguments);
      }, e._MagickImage_RotationalBlur = function() {
        return (e._MagickImage_RotationalBlur = e.asm.ei).apply(null, arguments);
      }, e._MagickImage_Sample = function() {
        return (e._MagickImage_Sample = e.asm.fi).apply(null, arguments);
      }, e._MagickImage_Scale = function() {
        return (e._MagickImage_Scale = e.asm.gi).apply(null, arguments);
      }, e._MagickImage_Segment = function() {
        return (e._MagickImage_Segment = e.asm.hi).apply(null, arguments);
      }, e._MagickImage_SelectiveBlur = function() {
        return (e._MagickImage_SelectiveBlur = e.asm.ii).apply(null, arguments);
      }, e._MagickImage_Separate = function() {
        return (e._MagickImage_Separate = e.asm.ji).apply(null, arguments);
      }, e._MagickImage_SepiaTone = function() {
        return (e._MagickImage_SepiaTone = e.asm.ki).apply(null, arguments);
      }, e._MagickImage_SetAlpha = function() {
        return (e._MagickImage_SetAlpha = e.asm.li).apply(null, arguments);
      }, e._MagickImage_SetArtifact = function() {
        return (e._MagickImage_SetArtifact = e.asm.mi).apply(null, arguments);
      }, e._MagickImage_SetAttribute = function() {
        return (e._MagickImage_SetAttribute = e.asm.ni).apply(null, arguments);
      }, e._MagickImage_SetBitDepth = function() {
        return (e._MagickImage_SetBitDepth = e.asm.oi).apply(null, arguments);
      }, e._MagickImage_SetColormapColor = function() {
        return (e._MagickImage_SetColormapColor = e.asm.pi).apply(null, arguments);
      }, e._MagickImage_SetColorMetric = function() {
        return (e._MagickImage_SetColorMetric = e.asm.qi).apply(null, arguments);
      }, e._MagickImage_SetNext = function() {
        return (e._MagickImage_SetNext = e.asm.ri).apply(null, arguments);
      }, e._MagickImage_SetProfile = function() {
        return (e._MagickImage_SetProfile = e.asm.si).apply(null, arguments);
      }, e._MagickImage_SetProgressDelegate = function() {
        return (e._MagickImage_SetProgressDelegate = e.asm.ti).apply(null, arguments);
      }, e._MagickImage_SetReadMask = function() {
        return (e._MagickImage_SetReadMask = e.asm.ui).apply(null, arguments);
      }, e._MagickImage_SetWriteMask = function() {
        return (e._MagickImage_SetWriteMask = e.asm.vi).apply(null, arguments);
      }, e._MagickImage_Shade = function() {
        return (e._MagickImage_Shade = e.asm.wi).apply(null, arguments);
      }, e._MagickImage_Shadow = function() {
        return (e._MagickImage_Shadow = e.asm.xi).apply(null, arguments);
      }, e._MagickImage_Sharpen = function() {
        return (e._MagickImage_Sharpen = e.asm.yi).apply(null, arguments);
      }, e._MagickImage_Shave = function() {
        return (e._MagickImage_Shave = e.asm.zi).apply(null, arguments);
      }, e._MagickImage_Shear = function() {
        return (e._MagickImage_Shear = e.asm.Ai).apply(null, arguments);
      }, e._MagickImage_SigmoidalContrast = function() {
        return (e._MagickImage_SigmoidalContrast = e.asm.Bi).apply(null, arguments);
      }, e._MagickImage_SparseColor = function() {
        return (e._MagickImage_SparseColor = e.asm.Ci).apply(null, arguments);
      }, e._MagickImage_Spread = function() {
        return (e._MagickImage_Spread = e.asm.Di).apply(null, arguments);
      }, e._MagickImage_Sketch = function() {
        return (e._MagickImage_Sketch = e.asm.Ei).apply(null, arguments);
      }, e._MagickImage_Solarize = function() {
        return (e._MagickImage_Solarize = e.asm.Fi).apply(null, arguments);
      }, e._MagickImage_SortPixels = function() {
        return (e._MagickImage_SortPixels = e.asm.Gi).apply(null, arguments);
      }, e._MagickImage_Splice = function() {
        return (e._MagickImage_Splice = e.asm.Hi).apply(null, arguments);
      }, e._MagickImage_Statistic = function() {
        return (e._MagickImage_Statistic = e.asm.Ii).apply(null, arguments);
      }, e._MagickImage_Statistics = function() {
        return (e._MagickImage_Statistics = e.asm.Ji).apply(null, arguments);
      }, e._MagickImage_Stegano = function() {
        return (e._MagickImage_Stegano = e.asm.Ki).apply(null, arguments);
      }, e._MagickImage_Stereo = function() {
        return (e._MagickImage_Stereo = e.asm.Li).apply(null, arguments);
      }, e._MagickImage_Strip = function() {
        return (e._MagickImage_Strip = e.asm.Mi).apply(null, arguments);
      }, e._MagickImage_SubImageSearch = function() {
        return (e._MagickImage_SubImageSearch = e.asm.Ni).apply(null, arguments);
      }, e._MagickImage_Swirl = function() {
        return (e._MagickImage_Swirl = e.asm.Oi).apply(null, arguments);
      }, e._MagickImage_Texture = function() {
        return (e._MagickImage_Texture = e.asm.Pi).apply(null, arguments);
      }, e._MagickImage_Threshold = function() {
        return (e._MagickImage_Threshold = e.asm.Qi).apply(null, arguments);
      }, e._MagickImage_Thumbnail = function() {
        return (e._MagickImage_Thumbnail = e.asm.Ri).apply(null, arguments);
      }, e._MagickImage_Tint = function() {
        return (e._MagickImage_Tint = e.asm.Si).apply(null, arguments);
      }, e._MagickImage_Transparent = function() {
        return (e._MagickImage_Transparent = e.asm.Ti).apply(null, arguments);
      }, e._MagickImage_TransparentChroma = function() {
        return (e._MagickImage_TransparentChroma = e.asm.Ui).apply(null, arguments);
      }, e._MagickImage_Transpose = function() {
        return (e._MagickImage_Transpose = e.asm.Vi).apply(null, arguments);
      }, e._MagickImage_Transverse = function() {
        return (e._MagickImage_Transverse = e.asm.Wi).apply(null, arguments);
      }, e._MagickImage_Trim = function() {
        return (e._MagickImage_Trim = e.asm.Xi).apply(null, arguments);
      }, e._MagickImage_UniqueColors = function() {
        return (e._MagickImage_UniqueColors = e.asm.Yi).apply(null, arguments);
      }, e._MagickImage_UnsharpMask = function() {
        return (e._MagickImage_UnsharpMask = e.asm.Zi).apply(null, arguments);
      }, e._MagickImage_Vignette = function() {
        return (e._MagickImage_Vignette = e.asm._i).apply(null, arguments);
      }, e._MagickImage_Wave = function() {
        return (e._MagickImage_Wave = e.asm.$i).apply(null, arguments);
      }, e._MagickImage_WaveletDenoise = function() {
        return (e._MagickImage_WaveletDenoise = e.asm.aj).apply(null, arguments);
      }, e._MagickImage_WhiteBalance = function() {
        return (e._MagickImage_WhiteBalance = e.asm.bj).apply(null, arguments);
      }, e._MagickImage_WhiteThreshold = function() {
        return (e._MagickImage_WhiteThreshold = e.asm.cj).apply(null, arguments);
      }, e._MagickImage_WriteBlob = function() {
        return (e._MagickImage_WriteBlob = e.asm.dj).apply(null, arguments);
      }, e._MagickImage_WriteFile = function() {
        return (e._MagickImage_WriteFile = e.asm.ej).apply(null, arguments);
      }, e._MagickImage_WriteStream = function() {
        return (e._MagickImage_WriteStream = e.asm.fj).apply(null, arguments);
      }, e._MagickImageCollection_Append = function() {
        return (e._MagickImageCollection_Append = e.asm.gj).apply(null, arguments);
      }, e._MagickImageCollection_Coalesce = function() {
        return (e._MagickImageCollection_Coalesce = e.asm.hj).apply(null, arguments);
      }, e._MagickImageCollection_Combine = function() {
        return (e._MagickImageCollection_Combine = e.asm.ij).apply(null, arguments);
      }, e._MagickImageCollection_Complex = function() {
        return (e._MagickImageCollection_Complex = e.asm.jj).apply(null, arguments);
      }, e._MagickImageCollection_Deconstruct = function() {
        return (e._MagickImageCollection_Deconstruct = e.asm.kj).apply(null, arguments);
      }, e._MagickImageCollection_Dispose = function() {
        return (e._MagickImageCollection_Dispose = e.asm.lj).apply(null, arguments);
      }, e._MagickImageCollection_Evaluate = function() {
        return (e._MagickImageCollection_Evaluate = e.asm.mj).apply(null, arguments);
      }, e._MagickImageCollection_Fx = function() {
        return (e._MagickImageCollection_Fx = e.asm.nj).apply(null, arguments);
      }, e._MagickImageCollection_Map = function() {
        return (e._MagickImageCollection_Map = e.asm.oj).apply(null, arguments);
      }, e._MagickImageCollection_Merge = function() {
        return (e._MagickImageCollection_Merge = e.asm.pj).apply(null, arguments);
      }, e._MagickImageCollection_Montage = function() {
        return (e._MagickImageCollection_Montage = e.asm.qj).apply(null, arguments);
      }, e._MagickImageCollection_Morph = function() {
        return (e._MagickImageCollection_Morph = e.asm.rj).apply(null, arguments);
      }, e._MagickImageCollection_Optimize = function() {
        return (e._MagickImageCollection_Optimize = e.asm.sj).apply(null, arguments);
      }, e._MagickImageCollection_OptimizePlus = function() {
        return (e._MagickImageCollection_OptimizePlus = e.asm.tj).apply(null, arguments);
      }, e._MagickImageCollection_OptimizeTransparency = function() {
        return (e._MagickImageCollection_OptimizeTransparency = e.asm.uj).apply(null, arguments);
      }, e._MagickImageCollection_Polynomial = function() {
        return (e._MagickImageCollection_Polynomial = e.asm.vj).apply(null, arguments);
      }, e._MagickImageCollection_Quantize = function() {
        return (e._MagickImageCollection_Quantize = e.asm.wj).apply(null, arguments);
      }, e._MagickImageCollection_ReadBlob = function() {
        return (e._MagickImageCollection_ReadBlob = e.asm.xj).apply(null, arguments);
      }, e._MagickImageCollection_ReadFile = function() {
        return (e._MagickImageCollection_ReadFile = e.asm.yj).apply(null, arguments);
      }, e._MagickImageCollection_ReadStream = function() {
        return (e._MagickImageCollection_ReadStream = e.asm.zj).apply(null, arguments);
      }, e._MagickImageCollection_Smush = function() {
        return (e._MagickImageCollection_Smush = e.asm.Aj).apply(null, arguments);
      }, e._MagickImageCollection_WriteFile = function() {
        return (e._MagickImageCollection_WriteFile = e.asm.Bj).apply(null, arguments);
      }, e._MagickImageCollection_WriteStream = function() {
        return (e._MagickImageCollection_WriteStream = e.asm.Cj).apply(null, arguments);
      }, e._DoubleMatrix_Create = function() {
        return (e._DoubleMatrix_Create = e.asm.Dj).apply(null, arguments);
      }, e._DoubleMatrix_Dispose = function() {
        return (e._DoubleMatrix_Dispose = e.asm.Ej).apply(null, arguments);
      }, e._OpenCL_GetDevices = function() {
        return (e._OpenCL_GetDevices = e.asm.Fj).apply(null, arguments);
      }, e._OpenCL_GetDevice = function() {
        return (e._OpenCL_GetDevice = e.asm.Gj).apply(null, arguments);
      }, e._OpenCL_GetEnabled = function() {
        return (e._OpenCL_GetEnabled = e.asm.Hj).apply(null, arguments);
      }, e._OpenCL_SetEnabled = function() {
        return (e._OpenCL_SetEnabled = e.asm.Ij).apply(null, arguments);
      }, e._OpenCLDevice_DeviceType_Get = function() {
        return (e._OpenCLDevice_DeviceType_Get = e.asm.Jj).apply(null, arguments);
      }, e._OpenCLDevice_BenchmarkScore_Get = function() {
        return (e._OpenCLDevice_BenchmarkScore_Get = e.asm.Kj).apply(null, arguments);
      }, e._OpenCLDevice_IsEnabled_Get = function() {
        return (e._OpenCLDevice_IsEnabled_Get = e.asm.Lj).apply(null, arguments);
      }, e._OpenCLDevice_IsEnabled_Set = function() {
        return (e._OpenCLDevice_IsEnabled_Set = e.asm.Mj).apply(null, arguments);
      }, e._OpenCLDevice_Name_Get = function() {
        return (e._OpenCLDevice_Name_Get = e.asm.Nj).apply(null, arguments);
      }, e._OpenCLDevice_Version_Get = function() {
        return (e._OpenCLDevice_Version_Get = e.asm.Oj).apply(null, arguments);
      }, e._OpenCLDevice_GetKernelProfileRecords = function() {
        return (e._OpenCLDevice_GetKernelProfileRecords = e.asm.Pj).apply(null, arguments);
      }, e._OpenCLDevice_GetKernelProfileRecord = function() {
        return (e._OpenCLDevice_GetKernelProfileRecord = e.asm.Qj).apply(null, arguments);
      }, e._OpenCLDevice_SetProfileKernels = function() {
        return (e._OpenCLDevice_SetProfileKernels = e.asm.Rj).apply(null, arguments);
      }, e._OpenCLKernelProfileRecord_Count_Get = function() {
        return (e._OpenCLKernelProfileRecord_Count_Get = e.asm.Sj).apply(null, arguments);
      }, e._OpenCLKernelProfileRecord_Name_Get = function() {
        return (e._OpenCLKernelProfileRecord_Name_Get = e.asm.Tj).apply(null, arguments);
      }, e._OpenCLKernelProfileRecord_MaximumDuration_Get = function() {
        return (e._OpenCLKernelProfileRecord_MaximumDuration_Get = e.asm.Uj).apply(null, arguments);
      }, e._OpenCLKernelProfileRecord_MinimumDuration_Get = function() {
        return (e._OpenCLKernelProfileRecord_MinimumDuration_Get = e.asm.Vj).apply(null, arguments);
      }, e._OpenCLKernelProfileRecord_TotalDuration_Get = function() {
        return (e._OpenCLKernelProfileRecord_TotalDuration_Get = e.asm.Wj).apply(null, arguments);
      }, e._JpegOptimizer_CompressFile = function() {
        return (e._JpegOptimizer_CompressFile = e.asm.Xj).apply(null, arguments);
      }, e._JpegOptimizer_CompressStream = function() {
        return (e._JpegOptimizer_CompressStream = e.asm.Yj).apply(null, arguments);
      };
      var Xe = e._malloc = function() {
        return (Xe = e._malloc = e.asm.Zj).apply(null, arguments);
      }, Ie = e._free = function() {
        return (Ie = e._free = e.asm._j).apply(null, arguments);
      }, ct = function() {
        return (ct = e.asm.$j).apply(null, arguments);
      };
      e._PixelCollection_Create = function() {
        return (e._PixelCollection_Create = e.asm.ak).apply(null, arguments);
      }, e._PixelCollection_Dispose = function() {
        return (e._PixelCollection_Dispose = e.asm.bk).apply(null, arguments);
      }, e._PixelCollection_GetArea = function() {
        return (e._PixelCollection_GetArea = e.asm.ck).apply(null, arguments);
      }, e._PixelCollection_SetArea = function() {
        return (e._PixelCollection_SetArea = e.asm.dk).apply(null, arguments);
      }, e._PixelCollection_ToByteArray = function() {
        return (e._PixelCollection_ToByteArray = e.asm.ek).apply(null, arguments);
      }, e._PixelCollection_ToShortArray = function() {
        return (e._PixelCollection_ToShortArray = e.asm.fk).apply(null, arguments);
      }, e._Quantum_Depth_Get = function() {
        return (e._Quantum_Depth_Get = e.asm.gk).apply(null, arguments);
      }, e._Quantum_Max_Get = function() {
        return (e._Quantum_Max_Get = e.asm.hk).apply(null, arguments);
      }, e._Quantum_ScaleToByte = function() {
        return (e._Quantum_ScaleToByte = e.asm.ik).apply(null, arguments);
      }, e._ResourceLimits_Area_Get = function() {
        return (e._ResourceLimits_Area_Get = e.asm.jk).apply(null, arguments);
      }, e._ResourceLimits_Area_Set = function() {
        return (e._ResourceLimits_Area_Set = e.asm.kk).apply(null, arguments);
      }, e._ResourceLimits_Disk_Get = function() {
        return (e._ResourceLimits_Disk_Get = e.asm.lk).apply(null, arguments);
      }, e._ResourceLimits_Disk_Set = function() {
        return (e._ResourceLimits_Disk_Set = e.asm.mk).apply(null, arguments);
      }, e._ResourceLimits_Height_Get = function() {
        return (e._ResourceLimits_Height_Get = e.asm.nk).apply(null, arguments);
      }, e._ResourceLimits_Height_Set = function() {
        return (e._ResourceLimits_Height_Set = e.asm.ok).apply(null, arguments);
      }, e._ResourceLimits_ListLength_Get = function() {
        return (e._ResourceLimits_ListLength_Get = e.asm.pk).apply(null, arguments);
      }, e._ResourceLimits_ListLength_Set = function() {
        return (e._ResourceLimits_ListLength_Set = e.asm.qk).apply(null, arguments);
      }, e._ResourceLimits_MaxMemoryRequest_Get = function() {
        return (e._ResourceLimits_MaxMemoryRequest_Get = e.asm.rk).apply(null, arguments);
      }, e._ResourceLimits_MaxMemoryRequest_Set = function() {
        return (e._ResourceLimits_MaxMemoryRequest_Set = e.asm.sk).apply(null, arguments);
      }, e._ResourceLimits_Memory_Get = function() {
        return (e._ResourceLimits_Memory_Get = e.asm.tk).apply(null, arguments);
      }, e._ResourceLimits_Memory_Set = function() {
        return (e._ResourceLimits_Memory_Set = e.asm.uk).apply(null, arguments);
      }, e._ResourceLimits_Thread_Get = function() {
        return (e._ResourceLimits_Thread_Get = e.asm.vk).apply(null, arguments);
      }, e._ResourceLimits_Thread_Set = function() {
        return (e._ResourceLimits_Thread_Set = e.asm.wk).apply(null, arguments);
      }, e._ResourceLimits_Throttle_Get = function() {
        return (e._ResourceLimits_Throttle_Get = e.asm.xk).apply(null, arguments);
      }, e._ResourceLimits_Throttle_Set = function() {
        return (e._ResourceLimits_Throttle_Set = e.asm.yk).apply(null, arguments);
      }, e._ResourceLimits_Width_Get = function() {
        return (e._ResourceLimits_Width_Get = e.asm.zk).apply(null, arguments);
      }, e._ResourceLimits_Width_Set = function() {
        return (e._ResourceLimits_Width_Set = e.asm.Ak).apply(null, arguments);
      }, e._ResourceLimits_LimitMemory = function() {
        return (e._ResourceLimits_LimitMemory = e.asm.Bk).apply(null, arguments);
      }, e._DrawingSettings_Create = function() {
        return (e._DrawingSettings_Create = e.asm.Ck).apply(null, arguments);
      }, e._DrawingSettings_Dispose = function() {
        return (e._DrawingSettings_Dispose = e.asm.Dk).apply(null, arguments);
      }, e._DrawingSettings_BorderColor_Get = function() {
        return (e._DrawingSettings_BorderColor_Get = e.asm.Ek).apply(null, arguments);
      }, e._DrawingSettings_BorderColor_Set = function() {
        return (e._DrawingSettings_BorderColor_Set = e.asm.Fk).apply(null, arguments);
      }, e._DrawingSettings_FillColor_Get = function() {
        return (e._DrawingSettings_FillColor_Get = e.asm.Gk).apply(null, arguments);
      }, e._DrawingSettings_FillColor_Set = function() {
        return (e._DrawingSettings_FillColor_Set = e.asm.Hk).apply(null, arguments);
      }, e._DrawingSettings_FillRule_Get = function() {
        return (e._DrawingSettings_FillRule_Get = e.asm.Ik).apply(null, arguments);
      }, e._DrawingSettings_FillRule_Set = function() {
        return (e._DrawingSettings_FillRule_Set = e.asm.Jk).apply(null, arguments);
      }, e._DrawingSettings_Font_Get = function() {
        return (e._DrawingSettings_Font_Get = e.asm.Kk).apply(null, arguments);
      }, e._DrawingSettings_Font_Set = function() {
        return (e._DrawingSettings_Font_Set = e.asm.Lk).apply(null, arguments);
      }, e._DrawingSettings_FontFamily_Get = function() {
        return (e._DrawingSettings_FontFamily_Get = e.asm.Mk).apply(null, arguments);
      }, e._DrawingSettings_FontFamily_Set = function() {
        return (e._DrawingSettings_FontFamily_Set = e.asm.Nk).apply(null, arguments);
      }, e._DrawingSettings_FontPointsize_Get = function() {
        return (e._DrawingSettings_FontPointsize_Get = e.asm.Ok).apply(null, arguments);
      }, e._DrawingSettings_FontPointsize_Set = function() {
        return (e._DrawingSettings_FontPointsize_Set = e.asm.Pk).apply(null, arguments);
      }, e._DrawingSettings_FontStyle_Get = function() {
        return (e._DrawingSettings_FontStyle_Get = e.asm.Qk).apply(null, arguments);
      }, e._DrawingSettings_FontStyle_Set = function() {
        return (e._DrawingSettings_FontStyle_Set = e.asm.Rk).apply(null, arguments);
      }, e._DrawingSettings_FontWeight_Get = function() {
        return (e._DrawingSettings_FontWeight_Get = e.asm.Sk).apply(null, arguments);
      }, e._DrawingSettings_FontWeight_Set = function() {
        return (e._DrawingSettings_FontWeight_Set = e.asm.Tk).apply(null, arguments);
      }, e._DrawingSettings_StrokeAntiAlias_Get = function() {
        return (e._DrawingSettings_StrokeAntiAlias_Get = e.asm.Uk).apply(null, arguments);
      }, e._DrawingSettings_StrokeAntiAlias_Set = function() {
        return (e._DrawingSettings_StrokeAntiAlias_Set = e.asm.Vk).apply(null, arguments);
      }, e._DrawingSettings_StrokeColor_Get = function() {
        return (e._DrawingSettings_StrokeColor_Get = e.asm.Wk).apply(null, arguments);
      }, e._DrawingSettings_StrokeColor_Set = function() {
        return (e._DrawingSettings_StrokeColor_Set = e.asm.Xk).apply(null, arguments);
      }, e._DrawingSettings_StrokeDashOffset_Get = function() {
        return (e._DrawingSettings_StrokeDashOffset_Get = e.asm.Yk).apply(null, arguments);
      }, e._DrawingSettings_StrokeDashOffset_Set = function() {
        return (e._DrawingSettings_StrokeDashOffset_Set = e.asm.Zk).apply(null, arguments);
      }, e._DrawingSettings_StrokeLineCap_Get = function() {
        return (e._DrawingSettings_StrokeLineCap_Get = e.asm._k).apply(null, arguments);
      }, e._DrawingSettings_StrokeLineCap_Set = function() {
        return (e._DrawingSettings_StrokeLineCap_Set = e.asm.$k).apply(null, arguments);
      }, e._DrawingSettings_StrokeLineJoin_Get = function() {
        return (e._DrawingSettings_StrokeLineJoin_Get = e.asm.al).apply(null, arguments);
      }, e._DrawingSettings_StrokeLineJoin_Set = function() {
        return (e._DrawingSettings_StrokeLineJoin_Set = e.asm.bl).apply(null, arguments);
      }, e._DrawingSettings_StrokeMiterLimit_Get = function() {
        return (e._DrawingSettings_StrokeMiterLimit_Get = e.asm.cl).apply(null, arguments);
      }, e._DrawingSettings_StrokeMiterLimit_Set = function() {
        return (e._DrawingSettings_StrokeMiterLimit_Set = e.asm.dl).apply(null, arguments);
      }, e._DrawingSettings_StrokeWidth_Get = function() {
        return (e._DrawingSettings_StrokeWidth_Get = e.asm.el).apply(null, arguments);
      }, e._DrawingSettings_StrokeWidth_Set = function() {
        return (e._DrawingSettings_StrokeWidth_Set = e.asm.fl).apply(null, arguments);
      }, e._DrawingSettings_TextAntiAlias_Get = function() {
        return (e._DrawingSettings_TextAntiAlias_Get = e.asm.gl).apply(null, arguments);
      }, e._DrawingSettings_TextAntiAlias_Set = function() {
        return (e._DrawingSettings_TextAntiAlias_Set = e.asm.hl).apply(null, arguments);
      }, e._DrawingSettings_TextDirection_Get = function() {
        return (e._DrawingSettings_TextDirection_Get = e.asm.il).apply(null, arguments);
      }, e._DrawingSettings_TextDirection_Set = function() {
        return (e._DrawingSettings_TextDirection_Set = e.asm.jl).apply(null, arguments);
      }, e._DrawingSettings_TextEncoding_Get = function() {
        return (e._DrawingSettings_TextEncoding_Get = e.asm.kl).apply(null, arguments);
      }, e._DrawingSettings_TextEncoding_Set = function() {
        return (e._DrawingSettings_TextEncoding_Set = e.asm.ll).apply(null, arguments);
      }, e._DrawingSettings_TextGravity_Get = function() {
        return (e._DrawingSettings_TextGravity_Get = e.asm.ml).apply(null, arguments);
      }, e._DrawingSettings_TextGravity_Set = function() {
        return (e._DrawingSettings_TextGravity_Set = e.asm.nl).apply(null, arguments);
      }, e._DrawingSettings_TextInterlineSpacing_Get = function() {
        return (e._DrawingSettings_TextInterlineSpacing_Get = e.asm.ol).apply(null, arguments);
      }, e._DrawingSettings_TextInterlineSpacing_Set = function() {
        return (e._DrawingSettings_TextInterlineSpacing_Set = e.asm.pl).apply(null, arguments);
      }, e._DrawingSettings_TextInterwordSpacing_Get = function() {
        return (e._DrawingSettings_TextInterwordSpacing_Get = e.asm.ql).apply(null, arguments);
      }, e._DrawingSettings_TextInterwordSpacing_Set = function() {
        return (e._DrawingSettings_TextInterwordSpacing_Set = e.asm.rl).apply(null, arguments);
      }, e._DrawingSettings_TextKerning_Get = function() {
        return (e._DrawingSettings_TextKerning_Get = e.asm.sl).apply(null, arguments);
      }, e._DrawingSettings_TextKerning_Set = function() {
        return (e._DrawingSettings_TextKerning_Set = e.asm.tl).apply(null, arguments);
      }, e._DrawingSettings_TextUnderColor_Get = function() {
        return (e._DrawingSettings_TextUnderColor_Get = e.asm.ul).apply(null, arguments);
      }, e._DrawingSettings_TextUnderColor_Set = function() {
        return (e._DrawingSettings_TextUnderColor_Set = e.asm.vl).apply(null, arguments);
      }, e._DrawingSettings_SetAffine = function() {
        return (e._DrawingSettings_SetAffine = e.asm.wl).apply(null, arguments);
      }, e._DrawingSettings_SetFillPattern = function() {
        return (e._DrawingSettings_SetFillPattern = e.asm.xl).apply(null, arguments);
      }, e._DrawingSettings_SetStrokeDashArray = function() {
        return (e._DrawingSettings_SetStrokeDashArray = e.asm.yl).apply(null, arguments);
      }, e._DrawingSettings_SetStrokePattern = function() {
        return (e._DrawingSettings_SetStrokePattern = e.asm.zl).apply(null, arguments);
      }, e._DrawingSettings_SetText = function() {
        return (e._DrawingSettings_SetText = e.asm.Al).apply(null, arguments);
      }, e._MagickSettings_Create = function() {
        return (e._MagickSettings_Create = e.asm.Bl).apply(null, arguments);
      }, e._MagickSettings_Dispose = function() {
        return (e._MagickSettings_Dispose = e.asm.Cl).apply(null, arguments);
      }, e._MagickSettings_AntiAlias_Get = function() {
        return (e._MagickSettings_AntiAlias_Get = e.asm.Dl).apply(null, arguments);
      }, e._MagickSettings_AntiAlias_Set = function() {
        return (e._MagickSettings_AntiAlias_Set = e.asm.El).apply(null, arguments);
      }, e._MagickSettings_BackgroundColor_Get = function() {
        return (e._MagickSettings_BackgroundColor_Get = e.asm.Fl).apply(null, arguments);
      }, e._MagickSettings_BackgroundColor_Set = function() {
        return (e._MagickSettings_BackgroundColor_Set = e.asm.Gl).apply(null, arguments);
      }, e._MagickSettings_ColorSpace_Get = function() {
        return (e._MagickSettings_ColorSpace_Get = e.asm.Hl).apply(null, arguments);
      }, e._MagickSettings_ColorSpace_Set = function() {
        return (e._MagickSettings_ColorSpace_Set = e.asm.Il).apply(null, arguments);
      }, e._MagickSettings_ColorType_Get = function() {
        return (e._MagickSettings_ColorType_Get = e.asm.Jl).apply(null, arguments);
      }, e._MagickSettings_ColorType_Set = function() {
        return (e._MagickSettings_ColorType_Set = e.asm.Kl).apply(null, arguments);
      }, e._MagickSettings_Compression_Get = function() {
        return (e._MagickSettings_Compression_Get = e.asm.Ll).apply(null, arguments);
      }, e._MagickSettings_Compression_Set = function() {
        return (e._MagickSettings_Compression_Set = e.asm.Ml).apply(null, arguments);
      }, e._MagickSettings_Debug_Get = function() {
        return (e._MagickSettings_Debug_Get = e.asm.Nl).apply(null, arguments);
      }, e._MagickSettings_Debug_Set = function() {
        return (e._MagickSettings_Debug_Set = e.asm.Ol).apply(null, arguments);
      }, e._MagickSettings_Density_Get = function() {
        return (e._MagickSettings_Density_Get = e.asm.Pl).apply(null, arguments);
      }, e._MagickSettings_Density_Set = function() {
        return (e._MagickSettings_Density_Set = e.asm.Ql).apply(null, arguments);
      }, e._MagickSettings_Depth_Get = function() {
        return (e._MagickSettings_Depth_Get = e.asm.Rl).apply(null, arguments);
      }, e._MagickSettings_Depth_Set = function() {
        return (e._MagickSettings_Depth_Set = e.asm.Sl).apply(null, arguments);
      }, e._MagickSettings_Endian_Get = function() {
        return (e._MagickSettings_Endian_Get = e.asm.Tl).apply(null, arguments);
      }, e._MagickSettings_Endian_Set = function() {
        return (e._MagickSettings_Endian_Set = e.asm.Ul).apply(null, arguments);
      }, e._MagickSettings_Extract_Get = function() {
        return (e._MagickSettings_Extract_Get = e.asm.Vl).apply(null, arguments);
      }, e._MagickSettings_Extract_Set = function() {
        return (e._MagickSettings_Extract_Set = e.asm.Wl).apply(null, arguments);
      }, e._MagickSettings_Format_Get = function() {
        return (e._MagickSettings_Format_Get = e.asm.Xl).apply(null, arguments);
      }, e._MagickSettings_Format_Set = function() {
        return (e._MagickSettings_Format_Set = e.asm.Yl).apply(null, arguments);
      }, e._MagickSettings_Font_Get = function() {
        return (e._MagickSettings_Font_Get = e.asm.Zl).apply(null, arguments);
      }, e._MagickSettings_Font_Set = function() {
        return (e._MagickSettings_Font_Set = e.asm._l).apply(null, arguments);
      }, e._MagickSettings_FontPointsize_Get = function() {
        return (e._MagickSettings_FontPointsize_Get = e.asm.$l).apply(null, arguments);
      }, e._MagickSettings_FontPointsize_Set = function() {
        return (e._MagickSettings_FontPointsize_Set = e.asm.am).apply(null, arguments);
      }, e._MagickSettings_Interlace_Get = function() {
        return (e._MagickSettings_Interlace_Get = e.asm.bm).apply(null, arguments);
      }, e._MagickSettings_Interlace_Set = function() {
        return (e._MagickSettings_Interlace_Set = e.asm.cm).apply(null, arguments);
      }, e._MagickSettings_Monochrome_Get = function() {
        return (e._MagickSettings_Monochrome_Get = e.asm.dm).apply(null, arguments);
      }, e._MagickSettings_Monochrome_Set = function() {
        return (e._MagickSettings_Monochrome_Set = e.asm.em).apply(null, arguments);
      }, e._MagickSettings_Verbose_Get = function() {
        return (e._MagickSettings_Verbose_Get = e.asm.fm).apply(null, arguments);
      }, e._MagickSettings_Verbose_Set = function() {
        return (e._MagickSettings_Verbose_Set = e.asm.gm).apply(null, arguments);
      }, e._MagickSettings_SetColorFuzz = function() {
        return (e._MagickSettings_SetColorFuzz = e.asm.hm).apply(null, arguments);
      }, e._MagickSettings_SetFileName = function() {
        return (e._MagickSettings_SetFileName = e.asm.im).apply(null, arguments);
      }, e._MagickSettings_SetNumberScenes = function() {
        return (e._MagickSettings_SetNumberScenes = e.asm.jm).apply(null, arguments);
      }, e._MagickSettings_SetOption = function() {
        return (e._MagickSettings_SetOption = e.asm.km).apply(null, arguments);
      }, e._MagickSettings_SetPage = function() {
        return (e._MagickSettings_SetPage = e.asm.lm).apply(null, arguments);
      }, e._MagickSettings_SetPing = function() {
        return (e._MagickSettings_SetPing = e.asm.mm).apply(null, arguments);
      }, e._MagickSettings_SetQuality = function() {
        return (e._MagickSettings_SetQuality = e.asm.nm).apply(null, arguments);
      }, e._MagickSettings_SetScenes = function() {
        return (e._MagickSettings_SetScenes = e.asm.om).apply(null, arguments);
      }, e._MagickSettings_SetScene = function() {
        return (e._MagickSettings_SetScene = e.asm.pm).apply(null, arguments);
      }, e._MagickSettings_SetSize = function() {
        return (e._MagickSettings_SetSize = e.asm.qm).apply(null, arguments);
      }, e._MontageSettings_Create = function() {
        return (e._MontageSettings_Create = e.asm.rm).apply(null, arguments);
      }, e._MontageSettings_Dispose = function() {
        return (e._MontageSettings_Dispose = e.asm.sm).apply(null, arguments);
      }, e._MontageSettings_SetBackgroundColor = function() {
        return (e._MontageSettings_SetBackgroundColor = e.asm.tm).apply(null, arguments);
      }, e._MontageSettings_SetBorderColor = function() {
        return (e._MontageSettings_SetBorderColor = e.asm.um).apply(null, arguments);
      }, e._MontageSettings_SetBorderWidth = function() {
        return (e._MontageSettings_SetBorderWidth = e.asm.vm).apply(null, arguments);
      }, e._MontageSettings_SetFillColor = function() {
        return (e._MontageSettings_SetFillColor = e.asm.wm).apply(null, arguments);
      }, e._MontageSettings_SetFont = function() {
        return (e._MontageSettings_SetFont = e.asm.xm).apply(null, arguments);
      }, e._MontageSettings_SetFontPointsize = function() {
        return (e._MontageSettings_SetFontPointsize = e.asm.ym).apply(null, arguments);
      }, e._MontageSettings_SetFrameGeometry = function() {
        return (e._MontageSettings_SetFrameGeometry = e.asm.zm).apply(null, arguments);
      }, e._MontageSettings_SetGeometry = function() {
        return (e._MontageSettings_SetGeometry = e.asm.Am).apply(null, arguments);
      }, e._MontageSettings_SetGravity = function() {
        return (e._MontageSettings_SetGravity = e.asm.Bm).apply(null, arguments);
      }, e._MontageSettings_SetShadow = function() {
        return (e._MontageSettings_SetShadow = e.asm.Cm).apply(null, arguments);
      }, e._MontageSettings_SetStrokeColor = function() {
        return (e._MontageSettings_SetStrokeColor = e.asm.Dm).apply(null, arguments);
      }, e._MontageSettings_SetTextureFileName = function() {
        return (e._MontageSettings_SetTextureFileName = e.asm.Em).apply(null, arguments);
      }, e._MontageSettings_SetTileGeometry = function() {
        return (e._MontageSettings_SetTileGeometry = e.asm.Fm).apply(null, arguments);
      }, e._MontageSettings_SetTitle = function() {
        return (e._MontageSettings_SetTitle = e.asm.Gm).apply(null, arguments);
      }, e._QuantizeSettings_SetColors = function() {
        return (e._QuantizeSettings_SetColors = e.asm.Hm).apply(null, arguments);
      }, e._QuantizeSettings_SetColorSpace = function() {
        return (e._QuantizeSettings_SetColorSpace = e.asm.Im).apply(null, arguments);
      }, e._QuantizeSettings_SetDitherMethod = function() {
        return (e._QuantizeSettings_SetDitherMethod = e.asm.Jm).apply(null, arguments);
      }, e._QuantizeSettings_SetMeasureErrors = function() {
        return (e._QuantizeSettings_SetMeasureErrors = e.asm.Km).apply(null, arguments);
      }, e._QuantizeSettings_SetTreeDepth = function() {
        return (e._QuantizeSettings_SetTreeDepth = e.asm.Lm).apply(null, arguments);
      }, e._ChannelMoments_Centroid_Get = function() {
        return (e._ChannelMoments_Centroid_Get = e.asm.Mm).apply(null, arguments);
      }, e._ChannelMoments_EllipseAngle_Get = function() {
        return (e._ChannelMoments_EllipseAngle_Get = e.asm.Nm).apply(null, arguments);
      }, e._ChannelMoments_EllipseAxis_Get = function() {
        return (e._ChannelMoments_EllipseAxis_Get = e.asm.Om).apply(null, arguments);
      }, e._ChannelMoments_EllipseEccentricity_Get = function() {
        return (e._ChannelMoments_EllipseEccentricity_Get = e.asm.Pm).apply(null, arguments);
      }, e._ChannelMoments_EllipseIntensity_Get = function() {
        return (e._ChannelMoments_EllipseIntensity_Get = e.asm.Qm).apply(null, arguments);
      }, e._ChannelMoments_GetHuInvariants = function() {
        return (e._ChannelMoments_GetHuInvariants = e.asm.Rm).apply(null, arguments);
      }, e._ChannelPerceptualHash_GetHclpHuPhash = function() {
        return (e._ChannelPerceptualHash_GetHclpHuPhash = e.asm.Sm).apply(null, arguments);
      }, e._ChannelPerceptualHash_GetSrgbHuPhash = function() {
        return (e._ChannelPerceptualHash_GetSrgbHuPhash = e.asm.Tm).apply(null, arguments);
      }, e._ChannelStatistics_Depth_Get = function() {
        return (e._ChannelStatistics_Depth_Get = e.asm.Um).apply(null, arguments);
      }, e._ChannelStatistics_Entropy_Get = function() {
        return (e._ChannelStatistics_Entropy_Get = e.asm.Vm).apply(null, arguments);
      }, e._ChannelStatistics_Kurtosis_Get = function() {
        return (e._ChannelStatistics_Kurtosis_Get = e.asm.Wm).apply(null, arguments);
      }, e._ChannelStatistics_Maximum_Get = function() {
        return (e._ChannelStatistics_Maximum_Get = e.asm.Xm).apply(null, arguments);
      }, e._ChannelStatistics_Mean_Get = function() {
        return (e._ChannelStatistics_Mean_Get = e.asm.Ym).apply(null, arguments);
      }, e._ChannelStatistics_Minimum_Get = function() {
        return (e._ChannelStatistics_Minimum_Get = e.asm.Zm).apply(null, arguments);
      }, e._ChannelStatistics_Skewness_Get = function() {
        return (e._ChannelStatistics_Skewness_Get = e.asm._m).apply(null, arguments);
      }, e._ChannelStatistics_StandardDeviation_Get = function() {
        return (e._ChannelStatistics_StandardDeviation_Get = e.asm.$m).apply(null, arguments);
      }, e._Moments_DisposeList = function() {
        return (e._Moments_DisposeList = e.asm.an).apply(null, arguments);
      }, e._Moments_GetInstance = function() {
        return (e._Moments_GetInstance = e.asm.bn).apply(null, arguments);
      }, e._PerceptualHash_DisposeList = function() {
        return (e._PerceptualHash_DisposeList = e.asm.cn).apply(null, arguments);
      }, e._PerceptualHash_GetInstance = function() {
        return (e._PerceptualHash_GetInstance = e.asm.dn).apply(null, arguments);
      }, e._Statistics_DisposeList = function() {
        return (e._Statistics_DisposeList = e.asm.en).apply(null, arguments);
      }, e._Statistics_GetInstance = function() {
        return (e._Statistics_GetInstance = e.asm.fn).apply(null, arguments);
      }, e._ConnectedComponent_DisposeList = function() {
        return (e._ConnectedComponent_DisposeList = e.asm.gn).apply(null, arguments);
      }, e._ConnectedComponent_GetArea = function() {
        return (e._ConnectedComponent_GetArea = e.asm.hn).apply(null, arguments);
      }, e._ConnectedComponent_GetCentroid = function() {
        return (e._ConnectedComponent_GetCentroid = e.asm.jn).apply(null, arguments);
      }, e._ConnectedComponent_GetColor = function() {
        return (e._ConnectedComponent_GetColor = e.asm.kn).apply(null, arguments);
      }, e._ConnectedComponent_GetHeight = function() {
        return (e._ConnectedComponent_GetHeight = e.asm.ln).apply(null, arguments);
      }, e._ConnectedComponent_GetId = function() {
        return (e._ConnectedComponent_GetId = e.asm.mn).apply(null, arguments);
      }, e._ConnectedComponent_GetWidth = function() {
        return (e._ConnectedComponent_GetWidth = e.asm.nn).apply(null, arguments);
      }, e._ConnectedComponent_GetX = function() {
        return (e._ConnectedComponent_GetX = e.asm.on).apply(null, arguments);
      }, e._ConnectedComponent_GetY = function() {
        return (e._ConnectedComponent_GetY = e.asm.pn).apply(null, arguments);
      }, e._ConnectedComponent_GetInstance = function() {
        return (e._ConnectedComponent_GetInstance = e.asm.qn).apply(null, arguments);
      }, e._MagickGeometry_Create = function() {
        return (e._MagickGeometry_Create = e.asm.rn).apply(null, arguments);
      }, e._MagickGeometry_Dispose = function() {
        return (e._MagickGeometry_Dispose = e.asm.sn).apply(null, arguments);
      }, e._MagickGeometry_X_Get = function() {
        return (e._MagickGeometry_X_Get = e.asm.tn).apply(null, arguments);
      }, e._MagickGeometry_Y_Get = function() {
        return (e._MagickGeometry_Y_Get = e.asm.un).apply(null, arguments);
      }, e._MagickGeometry_Width_Get = function() {
        return (e._MagickGeometry_Width_Get = e.asm.vn).apply(null, arguments);
      }, e._MagickGeometry_Height_Get = function() {
        return (e._MagickGeometry_Height_Get = e.asm.wn).apply(null, arguments);
      }, e._MagickGeometry_Initialize = function() {
        return (e._MagickGeometry_Initialize = e.asm.xn).apply(null, arguments);
      }, e._MagickRectangle_Dispose = function() {
        return (e._MagickRectangle_Dispose = e.asm.yn).apply(null, arguments);
      }, e._MagickRectangle_X_Get = function() {
        return (e._MagickRectangle_X_Get = e.asm.zn).apply(null, arguments);
      }, e._MagickRectangle_X_Set = function() {
        return (e._MagickRectangle_X_Set = e.asm.An).apply(null, arguments);
      }, e._MagickRectangle_Y_Get = function() {
        return (e._MagickRectangle_Y_Get = e.asm.Bn).apply(null, arguments);
      }, e._MagickRectangle_Y_Set = function() {
        return (e._MagickRectangle_Y_Set = e.asm.Cn).apply(null, arguments);
      }, e._MagickRectangle_Width_Get = function() {
        return (e._MagickRectangle_Width_Get = e.asm.Dn).apply(null, arguments);
      }, e._MagickRectangle_Width_Set = function() {
        return (e._MagickRectangle_Width_Set = e.asm.En).apply(null, arguments);
      }, e._MagickRectangle_Height_Get = function() {
        return (e._MagickRectangle_Height_Get = e.asm.Fn).apply(null, arguments);
      }, e._MagickRectangle_Height_Set = function() {
        return (e._MagickRectangle_Height_Set = e.asm.Gn).apply(null, arguments);
      }, e._MagickRectangle_FromPageSize = function() {
        return (e._MagickRectangle_FromPageSize = e.asm.Hn).apply(null, arguments);
      }, e._OffsetInfo_Create = function() {
        return (e._OffsetInfo_Create = e.asm.In).apply(null, arguments);
      }, e._OffsetInfo_Dispose = function() {
        return (e._OffsetInfo_Dispose = e.asm.Jn).apply(null, arguments);
      }, e._OffsetInfo_SetX = function() {
        return (e._OffsetInfo_SetX = e.asm.Kn).apply(null, arguments);
      }, e._OffsetInfo_SetY = function() {
        return (e._OffsetInfo_SetY = e.asm.Ln).apply(null, arguments);
      }, e._PointInfo_X_Get = function() {
        return (e._PointInfo_X_Get = e.asm.Mn).apply(null, arguments);
      }, e._PointInfo_Y_Get = function() {
        return (e._PointInfo_Y_Get = e.asm.Nn).apply(null, arguments);
      }, e._PrimaryInfo_Dispose = function() {
        return (e._PrimaryInfo_Dispose = e.asm.On).apply(null, arguments);
      }, e._PrimaryInfo_X_Get = function() {
        return (e._PrimaryInfo_X_Get = e.asm.Pn).apply(null, arguments);
      }, e._PrimaryInfo_X_Set = function() {
        return (e._PrimaryInfo_X_Set = e.asm.Qn).apply(null, arguments);
      }, e._PrimaryInfo_Y_Get = function() {
        return (e._PrimaryInfo_Y_Get = e.asm.Rn).apply(null, arguments);
      }, e._PrimaryInfo_Y_Set = function() {
        return (e._PrimaryInfo_Y_Set = e.asm.Sn).apply(null, arguments);
      }, e._PrimaryInfo_Z_Get = function() {
        return (e._PrimaryInfo_Z_Get = e.asm.Tn).apply(null, arguments);
      }, e._PrimaryInfo_Z_Set = function() {
        return (e._PrimaryInfo_Z_Set = e.asm.Un).apply(null, arguments);
      }, e._StringInfo_Length_Get = function() {
        return (e._StringInfo_Length_Get = e.asm.Vn).apply(null, arguments);
      }, e._StringInfo_Datum_Get = function() {
        return (e._StringInfo_Datum_Get = e.asm.Wn).apply(null, arguments);
      }, e._TypeMetric_Dispose = function() {
        return (e._TypeMetric_Dispose = e.asm.Xn).apply(null, arguments);
      }, e._TypeMetric_Ascent_Get = function() {
        return (e._TypeMetric_Ascent_Get = e.asm.Yn).apply(null, arguments);
      }, e._TypeMetric_Descent_Get = function() {
        return (e._TypeMetric_Descent_Get = e.asm.Zn).apply(null, arguments);
      }, e._TypeMetric_MaxHorizontalAdvance_Get = function() {
        return (e._TypeMetric_MaxHorizontalAdvance_Get = e.asm._n).apply(null, arguments);
      }, e._TypeMetric_TextHeight_Get = function() {
        return (e._TypeMetric_TextHeight_Get = e.asm.$n).apply(null, arguments);
      }, e._TypeMetric_TextWidth_Get = function() {
        return (e._TypeMetric_TextWidth_Get = e.asm.ao).apply(null, arguments);
      }, e._TypeMetric_UnderlinePosition_Get = function() {
        return (e._TypeMetric_UnderlinePosition_Get = e.asm.bo).apply(null, arguments);
      }, e._TypeMetric_UnderlineThickness_Get = function() {
        return (e._TypeMetric_UnderlineThickness_Get = e.asm.co).apply(null, arguments);
      };
      var ir = function() {
        return (ir = e.asm.eo).apply(null, arguments);
      }, Wt = function() {
        return (Wt = e.asm.fo).apply(null, arguments);
      }, _n = function() {
        return (_n = e.asm.go).apply(null, arguments);
      }, Bt = function() {
        return (Bt = e.asm.ho).apply(null, arguments);
      }, sr = e.___getTypeName = function() {
        return (sr = e.___getTypeName = e.asm.io).apply(null, arguments);
      };
      e.__embind_initialize_bindings = function() {
        return (e.__embind_initialize_bindings = e.asm.jo).apply(null, arguments);
      };
      var ur = function() {
        return (ur = e.asm.ko).apply(null, arguments);
      }, or = function() {
        return (or = e.asm.lo).apply(null, arguments);
      }, j = function() {
        return (j = e.asm.mo).apply(null, arguments);
      }, Y = function() {
        return (Y = e.asm.no).apply(null, arguments);
      }, $ = function() {
        return ($ = e.asm.oo).apply(null, arguments);
      }, _r = function() {
        return (_r = e.asm.po).apply(null, arguments);
      }, lr = function() {
        return (lr = e.asm.qo).apply(null, arguments);
      }, cr = e.dynCall_ji = function() {
        return (cr = e.dynCall_ji = e.asm.ro).apply(null, arguments);
      }, gr = e.dynCall_iiijj = function() {
        return (gr = e.dynCall_iiijj = e.asm.so).apply(null, arguments);
      }, fr = e.dynCall_iij = function() {
        return (fr = e.dynCall_iij = e.asm.to).apply(null, arguments);
      }, mr = e.dynCall_vij = function() {
        return (mr = e.dynCall_vij = e.asm.uo).apply(null, arguments);
      };
      e.dynCall_iji = function() {
        return (e.dynCall_iji = e.asm.vo).apply(null, arguments);
      }, e.dynCall_jji = function() {
        return (e.dynCall_jji = e.asm.wo).apply(null, arguments);
      }, e.dynCall_jiji = function() {
        return (e.dynCall_jiji = e.asm.xo).apply(null, arguments);
      }, e.dynCall_viij = function() {
        return (e.dynCall_viij = e.asm.yo).apply(null, arguments);
      }, e.dynCall_jjii = function() {
        return (e.dynCall_jjii = e.asm.zo).apply(null, arguments);
      }, e.dynCall_iiji = function() {
        return (e.dynCall_iiji = e.asm.Ao).apply(null, arguments);
      }, e.dynCall_jiiiii = function() {
        return (e.dynCall_jiiiii = e.asm.Bo).apply(null, arguments);
      };
      var pr = e.dynCall_iiiijj = function() {
        return (pr = e.dynCall_iiiijj = e.asm.Co).apply(null, arguments);
      }, dr = e.dynCall_ij = function() {
        return (dr = e.dynCall_ij = e.asm.Do).apply(null, arguments);
      };
      e.dynCall_iiijii = function() {
        return (e.dynCall_iiijii = e.asm.Eo).apply(null, arguments);
      }, e.dynCall_jiiiiiiiii = function() {
        return (e.dynCall_jiiiiiiiii = e.asm.Fo).apply(null, arguments);
      }, e.dynCall_jiiiiii = function() {
        return (e.dynCall_jiiiiii = e.asm.Go).apply(null, arguments);
      }, e.dynCall_jiiiiiiii = function() {
        return (e.dynCall_jiiiiiiii = e.asm.Ho).apply(null, arguments);
      }, e.dynCall_viijii = function() {
        return (e.dynCall_viijii = e.asm.Io).apply(null, arguments);
      }, e.dynCall_iiiiij = function() {
        return (e.dynCall_iiiiij = e.asm.Jo).apply(null, arguments);
      }, e.dynCall_iiiiijj = function() {
        return (e.dynCall_iiiiijj = e.asm.Ko).apply(null, arguments);
      }, e.dynCall_iiiiiijj = function() {
        return (e.dynCall_iiiiiijj = e.asm.Lo).apply(null, arguments);
      }, e.___emscripten_embedded_file_data = 4503168;
      function Is(t, n, a, s) {
        var o = Y();
        try {
          K(t)(n, a, s);
        } catch (l) {
          if ($(o), l !== l + 0)
            throw l;
          j(1, 0);
        }
      }
      function Ms(t, n, a, s) {
        var o = Y();
        try {
          return K(t)(n, a, s);
        } catch (l) {
          if ($(o), l !== l + 0)
            throw l;
          j(1, 0);
        }
      }
      function Ds(t, n, a) {
        var s = Y();
        try {
          return K(t)(n, a);
        } catch (o) {
          if ($(s), o !== o + 0)
            throw o;
          j(1, 0);
        }
      }
      function Cs(t, n) {
        var a = Y();
        try {
          return K(t)(n);
        } catch (s) {
          if ($(a), s !== s + 0)
            throw s;
          j(1, 0);
        }
      }
      function Ps(t, n) {
        var a = Y();
        try {
          K(t)(n);
        } catch (s) {
          if ($(a), s !== s + 0)
            throw s;
          j(1, 0);
        }
      }
      function bs(t, n, a) {
        var s = Y();
        try {
          K(t)(n, a);
        } catch (o) {
          if ($(s), o !== o + 0)
            throw o;
          j(1, 0);
        }
      }
      function Gs(t, n, a, s, o) {
        var l = Y();
        try {
          K(t)(n, a, s, o);
        } catch (c) {
          if ($(l), c !== c + 0)
            throw c;
          j(1, 0);
        }
      }
      function Es(t) {
        var n = Y();
        try {
          return K(t)();
        } catch (a) {
          if ($(n), a !== a + 0)
            throw a;
          j(1, 0);
        }
      }
      function Rs(t, n, a, s, o, l, c) {
        var g = Y();
        try {
          return K(t)(n, a, s, o, l, c);
        } catch (d) {
          if ($(g), d !== d + 0)
            throw d;
          j(1, 0);
        }
      }
      function As(t, n, a, s, o) {
        var l = Y();
        try {
          return K(t)(n, a, s, o);
        } catch (c) {
          if ($(l), c !== c + 0)
            throw c;
          j(1, 0);
        }
      }
      function Ts(t, n, a, s, o, l, c, g, d) {
        var h = Y();
        try {
          return K(t)(n, a, s, o, l, c, g, d);
        } catch (v) {
          if ($(h), v !== v + 0)
            throw v;
          j(1, 0);
        }
      }
      function Ls(t, n, a, s, o, l) {
        var c = Y();
        try {
          return K(t)(n, a, s, o, l);
        } catch (g) {
          if ($(c), g !== g + 0)
            throw g;
          j(1, 0);
        }
      }
      function Ws(t, n, a) {
        var s = Y();
        try {
          return K(t)(n, a);
        } catch (o) {
          if ($(s), o !== o + 0)
            throw o;
          j(1, 0);
        }
      }
      function Bs(t) {
        var n = Y();
        try {
          K(t)();
        } catch (a) {
          if ($(n), a !== a + 0)
            throw a;
          j(1, 0);
        }
      }
      function xs(t, n, a, s, o, l) {
        var c = Y();
        try {
          K(t)(n, a, s, o, l);
        } catch (g) {
          if ($(c), g !== g + 0)
            throw g;
          j(1, 0);
        }
      }
      function Ns(t, n, a, s, o, l, c, g) {
        var d = Y();
        try {
          return K(t)(n, a, s, o, l, c, g);
        } catch (h) {
          if ($(d), h !== h + 0)
            throw h;
          j(1, 0);
        }
      }
      function zs(t, n, a, s, o, l, c, g, d, h) {
        var v = Y();
        try {
          return K(t)(n, a, s, o, l, c, g, d, h);
        } catch (C) {
          if ($(v), C !== C + 0)
            throw C;
          j(1, 0);
        }
      }
      function Hs(t, n, a, s) {
        var o = Y();
        try {
          K(t)(n, a, s);
        } catch (l) {
          if ($(o), l !== l + 0)
            throw l;
          j(1, 0);
        }
      }
      function Fs(t, n, a, s, o, l, c, g, d, h, v) {
        var C = Y();
        try {
          K(t)(n, a, s, o, l, c, g, d, h, v);
        } catch (D) {
          if ($(C), D !== D + 0)
            throw D;
          j(1, 0);
        }
      }
      function Us(t, n, a, s, o, l, c, g, d, h) {
        var v = Y();
        try {
          K(t)(n, a, s, o, l, c, g, d, h);
        } catch (C) {
          if ($(v), C !== C + 0)
            throw C;
          j(1, 0);
        }
      }
      function js(t, n, a, s, o, l, c) {
        var g = Y();
        try {
          K(t)(n, a, s, o, l, c);
        } catch (d) {
          if ($(g), d !== d + 0)
            throw d;
          j(1, 0);
        }
      }
      function Ys(t, n, a, s, o, l, c, g) {
        var d = Y();
        try {
          K(t)(n, a, s, o, l, c, g);
        } catch (h) {
          if ($(d), h !== h + 0)
            throw h;
          j(1, 0);
        }
      }
      function $s(t, n, a, s, o, l, c, g, d, h, v, C) {
        var D = Y();
        try {
          return K(t)(n, a, s, o, l, c, g, d, h, v, C);
        } catch (P) {
          if ($(D), P !== P + 0)
            throw P;
          j(1, 0);
        }
      }
      function Xs(t, n) {
        var a = Y();
        try {
          return cr(t, n);
        } catch (s) {
          if ($(a), s !== s + 0)
            throw s;
          j(1, 0);
        }
      }
      function qs(t, n, a, s, o, l, c) {
        var g = Y();
        try {
          return gr(t, n, a, s, o, l, c);
        } catch (d) {
          if ($(g), d !== d + 0)
            throw d;
          j(1, 0);
        }
      }
      function Vs(t, n, a, s) {
        var o = Y();
        try {
          return fr(t, n, a, s);
        } catch (l) {
          if ($(o), l !== l + 0)
            throw l;
          j(1, 0);
        }
      }
      function Ks(t, n, a, s) {
        var o = Y();
        try {
          mr(t, n, a, s);
        } catch (l) {
          if ($(o), l !== l + 0)
            throw l;
          j(1, 0);
        }
      }
      function Qs(t, n, a, s, o, l, c, g) {
        var d = Y();
        try {
          return pr(t, n, a, s, o, l, c, g);
        } catch (h) {
          if ($(d), h !== h + 0)
            throw h;
          j(1, 0);
        }
      }
      function Js(t, n, a) {
        var s = Y();
        try {
          return dr(t, n, a);
        } catch (o) {
          if ($(s), o !== o + 0)
            throw o;
          j(1, 0);
        }
      }
      e.addRunDependency = wt, e.removeRunDependency = et, e.FS_createPath = _.createPath, e.FS_createDataFile = _.createDataFile, e.FS_createPreloadedFile = _.createPreloadedFile, e.FS_createLazyFile = _.createLazyFile, e.FS_createDevice = _.createDevice, e.FS_unlink = _.unlink, e.setValue = Hr, e.getValue = zr, e.UTF8ToString = ke, e.stringToUTF8 = Ye, e.lengthBytesUTF8 = Le, e.FS = _;
      var xt;
      Oe = function t() {
        xt || hr(), xt || (Oe = t);
      };
      function hr() {
        if (Te > 0 || (Gr(), Te > 0))
          return;
        function t() {
          xt || (xt = !0, e.calledRun = !0, !pt && (Er(), w(e), e.onRuntimeInitialized && e.onRuntimeInitialized(), Rr()));
        }
        e.setStatus ? (e.setStatus("Running..."), setTimeout(function() {
          setTimeout(function() {
            e.setStatus("");
          }, 1), t();
        }, 1)) : t();
      }
      if (e.preInit)
        for (typeof e.preInit == "function" && (e.preInit = [e.preInit]); e.preInit.length > 0; )
          e.preInit.pop()();
      return hr(), p.ready;
    };
  })();
  r.exports = u;
})(vr);
var eu = vr.exports;
const tu = /* @__PURE__ */ Os(eu);
var ie = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.Red = 1] = "Red", r[r.Gray = 1] = "Gray", r[r.Cyan = 1] = "Cyan", r[r.Green = 2] = "Green", r[r.Magenta = 2] = "Magenta", r[r.Blue = 4] = "Blue", r[r.Yellow = 4] = "Yellow", r[r.Black = 8] = "Black", r[r.Alpha = 16] = "Alpha", r[r.Opacity = 16] = "Opacity", r[r.Index = 32] = "Index", r[r.Composite = 31] = "Composite", r[r.All = 134217727] = "All", r[r.TrueAlpha = 256] = "TrueAlpha", r[r.RGB = 7] = "RGB", r[r.CMYK = 15] = "CMYK", r[r.Grays = 1024] = "Grays", r[r.Sync = 131072] = "Sync", r[
  r.Default = 134217727
  /* All */
] = "Default", r))(ie || {});
class nu {
  red;
  green;
  blue;
  white;
  constructor(i, u, f, p) {
    this.red = i, this.green = u, this.blue = f, this.white = p;
  }
}
var Sr = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.CMY = 1] = "CMY", r[r.CMYK = 2] = "CMYK", r[r.Gray = 3] = "Gray", r[r.HCL = 4] = "HCL", r[r.HCLp = 5] = "HCLp", r[r.HSB = 6] = "HSB", r[r.HSI = 7] = "HSI", r[r.HSL = 8] = "HSL", r[r.HSV = 9] = "HSV", r[r.HWB = 10] = "HWB", r[r.Lab = 11] = "Lab", r[r.LCH = 12] = "LCH", r[r.LCHab = 13] = "LCHab", r[r.LCHuv = 14] = "LCHuv", r[r.Log = 15] = "Log", r[r.LMS = 16] = "LMS", r[r.Luv = 17] = "Luv", r[r.OHTA = 18] = "OHTA", r[r.Rec601YCbCr = 19] = "Rec601YCbCr", r[r.Rec709YCbCr = 20] = "Rec709YCbCr", r[r.RGB = 21] = "RGB", r[r.scRGB = 22] = "scRGB", r[r.sRGB = 23] = "sRGB", r[r.Transparent = 24] = "Transparent", r[r.XyY = 25] = "XyY", r[r.XYZ = 26] = "XYZ", r[r.YCbCr = 27] = "YCbCr", r[r.YCC = 28] = "YCC", r[r.YDbDr = 29] = "YDbDr", r[r.YIQ = 30] = "YIQ", r[r.YPbPr = 31] = "YPbPr", r[r.YUV = 32] = "YUV", r[r.LinearGray = 33] = "LinearGray", r))(Sr || {}), Nt = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.Alpha = 1] = "Alpha", r[r.Atop = 2] = "Atop", r[r.Blend = 3] = "Blend", r[r.Blur = 4] = "Blur", r[r.Bumpmap = 5] = "Bumpmap", r[r.ChangeMask = 6] = "ChangeMask", r[r.Clear = 7] = "Clear", r[r.ColorBurn = 8] = "ColorBurn", r[r.ColorDodge = 9] = "ColorDodge", r[r.Colorize = 10] = "Colorize", r[r.CopyBlack = 11] = "CopyBlack", r[r.CopyBlue = 12] = "CopyBlue", r[r.Copy = 13] = "Copy", r[r.CopyCyan = 14] = "CopyCyan", r[r.CopyGreen = 15] = "CopyGreen", r[r.CopyMagenta = 16] = "CopyMagenta", r[r.CopyAlpha = 17] = "CopyAlpha", r[r.CopyRed = 18] = "CopyRed", r[r.CopyYellow = 19] = "CopyYellow", r[r.Darken = 20] = "Darken", r[r.DarkenIntensity = 21] = "DarkenIntensity", r[r.Difference = 22] = "Difference", r[r.Displace = 23] = "Displace", r[r.Dissolve = 24] = "Dissolve", r[r.Distort = 25] = "Distort", r[r.DivideDst = 26] = "DivideDst", r[r.DivideSrc = 27] = "DivideSrc", r[r.DstAtop = 28] = "DstAtop", r[r.Dst = 29] = "Dst", r[r.DstIn = 30] = "DstIn", r[r.DstOut = 31] = "DstOut", r[r.DstOver = 32] = "DstOver", r[r.Exclusion = 33] = "Exclusion", r[r.HardLight = 34] = "HardLight", r[r.HardMix = 35] = "HardMix", r[r.Hue = 36] = "Hue", r[r.In = 37] = "In", r[r.Intensity = 38] = "Intensity", r[r.Lighten = 39] = "Lighten", r[r.LightenIntensity = 40] = "LightenIntensity", r[r.LinearBurn = 41] = "LinearBurn", r[r.LinearDodge = 42] = "LinearDodge", r[r.LinearLight = 43] = "LinearLight", r[r.Luminize = 44] = "Luminize", r[r.Mathematics = 45] = "Mathematics", r[r.MinusDst = 46] = "MinusDst", r[r.MinusSrc = 47] = "MinusSrc", r[r.Modulate = 48] = "Modulate", r[r.ModulusAdd = 49] = "ModulusAdd", r[r.ModulusSubtract = 50] = "ModulusSubtract", r[r.Multiply = 51] = "Multiply", r[r.No = 52] = "No", r[r.Out = 53] = "Out", r[r.Over = 54] = "Over", r[r.Overlay = 55] = "Overlay", r[r.PegtopLight = 56] = "PegtopLight", r[r.PinLight = 57] = "PinLight", r[r.Plus = 58] = "Plus", r[r.Replace = 59] = "Replace", r[r.Saturate = 60] = "Saturate", r[r.Screen = 61] = "Screen", r[r.SoftLight = 62] = "SoftLight", r[r.SrcAtop = 63] = "SrcAtop", r[r.Src = 64] = "Src", r[r.SrcIn = 65] = "SrcIn", r[r.SrcOut = 66] = "SrcOut", r[r.SrcOver = 67] = "SrcOver", r[r.Threshold = 68] = "Threshold", r[r.VividLight = 69] = "VividLight", r[r.Xor = 70] = "Xor", r[r.Stereo = 71] = "Stereo", r))(Nt || {}), Ir = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.PixelsPerInch = 1] = "PixelsPerInch", r[r.PixelsPerCentimeter = 2] = "PixelsPerCentimeter", r))(Ir || {});
class ru {
  constructor(i, u, f) {
    u === void 0 ? (this.x = i, this.y = i, this.units = Ir.PixelsPerInch) : f !== void 0 ? (this.x = i, this.y = u, this.units = f) : (this.x = i, this.y = i, this.units = u);
  }
  x;
  y;
  units;
}
class Ce {
  static _disposeAfterExecution(i, u) {
    try {
      const f = u(i);
      return f instanceof Promise ? Promise.resolve(f).then((p) => (i.dispose(), p)) : (i.dispose(), f);
    } catch (f) {
      throw i.dispose(), f;
    }
  }
}
class Mr {
  _pointer;
  _bytes;
  _func;
  constructor(i, u, f) {
    this._pointer = i, this._func = f, this._bytes = m._api.HEAPU8.subarray(i, i + u);
  }
  func(i) {
    return i._bytes === void 0 ? i._func(new Uint8Array()) : i._func(i._bytes);
  }
  dispose() {
    this._pointer = m._api._MagickMemory_Relinquish(this._pointer);
  }
}
var Ft = /* @__PURE__ */ ((r) => (r[r.Error = 400] = "Error", r[r.ResourceLimitError = 400] = "ResourceLimitError", r[r.TypeError = 405] = "TypeError", r[r.OptionError = 410] = "OptionError", r[r.DelegateError = 415] = "DelegateError", r[r.MissingDelegateError = 420] = "MissingDelegateError", r[r.CorruptImageError = 425] = "CorruptImageError", r[r.FileOpenError = 430] = "FileOpenError", r[r.BlobError = 435] = "BlobError", r[r.StreamError = 440] = "StreamError", r[r.CacheError = 445] = "CacheError", r[r.CoderError = 450] = "CoderError", r[r.FilterError = 452] = "FilterError", r[r.ModuleError = 455] = "ModuleError", r[r.DrawError = 460] = "DrawError", r[r.ImageError = 465] = "ImageError", r[r.WandError = 470] = "WandError", r[r.RandomError = 475] = "RandomError", r[r.XServerError = 480] = "XServerError", r[r.MonitorError = 485] = "MonitorError", r[r.RegistryError = 490] = "RegistryError", r[r.ConfigureError = 495] = "ConfigureError", r[r.PolicyError = 499] = "PolicyError", r))(Ft || {});
class O extends Error {
  _severity;
  _relatedErrors = [];
  constructor(i, u = Ft.Error) {
    super(i), this._severity = u;
  }
  get relatedErrors() {
    return this._relatedErrors;
  }
  get severity() {
    return this._severity;
  }
  /** @internal */
  _setRelatedErrors(i) {
    this._relatedErrors = i;
  }
}
class Ae {
  instance;
  constructor() {
    this.instance = m._api._malloc(8), m._api.setValue(this.instance, 0, "i64");
  }
  get ptr() {
    return this.instance;
  }
  get value() {
    return m._api.getValue(this.instance, "i64");
  }
  static use(i) {
    const u = new Ae();
    try {
      return i(u);
    } finally {
      m._api._free(u.instance);
    }
  }
}
function he(r) {
  return r === 0 ? null : m._api.UTF8ToString(r);
}
function cn(r, i, u) {
  const f = r.lengthBytesUTF8(i) + 1, p = r._malloc(f);
  try {
    return r.stringToUTF8(i, p, f), u(p);
  } finally {
    r._free(p);
  }
}
function W(r, i) {
  return cn(m._api, r, i);
}
class M {
  pointer;
  constructor(i) {
    this.pointer = i;
  }
  get ptr() {
    return this.pointer.ptr;
  }
  check(i, u) {
    return this.isError() ? u() : i();
  }
  static usePointer(i) {
    return Ae.use((u) => {
      const f = i(u.ptr);
      return M.checkException(u, f);
    });
  }
  static use(i) {
    return Ae.use((u) => {
      const f = i(new M(u));
      return M.checkException(u, f);
    });
  }
  static checkException(i, u) {
    if (!M.isRaised(i))
      return u;
    const f = M.getErrorSeverity(i.value);
    return f >= Ft.Error ? M.throw(i, f) : M.dispose(i), u;
  }
  isError() {
    return M.isRaised(this.pointer) ? M.getErrorSeverity(this.pointer.value) >= Ft.Error : !1;
  }
  static getErrorSeverity(i) {
    return m._api._MagickExceptionHelper_Severity(i);
  }
  static isRaised(i) {
    return i.value !== 0;
  }
  static throw(i, u) {
    const f = M.createError(i.value, u);
    throw M.dispose(i), f;
  }
  static createError(i, u) {
    const f = M.getMessage(i), p = new O(f, u), e = m._api._MagickExceptionHelper_RelatedCount(i);
    if (e === 0)
      return p;
    const w = [];
    for (let S = 0; S < e; S++) {
      const E = m._api._MagickExceptionHelper_Related(i, S), B = M.getErrorSeverity(E), Q = M.createError(E, B);
      w.push(Q);
    }
    return p._setRelatedErrors(w), p;
  }
  static getMessage(i) {
    const u = m._api._MagickExceptionHelper_Message(i), f = m._api._MagickExceptionHelper_Description(i);
    let p = he(u);
    return f !== 0 && (p += `(${m._api.UTF8ToString(f)})`), p;
  }
  static dispose(i) {
    m._api._MagickExceptionHelper_Dispose(i.value);
  }
}
var Re = /* @__PURE__ */ ((r) => (r.Unknown = "UNKNOWN", r.ThreeFr = "3FR", r.ThreeG2 = "3G2", r.ThreeGp = "3GP", r.A = "A", r.Aai = "AAI", r.Ai = "AI", r.Apng = "APNG", r.Art = "ART", r.Arw = "ARW", r.Ashlar = "ASHLAR", r.Avi = "AVI", r.Avif = "AVIF", r.Avs = "AVS", r.B = "B", r.Bayer = "BAYER", r.Bayera = "BAYERA", r.Bgr = "BGR", r.Bgra = "BGRA", r.Bgro = "BGRO", r.Bmp = "BMP", r.Bmp2 = "BMP2", r.Bmp3 = "BMP3", r.Brf = "BRF", r.C = "C", r.Cal = "CAL", r.Cals = "CALS", r.Canvas = "CANVAS", r.Caption = "CAPTION", r.Cin = "CIN", r.Cip = "CIP", r.Clip = "CLIP", r.Cmyk = "CMYK", r.Cmyka = "CMYKA", r.Cr2 = "CR2", r.Cr3 = "CR3", r.Crw = "CRW", r.Cube = "CUBE", r.Cur = "CUR", r.Cut = "CUT", r.Data = "DATA", r.Dcm = "DCM", r.Dcr = "DCR", r.Dcraw = "DCRAW", r.Dcx = "DCX", r.Dds = "DDS", r.Dfont = "DFONT", r.Dng = "DNG", r.Dpx = "DPX", r.Dxt1 = "DXT1", r.Dxt5 = "DXT5", r.Epdf = "EPDF", r.Epi = "EPI", r.Eps = "EPS", r.Eps2 = "EPS2", r.Eps3 = "EPS3", r.Epsf = "EPSF", r.Epsi = "EPSI", r.Ept = "EPT", r.Ept2 = "EPT2", r.Ept3 = "EPT3", r.Erf = "ERF", r.Exr = "EXR", r.Farbfeld = "FARBFELD", r.Fax = "FAX", r.FF = "FF", r.File = "FILE", r.Fits = "FITS", r.Fl32 = "FL32", r.Flv = "FLV", r.Fractal = "FRACTAL", r.Ftp = "FTP", r.Ftxt = "FTXT", r.Fts = "FTS", r.G = "G", r.G3 = "G3", r.G4 = "G4", r.Gif = "GIF", r.Gif87 = "GIF87", r.Gradient = "GRADIENT", r.Gray = "GRAY", r.Graya = "GRAYA", r.Group4 = "GROUP4", r.Hald = "HALD", r.Hdr = "HDR", r.Heic = "HEIC", r.Heif = "HEIF", r.Histogram = "HISTOGRAM", r.Hrz = "HRZ", r.Htm = "HTM", r.Html = "HTML", r.Http = "HTTP", r.Https = "HTTPS", r.Icb = "ICB", r.Ico = "ICO", r.Icon = "ICON", r.Iiq = "IIQ", r.Info = "INFO", r.Inline = "INLINE", r.Ipl = "IPL", r.Isobrl = "ISOBRL", r.Isobrl6 = "ISOBRL6", r.J2c = "J2C", r.J2k = "J2K", r.Jng = "JNG", r.Jnx = "JNX", r.Jp2 = "JP2", r.Jpc = "JPC", r.Jpe = "JPE", r.Jpeg = "JPEG", r.Jpg = "JPG", r.Jpm = "JPM", r.Jps = "JPS", r.Jpt = "JPT", r.Json = "JSON", r.Jxl = "JXL", r.K = "K", r.K25 = "K25", r.Kdc = "KDC", r.Label = "LABEL", r.M = "M", r.M2v = "M2V", r.M4v = "M4V", r.Mac = "MAC", r.Map = "MAP", r.Mask = "MASK", r.Mat = "MAT", r.Matte = "MATTE", r.Mef = "MEF", r.Miff = "MIFF", r.Mkv = "MKV", r.Mng = "MNG", r.Mono = "MONO", r.Mov = "MOV", r.Mp4 = "MP4", r.Mpc = "MPC", r.Mpeg = "MPEG", r.Mpg = "MPG", r.Mrw = "MRW", r.Msl = "MSL", r.Msvg = "MSVG", r.Mtv = "MTV", r.Mvg = "MVG", r.Nef = "NEF", r.Nrw = "NRW", r.Null = "NULL", r.O = "O", r.Ora = "ORA", r.Orf = "ORF", r.Otb = "OTB", r.Otf = "OTF", r.Pal = "PAL", r.Palm = "PALM", r.Pam = "PAM", r.Pango = "PANGO", r.Pattern = "PATTERN", r.Pbm = "PBM", r.Pcd = "PCD", r.Pcds = "PCDS", r.Pcl = "PCL", r.Pct = "PCT", r.Pcx = "PCX", r.Pdb = "PDB", r.Pdf = "PDF", r.Pdfa = "PDFA", r.Pef = "PEF", r.Pes = "PES", r.Pfa = "PFA", r.Pfb = "PFB", r.Pfm = "PFM", r.Pgm = "PGM", r.Pgx = "PGX", r.Phm = "PHM", r.Picon = "PICON", r.Pict = "PICT", r.Pix = "PIX", r.Pjpeg = "PJPEG", r.Plasma = "PLASMA", r.Png = "PNG", r.Png00 = "PNG00", r.Png24 = "PNG24", r.Png32 = "PNG32", r.Png48 = "PNG48", r.Png64 = "PNG64", r.Png8 = "PNG8", r.Pnm = "PNM", r.Pocketmod = "POCKETMOD", r.Ppm = "PPM", r.Ps = "PS", r.Ps2 = "PS2", r.Ps3 = "PS3", r.Psb = "PSB", r.Psd = "PSD", r.Ptif = "PTIF", r.Pwp = "PWP", r.Qoi = "QOI", r.R = "R", r.RadialGradient = "RADIAL-GRADIENT", r.Raf = "RAF", r.Ras = "RAS", r.Raw = "RAW", r.Rgb = "RGB", r.Rgb565 = "RGB565", r.Rgba = "RGBA", r.Rgbo = "RGBO", r.Rgf = "RGF", r.Rla = "RLA", r.Rle = "RLE", r.Rmf = "RMF", r.Rw2 = "RW2", r.Scr = "SCR", r.Screenshot = "SCREENSHOT", r.Sct = "SCT", r.Sfw = "SFW", r.Sgi = "SGI", r.Shtml = "SHTML", r.Six = "SIX", r.Sixel = "SIXEL", r.SparseColor = "SPARSE-COLOR", r.Sr2 = "SR2", r.Srf = "SRF", r.Stegano = "STEGANO", r.StrImg = "STRIMG", r.Sun = "SUN", r.Svg = "SVG", r.Svgz = "SVGZ", r.Text = "TEXT", r.Tga = "TGA", r.Thumbnail = "THUMBNAIL", r.Tiff = "TIFF", r.Tiff64 = "TIFF64", r.Tile = "TILE", r.Tim = "TIM", r.Tm2 = "TM2", r.Ttc = "TTC", r.Ttf = "TTF", r.Txt = "TXT", r.Ubrl = "UBRL", r.Ubrl6 = "UBRL6", r.Uil = "UIL", r.Uyvy = "UYVY", r.Vda = "VDA", r.Vicar = "VICAR", r.Vid = "VID", r.Viff = "VIFF", r.Vips = "VIPS", r.Vst = "VST", r.Wbmp = "WBMP", r.Webp = "WEBP", r.Webm = "WEBM", r.Wmv = "WMV", r.Wpg = "WPG", r.X3f = "X3F", r.Xbm = "XBM", r.Xc = "XC", r.Xcf = "XCF", r.Xpm = "XPM", r.Xps = "XPS", r.Xv = "XV", r.Y = "Y", r.Yaml = "YAML", r.Ycbcr = "YCbCr", r.Ycbcra = "YCbCrA", r.Yuv = "YUV", r))(Re || {});
class De {
  _format;
  _description;
  _supportsMultipleFrames;
  _supportsReading;
  _supportsWriting;
  static _all;
  constructor(i, u, f, p, e) {
    this._format = i, this._description = u, this._supportsMultipleFrames = f, this._supportsReading = p, this._supportsWriting = e;
  }
  get description() {
    return this._description;
  }
  get format() {
    return this._format;
  }
  get supportsMultipleFrames() {
    return this._supportsMultipleFrames;
  }
  get supportsReading() {
    return this._supportsReading;
  }
  get supportsWriting() {
    return this._supportsWriting;
  }
  static get all() {
    return De._all === void 0 && (De._all = De.loadFormats()), De._all;
  }
  static create(i) {
    for (const u of De.all)
      if (u.format === i)
        return u;
    throw new O(`unable to get format info for ${i}`);
  }
  static loadFormats() {
    return M.usePointer((i) => Ae.use((u) => {
      const f = m._api._MagickFormatInfo_CreateList(u.ptr, i), p = u.value;
      try {
        const e = new Array(p), w = Object.values(Re);
        for (let S = 0; S < p; S++) {
          const E = m._api._MagickFormatInfo_GetInfo(f, S, i), B = he(m._api._MagickFormatInfo_Format_Get(E)), Q = De.convertFormat(B, w), ue = he(m._api._MagickFormatInfo_Description_Get(E), ""), ge = m._api._MagickFormatInfo_SupportsMultipleFrames_Get(E) == 1, le = m._api._MagickFormatInfo_SupportsReading_Get(E) == 1, re = m._api._MagickFormatInfo_SupportsWriting_Get(E) == 1;
          e[S] = new De(Q, ue, ge, le, re);
        }
        return e;
      } finally {
        m._api._MagickFormatInfo_DisposeList(f, p);
      }
    }));
  }
  static convertFormat(i, u) {
    return i === null ? Re.Unknown : u.includes(i) ? i : Re.Unknown;
  }
}
class Ut {
  static get delegates() {
    return he(m._api._Magick_Delegates_Get());
  }
  static get features() {
    return he(m._api._Magick_Features_Get()).slice(0, -1);
  }
  static get imageMagickVersion() {
    return he(m._api._Magick_ImageMagickVersion_Get());
  }
  static get supportedFormats() {
    return De.all;
  }
  static addFont(i, u) {
    const f = m._api.FS;
    f.analyzePath("/fonts").exists || f.mkdir("/fonts");
    const e = f.open(`/fonts/${i}`, "w");
    f.write(e, u, 0, u.length), f.close(e);
  }
  static setRandomSeed = (i) => m._api._Magick_SetRandomSeed(i);
  /** @internal */
  static _getFontFileName(i) {
    const u = `/fonts/${i}`;
    if (!m._api.FS.analyzePath(u).exists)
      throw `Unable to find a font with the name '${i}', add it with Magick.addFont.`;
    return u;
  }
}
class Ve {
  disposeMethod;
  instance;
  /** @internal */
  constructor(i, u) {
    this.instance = i, this.disposeMethod = u;
  }
  /** @internal */
  get _instance() {
    if (this.instance > 0)
      return this.instance;
    throw this.instance === -1 && this._instanceNotInitialized(), new O("instance is disposed");
  }
  /** @internal */
  set _instance(i) {
    this.disposeInstance(this.instance), this.instance = i;
  }
  dispose() {
    this.instance = this.disposeInstance(this.instance);
  }
  /** @internal */
  _setInstance(i, u) {
    u.check(() => {
      this.dispose(), this.instance = i;
    }, () => {
      this.disposeInstance(i);
    });
  }
  /** @internal */
  _instanceNotInitialized() {
    throw new O("instance is not initialized");
  }
  disposeInstance(i) {
    return i > 0 && this.disposeMethod(i), 0;
  }
}
class au extends Ve {
  constructor(i) {
    const u = m._api._DrawingSettings_Create(), f = m._api._DrawingSettings_Dispose;
    if (super(u, f), i.fillColor !== void 0 && i.fillColor._use((p) => {
      m._api._DrawingSettings_FillColor_Set(this._instance, p);
    }), i.font !== void 0) {
      const p = Ut._getFontFileName(i.font);
      W(p, (e) => {
        m._api._DrawingSettings_Font_Set(this._instance, e);
      });
    }
    i.fontPointsize !== void 0 && m._api._DrawingSettings_FontPointsize_Set(this._instance, i.fontPointsize), i.strokeColor !== void 0 && i.strokeColor._use((p) => {
      m._api._DrawingSettings_StrokeColor_Set(this._instance, p);
    }), i.strokeWidth !== void 0 && m._api._DrawingSettings_StrokeWidth_Set(this._instance, i.strokeWidth);
  }
}
class gn {
  backgroundColor;
  fillColor;
  font;
  fontPointsize;
  strokeColor;
  strokeWidth;
  /** @internal */
  static _create(i) {
    const u = new gn();
    return u.fillColor = i.fillColor, u.font = i.font, u.fontPointsize = i.fontPointsize, u.strokeColor = i.strokeColor, u.strokeWidth = i.strokeWidth, u;
  }
  /** @internal */
  _use(i) {
    const u = new au(this);
    return Ce._disposeAfterExecution(u, i);
  }
}
class fn extends Ve {
  constructor(i, u) {
    const p = gn._create(u)._use((w) => m._api._DrawingWand_Create(i._instance, w._instance)), e = m._api._DrawingWand_Dispose;
    super(p, e);
  }
  color(i, u, f) {
    M.usePointer((p) => {
      m._api._DrawingWand_Color(this._instance, i, u, f, p);
    });
  }
  draw(i) {
    i.forEach((u) => {
      u.draw(this);
    }), M.usePointer((u) => {
      m._api._DrawingWand_Render(this._instance, u);
    });
  }
  fillColor(i) {
    M.usePointer((u) => {
      i._use((f) => {
        m._api._DrawingWand_FillColor(this._instance, f, u);
      });
    });
  }
  fillOpacity(i) {
    M.usePointer((u) => {
      m._api._DrawingWand_FillOpacity(this._instance, i, u);
    });
  }
  font(i) {
    M.usePointer((u) => {
      W(i, (f) => {
        m._api._DrawingWand_Font(this._instance, f, u);
      });
    });
  }
  fontPointSize(i) {
    M.usePointer((u) => {
      m._api._DrawingWand_FontPointSize(this._instance, i, u);
    });
  }
  gravity(i) {
    M.usePointer((u) => {
      m._api._DrawingWand_Gravity(this._instance, i, u);
    });
  }
  rectangle(i, u, f, p) {
    M.usePointer((e) => {
      m._api._DrawingWand_Rectangle(this._instance, i, u, f, p, e);
    });
  }
  roundRectangle(i, u, f, p, e, w) {
    M.usePointer((S) => {
      m._api._DrawingWand_RoundRectangle(this._instance, i, u, f, p, e, w, S);
    });
  }
  text(i, u, f) {
    M.usePointer((p) => {
      W(f, (e) => {
        m._api._DrawingWand_Text(this._instance, i, u, e, p);
      });
    });
  }
  /** @internal */
  static _create(i, u) {
    return new fn(i, u);
  }
}
var zt = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.Forget = 0] = "Forget", r[r.Northwest = 1] = "Northwest", r[r.North = 2] = "North", r[r.Northeast = 3] = "Northeast", r[r.West = 4] = "West", r[r.Center = 5] = "Center", r[r.East = 6] = "East", r[r.Southwest = 7] = "Southwest", r[r.South = 8] = "South", r[r.Southeast = 9] = "Southeast", r))(zt || {});
function* iu(r) {
  for (const i of r)
    switch (i) {
      case 2:
        yield "north";
        break;
      case 3:
        yield "north", yield "east";
        break;
      case 1:
        yield "north", yield "west";
        break;
      case 6:
        yield "east";
        break;
      case 4:
        yield "west";
        break;
      case 8:
        yield "south";
        break;
      case 9:
        yield "south", yield "east";
        break;
      case 7:
        yield "south", yield "west";
    }
}
class su {
  _data;
  constructor(i, u) {
    this.name = i, this._data = u;
  }
  name;
  getData() {
    return this._data;
  }
}
class ze {
  static get depth() {
    return m._api._Quantum_Depth_Get();
  }
  static get max() {
    return m._api._Quantum_Max_Get();
  }
}
class y {
  _r = 0;
  _g = 0;
  _b = 0;
  _a = 0;
  _k = 0;
  _isCmyk = !1;
  constructor(i, u, f, p, e) {
    if (i !== void 0)
      if (typeof i == "string") {
        let w = 0;
        try {
          w = m._api._MagickColor_Create(), W(i, (S) => {
            if (m._api._MagickColor_Initialize(w, S) === 0)
              throw new O("invalid color specified");
            this.initialize(w);
          });
        } finally {
          m._api._free(w);
        }
      } else
        this._r = i, this._g = u ?? 0, this._b = f ?? 0, e === void 0 ? this._a = p ?? ze.max : (this._k = p ?? 0, this._a = e, this._isCmyk = !0);
  }
  /** @internal */
  static _create(i) {
    const u = new y();
    return u.initialize(i), u;
  }
  get r() {
    return this._r;
  }
  set r(i) {
    this._r = i;
  }
  get g() {
    return this._g;
  }
  set g(i) {
    this._g = i;
  }
  get b() {
    return this._b;
  }
  set b(i) {
    this._b = i;
  }
  get a() {
    return this._a;
  }
  set a(i) {
    this._a = i;
  }
  get k() {
    return this._k;
  }
  set k(i) {
    this._k = i;
  }
  get isCmyk() {
    return this._isCmyk;
  }
  toShortString() {
    return this._a !== ze.max ? this.toString() : this.isCmyk ? `cmyka(${this._r},${this._g},${this._b},${this._k})` : `#${this.toHex(this._r)}${this.toHex(this._g)}${this.toHex(this._b)}`;
  }
  toString() {
    return this.isCmyk ? `cmyka(${this._r},${this._g},${this._b},${this._k},${(this._a / ze.max).toFixed(4)})` : `#${this.toHex(this._r)}${this.toHex(this._g)}${this.toHex(this._b)}${this.toHex(this._a)}`;
  }
  /** @internal */
  _use(i) {
    let u = 0;
    try {
      u = m._api._MagickColor_Create(), m._api._MagickColor_Red_Set(u, this._r), m._api._MagickColor_Green_Set(u, this._g), m._api._MagickColor_Blue_Set(u, this._b), m._api._MagickColor_Alpha_Set(u, this._a), m._api._MagickColor_IsCMYK_Set(u, this._isCmyk ? 1 : 0), i(u);
    } finally {
      m._api._free(u);
    }
  }
  initialize(i) {
    this._r = m._api._MagickColor_Red_Get(i), this._g = m._api._MagickColor_Green_Get(i), this._b = m._api._MagickColor_Blue_Get(i), this._a = m._api._MagickColor_Alpha_Get(i), this._isCmyk = m._api._MagickColor_IsCMYK_Get(i) === 1;
  }
  toHex(i) {
    return i.toString(16).padStart(2, "0");
  }
}
var Me = /* @__PURE__ */ ((r) => (r[r.NoValue = 0] = "NoValue", r[r.PercentValue = 4096] = "PercentValue", r[r.IgnoreAspectRatio = 8192] = "IgnoreAspectRatio", r[r.Less = 16384] = "Less", r[r.Greater = 32768] = "Greater", r[r.FillArea = 65536] = "FillArea", r[r.LimitPixels = 131072] = "LimitPixels", r[r.AspectRatio = 1048576] = "AspectRatio", r))(Me || {});
class _e {
  _width = 0;
  _height = 0;
  _x = 0;
  _y = 0;
  _aspectRatio = !1;
  _fillArea = !1;
  _greater = !1;
  _isPercentage = !1;
  _ignoreAspectRatio = !1;
  _less = !1;
  _limitPixels = !1;
  constructor(i, u, f, p) {
    if (typeof i == "number") {
      if (f !== void 0 && p !== void 0 ? (this._width = f, this._height = p, this._x = i, this._y = u ?? 0) : (this._width = i, this._height = u ?? this._width, this._x = 0, this._y = 0), this._width < 0)
        throw new O("negative width is not allowed");
      if (this._height < 0)
        throw new O("negative height is not allowed");
    } else {
      const e = m._api._MagickGeometry_Create();
      try {
        W(i, (w) => {
          const S = m._api._MagickGeometry_Initialize(e, w);
          if (S === Me.NoValue)
            throw new O("invalid geometry specified");
          this.hasFlag(S, Me.AspectRatio) ? this.initializeFromAspectRation(e, i) : this.initialize(e, S);
        });
      } finally {
        m._api._MagickGeometry_Dispose(e);
      }
    }
  }
  get aspectRatio() {
    return this._aspectRatio;
  }
  get fillArea() {
    return this._fillArea;
  }
  set fillArea(i) {
    this._fillArea = i;
  }
  get greater() {
    return this._greater;
  }
  set greater(i) {
    this._greater = i;
  }
  get ignoreAspectRatio() {
    return this._ignoreAspectRatio;
  }
  set ignoreAspectRatio(i) {
    this._ignoreAspectRatio = i;
  }
  get isPercentage() {
    return this._isPercentage;
  }
  set isPercentage(i) {
    this._isPercentage = i;
  }
  get less() {
    return this._less;
  }
  set less(i) {
    this._less = i;
  }
  get limitPixels() {
    return this._limitPixels;
  }
  set limitPixels(i) {
    this._limitPixels = i;
  }
  get height() {
    return this._height;
  }
  set height(i) {
    this._height = i;
  }
  get width() {
    return this._width;
  }
  set width(i) {
    this._width = i;
  }
  get x() {
    return this._x;
  }
  set x(i) {
    this._x = i;
  }
  get y() {
    return this._y;
  }
  set y(i) {
    this._y = i;
  }
  toString() {
    if (this._aspectRatio)
      return this._width + ":" + this._height;
    let i = "";
    return this._width > 0 && (i += this._width.toString()), this._height > 0 ? i += "x" + this._height.toString() : i += "x", (this._x != 0 || this._y != 0) && (this._x >= 0 && (i += "+"), i += this._x, this.y >= 0 && (i += "+"), i += this.y), this._fillArea && (i += "^"), this._greater && (i += ">"), this._isPercentage && (i += "%"), this._ignoreAspectRatio && (i += "!"), this._less && (i += "<"), this._limitPixels && (i += "@"), i;
  }
  /** @internal */
  static _fromRectangle(i) {
    if (i === 0)
      throw new O("unable to allocate memory");
    try {
      const u = m._api._MagickRectangle_Width_Get(i), f = m._api._MagickRectangle_Height_Get(i), p = m._api._MagickRectangle_X_Get(i), e = m._api._MagickRectangle_Y_Get(i);
      return new _e(p, e, u, f);
    } finally {
      m._api._MagickRectangle_Dispose(i);
    }
  }
  /** @internal */
  _toRectangle(i) {
    const u = m._api._MagickRectangle_Create();
    if (u === 0)
      throw new O("unable to allocate memory");
    try {
      m._api._MagickRectangle_Width_Set(u, this._width), m._api._MagickRectangle_Height_Set(u, this._height), m._api._MagickRectangle_X_Set(u, this._x), m._api._MagickRectangle_Y_Set(u, this._y), i(u);
    } finally {
      m._api._MagickRectangle_Dispose(u);
    }
  }
  initialize(i, u) {
    this._width = m._api._MagickGeometry_Width_Get(i), this._height = m._api._MagickGeometry_Height_Get(i), this._x = m._api._MagickGeometry_X_Get(i), this._y = m._api._MagickGeometry_Y_Get(i), this._ignoreAspectRatio = this.hasFlag(u, Me.IgnoreAspectRatio), this._isPercentage = this.hasFlag(u, Me.PercentValue), this._fillArea = this.hasFlag(u, Me.FillArea), this._greater = this.hasFlag(u, Me.Greater), this._less = this.hasFlag(u, Me.Less), this._limitPixels = this.hasFlag(u, Me.LimitPixels);
  }
  initializeFromAspectRation(i, u) {
    this._aspectRatio = !0;
    const f = u.split(":");
    this._width = this.parseNumber(f[0]), this._height = this.parseNumber(f[1]), this._x = m._api._MagickGeometry_X_Get(i), this._y = m._api._MagickGeometry_Y_Get(i);
  }
  parseNumber(i) {
    let u = 0;
    for (; u < i.length && !this.isNumber(i[u]); )
      u++;
    const f = u;
    for (; u < i.length && this.isNumber(i[u]); )
      u++;
    return parseInt(i.substr(f, u - f));
  }
  isNumber(i) {
    return i >= "0" && i <= "9";
  }
  hasFlag(i, u) {
    return (i & u) === u;
  }
}
class Dr extends Ve {
  constructor(i) {
    const u = m._api._MagickSettings_Create(), f = m._api._MagickSettings_Dispose;
    if (super(u, f), i._fileName !== void 0 && W(i._fileName, (p) => {
      m._api._MagickSettings_SetFileName(this._instance, p);
    }), i._ping && m._api._MagickSettings_SetPing(this._instance, 1), i._quality !== void 0 && m._api._MagickSettings_SetQuality(this._instance, i._quality), i.backgroundColor !== void 0 && i.backgroundColor._use((p) => {
      m._api._MagickSettings_BackgroundColor_Set(this._instance, p);
    }), i.colorType !== void 0 && m._api._MagickSettings_ColorType_Set(this._instance, i.colorType), i.endian !== void 0 && m._api._MagickSettings_Endian_Set(this._instance, i.endian), i.fillColor !== void 0 && this.setOption("fill", i.fillColor.toString()), i.font !== void 0) {
      const p = Ut._getFontFileName(i.font);
      W(p, (e) => {
        m._api._MagickSettings_Font_Set(this._instance, e);
      });
    }
    i.fontPointsize !== void 0 && m._api._MagickSettings_FontPointsize_Set(this._instance, i.fontPointsize), i.format !== void 0 && W(i.format, (p) => {
      m._api._MagickSettings_Format_Set(this._instance, p);
    }), i.interlace !== void 0 && m._api._MagickSettings_Interlace_Set(this._instance, i.interlace), i.strokeColor !== void 0 && this.setOption("stroke", i.strokeColor.toString()), i.strokeWidth !== void 0 && this.setOption("strokeWidth", i.strokeWidth.toString()), i.textInterlineSpacing !== void 0 && this.setOption("interline-spacing", i.textInterlineSpacing.toString()), i.textKerning !== void 0 && this.setOption("kerning", i.textKerning.toString());
    for (const p in i._options)
      this.setOption(p, i._options[p]);
  }
  setOption(i, u) {
    W(i, (f) => {
      W(u, (p) => {
        m._api._MagickSettings_SetOption(this._instance, f, p);
      });
    });
  }
}
class qe {
  /** @internal */
  _options = {};
  /** @internal */
  _fileName;
  /** @internal */
  _ping = !1;
  /** @internal */
  _quality;
  backgroundColor;
  colorType;
  endian;
  fillColor;
  font;
  fontPointsize;
  format;
  interlace;
  strokeColor;
  strokeWidth;
  textInterlineSpacing;
  textKerning;
  getDefine(i, u) {
    return u !== void 0 ? this._options[`${i}:${u}`] ?? null : this._options[i] ?? null;
  }
  setDefine(i, u, f) {
    if (f === void 0)
      this._options[i] = u;
    else {
      const p = this.parseDefine(i, u);
      typeof f == "string" ? this._options[p] = f : typeof f == "number" ? this._options[p] = f.toString() : this._options[p] = f ? "true" : "false";
    }
  }
  setDefines(i) {
    i.getDefines().forEach((u) => {
      u !== void 0 && this.setDefine(u.format, u.name, u.value);
    });
  }
  /** @internal */
  _clone() {
    const i = new qe();
    return Object.assign(i, this), i;
  }
  /** @internal */
  _use(i) {
    const u = new Dr(this);
    return Ce._disposeAfterExecution(u, i);
  }
  parseDefine(i, u) {
    return i === Re.Unknown ? u : `${i}:${u}`;
  }
}
class Ee extends qe {
  constructor(i) {
    super(), Object.assign(this, i);
  }
  height;
  width;
  /** @internal */
  _use(i) {
    const u = new Dr(this), f = this.getSize();
    return f !== "" && W(f, (p) => {
      m._api._MagickSettings_SetSize(u._instance, p);
    }), Ce._disposeAfterExecution(u, i);
  }
  getSize() {
    return this.width !== void 0 && this.height !== void 0 ? `${this.width}x${this.height}` : this.width !== void 0 ? `${this.width}x` : this.height !== void 0 ? `x${this.height}` : "";
  }
}
class de extends Array {
  constructor() {
    super();
  }
  dispose() {
    let i = this.pop();
    for (; i !== void 0; )
      i.dispose(), i = this.pop();
  }
  appendHorizontally(i) {
    return this.createImage((u, f) => m._api._MagickImageCollection_Append(u, 0, f.ptr), i);
  }
  appendVertically(i) {
    return this.createImage((u, f) => m._api._MagickImageCollection_Append(u, 1, f.ptr), i);
  }
  clone(i) {
    const u = de.create();
    for (let f = 0; f < this.length; f++)
      u.push(se._clone(this[f]));
    return u._use(i);
  }
  evaluate(i, u) {
    return this.createImage((f, p) => m._api._MagickImageCollection_Evaluate(f, i, p.ptr), u);
  }
  flatten(i) {
    return this.mergeImages(14, i);
  }
  merge(i) {
    return this.mergeImages(13, i);
  }
  montage(i, u) {
    this.throwIfEmpty();
    try {
      this.attachImages();
      const f = i._use((w) => M.use((S) => {
        const E = m._api._MagickImageCollection_Montage(this[0]._instance, w._instance, S.ptr);
        return this.checkResult(E, S);
      })), p = de._createFromImages(f, this.getSettings()), e = i.transparentColor;
      return e !== void 0 && p.forEach((w) => {
        w.transparent(e);
      }), p.merge(u);
    } finally {
      this.detachImages();
    }
  }
  mosaic(i) {
    return this.mergeImages(15, i);
  }
  read(i, u) {
    this.dispose(), M.use((f) => {
      const p = de.createSettings(u);
      typeof i == "string" ? (p._fileName = i, p._use((e) => {
        const w = m._api._MagickImageCollection_ReadFile(e._instance, f.ptr);
        this.addImages(w, p);
      })) : p._use((e) => {
        const w = i.byteLength;
        let S = 0;
        try {
          S = m._api._malloc(w), m._api.HEAPU8.set(i, S);
          const E = m._api._MagickImageCollection_ReadBlob(e._instance, S, 0, w, f.ptr);
          this.addImages(E, p);
        } finally {
          S !== 0 && m._api._free(S);
        }
      });
    });
  }
  write(i, u) {
    this.throwIfEmpty();
    let f = 0, p = 0;
    const e = this[0], w = this.getSettings();
    u !== void 0 ? w.format = i : (u = i, w.format = e.format), M.use((E) => {
      Ae.use((B) => {
        w._use((Q) => {
          try {
            this.attachImages(), f = m._api._MagickImage_WriteBlob(e._instance, Q._instance, B.ptr, E.ptr), p = B.value;
          } finally {
            this.detachImages();
          }
        });
      });
    });
    const S = new Mr(f, p, u);
    return Ce._disposeAfterExecution(S, S.func);
  }
  static create(i) {
    const u = de.createObject();
    return i !== void 0 && u.read(i), u;
  }
  /** @internal */
  static _createFromImages(i, u) {
    const f = de.createObject();
    return f.addImages(i, u._clone()), f;
  }
  _use(i) {
    return Ce._disposeAfterExecution(this, i);
  }
  addImages(i, u) {
    u.format = Re.Unknown;
    let f = i;
    for (; f !== 0; ) {
      const p = m._api._MagickImage_GetNext(f);
      m._api._MagickImage_SetNext(f, 0), this.push(se._createFromImage(f, u)), f = p;
    }
  }
  attachImages() {
    for (let i = 0; i < this.length - 1; i++)
      m._api._MagickImage_SetNext(this[i]._instance, this[i + 1]._instance);
  }
  static createObject() {
    return Object.create(de.prototype);
  }
  createImage(i, u) {
    this.throwIfEmpty();
    try {
      this.attachImages();
      const f = M.use((e) => {
        const w = i(this[0]._instance, e);
        return this.checkResult(w, e);
      });
      return se._createFromImage(f, this.getSettings())._use(u);
    } finally {
      this.detachImages();
    }
  }
  static createSettings(i) {
    return i == null ? new qe() : new Ee(i);
  }
  detachImages() {
    for (let i = 0; i < this.length - 1; i++)
      m._api._MagickImage_SetNext(this[i]._instance, 0);
  }
  getSettings() {
    return this[0]._getSettings()._clone();
  }
  mergeImages(i, u) {
    return this.createImage((f, p) => m._api._MagickImageCollection_Merge(f, i, p.ptr), u);
  }
  throwIfEmpty() {
    if (this.length === 0)
      throw new O("operation requires at least one image");
  }
  checkResult(i, u) {
    return u.check(() => i, () => (m._api._MagickImageCollection_Dispose(i), 0));
  }
}
class ce {
  _value;
  constructor(i) {
    this._value = i;
  }
  /** @internal */
  static fromQuantum(i) {
    return new ce(i / ze.max * 100);
  }
  multiply(i) {
    return i * this._value / 100;
  }
  toDouble() {
    return this._value;
  }
  toQuantum() {
    return ze.max * (this._value / 100);
  }
}
class yr {
  static use(i, u, f) {
    const p = m._api._MagickRectangle_Create();
    try {
      m._api._MagickRectangle_X_Set(p, u.x), m._api._MagickRectangle_Y_Set(p, u.y);
      let e = u.width, w = u.height;
      return u.isPercentage && (e = new ce(u.width).multiply(i.width), w = new ce(u.height).multiply(i.height)), m._api._MagickRectangle_Width_Set(p, e), m._api._MagickRectangle_Height_Set(p, w), f(p);
    } finally {
      m._api._MagickRectangle_Dispose(p);
    }
  }
}
var Ge = /* @__PURE__ */ ((r) => (r[r.Red = 0] = "Red", r[r.Cyan = 0] = "Cyan", r[r.Gray = 0] = "Gray", r[r.Green = 1] = "Green", r[r.Magenta = 1] = "Magenta", r[r.Blue = 2] = "Blue", r[r.Yellow = 2] = "Yellow", r[r.Black = 3] = "Black", r[r.Alpha = 4] = "Alpha", r[r.Index = 5] = "Index", r[r.Composite = 64] = "Composite", r))(Ge || {});
function wr(r, i) {
  if (r.byteLength === 0)
    throw new O("The specified array cannot be empty");
  let u = 0;
  try {
    return u = m._api._malloc(r.byteLength), m._api.HEAPU8.set(r, u), i(u);
  } finally {
    u !== 0 && m._api._free(u);
  }
}
function uu(r, i) {
  const u = r.length * 8;
  if (u === 0)
    throw new O("The specified array cannot be empty");
  let f = 0;
  try {
    f = m._api._malloc(u);
    const p = new ArrayBuffer(u), e = new Float64Array(p);
    for (let w = 0; w < r.length; w++)
      e[w] = r[w];
    return m._api.HEAPU8.set(new Int8Array(p), f), i(f);
  } finally {
    f !== 0 && m._api._free(f);
  }
}
function ou(r, i) {
  if (r.byteLength === 0)
    throw new O("The specified array cannot be empty");
  let u = 0;
  try {
    return u = m._api._malloc(r.byteLength), m._api.HEAPU8.set(r, u), i(u);
  } finally {
    u !== 0 && m._api._free(u);
  }
}
class xe extends Ve {
  image;
  constructor(i) {
    const u = M.usePointer((p) => m._api._PixelCollection_Create(i._instance, p)), f = m._api._PixelCollection_Dispose;
    super(u, f), this.image = i;
  }
  /** @internal */
  static _create(i) {
    return new xe(i);
  }
  static _use(i, u) {
    const f = new xe(i);
    return Ce._disposeAfterExecution(f, u);
  }
  /** @internal */
  static _map(i, u, f) {
    const p = new xe(i);
    try {
      p.use(0, 0, i.width, i.height, u, (e) => {
        f(e);
      });
    } finally {
      p.dispose();
    }
  }
  getArea(i, u, f, p) {
    return M.usePointer((e) => {
      const w = m._api._PixelCollection_GetArea(this._instance, i, u, f, p, e), S = f * p * this.image.channelCount;
      return m._api.HEAPU8.subarray(w, w + S);
    });
  }
  getPixel(i, u) {
    return this.getArea(i, u, 1, 1);
  }
  setArea(i, u, f, p, e) {
    M.usePointer((w) => {
      const S = e instanceof Uint8Array ? e : new Uint8Array(e);
      ou(S, (E) => {
        m._api._PixelCollection_SetArea(this._instance, i, u, f, p, E, S.length, w);
      });
    });
  }
  setPixel(i, u, f) {
    f instanceof Uint8Array ? this.setArea(i, u, 1, 1, f) : this.setArea(i, u, 1, 1, f);
  }
  toByteArray(i, u, f, p, e) {
    return this.use(i, u, f, p, e, (w) => xe.createArray(w, f, p, e.length));
  }
  static createArray(i, u, f, p) {
    if (i === 0)
      return null;
    try {
      const e = u * f * p;
      return m._api.HEAPU8.slice(i, i + e);
    } finally {
      i = m._api._MagickMemory_Relinquish(i);
    }
  }
  use(i, u, f, p, e, w) {
    return W(e, (S) => M.use((E) => {
      let B = m._api._PixelCollection_ToByteArray(this._instance, i, u, f, p, S, E.ptr);
      return E.check(() => {
        const Q = w(B);
        return B = m._api._MagickMemory_Relinquish(B), Q;
      }, () => (B = m._api._MagickMemory_Relinquish(B), null));
    }));
  }
}
class gt {
  _x;
  _y;
  constructor(i, u) {
    this._x = i, this._y = u ?? i;
  }
  get x() {
    return this._x;
  }
  set x(i) {
    this._x = i;
  }
  get y() {
    return this._y;
  }
  set y(i) {
    this._y = i;
  }
}
class Ne {
  _x;
  _y;
  _z;
  constructor(i, u, f) {
    this._x = i, this._y = u, this._z = f;
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get z() {
    return this._z;
  }
  /** @internal */
  static _create(i) {
    return i === 0 ? new Ne(0, 0, 0) : new Ne(
      m._api._PrimaryInfo_X_Get(i),
      m._api._PrimaryInfo_Y_Get(i),
      m._api._PrimaryInfo_Z_Get(i)
    );
  }
  /** @internal */
  _use(i) {
    let u = 0;
    try {
      u = m._api._PrimaryInfo_Create(), m._api._PrimaryInfo_X_Set(u, this._x), m._api._PrimaryInfo_Y_Set(u, this._y), m._api._PrimaryInfo_Z_Set(u, this._z), i(u);
    } finally {
      m._api._free(u);
    }
  }
}
class mn {
  _channels = {};
  get channels() {
    const i = [];
    for (const u in this._channels)
      i.push(parseInt(u));
    return i;
  }
  composite() {
    return this._channels[Ge.Composite];
  }
  getChannel(i) {
    const u = this._channels[i];
    return u !== void 0 ? u : null;
  }
  static _create(i, u, f) {
    const p = new mn();
    return i.channels.forEach((e) => {
      f >> e & 1 && p.addChannel(u, e);
    }), p.addChannel(u, Ge.Composite), p;
  }
  addChannel(i, u) {
    const f = m._api._Statistics_GetInstance(i, u);
    f !== 0 && (this._channels[u] = new cu(u, f));
  }
}
class _u {
  static toArray(i) {
    if (i === 0)
      return null;
    const u = m._api._StringInfo_Datum_Get(i), f = m._api._StringInfo_Length_Get(i);
    return m._api.HEAPU8.subarray(u, u + f);
  }
}
class se extends Ve {
  _settings;
  constructor(i, u) {
    super(i, m._api._MagickImage_Dispose), this._settings = u;
  }
  get animationDelay() {
    return m._api._MagickImage_AnimationDelay_Get(this._instance);
  }
  set animationDelay(i) {
    m._api._MagickImage_AnimationDelay_Set(this._instance, i);
  }
  get animationIterations() {
    return m._api._MagickImage_AnimationIterations_Get(this._instance);
  }
  set animationIterations(i) {
    m._api._MagickImage_AnimationIterations_Set(this._instance, i);
  }
  get animationTicksPerSecond() {
    return m._api._MagickImage_AnimationTicksPerSecond_Get(this._instance);
  }
  set animationTicksPerSecond(i) {
    m._api._MagickImage_AnimationTicksPerSecond_Set(this._instance, i);
  }
  get artifactNames() {
    const i = [];
    m._api._MagickImage_ResetArtifactIterator(this._instance);
    let u = m._api._MagickImage_GetNextArtifactName(this._instance);
    for (; u !== 0; )
      i.push(m._api.UTF8ToString(u)), u = m._api._MagickImage_GetNextArtifactName(this._instance);
    return i;
  }
  get attributeNames() {
    const i = [];
    m._api._MagickImage_ResetAttributeIterator(this._instance);
    let u = m._api._MagickImage_GetNextAttributeName(this._instance);
    for (; u !== 0; )
      i.push(m._api.UTF8ToString(u)), u = m._api._MagickImage_GetNextAttributeName(this._instance);
    return i;
  }
  get backgroundColor() {
    const i = m._api._MagickImage_BackgroundColor_Get(this._instance);
    return y._create(i);
  }
  set backgroundColor(i) {
    i._use((u) => {
      m._api._MagickImage_BackgroundColor_Set(this._instance, u);
    });
  }
  get baseHeight() {
    return m._api._MagickImage_BaseHeight_Get(this._instance);
  }
  get baseWidth() {
    return m._api._MagickImage_BaseWidth_Get(this._instance);
  }
  get blackPointCompensation() {
    return m._api._MagickImage_BlackPointCompensation_Get(this._instance) === 1;
  }
  set blackPointCompensation(i) {
    m._api._MagickImage_BlackPointCompensation_Set(this._instance, i ? 1 : 0);
  }
  get borderColor() {
    const i = m._api._MagickImage_BorderColor_Get(this._instance);
    return y._create(i);
  }
  set borderColor(i) {
    i._use((u) => {
      m._api._MagickImage_BorderColor_Set(this._instance, u);
    });
  }
  get boundingBox() {
    return M.usePointer((i) => {
      const u = m._api._MagickImage_BoundingBox_Get(this._instance, i), f = _e._fromRectangle(u);
      return f.width === 0 || f.height === 0 ? null : f;
    });
  }
  get channelCount() {
    return m._api._MagickImage_ChannelCount_Get(this._instance);
  }
  get channels() {
    const i = [];
    return [Ge.Red, Ge.Green, Ge.Blue, Ge.Black, Ge.Alpha].forEach((u) => {
      m._api._MagickImage_HasChannel(this._instance, u) && i.push(u);
    }), i;
  }
  get chromaticity() {
    return new nu(
      Ne._create(m._api._MagickImage_ChromaRedPrimary_Get(this._instance)),
      Ne._create(m._api._MagickImage_ChromaGreenPrimary_Get(this._instance)),
      Ne._create(m._api._MagickImage_ChromaBluePrimary_Get(this._instance)),
      Ne._create(m._api._MagickImage_ChromaWhitePoint_Get(this._instance))
    );
  }
  set chromaticity(i) {
    i.blue._use((u) => m._api._MagickImage_ChromaBluePrimary_Set(this._instance, u)), i.green._use((u) => m._api._MagickImage_ChromaGreenPrimary_Set(this._instance, u)), i.red._use((u) => m._api._MagickImage_ChromaRedPrimary_Set(this._instance, u)), i.white._use((u) => m._api._MagickImage_ChromaWhitePoint_Set(this._instance, u));
  }
  get classType() {
    return M.usePointer((i) => m._api._MagickImage_ClassType_Get(this._instance, i));
  }
  set classType(i) {
    M.usePointer((u) => {
      m._api._MagickImage_ClassType_Set(this._instance, i, u);
    });
  }
  get colorFuzz() {
    return ce.fromQuantum(m._api._MagickImage_ColorFuzz_Get(this._instance));
  }
  set colorFuzz(i) {
    m._api._MagickImage_ColorFuzz_Set(this._instance, i.toQuantum());
  }
  get colormapSize() {
    return M.usePointer((i) => m._api._MagickImage_ColormapSize_Get(this._instance, i));
  }
  set colormapSize(i) {
    M.usePointer((u) => {
      m._api._MagickImage_ColormapSize_Set(this._instance, i, u);
    });
  }
  get colorSpace() {
    return M.usePointer((i) => m._api._MagickImage_ColorSpace_Get(this._instance, i));
  }
  set colorSpace(i) {
    M.usePointer((u) => {
      m._api._MagickImage_ColorSpace_Set(this._instance, i, u);
    });
  }
  get colorType() {
    return this.settings.colorType !== void 0 ? this.settings.colorType : M.usePointer((i) => m._api._MagickImage_ColorType_Get(this._instance, i));
  }
  set colorType(i) {
    M.usePointer((u) => {
      m._api._MagickImage_ColorType_Set(this._instance, i, u);
    });
  }
  get comment() {
    return this.getAttribute("comment");
  }
  set comment(i) {
    i === null ? this.removeAttribute("comment") : this.setAttribute("comment", i);
  }
  get compose() {
    return m._api._MagickImage_Compose_Get(this._instance);
  }
  set compose(i) {
    m._api._MagickImage_Compose_Set(this._instance, i);
  }
  get compression() {
    return m._api._MagickImage_Compression_Get(this._instance);
  }
  get density() {
    return new ru(
      m._api._MagickImage_ResolutionX_Get(this._instance),
      m._api._MagickImage_ResolutionY_Get(this._instance),
      m._api._MagickImage_ResolutionUnits_Get(this._instance)
    );
  }
  set density(i) {
    m._api._MagickImage_ResolutionX_Set(this._instance, i.x), m._api._MagickImage_ResolutionY_Set(this._instance, i.y), m._api._MagickImage_ResolutionUnits_Set(this._instance, i.units);
  }
  get depth() {
    return m._api._MagickImage_Depth_Get(this._instance);
  }
  set depth(i) {
    m._api._MagickImage_Depth_Set(this._instance, i);
  }
  get endian() {
    return m._api._MagickImage_Endian_Get(this._instance);
  }
  set endian(i) {
    m._api._MagickImage_Endian_Set(this._instance, i);
  }
  get fileName() {
    const i = m._api._MagickImage_FileName_Get(this._instance);
    return i === 0 ? null : m._api.UTF8ToString(i);
  }
  get filterType() {
    return m._api._MagickImage_FilterType_Get(this._instance);
  }
  set filterType(i) {
    m._api._MagickImage_FilterType_Set(this._instance, i);
  }
  get format() {
    return he(m._api._MagickImage_Format_Get(this._instance));
  }
  set format(i) {
    W(i.toString(), (u) => m._api._MagickImage_Format_Set(this._instance, u));
  }
  get gamma() {
    return m._api._MagickImage_Gamma_Get(this._instance);
  }
  get gifDisposeMethod() {
    return m._api._MagickImage_GifDisposeMethod_Get(this._instance);
  }
  set gifDisposeMethod(i) {
    m._api._MagickImage_GifDisposeMethod_Set(this._instance, i);
  }
  get hasAlpha() {
    return M.usePointer((i) => this.toBool(m._api._MagickImage_HasAlpha_Get(this._instance, i)));
  }
  set hasAlpha(i) {
    M.usePointer((u) => {
      i && this.alpha(kr.Opaque), m._api._MagickImage_HasAlpha_Set(this._instance, this.fromBool(i), u);
    });
  }
  get height() {
    return m._api._MagickImage_Height_Get(this._instance);
  }
  get interlace() {
    return m._api._MagickImage_Interlace_Get(this._instance);
  }
  get interpolate() {
    return m._api._MagickImage_Interpolate_Get(this._instance);
  }
  set interpolate(i) {
    m._api._MagickImage_Interpolate_Set(this._instance, i);
  }
  get label() {
    return this.getAttribute("label");
  }
  set label(i) {
    i === null ? this.removeAttribute("label") : this.setAttribute("label", i);
  }
  get orientation() {
    return m._api._MagickImage_Orientation_Get(this._instance);
  }
  set orientation(i) {
    m._api._MagickImage_Orientation_Set(this._instance, i);
  }
  get page() {
    const i = m._api._MagickImage_Page_Get(this._instance);
    return _e._fromRectangle(i);
  }
  set page(i) {
    i._toRectangle((u) => {
      m._api._MagickImage_Page_Set(this._instance, u);
    });
  }
  get quality() {
    return m._api._MagickImage_Quality_Get(this._instance);
  }
  set quality(i) {
    let u = i < 1 ? 1 : i;
    u = u > 100 ? 100 : u, m._api._MagickImage_Quality_Set(this._instance, u), this._settings._quality = u;
  }
  get settings() {
    return this._settings;
  }
  get signature() {
    return M.usePointer((i) => he(m._api._MagickImage_Signature_Get(this._instance, i)));
  }
  get virtualPixelMethod() {
    return M.usePointer((i) => m._api._MagickImage_VirtualPixelMethod_Get(this._instance, i));
  }
  set virtualPixelMethod(i) {
    M.usePointer((u) => {
      m._api._MagickImage_VirtualPixelMethod_Set(this._instance, i, u);
    });
  }
  get width() {
    return m._api._MagickImage_Width_Get(this._instance);
  }
  alpha(i) {
    M.usePointer((u) => {
      m._api._MagickImage_SetAlpha(this._instance, i, u);
    });
  }
  autoOrient() {
    M.use((i) => {
      const u = m._api._MagickImage_AutoOrient(this._instance, i.ptr);
      this._setInstance(u, i);
    });
  }
  autoThreshold(i) {
    M.use((u) => {
      m._api._MagickImage_AutoThreshold(this._instance, i, u.ptr);
    });
  }
  blur(i, u, f) {
    let p = 0;
    const e = this.valueOrDefault(u, 1);
    let w = this.valueOrDefault(f, ie.Undefined);
    typeof i == "number" ? p = i : i !== void 0 && (w = i), M.use((S) => {
      const E = m._api._MagickImage_Blur(this._instance, p, e, w, S.ptr);
      this._setInstance(E, S);
    });
  }
  border(i, u) {
    const f = i, p = this.valueOrDefault(u, i), e = new _e(0, 0, f, p);
    M.use((w) => {
      e._toRectangle((S) => {
        const E = m._api._MagickImage_Border(this._instance, S, w.ptr);
        this._setInstance(E, w);
      });
    });
  }
  brightnessContrast(i, u, f) {
    const p = this.valueOrDefault(f, ie.Undefined);
    M.use((e) => {
      m._api._MagickImage_BrightnessContrast(this._instance, i.toDouble(), u.toDouble(), p, e.ptr);
    });
  }
  channelOffset(i) {
    return m._api._MagickImage_HasChannel(this._instance, i) ? m._api._MagickImage_ChannelOffset(this._instance, i) : -1;
  }
  charcoal(i, u) {
    const f = i === void 0 ? 0 : i, p = u === void 0 ? 1 : u;
    M.use((e) => {
      const w = m._api._MagickImage_Charcoal(this._instance, f, p, e.ptr);
      this._setInstance(w, e);
    });
  }
  clahe(i, u, f, p) {
    M.usePointer((e) => {
      const w = i instanceof ce ? i.multiply(this.width) : i, S = u instanceof ce ? u.multiply(this.height) : u;
      m._api._MagickImage_Clahe(this._instance, w, S, f, p, e);
    });
  }
  clone(i) {
    return se._clone(this)._use(i);
  }
  colorAlpha(i) {
    if (!this.hasAlpha)
      return;
    const u = se.create();
    u.read(i, this.width, this.height), u.composite(this, Nt.SrcOver, new gt(0, 0)), this._instance = u._instance;
  }
  compare(i, u, f) {
    return M.usePointer((p) => {
      const e = this.valueOrDefault(f, ie.Undefined);
      return m._api._MagickImage_CompareDistortion(this._instance, i._instance, u, e, p);
    });
  }
  composite(i, u, f, p, e) {
    let w = 0, S = 0, E = Nt.In, B = ie.Default, Q = null;
    u instanceof gt ? (w = u.x, S = u.y) : u !== void 0 && (E = u), f instanceof gt ? (w = f.x, S = f.y) : typeof f == "string" ? Q = f : f !== void 0 && (B = f), typeof p == "string" ? Q = p : p !== void 0 && (B = p), e !== void 0 && (B = e), Q !== null && this.setArtifact("compose:args", Q), M.usePointer((ue) => {
      m._api._MagickImage_Composite(this._instance, i._instance, w, S, E, B, ue);
    }), Q !== null && this.removeArtifact("compose:args");
  }
  compositeGravity(i, u, f, p, e, w) {
    let S = 0, E = 0, B = Nt.In, Q = ie.Default, ue = null;
    f instanceof gt ? (S = f.x, E = f.y) : f !== void 0 && (B = f), p instanceof gt ? (S = p.x, E = p.y) : typeof p == "string" ? ue = p : p !== void 0 && (Q = p), typeof e == "string" ? ue = e : e !== void 0 && (Q = e), w !== void 0 && (Q = w), ue !== null && this.setArtifact("compose:args", ue), M.usePointer((ge) => {
      m._api._MagickImage_CompositeGravity(this._instance, i._instance, u, S, E, B, Q, ge);
    }), ue !== null && this.removeArtifact("compose:args");
  }
  contrast = () => this._contrast(!0);
  contrastStretch(i, u, f) {
    const p = this.width * this.height, e = i.multiply(p), w = p - (u ?? i).multiply(p), S = this.valueOrDefault(f, ie.Undefined);
    M.usePointer((E) => {
      m._api._MagickImage_ContrastStretch(this._instance, e, w, S, E);
    });
  }
  static create(i, u, f) {
    const p = new se(se.createInstance(), new qe());
    return i !== void 0 && p.readOrPing(!1, i, u, f), p;
  }
  crop(i, u, f) {
    let p, e;
    i instanceof _e ? (p = i, e = this.valueOrDefault(u, zt.Undefined)) : u !== void 0 && (p = new _e(i, u), e = this.valueOrDefault(f, zt.Undefined)), M.use((w) => {
      W(p.toString(), (S) => {
        const E = m._api._MagickImage_Crop(this._instance, S, e, w.ptr);
        this._setInstance(E, w);
      });
    });
  }
  cropToTiles(i) {
    return M.use((u) => W(i.toString(), (f) => {
      const p = m._api._MagickImage_CropToTiles(this._instance, f, u.ptr);
      return de._createFromImages(p, this._settings);
    }));
  }
  deskew(i) {
    M.use((f) => {
      const p = m._api._MagickImage_Deskew(this._instance, i.toQuantum(), f.ptr);
      this._setInstance(p, f);
    });
    const u = Number(this.getArtifact("deskew:angle"));
    return isNaN(u) ? 0 : u;
  }
  distort(i, u, f) {
    let p, e = 0, w = null;
    u instanceof Array ? p = u : f instanceof Array ? (p = f, w = u, e = w.bestFit ? 1 : 0, w._setArtifacts(this)) : p = [], M.use((S) => {
      uu(p, (E) => {
        const B = m._api._MagickImage_Distort(this._instance, i, e, E, p.length, S.ptr);
        this._setInstance(B, S);
      });
    }), w !== null && w._removeArtifacts(this);
  }
  draw(...i) {
    const u = fn._create(this, this._settings);
    try {
      u.draw(i.flat());
    } finally {
      u.dispose();
    }
  }
  evaluate(i, u, f, p) {
    if (typeof u == "number") {
      const e = u, w = typeof f == "number" ? f : f.toQuantum();
      M.usePointer((S) => {
        m._api._MagickImage_EvaluateOperator(this._instance, i, e, w, S);
      });
    } else if (p !== void 0) {
      if (typeof f != "number")
        throw new O("this should not happen");
      const e = u, w = f, S = typeof p == "number" ? p : p.toQuantum();
      if (e.isPercentage)
        throw new O("percentage is not supported");
      M.usePointer((E) => {
        yr.use(this, e, (B) => {
          m._api._MagickImage_EvaluateGeometry(this._instance, i, B, w, S, E);
        });
      });
    }
  }
  extent(i, u, f) {
    let p = zt.Undefined, e;
    i instanceof _e ? e = i : typeof u == "number" && (e = new _e(i, u)), u instanceof y ? this.backgroundColor = u : u !== void 0 && (p = u), f instanceof y ? this.backgroundColor = f : f !== void 0 && (p = f), M.use((w) => {
      W(e.toString(), (S) => {
        const E = m._api._MagickImage_Extent(this._instance, S, p, w.ptr);
        this._setInstance(E, w);
      });
    });
  }
  flip() {
    M.use((i) => {
      const u = m._api._MagickImage_Flip(this._instance, i.ptr);
      this._setInstance(u, i);
    });
  }
  flop() {
    M.use((i) => {
      const u = m._api._MagickImage_Flop(this._instance, i.ptr);
      this._setInstance(u, i);
    });
  }
  getArtifact(i) {
    return W(i, (u) => {
      const f = m._api._MagickImage_GetArtifact(this._instance, u);
      return he(f);
    });
  }
  getAttribute(i) {
    return M.use((u) => W(i, (f) => {
      const p = m._api._MagickImage_GetAttribute(this._instance, f, u.ptr);
      return he(p);
    }));
  }
  getProfile(i) {
    return W(i, (u) => {
      const f = m._api._MagickImage_GetProfile(this._instance, u), p = _u.toArray(f);
      return p === null ? null : new su(i, p);
    });
  }
  getWriteMask(i) {
    const u = M.usePointer((p) => m._api._MagickImage_GetWriteMask(this._instance, p)), f = u === 0 ? null : new se(u, new qe());
    return f == null ? i(f) : f._use(i);
  }
  getPixels(i) {
    if (this._settings._ping)
      throw new O("image contains no pixel data");
    return xe._use(this, i);
  }
  histogram() {
    const i = /* @__PURE__ */ new Map();
    return M.usePointer((u) => {
      Ae.use((f) => {
        const p = m._api._MagickImage_Histogram(this._instance, f.ptr, u);
        if (p !== 0) {
          const e = f.value;
          for (let w = 0; w < e; w++) {
            const S = m._api._MagickColorCollection_GetInstance(p, w), E = y._create(S), B = m._api._MagickColor_Count_Get(S);
            i.set(E.toString(), B);
          }
          m._api._MagickColorCollection_DisposeList(p);
        }
      });
    }), i;
  }
  inverseContrast = () => this._contrast(!1);
  inverseOpaque = (i, u) => this._opaque(i, u, !0);
  inverseSigmoidalContrast(i, u, f) {
    this._sigmoidalContrast(!1, i, u, f);
  }
  inverseTransparent = (i) => this._transparent(i, !0);
  level(i, u, f, p) {
    let e = ie.Composite, w, S, E = this.valueOrDefault(p, 1);
    typeof i == "number" ? (e = i, w = u, f instanceof ce && (S = f)) : (w = i, S = u, typeof f == "number" && (E = f)), M.usePointer((B) => {
      m._api._MagickImage_Level(this._instance, w.toDouble(), S.toQuantum(), E, e, B);
    });
  }
  linearStretch(i, u) {
    M.usePointer((f) => {
      m._api._MagickImage_LinearStretch(this._instance, i.toDouble(), u.toQuantum(), f);
    });
  }
  liquidRescale(i, u) {
    const f = typeof i == "number" ? new _e(i, u) : i;
    M.use((p) => {
      W(f.toString(), (e) => {
        const w = m._api._MagickImage_LiquidRescale(this._instance, e, f.x, f.y, p.ptr);
        this._setInstance(w, p);
      });
    });
  }
  negate(i) {
    M.usePointer((u) => {
      const f = this.valueOrDefault(i, ie.Undefined);
      m._api._MagickImage_Negate(this._instance, 0, f, u);
    });
  }
  negateGrayScale(i) {
    M.usePointer((u) => {
      const f = this.valueOrDefault(i, ie.Undefined);
      m._api._MagickImage_Negate(this._instance, 1, f, u);
    });
  }
  normalize() {
    M.usePointer((i) => {
      m._api._MagickImage_Normalize(this._instance, i);
    });
  }
  modulate(i, u, f) {
    const p = this.valueOrDefault(u, new ce(100)), e = this.valueOrDefault(f, new ce(100));
    M.usePointer((w) => {
      const S = `${i.toDouble()}/${p.toDouble()}/${e.toDouble()}`;
      W(S, (E) => {
        m._api._MagickImage_Modulate(this._instance, E, w);
      });
    });
  }
  oilPaint(i) {
    const u = this.valueOrDefault(i, 3), f = 0;
    M.use((p) => {
      const e = m._api._MagickImage_OilPaint(this._instance, u, f, p.ptr);
      this._setInstance(e, p);
    });
  }
  opaque = (i, u) => this._opaque(i, u, !1);
  ping(i, u) {
    this.readOrPing(!0, i, u);
  }
  read(i, u, f) {
    this.readOrPing(!1, i, u, f);
  }
  readFromCanvas(i) {
    const u = i.getContext("2d");
    if (u === null)
      return;
    const f = u.getImageData(0, 0, i.width, i.height), p = new Ee();
    p.format = Re.Rgba, p.width = i.width, p.height = i.height, M.use((e) => {
      this.readFromArray(f.data, p, e);
    });
  }
  removeArtifact(i) {
    W(i, (u) => {
      m._api._MagickImage_RemoveArtifact(this._instance, u);
    });
  }
  removeAttribute(i) {
    W(i, (u) => {
      m._api._MagickImage_RemoveAttribute(this._instance, u);
    });
  }
  removeProfile(i) {
    W(i, (u) => {
      m._api._MagickImage_RemoveProfile(this._instance, u);
    });
  }
  removeWriteMask() {
    M.usePointer((i) => {
      m._api._MagickImage_SetWriteMask(this._instance, 0, i);
    });
  }
  repage() {
    this.page = new _e(0, 0, 0, 0);
  }
  resize(i, u) {
    const f = typeof i == "number" ? new _e(i, u) : i;
    M.use((p) => {
      W(f.toString(), (e) => {
        const w = m._api._MagickImage_Resize(this._instance, e, p.ptr);
        this._setInstance(w, p);
      });
    });
  }
  rotate(i) {
    M.use((u) => {
      const f = m._api._MagickImage_Rotate(this._instance, i, u.ptr);
      this._setInstance(f, u);
    });
  }
  separate(i, u) {
    return M.use((f) => {
      const p = this.valueOrDefault(u, ie.Undefined), e = m._api._MagickImage_Separate(this._instance, p, f.ptr);
      return de._createFromImages(e, this._settings)._use(i);
    });
  }
  setArtifact(i, u) {
    let f;
    typeof u == "string" ? f = u : f = this.fromBool(u).toString(), W(i, (p) => {
      W(f, (e) => {
        m._api._MagickImage_SetArtifact(this._instance, p, e);
      });
    });
  }
  setAttribute(i, u) {
    M.use((f) => {
      W(i, (p) => {
        W(u, (e) => {
          m._api._MagickImage_SetAttribute(this._instance, p, e, f.ptr);
        });
      });
    });
  }
  setProfile(i, u) {
    M.use((f) => {
      W(i, (p) => {
        wr(u, (e) => {
          m._api._MagickImage_SetProfile(this._instance, p, e, u.byteLength, f.ptr);
        });
      });
    });
  }
  setWriteMask(i) {
    M.usePointer((u) => {
      m._api._MagickImage_SetWriteMask(this._instance, i._instance, u);
    });
  }
  sharpen(i, u, f) {
    const p = this.valueOrDefault(i, 0), e = this.valueOrDefault(u, 1), w = this.valueOrDefault(f, ie.Undefined);
    M.use((S) => {
      const E = m._api._MagickImage_Sharpen(this._instance, p, e, w, S.ptr);
      this._setInstance(E, S);
    });
  }
  shave(i, u) {
    M.use((f) => {
      const p = m._api._MagickImage_Shave(this._instance, i, u, f.ptr);
      this._setInstance(p, f);
    });
  }
  sigmoidalContrast(i, u, f) {
    this._sigmoidalContrast(!0, i, u, f);
  }
  splice(i) {
    yr.use(this, i, (u) => {
      M.use((f) => {
        const p = m._api._MagickImage_Splice(this._instance, u, f.ptr);
        this._setInstance(p, f);
      });
    });
  }
  statistics(i) {
    const u = this.valueOrDefault(i, ie.Default);
    return M.usePointer((f) => {
      const p = m._api._MagickImage_Statistics(this._instance, u, f), e = mn._create(this, p, u);
      return m._api._Statistics_DisposeList(p), e;
    });
  }
  strip() {
    M.usePointer((i) => {
      m._api._MagickImage_Strip(this._instance, i);
    });
  }
  toString = () => `${this.format} ${this.width}x${this.height} ${this.depth}-bit ${Sr[this.colorSpace]}`;
  transparent(i) {
    i._use((u) => {
      M.usePointer((f) => {
        m._api._MagickImage_Transparent(this._instance, u, 0, f);
      });
    });
  }
  trim(...i) {
    if (i.length > 0)
      if (i.length == 1 && i[0] instanceof ce) {
        const u = i[0];
        this.setArtifact("trim:percent-background", u.toDouble().toString());
      } else {
        const u = i, f = [...new Set(iu(u))].join(",");
        this.setArtifact("trim:edges", f);
      }
    M.use((u) => {
      const f = m._api._MagickImage_Trim(this._instance, u.ptr);
      this._setInstance(f, u), this.removeArtifact("trim:edges"), this.removeArtifact("trim:percent-background");
    });
  }
  wave(i, u, f) {
    const p = this.valueOrDefault(i, this.interpolate), e = this.valueOrDefault(u, 25), w = this.valueOrDefault(f, 150);
    M.use((S) => {
      const E = m._api._MagickImage_Wave(this._instance, p, e, w, S.ptr);
      this._setInstance(E, S);
    });
  }
  vignette(i, u, f, p) {
    const e = this.valueOrDefault(i, 0), w = this.valueOrDefault(u, 1), S = this.valueOrDefault(f, 0), E = this.valueOrDefault(p, 0);
    M.use((B) => {
      const Q = m._api._MagickImage_Vignette(this._instance, e, w, S, E, B.ptr);
      this._setInstance(Q, B);
    });
  }
  write(i, u) {
    let f = 0, p = 0;
    u !== void 0 ? this._settings.format = i : u = i, M.use((w) => {
      Ae.use((S) => {
        this._settings._use((E) => {
          try {
            f = m._api._MagickImage_WriteBlob(this._instance, E._instance, S.ptr, w.ptr), p = S.value;
          } catch {
            f !== 0 && (f = m._api._MagickMemory_Relinquish(f));
          }
        });
      });
    });
    const e = new Mr(f, p, u);
    return Ce._disposeAfterExecution(e, e.func);
  }
  writeToCanvas(i) {
    i.width = this.width, i.height = this.height;
    const u = i.getContext("2d");
    u !== null && xe._map(this, "RGBA", (f) => {
      const p = u.createImageData(this.width, this.height);
      let e = 0;
      for (let w = 0; w < this.height; w++)
        for (let S = 0; S < this.width; S++)
          p.data[e++] = m._api.HEAPU8[f++], p.data[e++] = m._api.HEAPU8[f++], p.data[e++] = m._api.HEAPU8[f++], p.data[e++] = m._api.HEAPU8[f++];
      u.putImageData(p, 0, 0);
    });
  }
  /** @internal */
  static _createFromImage(i, u) {
    return new se(i, u);
  }
  /** @internal */
  static _clone(i) {
    return M.usePointer((u) => new se(m._api._MagickImage_Clone(i._instance, u), i._settings._clone()));
  }
  /** @internal */
  _getSettings() {
    return this._settings;
  }
  /** @internal */
  _instanceNotInitialized() {
    throw new O("no image has been read");
  }
  _use(i) {
    return Ce._disposeAfterExecution(this, i);
  }
  static _use(i) {
    return se.create()._use(i);
  }
  _contrast(i) {
    M.usePointer((u) => {
      m._api._MagickImage_Contrast(this._instance, this.fromBool(i), u);
    });
  }
  _opaque(i, u, f) {
    M.usePointer((p) => {
      i._use((e) => {
        u._use((w) => {
          m._api._MagickImage_Opaque(this._instance, e, w, this.fromBool(f), p);
        });
      });
    });
  }
  _sigmoidalContrast(i, u, f, p) {
    let e;
    f !== void 0 ? typeof f == "number" ? e = f : e = f.multiply(ze.max) : e = ze.max * 0.5;
    const w = this.valueOrDefault(p, ie.Undefined);
    M.usePointer((S) => {
      m._api._MagickImage_SigmoidalContrast(this._instance, this.fromBool(i), u, e, w, S);
    });
  }
  _transparent(i, u) {
    i._use((f) => {
      M.usePointer((p) => {
        m._api._MagickImage_Transparent(this._instance, f, this.fromBool(u), p);
      });
    });
  }
  static createInstance() {
    return M.usePointer((i) => m._api._MagickImage_Create(0, i));
  }
  fromBool(i) {
    return i ? 1 : 0;
  }
  readOrPing(i, u, f, p) {
    M.use((e) => {
      const w = f instanceof Ee ? f : new Ee(this._settings);
      if (w._ping = i, this._settings._ping = i, typeof u == "string")
        w._fileName = u;
      else if (u instanceof y)
        w._fileName = "xc:" + u.toShortString(), w.width = typeof f == "number" ? f : 0, w.height = typeof p == "number" ? p : 0;
      else {
        this.readFromArray(u, w, e);
        return;
      }
      w._use((S) => {
        const E = m._api._MagickImage_ReadFile(S._instance, e.ptr);
        this._setInstance(E, e);
      });
    });
  }
  readFromArray(i, u, f) {
    u._use((p) => {
      wr(i, (e) => {
        const w = m._api._MagickImage_ReadBlob(p._instance, e, 0, i.byteLength, f.ptr);
        this._setInstance(w, f);
      });
    });
  }
  toBool(i) {
    return i === 1;
  }
  valueOrDefault(i, u) {
    return i === void 0 ? u : i;
  }
}
class lu {
  _wasmLocation;
  constructor(i) {
    i !== void 0 && (typeof i == "string" ? this._wasmLocation = i : this.wasmBinary = i);
  }
  wasmBinary;
  locateFile = (i, u) => {
    let f = this._wasmLocation;
    return (f === void 0 || f.length === 0) && (f = u + i), f;
  };
}
class m {
  loader;
  api;
  constructor() {
    this.loader = (i) => new Promise((u, f) => {
      if (this.api !== void 0) {
        u();
        return;
      }
      const p = new lu(i);
      tu(p).then((e) => {
        try {
          cn(e, "MAGICK_CONFIGURE_PATH", (w) => {
            cn(e, "/xml", (S) => {
              e._Environment_SetEnv(w, S), this.api = e, u();
            });
          });
        } catch (w) {
          f(w);
        }
      });
    });
  }
  static _create = () => new m();
  /** @internal */
  async _initialize(i) {
    await this.loader(i);
  }
  /** @internal */
  static get _api() {
    if (!Ht.api)
      throw new O("`await initializeImageMagick` should be called to initialize the library");
    return Ht.api;
  }
  /** @internal */
  static set _api(i) {
    Ht.api = i;
  }
  static read(i, u, f, p) {
    return se._use((e) => {
      let w = p;
      if (i instanceof y)
        typeof u == "number" && typeof f == "number" && e.read(i, u, f);
      else if (typeof u != "number" && typeof f != "number") {
        w = f;
        let S;
        u instanceof Ee ? S = u : typeof u == "string" ? (S = new Ee(), S.format = u) : w = u, e.read(i, S);
      }
      return w(e);
    });
  }
  static readCollection(i, u, f) {
    return de.create()._use((e) => {
      let w = f, S;
      return u instanceof Ee ? S = u : typeof u == "string" ? (S = new Ee(), S.format = u) : w = u, e.read(i, S), w(e);
    });
  }
  static readFromCanvas(i, u) {
    return se._use((f) => (f.readFromCanvas(i), u(f)));
  }
}
const Ht = m._create();
async function Eu(r) {
  await Ht._initialize(r);
}
class cu {
  channel;
  depth;
  entropy;
  kurtosis;
  maximum;
  mean;
  minimum;
  skewness;
  standardDeviation;
  constructor(i, u) {
    this.channel = i, this.depth = m._api._ChannelStatistics_Depth_Get(u), this.entropy = m._api._ChannelStatistics_Entropy_Get(u), this.kurtosis = m._api._ChannelStatistics_Kurtosis_Get(u), this.maximum = m._api._ChannelStatistics_Maximum_Get(u), this.mean = m._api._ChannelStatistics_Mean_Get(u), this.minimum = m._api._ChannelStatistics_Minimum_Get(u), this.skewness = m._api._ChannelStatistics_Skewness_Get(u), this.standardDeviation = m._api._ChannelStatistics_StandardDeviation_Get(u);
  }
}
var gu = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.Direct = 1] = "Direct", r[r.Pseudo = 2] = "Pseudo", r))(gu || {}), fu = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.Bilevel = 1] = "Bilevel", r[r.Grayscale = 2] = "Grayscale", r[r.GrayscaleAlpha = 3] = "GrayscaleAlpha", r[r.Palette = 4] = "Palette", r[r.PaletteAlpha = 5] = "PaletteAlpha", r[r.TrueColor = 6] = "TrueColor", r[r.TrueColorAlpha = 7] = "TrueColorAlpha", r[r.ColorSeparation = 8] = "ColorSeparation", r[r.ColorSeparationAlpha = 9] = "ColorSeparationAlpha", r[r.Optimize = 10] = "Optimize", r[r.PaletteBilevelAlpha = 11] = "PaletteBilevelAlpha", r))(fu || {}), mu = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.B44A = 1] = "B44A", r[r.B44 = 2] = "B44", r[r.BZip = 3] = "BZip", r[r.DXT1 = 4] = "DXT1", r[r.DXT3 = 5] = "DXT3", r[r.DXT5 = 6] = "DXT5", r[r.Fax = 7] = "Fax", r[r.Group4 = 8] = "Group4", r[r.JBIG1 = 9] = "JBIG1", r[r.JBIG2 = 10] = "JBIG2", r[r.JPEG2000 = 11] = "JPEG2000", r[r.JPEG = 12] = "JPEG", r[r.LosslessJPEG = 13] = "LosslessJPEG", r[r.LZMA = 14] = "LZMA", r[r.LZW = 15] = "LZW", r[r.NoCompression = 16] = "NoCompression", r[r.Piz = 17] = "Piz", r[r.Pxr24 = 18] = "Pxr24", r[r.RLE = 19] = "RLE", r[r.Zip = 20] = "Zip", r[r.ZipS = 21] = "ZipS", r[r.Zstd = 22] = "Zstd", r[r.WebP = 23] = "WebP", r[r.DWAA = 24] = "DWAA", r[r.DWAB = 25] = "DWAB", r[r.BC7 = 26] = "BC7", r[r.BC5 = 27] = "BC5", r))(mu || {});
class ln {
  constructor(i, u, f) {
    this.format = i, this.name = u, this.value = f;
  }
  format;
  name;
  value;
}
class pu {
  format;
  constructor(i) {
    this.format = i;
  }
  createDefine(i, u) {
    return typeof u == "boolean" ? new ln(this.format, i, u ? "true" : "false") : typeof u == "string" ? new ln(this.format, i, u) : new ln(this.format, i, u.toString());
  }
}
var du = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.Affine = 1] = "Affine", r[r.AffineProjection = 2] = "AffineProjection", r[r.ScaleRotateTranslate = 3] = "ScaleRotateTranslate", r[r.Perspective = 4] = "Perspective", r[r.PerspectiveProjection = 5] = "PerspectiveProjection", r[r.BilinearForward = 6] = "BilinearForward", r[r.BilinearReverse = 7] = "BilinearReverse", r[r.Polynomial = 8] = "Polynomial", r[r.Arc = 9] = "Arc", r[r.Polar = 10] = "Polar", r[r.DePolar = 11] = "DePolar", r[r.Cylinder2Plane = 12] = "Cylinder2Plane", r[r.Plane2Cylinder = 13] = "Plane2Cylinder", r[r.Barrel = 14] = "Barrel", r[r.BarrelInverse = 15] = "BarrelInverse", r[r.Shepards = 16] = "Shepards", r[r.Resize = 17] = "Resize", r[r.Sentinel = 18] = "Sentinel", r[r.RigidAffine = 19] = "RigidAffine", r))(du || {});
class Ru {
  _x;
  _y;
  _paintMethod;
  constructor(i, u, f) {
    this._x = i, this._y = u, this._paintMethod = f;
  }
  draw(i) {
    i.color(this._x, this._y, this._paintMethod);
  }
}
class Au {
  _color;
  constructor(i) {
    this._color = i;
  }
  draw(i) {
    i.fillColor(this._color);
  }
}
class Tu {
  _opacity;
  constructor(i) {
    this._opacity = i;
  }
  draw(i) {
    i.fillOpacity(this._opacity.toDouble() / 100);
  }
}
class Lu {
  _pointSize;
  constructor(i) {
    this._pointSize = i;
  }
  draw(i) {
    i.fontPointSize(this._pointSize);
  }
}
class Wu {
  _font;
  constructor(i) {
    this._font = i;
  }
  draw(i) {
    const u = Ut._getFontFileName(this._font);
    i.font(u);
  }
}
class Bu {
  _gravity;
  constructor(i) {
    this._gravity = i;
  }
  draw(i) {
    i.gravity(this._gravity);
  }
}
class xu {
  _upperLeftX;
  _upperLeftY;
  _lowerRightX;
  _lowerRightY;
  constructor(i, u, f, p) {
    this._upperLeftX = i, this._upperLeftY = u, this._lowerRightX = f, this._lowerRightY = p;
  }
  draw(i) {
    i.rectangle(this._upperLeftX, this._upperLeftY, this._lowerRightX, this._lowerRightY);
  }
}
class Nu {
  _upperLeftX;
  _upperLeftY;
  _lowerRightX;
  _lowerRightY;
  _cornerWidth;
  _cornerHeight;
  constructor(i, u, f, p, e, w) {
    this._upperLeftX = i, this._upperLeftY = u, this._lowerRightX = f, this._lowerRightY = p, this._cornerWidth = e, this._cornerHeight = w;
  }
  draw(i) {
    i.roundRectangle(this._upperLeftX, this._upperLeftY, this._lowerRightX, this._lowerRightY, this._cornerWidth, this._cornerHeight);
  }
}
class zu {
  _x;
  _y;
  _value;
  constructor(i, u, f) {
    this._x = i, this._y = u, this._value = f;
  }
  draw(i) {
    i.text(this._x, this._y, this._value);
  }
}
var hu = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.LSB = 1] = "LSB", r[r.MSB = 2] = "MSB", r))(hu || {}), yu = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.Absolute = 1] = "Absolute", r[r.Fuzz = 2] = "Fuzz", r[r.MeanAbsolute = 3] = "MeanAbsolute", r[r.MeanErrorPerPixel = 4] = "MeanErrorPerPixel", r[r.MeanSquared = 5] = "MeanSquared", r[r.NormalizedCrossCorrelation = 6] = "NormalizedCrossCorrelation", r[r.PeakAbsolute = 7] = "PeakAbsolute", r[r.PeakSignalToNoiseRatio = 8] = "PeakSignalToNoiseRatio", r[r.PerceptualHash = 9] = "PerceptualHash", r[r.RootMeanSquared = 10] = "RootMeanSquared", r[r.StructuralSimilarity = 11] = "StructuralSimilarity", r[r.StructuralDissimilarity = 12] = "StructuralDissimilarity", r))(yu || {}), wu = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.Abs = 1] = "Abs", r[r.Add = 2] = "Add", r[r.AddModulus = 3] = "AddModulus", r[r.And = 4] = "And", r[r.Cosine = 5] = "Cosine", r[r.Divide = 6] = "Divide", r[r.Exponential = 7] = "Exponential", r[r.GaussianNoise = 8] = "GaussianNoise", r[r.ImpulseNoise = 9] = "ImpulseNoise", r[r.LaplacianNoise = 10] = "LaplacianNoise", r[r.LeftShift = 11] = "LeftShift", r[r.Log = 12] = "Log", r[r.Max = 13] = "Max", r[r.Mean = 14] = "Mean", r[r.Median = 15] = "Median", r[r.Min = 16] = "Min", r[r.MultiplicativeNoise = 17] = "MultiplicativeNoise", r[r.Multiply = 18] = "Multiply", r[r.Or = 19] = "Or", r[r.PoissonNoise = 20] = "PoissonNoise", r[r.Pow = 21] = "Pow", r[r.RightShift = 22] = "RightShift", r[r.RootMeanSquare = 23] = "RootMeanSquare", r[r.Set = 24] = "Set", r[r.Sine = 25] = "Sine", r[r.Subtract = 26] = "Subtract", r[r.Sum = 27] = "Sum", r[r.ThresholdBlack = 28] = "ThresholdBlack", r[r.Threshold = 29] = "Threshold", r[r.ThresholdWhite = 30] = "ThresholdWhite", r[r.UniformNoise = 31] = "UniformNoise", r[r.Xor = 32] = "Xor", r[r.InverseLog = 33] = "InverseLog", r))(wu || {}), ku = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.Point = 1] = "Point", r[r.Box = 2] = "Box", r[r.Triangle = 3] = "Triangle", r[r.Hermite = 4] = "Hermite", r[r.Hann = 5] = "Hann", r[r.Hamming = 6] = "Hamming", r[r.Blackman = 7] = "Blackman", r[r.Gaussian = 8] = "Gaussian", r[r.Quadratic = 9] = "Quadratic", r[r.Cubic = 10] = "Cubic", r[r.Catrom = 11] = "Catrom", r[r.Mitchell = 12] = "Mitchell", r[r.Jinc = 13] = "Jinc", r[r.Sinc = 14] = "Sinc", r[r.SincFast = 15] = "SincFast", r[r.Kaiser = 16] = "Kaiser", r[r.Welch = 17] = "Welch", r[r.Parzen = 18] = "Parzen", r[r.Bohman = 19] = "Bohman", r[r.Bartlett = 20] = "Bartlett", r[r.Lagrange = 21] = "Lagrange", r[r.Lanczos = 22] = "Lanczos", r[r.LanczosSharp = 23] = "LanczosSharp", r[r.Lanczos2 = 24] = "Lanczos2", r[r.Lanczos2Sharp = 25] = "Lanczos2Sharp", r[r.Robidoux = 26] = "Robidoux", r[r.RobidouxSharp = 27] = "RobidouxSharp", r[r.Cosine = 28] = "Cosine", r[r.Spline = 29] = "Spline", r[r.LanczosRadius = 30] = "LanczosRadius", r[r.CubicSpline = 31] = "CubicSpline", r))(ku || {}), vu = /* @__PURE__ */ ((r) => (r[r.Raw = 0] = "Raw", r[r.SRGB = 1] = "SRGB", r[r.AdobeRGB = 2] = "AdobeRGB", r[r.WideGamutRGB = 3] = "WideGamutRGB", r[r.KodakProPhotoRGB = 4] = "KodakProPhotoRGB", r[r.XYZ = 5] = "XYZ", r[r.ACES = 6] = "ACES", r))(vu || {});
class Hu extends pu {
  constructor() {
    super(Re.Dng);
  }
  disableAutoBrightness;
  outputColor;
  useAutoWhitebalance;
  useCameraWhitebalance;
  getDefines() {
    const i = [];
    return this.hasValue(this.disableAutoBrightness) && i.push(this.createDefine("no-auto-bright", this.disableAutoBrightness)), this.hasValue(this.outputColor) && i.push(this.createDefine("output-color", this.outputColor)), this.hasValue(this.useCameraWhitebalance) && i.push(this.createDefine("use-camera-wb", this.useCameraWhitebalance)), this.hasValue(this.useAutoWhitebalance) && i.push(this.createDefine("use-auto-wb", this.useAutoWhitebalance)), i;
  }
  hasValue(i) {
    return i != null;
  }
}
var Su = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.None = 1] = "None", r[r.Background = 2] = "Background", r[r.Previous = 3] = "Previous", r))(Su || {}), Iu = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.NoInterlace = 1] = "NoInterlace", r[r.Line = 2] = "Line", r[r.Plane = 3] = "Plane", r[r.Partition = 4] = "Partition", r[r.Gif = 5] = "Gif", r[r.Jpeg = 6] = "Jpeg", r[r.Png = 7] = "Png", r))(Iu || {});
class Fu {
  static get None() {
    return new y(255, 255, 255, 0);
  }
  static get Transparent() {
    return new y(255, 255, 255, 0);
  }
  static get AliceBlue() {
    return new y(240, 248, 255, 255);
  }
  static get AntiqueWhite() {
    return new y(250, 235, 215, 255);
  }
  static get Aqua() {
    return new y(0, 255, 255, 255);
  }
  static get Aquamarine() {
    return new y(127, 255, 212, 255);
  }
  static get Azure() {
    return new y(240, 255, 255, 255);
  }
  static get Beige() {
    return new y(245, 245, 220, 255);
  }
  static get Bisque() {
    return new y(255, 228, 196, 255);
  }
  static get Black() {
    return new y(0, 0, 0, 255);
  }
  static get BlanchedAlmond() {
    return new y(255, 235, 205, 255);
  }
  static get Blue() {
    return new y(0, 0, 255, 255);
  }
  static get BlueViolet() {
    return new y(138, 43, 226, 255);
  }
  static get Brown() {
    return new y(165, 42, 42, 255);
  }
  static get BurlyWood() {
    return new y(222, 184, 135, 255);
  }
  static get CadetBlue() {
    return new y(95, 158, 160, 255);
  }
  static get Chartreuse() {
    return new y(127, 255, 0, 255);
  }
  static get Chocolate() {
    return new y(210, 105, 30, 255);
  }
  static get Coral() {
    return new y(255, 127, 80, 255);
  }
  static get CornflowerBlue() {
    return new y(100, 149, 237, 255);
  }
  static get Cornsilk() {
    return new y(255, 248, 220, 255);
  }
  static get Crimson() {
    return new y(220, 20, 60, 255);
  }
  static get Cyan() {
    return new y(0, 255, 255, 255);
  }
  static get DarkBlue() {
    return new y(0, 0, 139, 255);
  }
  static get DarkCyan() {
    return new y(0, 139, 139, 255);
  }
  static get DarkGoldenrod() {
    return new y(184, 134, 11, 255);
  }
  static get DarkGray() {
    return new y(169, 169, 169, 255);
  }
  static get DarkGreen() {
    return new y(0, 100, 0, 255);
  }
  static get DarkKhaki() {
    return new y(189, 183, 107, 255);
  }
  static get DarkMagenta() {
    return new y(139, 0, 139, 255);
  }
  static get DarkOliveGreen() {
    return new y(85, 107, 47, 255);
  }
  static get DarkOrange() {
    return new y(255, 140, 0, 255);
  }
  static get DarkOrchid() {
    return new y(153, 50, 204, 255);
  }
  static get DarkRed() {
    return new y(139, 0, 0, 255);
  }
  static get DarkSalmon() {
    return new y(233, 150, 122, 255);
  }
  static get DarkSeaGreen() {
    return new y(143, 188, 139, 255);
  }
  static get DarkSlateBlue() {
    return new y(72, 61, 139, 255);
  }
  static get DarkSlateGray() {
    return new y(47, 79, 79, 255);
  }
  static get DarkTurquoise() {
    return new y(0, 206, 209, 255);
  }
  static get DarkViolet() {
    return new y(148, 0, 211, 255);
  }
  static get DeepPink() {
    return new y(255, 20, 147, 255);
  }
  static get DeepSkyBlue() {
    return new y(0, 191, 255, 255);
  }
  static get DimGray() {
    return new y(105, 105, 105, 255);
  }
  static get DodgerBlue() {
    return new y(30, 144, 255, 255);
  }
  static get Firebrick() {
    return new y(178, 34, 34, 255);
  }
  static get FloralWhite() {
    return new y(255, 250, 240, 255);
  }
  static get ForestGreen() {
    return new y(34, 139, 34, 255);
  }
  static get Fuchsia() {
    return new y(255, 0, 255, 255);
  }
  static get Gainsboro() {
    return new y(220, 220, 220, 255);
  }
  static get GhostWhite() {
    return new y(248, 248, 255, 255);
  }
  static get Gold() {
    return new y(255, 215, 0, 255);
  }
  static get Goldenrod() {
    return new y(218, 165, 32, 255);
  }
  static get Gray() {
    return new y(128, 128, 128, 255);
  }
  static get Green() {
    return new y(0, 128, 0, 255);
  }
  static get GreenYellow() {
    return new y(173, 255, 47, 255);
  }
  static get Honeydew() {
    return new y(240, 255, 240, 255);
  }
  static get HotPink() {
    return new y(255, 105, 180, 255);
  }
  static get IndianRed() {
    return new y(205, 92, 92, 255);
  }
  static get Indigo() {
    return new y(75, 0, 130, 255);
  }
  static get Ivory() {
    return new y(255, 255, 240, 255);
  }
  static get Khaki() {
    return new y(240, 230, 140, 255);
  }
  static get Lavender() {
    return new y(230, 230, 250, 255);
  }
  static get LavenderBlush() {
    return new y(255, 240, 245, 255);
  }
  static get LawnGreen() {
    return new y(124, 252, 0, 255);
  }
  static get LemonChiffon() {
    return new y(255, 250, 205, 255);
  }
  static get LightBlue() {
    return new y(173, 216, 230, 255);
  }
  static get LightCoral() {
    return new y(240, 128, 128, 255);
  }
  static get LightCyan() {
    return new y(224, 255, 255, 255);
  }
  static get LightGoldenrodYellow() {
    return new y(250, 250, 210, 255);
  }
  static get LightGreen() {
    return new y(144, 238, 144, 255);
  }
  static get LightGray() {
    return new y(211, 211, 211, 255);
  }
  static get LightPink() {
    return new y(255, 182, 193, 255);
  }
  static get LightSalmon() {
    return new y(255, 160, 122, 255);
  }
  static get LightSeaGreen() {
    return new y(32, 178, 170, 255);
  }
  static get LightSkyBlue() {
    return new y(135, 206, 250, 255);
  }
  static get LightSlateGray() {
    return new y(119, 136, 153, 255);
  }
  static get LightSteelBlue() {
    return new y(176, 196, 222, 255);
  }
  static get LightYellow() {
    return new y(255, 255, 224, 255);
  }
  static get Lime() {
    return new y(0, 255, 0, 255);
  }
  static get LimeGreen() {
    return new y(50, 205, 50, 255);
  }
  static get Linen() {
    return new y(250, 240, 230, 255);
  }
  static get Magenta() {
    return new y(255, 0, 255, 255);
  }
  static get Maroon() {
    return new y(128, 0, 0, 255);
  }
  static get MediumAquamarine() {
    return new y(102, 205, 170, 255);
  }
  static get MediumBlue() {
    return new y(0, 0, 205, 255);
  }
  static get MediumOrchid() {
    return new y(186, 85, 211, 255);
  }
  static get MediumPurple() {
    return new y(147, 112, 219, 255);
  }
  static get MediumSeaGreen() {
    return new y(60, 179, 113, 255);
  }
  static get MediumSlateBlue() {
    return new y(123, 104, 238, 255);
  }
  static get MediumSpringGreen() {
    return new y(0, 250, 154, 255);
  }
  static get MediumTurquoise() {
    return new y(72, 209, 204, 255);
  }
  static get MediumVioletRed() {
    return new y(199, 21, 133, 255);
  }
  static get MidnightBlue() {
    return new y(25, 25, 112, 255);
  }
  static get MintCream() {
    return new y(245, 255, 250, 255);
  }
  static get MistyRose() {
    return new y(255, 228, 225, 255);
  }
  static get Moccasin() {
    return new y(255, 228, 181, 255);
  }
  static get NavajoWhite() {
    return new y(255, 222, 173, 255);
  }
  static get Navy() {
    return new y(0, 0, 128, 255);
  }
  static get OldLace() {
    return new y(253, 245, 230, 255);
  }
  static get Olive() {
    return new y(128, 128, 0, 255);
  }
  static get OliveDrab() {
    return new y(107, 142, 35, 255);
  }
  static get Orange() {
    return new y(255, 165, 0, 255);
  }
  static get OrangeRed() {
    return new y(255, 69, 0, 255);
  }
  static get Orchid() {
    return new y(218, 112, 214, 255);
  }
  static get PaleGoldenrod() {
    return new y(238, 232, 170, 255);
  }
  static get PaleGreen() {
    return new y(152, 251, 152, 255);
  }
  static get PaleTurquoise() {
    return new y(175, 238, 238, 255);
  }
  static get PaleVioletRed() {
    return new y(219, 112, 147, 255);
  }
  static get PapayaWhip() {
    return new y(255, 239, 213, 255);
  }
  static get PeachPuff() {
    return new y(255, 218, 185, 255);
  }
  static get Peru() {
    return new y(205, 133, 63, 255);
  }
  static get Pink() {
    return new y(255, 192, 203, 255);
  }
  static get Plum() {
    return new y(221, 160, 221, 255);
  }
  static get PowderBlue() {
    return new y(176, 224, 230, 255);
  }
  static get Purple() {
    return new y(128, 0, 128, 255);
  }
  static get Red() {
    return new y(255, 0, 0, 255);
  }
  static get RosyBrown() {
    return new y(188, 143, 143, 255);
  }
  static get RoyalBlue() {
    return new y(65, 105, 225, 255);
  }
  static get SaddleBrown() {
    return new y(139, 69, 19, 255);
  }
  static get Salmon() {
    return new y(250, 128, 114, 255);
  }
  static get SandyBrown() {
    return new y(244, 164, 96, 255);
  }
  static get SeaGreen() {
    return new y(46, 139, 87, 255);
  }
  static get SeaShell() {
    return new y(255, 245, 238, 255);
  }
  static get Sienna() {
    return new y(160, 82, 45, 255);
  }
  static get Silver() {
    return new y(192, 192, 192, 255);
  }
  static get SkyBlue() {
    return new y(135, 206, 235, 255);
  }
  static get SlateBlue() {
    return new y(106, 90, 205, 255);
  }
  static get SlateGray() {
    return new y(112, 128, 144, 255);
  }
  static get Snow() {
    return new y(255, 250, 250, 255);
  }
  static get SpringGreen() {
    return new y(0, 255, 127, 255);
  }
  static get SteelBlue() {
    return new y(70, 130, 180, 255);
  }
  static get Tan() {
    return new y(210, 180, 140, 255);
  }
  static get Teal() {
    return new y(0, 128, 128, 255);
  }
  static get Thistle() {
    return new y(216, 191, 216, 255);
  }
  static get Tomato() {
    return new y(255, 99, 71, 255);
  }
  static get Turquoise() {
    return new y(64, 224, 208, 255);
  }
  static get Violet() {
    return new y(238, 130, 238, 255);
  }
  static get Wheat() {
    return new y(245, 222, 179, 255);
  }
  static get White() {
    return new y(255, 255, 255, 255);
  }
  static get WhiteSmoke() {
    return new y(245, 245, 245, 255);
  }
  static get Yellow() {
    return new y(255, 255, 0, 255);
  }
  static get YellowGreen() {
    return new y(154, 205, 50, 255);
  }
}
var Mu = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.TopLeft = 1] = "TopLeft", r[r.TopRight = 2] = "TopRight", r[r.BottomRight = 3] = "BottomRight", r[r.BottomLeft = 4] = "BottomLeft", r[r.LeftTop = 5] = "LeftTop", r[r.RightTop = 6] = "RightTop", r[r.RightBottom = 7] = "RightBottom", r[r.LeftBotom = 8] = "LeftBotom", r))(Mu || {}), Du = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.Point = 1] = "Point", r[r.Replace = 2] = "Replace", r[r.Floodfill = 3] = "Floodfill", r[r.FillToBorder = 4] = "FillToBorder", r[r.Reset = 5] = "Reset", r))(Du || {}), Cu = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.Average = 1] = "Average", r[r.Average9 = 2] = "Average9", r[r.Average16 = 3] = "Average16", r[r.Background = 4] = "Background", r[r.Bilinear = 5] = "Bilinear", r[r.Blend = 6] = "Blend", r[r.Catrom = 7] = "Catrom", r[r.Integer = 8] = "Integer", r[r.Mesh = 9] = "Mesh", r[r.Nearest = 10] = "Nearest", r[r.Spline = 11] = "Spline", r))(Cu || {});
class Uu {
  bestFit = !1;
  scale;
  viewport;
  /** @internal */
  _removeArtifacts(i) {
    this.scale !== void 0 && i.removeArtifact("distort:scale"), this.viewport !== void 0 && i.removeArtifact("distort:viewport");
  }
  /** @internal */
  _setArtifacts(i) {
    this.scale !== void 0 && i.setArtifact("distort:scale", this.scale.toString()), this.viewport !== void 0 && i.setArtifact("distort:viewport", this.viewport.toString());
  }
}
class Pu extends Ve {
  constructor(i) {
    const u = m._api._MontageSettings_Create(), f = m._api._MontageSettings_Dispose;
    if (super(u, f), i.backgroundColor !== void 0 && i.backgroundColor._use((p) => {
      m._api._MontageSettings_SetBackgroundColor(this._instance, p);
    }), i.borderColor !== void 0 && i.borderColor._use((p) => {
      m._api._MontageSettings_SetBorderColor(this._instance, p);
    }), i.borderWidth !== void 0 && m._api._MontageSettings_SetBorderWidth(this._instance, i.borderWidth), i.fillColor !== void 0 && i.fillColor._use((p) => {
      m._api._MontageSettings_SetFillColor(this._instance, p);
    }), i.font !== void 0) {
      const p = Ut._getFontFileName(i.font);
      W(p, (e) => {
        m._api._MontageSettings_SetFont(this._instance, e);
      });
    }
    i.fontPointsize !== void 0 && m._api._MontageSettings_SetFontPointsize(this._instance, i.fontPointsize), i.frameGeometry !== void 0 && W(i.frameGeometry.toString(), (p) => {
      m._api._MontageSettings_SetFrameGeometry(this._instance, p);
    }), i.geometry !== void 0 && W(i.geometry.toString(), (p) => {
      m._api._MontageSettings_SetGeometry(this._instance, p);
    }), i.gravity !== void 0 && m._api._MontageSettings_SetGravity(this._instance, i.gravity), i.shadow !== void 0 && m._api._MontageSettings_SetShadow(this._instance, i.shadow ? 1 : 0), i.strokeColor !== void 0 && i.strokeColor._use((p) => {
      m._api._MontageSettings_SetStrokeColor(this._instance, p);
    }), i.textureFileName !== void 0 && W(i.textureFileName, (p) => {
      m._api._MontageSettings_SetTextureFileName(this._instance, p);
    }), i.tileGeometry !== void 0 && W(i.tileGeometry.toString(), (p) => {
      m._api._MontageSettings_SetTileGeometry(this._instance, p);
    }), i.title !== void 0 && W(i.title, (p) => {
      m._api._MontageSettings_SetTitle(this._instance, p);
    });
  }
}
class ju {
  backgroundColor;
  borderColor;
  borderWidth;
  fillColor;
  font;
  fontPointsize;
  frameGeometry;
  geometry;
  gravity;
  label;
  shadow;
  strokeColor;
  textureFileName;
  tileGeometry;
  title;
  transparentColor;
  _use(i) {
    const u = new Pu(this);
    return Ce._disposeAfterExecution(u, i);
  }
}
var bu = /* @__PURE__ */ ((r) => (r[r.Undefined = 0] = "Undefined", r[r.Background = 1] = "Background", r[r.Dither = 2] = "Dither", r[r.Edge = 3] = "Edge", r[r.Mirror = 4] = "Mirror", r[r.Random = 5] = "Random", r[r.Tile = 6] = "Tile", r[r.Transparent = 7] = "Transparent", r[r.Mask = 8] = "Mask", r[r.Black = 9] = "Black", r[r.Gray = 10] = "Gray", r[r.White = 11] = "White", r[r.HorizontalTile = 12] = "HorizontalTile", r[r.VerticalTile = 13] = "VerticalTile", r[r.HorizontalTileEdge = 14] = "HorizontalTileEdge", r[r.VerticalTileEdge = 15] = "VerticalTileEdge", r[r.CheckerTile = 16] = "CheckerTile", r))(bu || {});
export {
  kr as AlphaOption,
  Zs as AutoThresholdMethod,
  cu as ChannelStatistics,
  ie as Channels,
  nu as ChromaticityInfo,
  gu as ClassType,
  Sr as ColorSpace,
  fu as ColorType,
  Nt as CompositeOperator,
  mu as CompressionMethod,
  pu as DefinesCreator,
  ru as Density,
  Ir as DensityUnit,
  du as DistortMethod,
  Uu as DistortSettings,
  vu as DngOutputColor,
  Hu as DngReadDefines,
  Ru as DrawableColor,
  Au as DrawableFillColor,
  Tu as DrawableFillOpacity,
  Wu as DrawableFont,
  Lu as DrawableFontPointSize,
  Bu as DrawableGravity,
  xu as DrawableRectangle,
  Nu as DrawableRoundRectangle,
  zu as DrawableText,
  gn as DrawingSettings,
  fn as DrawingWand,
  hu as Endian,
  yu as ErrorMetric,
  wu as EvaluateOperator,
  ku as FilterType,
  Su as GifDisposeMethod,
  zt as Gravity,
  m as ImageMagick,
  su as ImageProfile,
  Iu as Interlace,
  Ut as Magick,
  y as MagickColor,
  Fu as MagickColors,
  ln as MagickDefine,
  O as MagickError,
  Ft as MagickErrorSeverity,
  Re as MagickFormat,
  De as MagickFormatInfo,
  _e as MagickGeometry,
  se as MagickImage,
  de as MagickImageCollection,
  Ee as MagickReadSettings,
  qe as MagickSettings,
  ju as MontageSettings,
  Ve as NativeInstance,
  Mu as OrientationType,
  Du as PaintMethod,
  ce as Percentage,
  Ge as PixelChannel,
  xe as PixelCollection,
  Cu as PixelInterpolateMethod,
  gt as Point,
  Ne as PrimaryInfo,
  ze as Quantum,
  mn as Statistics,
  bu as VirtualPixelMethod,
  iu as _getEdges,
  Eu as initializeImageMagick
};
