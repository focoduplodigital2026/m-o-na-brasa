/* Minha Central V6 — Web Push. Nenhum segredo de envio aqui. */
(()=>{'use strict';
const $=s=>document.querySelector(s);
const leadSelect=$('#notificationLead'),status=$('#notificationStatus'),help=$('#notificationHelp');
const allowed=new Set(['0','15','60','1440']);
const LOCAL_LEAD='minhacentral.notificationLead.v1';
let lead=localStorage.getItem(LOCAL_LEAD)||'15'; if(!allowed.has(lead))lead='15'; leadSelect.value=lead;
const isIOS=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const publicKey=window.MINHA_CENTRAL_VAPID_PUBLIC_KEY;
const cloud=()=>window.minhaCentralPushClient?.()||null;
const current=()=>window.minhaCentralCurrentUser?.()||null;
const base64ToU8=(s)=>{const x=(s+'='.repeat((4-s.length%4)%4)).replace(/-/g,'+').replace(/_/g,'/'),bin=atob(x);return Uint8Array.from(bin,c=>c.charCodeAt(0));};
const say=s=>{help.textContent=s;};
function display(){
 if(!('Notification' in window)||!('serviceWorker' in navigator)||!('PushManager' in window)){status.textContent='Indisponível';say('Este navegador não oferece suporte completo a Web Push.');return;}
 status.textContent=Notification.permission==='granted'?'Permissão concedida':Notification.permission==='denied'?'Bloqueado':'Desativado';
 if(isIOS()&&!standalone())say('No iPhone/iPad, primeiro use Compartilhar → Adicionar à Tela de Início; abra o app instalado e volte aqui.');
 else if(Notification.permission==='denied')say('Habilite notificações nas configurações do navegador e do sistema.');
 else say('Para avisos com o app fechado, ative as notificações e conclua a instalação do serviço no Supabase.');
}
async function ready(){const registration=await navigator.serviceWorker.ready;if(!registration.pushManager)throw Error('Push não é compatível com este navegador.');return registration;}
async function subscriptionData(sub){const j=sub.toJSON(); if(!j.endpoint||!j.keys?.auth||!j.keys?.p256dh)throw Error('Inscrição push inválida.');return j;}
async function saveSubscription(sub){const client=cloud(), user=current();if(!client||!user)throw Error('Entre com Google para salvar o dispositivo.');
 const j=await subscriptionData(sub);
 const row={user_id:user.id,endpoint:j.endpoint,p256dh:j.keys.p256dh,auth:j.keys.auth,lead_minutes:Number(leadSelect.value),enabled:true,user_agent:navigator.userAgent.slice(0,400)};
 const {error}=await client.from('push_subscriptions').upsert(row,{onConflict:'user_id,endpoint'});if(error)throw Error('Não foi possível registrar no banco: '+error.message);
 return row;
}
async function enable(){
 try{
  if(isIOS()&&!standalone())throw Error('No iPhone, instale o aplicativo na Tela de Início antes de ativar notificações.');
  if(!current())throw Error('Entre na sua conta Google antes de ativar notificações.');
  if(!publicKey)throw Error('Falta configurar a chave pública VAPID.');
  if(Notification.permission==='denied')throw Error('Notificações bloqueadas. Altere a permissão nas configurações do dispositivo.');
  const p=await Notification.requestPermission();if(p!=='granted')throw Error('Permissão não concedida.');
  const reg=await ready();let sub=await reg.pushManager.getSubscription();
  if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:base64ToU8(publicKey)});
  await saveSubscription(sub);status.textContent='Dispositivo inscrito';say('Inscrição salva na nuvem. Seus avisos podem chegar com o aplicativo fechado após ativar o disparador agendado no Supabase.');
 }catch(e){say('Erro: '+e.message);console.error(e);}displayStatusSoon();
}
function displayStatusSoon(){if(Notification.permission!=='granted')display();}
async function changeLead(){localStorage.setItem(LOCAL_LEAD,leadSelect.value);try{if(!current())return;const reg=await ready(),sub=await reg.pushManager.getSubscription();if(sub){await saveSubscription(sub);say('Antecedência atualizada neste dispositivo e sincronizada com o banco.');}}catch(e){say('Não foi possível salvar a antecedência: '+e.message);}}
async function sendTest(){try{
 const client=cloud(),user=current();if(!client||!user)throw Error('Faça login antes de testar.');
 const reg=await ready(),sub=await reg.pushManager.getSubscription();if(!sub)throw Error('Clique primeiro em Ativar notificações push.');
 await saveSubscription(sub);
 const {data:{session}}=await client.auth.getSession();if(!session?.access_token)throw Error('Sessão expirada. Entre novamente.');
 const response=await fetch('https://edhzxbsnimjaxsjqycdy.supabase.co/functions/v1/push-dispatch',{method:'POST',headers:{'Content-Type':'application/json','apikey':'sb_publishable_JSc14IwMpYutO3XMrm9czQ_fNetcLBE','Authorization':'Bearer '+session.access_token},body:JSON.stringify({action:'test',endpoint:sub.endpoint})});
 const result=await response.json().catch(()=>({}));if(!response.ok)throw Error(result.error||('Servidor retornou '+response.status));
 say('Teste enviado pelo Supabase. Confira as notificações deste dispositivo.');
 }catch(e){say('Teste não enviado: '+e.message+' Confira se a função push-dispatch já foi publicada.');}}
async function disableForSignout(){try{const client=cloud(),user=current();if(!client||!user)return;const reg=await ready(),sub=await reg.pushManager.getSubscription();if(sub){await client.from('push_subscriptions').delete().eq('user_id',user.id).eq('endpoint',sub.endpoint);await sub.unsubscribe();}}catch(e){console.warn('Falha ao desvincular push no logout',e);}}
window.minhaCentralPushDisable=disableForSignout;
$('#enableNotifications').addEventListener('click',enable);
$('#testNotification').addEventListener('click',sendTest);
leadSelect.addEventListener('change',changeLead);
window.addEventListener('focus',display);
display();
})();
