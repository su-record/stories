if(!self.define){let e,s={};const i=(i,r)=>(i=new URL(i+".js",r).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,o)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(s[a])return;let n={};const d=e=>i(e,a),t={module:{uri:a},exports:n,require:d};s[a]=Promise.all(r.map((e=>t[e]||d(e)))).then((e=>(o(...e),n)))}}define(["./workbox-2d118ab0"],(function(e){"use strict";e.setCacheNameDetails({prefix:"stories"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"/stories/750.939f1a81.js",revision:null},{url:"/stories/css/[request].03bf2c39.css",revision:null},{url:"/stories/css/app.f62af5f3.css",revision:null},{url:"/stories/images/404.png",revision:"b628f09f041458386d7ef08d40843f0a"},{url:"/stories/images/build-complete.png",revision:"e56e0747373d88c3b750b09392686ea7"},{url:"/stories/images/build-done.png",revision:"b9d4cb59a4a9f01a97a4b3a4f0f58209"},{url:"/stories/images/build-local.png",revision:"3e6815da2c1c5f5e9d32488fe788b625"},{url:"/stories/images/build.png",revision:"8b36b27daf6eda422e5c5692e370ef2d"},{url:"/stories/images/failed.png",revision:"10c855c277b89afe878130d9a433d7e2"},{url:"/stories/images/google-auto.png",revision:"f61d4beaa71f696363b36f142f0edb33"},{url:"/stories/images/google-search.png",revision:"7bfddf05c91c86388a27bc87c4fe35bc"},{url:"/stories/images/google-search2.png",revision:"bcb38982cc498d91fbea2268b745b325"},{url:"/stories/images/lerna/common_dependency.png",revision:"c49535b2ea71561e98dc272b33058614"},{url:"/stories/images/lerna/link_complete.png",revision:"8af7160fb71f176800dd98d2f5b85809"},{url:"/stories/images/lerna/link_convert_packages.png",revision:"10c2c0f993cad62128d1eb3bbfa94d46"},{url:"/stories/images/lerna/link_packages.png",revision:"0b44b87c4424bf1341fa7f72533db592"},{url:"/stories/images/lerna/link_root_package.png",revision:"02d3deab0db8f3a6aa7ba3c69981bcfa"},{url:"/stories/images/lerna/link_script_error.png",revision:"7f26984fa4c05d9f7cdd96404f4aabc7"},{url:"/stories/images/publish.png",revision:"e08d6a611d0211ef6f5698fc4acac07b"},{url:"/stories/images/vuejs/0702-market.png",revision:"57356973369ec66b3d1bd5468a0a3dfd"},{url:"/stories/images/vuejs/0702-prettier.png",revision:"3187de470345716ca83de98f7f366cb7"},{url:"/stories/images/vuejs/0702-vetur.png",revision:"8e63df4ab2c91e1463280065f03952bb"},{url:"/stories/images/vuejs/lifecycle.svg",revision:"f4a90248bd51e5ee6261fd079b5dffb5"},{url:"/stories/index.html",revision:"3e6f4cafbf14131a4915937afb795ad2"},{url:"/stories/js/app.b9886788.js",revision:null},{url:"/stories/js/chunk-vendors.97048ca5.js",revision:null},{url:"/stories/manifest.json",revision:"c2e2f64c59a53b25de06b054d1baa9c2"},{url:"/stories/posts/create-blog-vue.md",revision:"905d08ed8098e86d4aac169e749a5e8b"},{url:"/stories/posts/index.json",revision:"5f261ce43ae50ec178d072781c1439f7"},{url:"/stories/posts/js/ES5_ES6.md",revision:"8f56d9a1d5db9e5881ce9b5798f48e1b"},{url:"/stories/posts/js/ExecutionContext.md",revision:"8900d2ee98c8b84b43deb4339df9e014"},{url:"/stories/posts/lerna/Common_dependency.md",revision:"d971b7293278dbaf505bb46333d9cffe"},{url:"/stories/posts/lerna/Link_Convert.md",revision:"5badf6797a13349e91da5d54c007aa71"},{url:"/stories/posts/vuejs/220625.md",revision:"11a61f863bcb9369f1811a493ead907f"},{url:"/stories/posts/vuejs/220702.md",revision:"8718e6c75721c7201763de8c7d35ce95"},{url:"/stories/posts/vuejs/220709.md",revision:"18c81fa219a1509fe3089bad2c52e19b"},{url:"/stories/posts/vuejs/220716.md",revision:"b4a61749fcfebdd58254c8ffeb2db95c"},{url:"/stories/posts/vuejs/220723.md",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/stories/robots.txt",revision:"5565e4452e5aa041c28b45a65ab18b13"}],{})}));
//# sourceMappingURL=service-worker.js.map
