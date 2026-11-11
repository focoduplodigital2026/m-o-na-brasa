/* Instalação PWA — funciona sem alterar autenticação ou tarefas */
(()=>{'use strict';
let pendingPrompt=null;
const ios=/iPad|iPhone|iPod/i.test(navigator.userAgent) || (navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const standalone=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();pendingPrompt=event;});
window.addEventListener('appinstalled',()=>{pendingPrompt=null;document.querySelectorAll('[data-install]').forEach(b=>{b.textContent='✓ App instalado';b.disabled=true;});});
function guide(message){const dialog=document.getElementById('installDialog');document.getElementById('installInstructions').textContent=message;if(dialog&&!dialog.open)dialog.showModal();}
async function handleInstall(){
 if(standalone()){guide('A Minha Central já está aberta como aplicativo neste dispositivo.');return;}
 if(pendingPrompt){const prompt=pendingPrompt;pendingPrompt=null;try{await prompt.prompt();const result=await prompt.userChoice;if(result?.outcome!=='accepted')guide('Instalação não concluída. Você pode instalar depois pelo menu do navegador.');}catch(e){guide('Não foi possível abrir a instalação automaticamente. Abra o menu do navegador e procure “Instalar aplicativo”.');}return;}
 if(ios){guide(`No iPhone ou iPad:
1. Abra esta página no Safari (ou navegador com a opção de adicionar à Tela de Início).
2. Toque no botão Compartilhar.
3. Escolha “Adicionar à Tela de Início”.
4. Confirme em “Adicionar”.`);return;}
 guide(`Para instalar a Minha Central:
• Android (Chrome): abra o menu ⋮ e escolha “Instalar app” ou “Adicionar à tela inicial”.
• Computador (Chrome/Edge): use o ícone de instalação na barra de endereços ou a opção “Instalar” no menu.

Se não aparecer, atualize a página e verifique se está usando HTTPS.`);
}
document.addEventListener('click',event=>{const btn=event.target.closest('[data-install]');if(btn){event.preventDefault();handleInstall();}});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(error=>console.warn('Não foi possível registrar o suporte à instalação',error)));}
})();
