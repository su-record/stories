if(!self.define){let e,s={};const i=(i,r)=>(i=new URL(i+".js",r).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,o)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(s[a])return;let n={};const d=e=>i(e,a),c={module:{uri:a},exports:n,require:d};s[a]=Promise.all(r.map((e=>c[e]||d(e)))).then((e=>(o(...e),n)))}}define(["./workbox-2d118ab0"],(function(e){"use strict";e.setCacheNameDetails({prefix:"stories"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"/stories/750.da795e83.js",revision:null},{url:"/stories/css/app.9891550c.css",revision:null},{url:"/stories/images/build-complete.png",revision:"e56e0747373d88c3b750b09392686ea7"},{url:"/stories/images/build-done.png",revision:"b9d4cb59a4a9f01a97a4b3a4f0f58209"},{url:"/stories/images/build-local.png",revision:"3e6815da2c1c5f5e9d32488fe788b625"},{url:"/stories/images/build.png",revision:"8b36b27daf6eda422e5c5692e370ef2d"},{url:"/stories/images/failed.png",revision:"10c855c277b89afe878130d9a433d7e2"},{url:"/stories/images/google-auto.png",revision:"f61d4beaa71f696363b36f142f0edb33"},{url:"/stories/images/google-search.png",revision:"7bfddf05c91c86388a27bc87c4fe35bc"},{url:"/stories/images/google-search2.png",revision:"bcb38982cc498d91fbea2268b745b325"},{url:"/stories/images/lerna/common_dependency.png",revision:"c49535b2ea71561e98dc272b33058614"},{url:"/stories/images/lerna/link_complete.png",revision:"8af7160fb71f176800dd98d2f5b85809"},{url:"/stories/images/lerna/link_convert_packages.png",revision:"10c2c0f993cad62128d1eb3bbfa94d46"},{url:"/stories/images/lerna/link_packages.png",revision:"0b44b87c4424bf1341fa7f72533db592"},{url:"/stories/images/lerna/link_root_package.png",revision:"02d3deab0db8f3a6aa7ba3c69981bcfa"},{url:"/stories/images/lerna/link_script_error.png",revision:"7f26984fa4c05d9f7cdd96404f4aabc7"},{url:"/stories/images/vuejs/0702-market.png",revision:"57356973369ec66b3d1bd5468a0a3dfd"},{url:"/stories/images/vuejs/0702-prettier.png",revision:"3187de470345716ca83de98f7f366cb7"},{url:"/stories/images/vuejs/0702-vetur.png",revision:"8e63df4ab2c91e1463280065f03952bb"},{url:"/stories/images/vuejs/lifecycle.svg",revision:"f4a90248bd51e5ee6261fd079b5dffb5"},{url:"/stories/index.html",revision:"c9365eade87e18f23fda9f12d0518243"},{url:"/stories/js/app.122cc84f.js",revision:null},{url:"/stories/js/chunk-vendors.4bb67128.js",revision:null},{url:"/stories/manifest.json",revision:"c2e2f64c59a53b25de06b054d1baa9c2"},{url:"/stories/posts/create-blog-vue.md",revision:"176a21eb72d96075e774e6b73416cf2c"},{url:"/stories/posts/index.json",revision:"aaa69138e726c1a08fca1ab04807c8c9"},{url:"/stories/posts/js/ES5_ES6.md",revision:"8f56d9a1d5db9e5881ce9b5798f48e1b"},{url:"/stories/posts/js/ExecutionContext.md",revision:"8900d2ee98c8b84b43deb4339df9e014"},{url:"/stories/posts/lerna/Common_dependency.md",revision:"d971b7293278dbaf505bb46333d9cffe"},{url:"/stories/posts/lerna/Link_Convert.md",revision:"5badf6797a13349e91da5d54c007aa71"},{url:"/stories/posts/vuejs/project/0625.md",revision:"cc980c5bb9ff9a31917cb846c58a5954"},{url:"/stories/posts/vuejs/project/0702.md",revision:"df0fd0d8a4bcaad006b4de3f376ecfcf"},{url:"/stories/posts/vuejs/project/0709.md",revision:"b74584d668093e9f565d7778f96af50d"},{url:"/stories/posts/vuejs/project/0716.md",revision:"3c4896aa30eeba32d51876a81b8c11af"},{url:"/stories/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"}],{})}));
//# sourceMappingURL=service-worker.js.map
