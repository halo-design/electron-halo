process.env.HMR_PORT=0;process.env.HMR_HOSTNAME="localhost";parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"utils/file.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("fs-extra")),r=t(require("path"));function t(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)if(Object.prototype.hasOwnProperty.call(e,t)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,t):{};n.get||n.set?Object.defineProperty(r,t,n):r[t]=e[t]}return r.default=e,r}var n=r.join(__dirname,"../"),i=function(r,t){return new Promise(function(n,i){var o=e.createWriteStream(r);o.on("open",function(){for(var e=Math.ceil(t.length/128),r=0;r<e;r+=1){var n=t.slice(128*r,Math.min(128*(r+1),t.length));o.write(n)}o.end()}),o.on("error",function(e){i(e)}),o.on("finish",function(){n(!0)})})},o={JSON2File:function(e,r){var t=Buffer.from(JSON.stringify(r,null,2),"utf8");i(e,t)},del:function(t){var i=r.join(n,t);e.existsSync(i)&&e.unlinkSync(i)},exist:function(t){return e.existsSync(r.join(n,t))},file2JSON:function(t){return JSON.parse(e.readFileSync(r.join(n,t),"utf-8"))},path:function(e){return r.join(n,e)},root:n,saveFile:i};exports.default=o;
},{}],"core/winStateKeeper.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=require("electron"),t=require("electron-window-state"),r=function(r){var i=r.width,d=r.height,o=t({defaultHeight:d,defaultWidth:i}),a=new e.BrowserWindow(Object.assign({},r,{x:o.x,y:o.y,width:o.width,height:o.height}));return o.manage(a),a},i=r;exports.default=i;
},{}],"core/winCreate.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=n(require("url")),r=o(require("../utils/file")),t=o(require("./winStateKeeper")),a=require("electron");function o(e){return e&&e.__esModule?e:{default:e}}function n(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)if(Object.prototype.hasOwnProperty.call(e,t)){var a=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,t):{};a.get||a.set?Object.defineProperty(r,t,a):r[t]=e[t]}return r.default=e,r}var s=function(o,n,s,l){var c,i={appIcon:r.default.path("resources/dock.png"),center:!0,frame:!1,fullscreenable:!1,icon:r.default.path("resources/dock.ico"),titleBarStyle:"hidden",transparent:!1,webPreferences:{nodeIntegration:!0,scrollBounce:!0},resizable:!0};"darwin"===process.platform?i.vibrancy="appearance-based":i.backgroundColor="#fff",Object.assign(i,o),l?(Object.assign(i,{parent:s}),c=new a.BrowserWindow(i)):c=(0,t.default)(i);var u=e.format({pathname:r.default.path(n.pathname),protocol:"file:",slashes:!0,hash:n.hash});return c.loadURL(u),c},l=s;exports.default=l;
},{"../utils/file":"utils/file.ts","./winStateKeeper":"core/winStateKeeper.ts"}],"core/rpc.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=require("events"),t=require("electron"),n=r(require("uuid"));function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function u(e,t,n){return t&&c(e.prototype,t),n&&c(e,n),e}function s(e,t){return!t||"object"!==i(t)&&"function"!=typeof t?f(e):t}function f(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function l(e,t,n){return(l="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,n){var r=a(e,t);if(r){var i=Object.getOwnPropertyDescriptor(r,t);return i.get?i.get.call(n):i.value}})(e,t,n||e)}function a(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=p(e)););return e}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function y(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&d(e,t)}function d(e,t){return(d=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var b=function(r){function i(e){var r;if(o(this,i),(r=s(this,p(i).call(this))).win=null,r.destroyed=!1,r.id="",r.win=e,r.ipcListener=r.ipcListener.bind(f(r)),r.dispatch=r.dispatch.bind(f(r)),r.destroy=r.destroy.bind(f(r)),r.destroyed)return s(r);var c=n.v4();return r.id=c,t.ipcMain.on(c,r.ipcListener),r.wc&&r.wc.on("did-finish-load",function(){r.wc&&r.wc.send("init",c)}),r}return y(i,e.EventEmitter),u(i,[{key:"ipcListener",value:function(e,t){var n=t.ev,r=t.data;l(p(i.prototype),"emit",this).call(this,n,r)}},{key:"dispatch",value:function(e,t){this.win&&!this.win.isDestroyed()&&this.wc&&this.wc.send(this.id,{ch:e,data:t})}},{key:"destroy",value:function(){this.removeAllListeners(),this.wc&&this.wc.removeAllListeners(),this.id?t.ipcMain.removeListener(this.id,this.ipcListener):this.destroyed=!0}},{key:"wc",get:function(){return this.win?this.win.webContents:null}}]),i}(),h=function(e){return new b(e)};exports.default=h;
},{}],"utils/readTxtByLine.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=n(require("electron-log")),r=o(require("fs")),t=o(require("readline"));function o(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)if(Object.prototype.hasOwnProperty.call(e,t)){var o=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,t):{};o.get||o.set?Object.defineProperty(r,t,o):r[t]=e[t]}return r.default=e,r}function n(e){return e&&e.__esModule?e:{default:e}}var u=function(o,n,u){e.default.debug(o);var i=t.createInterface({input:r.createReadStream(o)}),a=1;i.on("line",function(e){n(a,e),a++}),i.on("close",u)};exports.default=u;
},{}],"utils/crypto.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.aseDecode=exports.aseEncode=void 0;var e=r(require("crypto"));function r(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)if(Object.prototype.hasOwnProperty.call(e,t)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,t):{};n.get||n.set?Object.defineProperty(r,t,n):r[t]=e[t]}return r.default=e,r}var t=function(r,t,n){if(16!==t.length||16!==n.length)return"";var o=e.createCipheriv("aes-128-cbc",t,n),c=o.update(r,"utf8","hex");return c+=o.final("hex")};exports.aseEncode=t;var n=function(r,t,n){if(16!==t.length||16!==n.length)return"";var o=e.createDecipheriv("aes-128-cbc",t,n),c=o.update(r,"hex","utf8");return c+=o.final("utf-8")};exports.aseDecode=n;
},{}],"utils/tray.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=require("electron"),t=r(require("./file"));function r(e){return e&&e.__esModule?e:{default:e}}var o="win32"===process.platform,l=function(r){var l=o?t.default.path("resources/dock.ico"):t.default.path("resources/icon.png"),n=new e.Tray(l),u=e.Menu.buildFromTemplate([{click:function(){r.dispatch("history-push","/sync"),r.win.show(),r.win.focus()},label:"设置"},{type:"separator"},{click:function(){e.shell.openExternal("https://github.com/halo-design/Altas")},label:"关于"},{click:function(){e.app.quit()},label:"退出"}]);return n.setContextMenu(u),n};exports.default=l;
},{"./file":"utils/file.ts"}],"core/bridge.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=require("electron"),t=w(require("../utils/file")),o=w(require("../utils/readTxtByLine")),n=w(require("electron-log")),r=g(require("electron-json-storage")),i=g(require("ip")),a=g(require("os")),s=g(require("object-hash")),d=g(require("../utils/crypto")),u=w(require("../utils/tray")),c=w(require("../core/winCreate")),l=require("electron-better-dialog"),f=w(require("electron-dl")),p=g(require("uuid"));function g(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,o):{};n.get||n.set?Object.defineProperty(t,o,n):t[o]=e[o]}return t.default=e,t}function w(e){return e&&e.__esModule?e:{default:e}}var m=function(g){var w,m=g.dispatch,v=g.win,x={},h=null;return v&&((h=(0,u.default)(g)).setToolTip("Altas"),g.on("set-tray-title",function(e){h.setTitle(e)}),h.on("click",function(){v.isVisible()?v.hide():v.show()})),g.on("get-appdir",function(){m("appdir",t.default.root)}),g.on("write-storage",function(e){var t=e.key,o=e.data;r.set(t,o,function(e){if(e)throw e;n.default.info(o),n.default.info("[".concat(t,"]：数据已写入"))})}),g.on("read-storage",function(e){r.get(e,function(e,t){m("get-storage",t)})}),g.on("remove-storage",function(e){r.remove(e,function(e){n.default.error(e)}),n.default.info("[".concat(e,"]：数据已删除"))}),g.on("on-dialog-message",function(e){v&&(0,l.showBetterMessageBox)(v,e)}),g.on("read-text",function(e){(0,o.default)(e,function(e,t){m("get-text-line",{index:e,line:t,status:"pending"})},function(){m("get-text-line",{status:"done"})})}),g.on("file-download",function(e){var t,o=e.url,r=e.args,i=function(){var e=r.timeout;e&&(t=setTimeout(function(){w&&(w.cancel(),n.default.error(o+"[下载超时，已取消]"))},e))};v&&f.default.download(v,o,Object.assign({onCancel:function(){t&&clearTimeout(t),m("on-download-state",{index:r.index||0,progress:0,status:"cancel"})},onProgress:function(e){t&&clearTimeout(t),i(),m("on-download-state",{index:r.index||0,progress:e,status:"running"})},onStarted:function(e){w=e,i(),m("on-download-state",{index:r.index||0,progress:0,status:"start"})}},r)).then(function(e){t&&clearTimeout(t),n.default.debug(e.getSavePath()),m("on-download-state",{index:r.index||0,progress:1,status:"finished"})}).catch(function(){t&&clearTimeout(t),m("on-download-state",{index:r.index||0,progress:0,status:"error"})})}),g.on("file-download-cancel",function(){w&&w.cancel()}),g.on("read-clipboard",function(){m("get-clipboard-text",e.clipboard.readText())}),g.on("write-clipboard",function(t){e.clipboard.writeText(t)}),g.on("get-ip-address",function(){var e={ip:""};e.ip=i.address(),m("ip-address",e)}),g.on("get-device-os",function(){var e={arch:a.arch(),cpu:a.cpus(),homedir:a.homedir(),hostname:a.hostname(),memory:a.totalmem(),network:a.networkInterfaces(),platform:a.platform(),release:a.release(),tmpdir:a.tmpdir(),type:a.type(),uptime:a.uptime(),userInfo:a.userInfo()};m("device-os",e)}),g.on("aes-encode",function(e){var t=s.MD5(e.pswd),o=t.slice(0,16),n=t.slice(16);m("get-aes-encode",d.aseEncode(e.data,o,n))}),g.on("aes-decode",function(e){var t=s.MD5(e.pswd),o=t.slice(0,16),n=t.slice(16);m("get-aes-decode",d.aseDecode(e.data,o,n))}),g.on("create-window",function(e){if(v){var t=(0,c.default)(e.options,e.entry,v,!0),o=p.v4();x[o]=t,m("get-window-id",{win_uid:o})}}),g.on("close-window",function(e){if(e.uid in x){var t=x[e.uid];t.isDestroyed()||t.close()}}),{tray:h}};exports.default=m;
},{"../utils/file":"utils/file.ts","../utils/readTxtByLine":"utils/readTxtByLine.ts","../utils/crypto":"utils/crypto.ts","../utils/tray":"utils/tray.ts","../core/winCreate":"core/winCreate.ts"}],"main.ts":[function(require,module,exports) {
"use strict";var e,r=require("electron"),t=a(require("./core/winCreate")),n=a(require("./core/rpc")),i=a(require("./core/bridge"));function a(e){return e&&e.__esModule?e:{default:e}}var o=!1,u=function(){e=(0,t.default)({height:648,width:1050,minWidth:980,minHeight:620},{pathname:"renderer/index.html",hash:"#/home"});var a=(0,n.default)(e),u=(0,i.default)(a).tray;e.on("close",function(t){o?(u.destroy(),e=null,r.app.quit()):(t.preventDefault(),e.hide())}),e.hide()};r.app.on("ready",u),r.app.on("before-quit",function(){o=!0}),r.app.on("window-all-closed",function(){"darwin"!==process.platform&&r.app.quit()}),r.app.on("activate",function(){null===e?u():e.show()});
},{"./core/winCreate":"core/winCreate.ts","./core/rpc":"core/rpc.ts","./core/bridge":"core/bridge.ts"}]},{},["main.ts"], null)