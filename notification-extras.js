/* Minha Central V7 — Histórico de notificações e adiamento. */
(()=>{'use strict';
const $=s=>document.querySelector(s);
const client=()=>window.minhaCentralPushClient?.();
const user=()=>window.minhaCentralCurrentUser?.();
const tasks=()=>window.minhaCentralTasks?.()||[];
const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let selected=null;
const dialog=$('#snoozeDialog');
function notify(message){const el=$('#toast'); if(!el)return;el.textContent=message;el.classList.remove('hidden');clearTimeout(notify.timer);notify.timer=setTimeout(()=>el.classList.add('hidden'),4500);}
function openSnooze(id){const t=tasks().find(x=>x.id===id&&!x.completed);if(!t){notify('Não foi possível encontrar esta tarefa pendente.');return;}selected=id;$('#snoozeTaskTitle').textContent=t.title;dialog.showModal();}
window.minhaCentralOpenSnooze=openSnooze;
async function scheduleSnooze(id,minutes){if(![10,30,60].includes(minutes))throw Error('Intervalo inválido.');const c=client(),u=user();if(!c||!u)throw Error('Entre com Google para adiar.');const t=tasks().find(x=>x.id===id&&!x.completed);if(!t)throw Error('Tarefa não encontrada ou já concluída.');const notifyAt=new Date(Date.now()+minutes*60000).toISOString();const {error}=await c.from('push_snoozes').insert({user_id:u.id,task_id:id,notify_at:notifyAt});if(error)throw error;notify(`Novo aviso agendado para daqui a ${minutes} minutos.`);await refreshHistory();}
async function refreshHistory(){const holder=$('#notificationHistory'),c=client(),u=user();if(!holder)return;if(!c||!u){holder.innerHTML='<p class="history-empty">Entre na sua conta para consultar os avisos.</p>';return;}
 const [h,s]=await Promise.all([c.from('notification_history').select('id,title,kind,status,sent_at,created_at,last_error').eq('user_id',u.id).order('created_at',{ascending:false}).limit(30),c.from('push_snoozes').select('id,task_id,notify_at,status,created_at').eq('user_id',u.id).eq('status','pending').order('notify_at',{ascending:true}).limit(15)]);
 if(h.error||s.error){holder.innerHTML='<p class="history-empty">Não foi possível carregar o histórico. Execute a migração SQL da V7 no Supabase.</p>';return;}
 const rows=[...(h.data||[]).map(x=>({...x,sortAt:x.created_at,displayAt:x.sent_at||x.created_at})),...(s.data||[]).map(x=>({...x,sortAt:x.created_at,displayAt:x.notify_at,title:tasks().find(t=>t.id===x.task_id)?.title||'Tarefa',kind:'Adiado',status:'pending'}))].sort((a,b)=>new Date(b.sortAt)-new Date(a.sortAt)).slice(0,30);
 holder.innerHTML=rows.map(x=>`<div class="history-item"><span class="history-dot ${escapeHtml(x.status)}"></span><div><strong>${escapeHtml(x.title)}</strong><small>${escapeHtml(x.kind==='snooze'?'Aviso adiado':x.kind==='Adiado'?'Novo aviso agendado':'Lembrete')} · ${escapeHtml(new Date(x.displayAt).toLocaleString('pt-BR'))}</small>${x.status==='failed'&&x.last_error?`<small class="history-error">Falha no envio</small>`:''}</div><span class="history-chip">${x.status==='sent'?'Enviado':x.status==='failed'?'Falhou':x.status==='pending'?'Agendado':'Processando'}</span></div>`).join('')||'<p class="history-empty">Nenhum aviso registrado ainda. Crie uma tarefa e ative as notificações.</p>';
}
$('#closeSnooze')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
document.querySelectorAll('[data-snooze-minutes]').forEach(b=>b.addEventListener('click',async()=>{b.disabled=true;try{await scheduleSnooze(selected,Number(b.dataset.snoozeMinutes));dialog.close();}catch(e){notify('Erro ao adiar: '+e.message);}finally{b.disabled=false;}}));
$('#refreshHistory')?.addEventListener('click',refreshHistory);
document.addEventListener('click',e=>{if(e.target.closest('[data-view="reminders"]'))setTimeout(refreshHistory,120);});
window.addEventListener('minhacentral:tasks-changed',()=>{if(!document.querySelector('[data-page="reminders"]')?.classList.contains('hidden'))refreshHistory();});
async function handleSnoozeFromPush(){const url=new URL(location.href),id=url.searchParams.get('snooze'),minutes=Number(url.searchParams.get('minutes'));if(!id)return;
 if(!/^[0-9a-f-]{36}$/i.test(id)||![10,30,60].includes(minutes)){url.searchParams.delete('snooze');url.searchParams.delete('minutes');history.replaceState(null,'',url);return;}
 if(!user())return;url.searchParams.delete('snooze');url.searchParams.delete('minutes');history.replaceState(null,'',url);
 try{await scheduleSnooze(id,minutes);}catch(e){notify('Não foi possível adiar: '+e.message);}}
window.addEventListener('minhacentral:tasks-changed',handleSnoozeFromPush);
setTimeout(handleSnoozeFromPush,1500);
})();
