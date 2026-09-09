const CACHE='vorschule-entdecker-mt-auto-v1';
const SHELL=['./','./index.html','./monster-trucks.json','./automarken.json','./manifest.webmanifest'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);

  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).catch(()=>caches.match('./index.html')));
    return;
  }

  if(u.origin===location.origin && (u.pathname.endsWith('/monster-trucks.json') || u.pathname.endsWith('/automarken.json'))){
    e.respondWith(
      fetch(e.request,{cache:'no-store'}).then(r=>{
        const copy=r.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copy));
        return r;
      }).catch(()=>caches.match(e.request))
    );
    return;
  }

  /* Wikimedia-Logos nach dem ersten Laden ebenfalls cachen */
  if(u.hostname.endsWith('wikimedia.org')){
    e.respondWith(
      caches.match(e.request).then(hit=>hit || fetch(e.request).then(r=>{
        const copy=r.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copy));
        return r;
      }))
    );
    return;
  }

  if(u.origin===location.origin){
    e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request)));
  }
});