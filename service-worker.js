const u=[{"revision":null,"url":"assets/index-DYUKH-zR.js"},{"revision":null,"url":"assets/index-iJGNgcg0.css"},{"revision":"5679cd4cf454b9822060f33910a6c109","url":"index.html"},{"revision":"38013143dc2183340ede8bc1c5124507","url":"registerSW.js"},{"revision":"0d5af7fa93ac4bd8d133cd15a821f3e8","url":"manifest.webmanifest"}],n="8ad0ab2c-20b5-428d-a634-95288fd294cc";console.log(n);const w=async()=>{const t=await caches.open(n);await Promise.all(u.map(async a=>{const e=new URL(a.url,location.href);a.revision&&e.searchParams.append("__WB_REVISION",a.revision);const s=await caches.match(e);s?await t.put(e,s.clone()):await t.add(e)}))};self.addEventListener("install",async()=>{await w()});self.addEventListener("activate",async()=>{const t=await caches.keys();await Promise.all(t.map(async a=>{n!==a&&await caches.delete(a)}))});const d=async t=>t.match("/index.html",{ignoreSearch:!0}),m=async t=>{var h;const a=await caches.open(n),{pathname:e}=new URL(t.request.url),s=e==="/"?"/index.html":e,i=await a.match(s,{ignoreSearch:!0});if(i)return i;const r=t.request.clone(),o=(h=r.headers.get("accept"))==null?void 0:h.includes("text/html");try{const c=await fetch(t.request);return c.status===404&&r.method==="GET"&&o?await d(a)||c:(c.status===200&&await a.put(r,c.clone()),c)}catch(c){if(o){const l=await d(a);if(l)return l}throw c}};self.addEventListener("fetch",t=>{t.respondWith(m(t))});
