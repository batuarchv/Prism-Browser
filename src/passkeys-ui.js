// Settings → Passwords: the passkeys Prism keeps (src/passkeys.cjs), with removal. Refreshed whenever the pane shows.
(()=>{if(!new URLSearchParams(location.search).has('tool'))return;const pane=document.querySelector('[data-pane=passwords]');if(!pane)return;
 const t=key=>window.prismLocale?.t?.(key)||key;
 const card=document.createElement('div');card.className='settings-card';card.id='passkey-card';
 const head=document.createElement('div');head.className='setting-row';const label=document.createElement('span');label.textContent=t('Passkeys');const small=document.createElement('small');small.textContent=t('Saved in Prism and unlocked with Touch ID.');label.append(small);head.append(label);
 const list=document.createElement('ul');list.className='passkey-list';card.append(head,list);
 (pane.querySelector('.settings-card')||pane.lastElementChild).after(card);
 async function refresh(){const {entries=[]}=await act('passkey-list')||{};list.replaceChildren(...(entries.length?entries.map(p=>{const li=document.createElement('li');li.className='setting-row';
   const name=document.createElement('span');name.textContent=p.rpId;const user=document.createElement('small');user.textContent=p.userName||p.userDisplayName||'';name.append(user);
   const remove=document.createElement('button');remove.textContent=t('Remove');remove.onclick=async()=>{await act('passkey-remove',{id:p.credentialId});refresh();};li.append(name,remove);return li;})
  :[Object.assign(document.createElement('li'),{className:'passkey-empty',textContent:t('No passkeys yet.')})]));}
 new MutationObserver(()=>{if(!pane.hidden)refresh();}).observe(pane,{attributes:true,attributeFilter:['hidden']});if(!pane.hidden)refresh();
})();
