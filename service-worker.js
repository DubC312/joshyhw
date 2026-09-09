const CACHE='vorschule-entdecker-mt-auto-v2';
const SHELL=['./','./index.html','./monster-trucks.json','./automarken.json','./manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);
if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(()=>caches.match('./index.html')));return;}
if(u.origin===location.origin&&(u.pathname.endsWith('/monster-trucks.json')||u.pathname.endsWith('/automarken.json'))){e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));return;}
if(u.hostname.endsWith('wikimedia.org')||u.hostname.endsWith('nocookie.net')){e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r})));return;}
if(u.origin===location.origin)e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request)));});