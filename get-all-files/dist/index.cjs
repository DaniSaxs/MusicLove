"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("fs"),t=require("path");function r(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var o=r(e);const s=o.default.promises,i=({resolve:e=!1,isExcludedDir:t=(()=>!1)}={})=>({resolve:e,isExcludedDir:t}),n=(e,r)=>(!0===r.resolve&&(e=t.resolve(e)),e.length>0&&e[e.length-1]!==t.sep&&(e+=t.sep),e);function l(e,r,s,i){if(0===e.length)return void(s.done=!0);const n=[];let c=e.length;for(const d of e)i.isExcludedDir(d)||o.default.readdir(d,{withFileTypes:!0},((e,o)=>{if(null==e){for(const e of o){const o=d+e.name;e.isDirectory()?n.push(o+t.sep):r.push(o)}s.resolve(),0==--c&&l(n,r,s,i)}else s.reject(e)}))}exports.getAllFiles=(e,t)=>{t=i(t);const r={async*[Symbol.asyncIterator](){if(!(await s.lstat(e)).isDirectory())return void(yield e);const r=[],o=function(){let e=!1,t=()=>{},r=()=>{},o=new Promise(((e,o)=>{t=e,r=o}));return{resolve(){const e=t;o=new Promise(((e,o)=>{t=e,r=o})),e()},reject(e){r(e)},get done(){return e},set done(t){e=t},onResolved:()=>o}}();l([n(e,t)],r,o,t);do{for(await o.onResolved();r.length>0;)yield r.pop()}while(!o.done)},toArray:async()=>{const e=[];for await(const t of r)e.push(t);return e}};return r},exports.getAllFilesSync=(e,r)=>{r=i(r);const s={*[Symbol.iterator](){o.default.lstatSync(e).isDirectory()?yield*function*e(s){if(!r.isExcludedDir(s))for(const r of o.default.readdirSync(s,{withFileTypes:!0})){const o=s+r.name;r.isDirectory()?yield*e(o+t.sep):yield o}}(n(e,r)):yield e},toArray:()=>[...s]};return s};
