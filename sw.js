/* Service Worker V4: somente arquivos públicos estáticos. Não armazena respostas autenticadas. */
const CACHE='minha-central-pwa-v7';
const ASSETS=['./styles.css','./app.js','./install.js','./notifications.js','./notification-extras.js','./push-config.js','./icon.svg','./icon-192.png','./icon-512.png','./manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('minha-central-pwa-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const request=e.request;if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 const u=new URL(request.url);if(!ASSETS.some(p=>u.pathname.endsWith('/'+p.replace('./',''))))return;
 e.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;}).catch(()=>caches.match(request)));
});

/* Abre o app ao tocar no aviso. O Service Worker não inventa lembretes sozinho. */
self.addEventListener('notificationclick',event=>{event.notification.close();const urlObj=new URL('./',self.registration.scope);if(event.action&&/^snooze-(10|30|60)$/.test(event.action)&&event.notification.data?.taskId){urlObj.searchParams.set('snooze',event.notification.data.taskId);urlObj.searchParams.set('minutes',event.action.slice(7));}const url=urlObj.href;event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>{const existing=clients.find(c=>c.url.startsWith(url));if(existing)return existing.focus();return self.clients.openWindow(url);}));});

/* Push chega por rede independentemente da aba; sistema operacional pode limitar entregas. */
self.addEventListener('push',event=>{let data={};try{data=event.data?.json()||{};}catch{data={body:event.data?.text()||''};}
 const options={body:String(data.body||'Você tem uma atividade para lembrar.'),icon:'./icon-192.png',badge:'./icon-192.png',tag:String(data.tag||'minha-central'),renotify:false,data:{url:new URL('./',self.registration.scope).href,taskId:data.task_id||null},actions:data.task_id?[{action:'snooze-10',title:'Adiar 10 min'},{action:'snooze-30',title:'Adiar 30 min'}]:[]};
 event.waitUntil(self.registration.showNotification(String(data.title||'Minha Central 🔔'),options));
});
