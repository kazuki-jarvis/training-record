const C='ptr-v2';
const SHELL=['./','./index.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()).catch(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.map(x=>x!==C&&caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const req=e.request;
  if(req.mode==='navigate'){
    e.respondWith(
      fetch(req).then(resp=>{const cp=resp.clone();caches.open(C).then(c=>c.put('./index.html',cp));return resp;})
        .catch(()=>caches.match('./index.html').then(r=>r||caches.match('./')))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(r=>r||fetch(req).then(resp=>{const cp=resp.clone();caches.open(C).then(c=>c.put(req,cp));return resp;}))
  );
});
