if(!self.define){let e,s={};const r=(r,i)=>(r=new URL(r+".js",i).href,s[r]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=r,e.onload=s,document.head.appendChild(e)}else e=r,importScripts(r),s()})).then((()=>{let e=s[r];if(!e)throw new Error(`Module ${r} didn’t register its module`);return e})));self.define=(i,o)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let n={};const c=e=>r(e,t),l={module:{uri:t},exports:n,require:c};s[t]=Promise.all(i.map((e=>l[e]||c(e)))).then((e=>(o(...e),n)))}}define(["./workbox-2d118ab0"],(function(e){"use strict";e.setCacheNameDetails({prefix:"stories"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"/stories/css/app.47663fcc.css",revision:null},{url:"/stories/index.html",revision:"d5e3b01cdc16484a422165fc2d8133ff"},{url:"/stories/js/about.d3b65ec1.js",revision:null},{url:"/stories/js/app.010c30bb.js",revision:null},{url:"/stories/js/chunk-vendors.94098c34.js",revision:null},{url:"/stories/manifest.json",revision:"c2e2f64c59a53b25de06b054d1baa9c2"},{url:"/stories/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"}],{})}));
//# sourceMappingURL=service-worker.js.map