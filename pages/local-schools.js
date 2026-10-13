
(() => {
 const nav=document.getElementById('nav'), burger=nav.querySelector('.nav-burger'), menu=document.getElementById('primary-navigation'), dropdown=nav.querySelector('details');
 function close(){nav.classList.remove('menu-open');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Открыть меню');dropdown.open=false;}
 burger.addEventListener('click',()=>{const open=burger.getAttribute('aria-expanded')!=='true';nav.classList.toggle('menu-open',open);burger.setAttribute('aria-expanded',String(open));burger.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');if(!open)dropdown.open=false;});
 document.addEventListener('click',e=>{if(!dropdown.contains(e.target))dropdown.open=false;if(!nav.contains(e.target))close();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(dropdown.open){dropdown.open=false;dropdown.querySelector('summary').focus();}else if(nav.classList.contains('menu-open')){close();burger.focus();}}});
 menu.addEventListener('click',e=>{if(e.target.closest('a'))close();});
 nav.addEventListener('focusout',()=>setTimeout(()=>{if(!dropdown.contains(document.activeElement))dropdown.open=false;if(!nav.contains(document.activeElement))close();},0));
 window.matchMedia('(max-width: 1024px)').addEventListener('change',close);
 const form=document.getElementById('branch-form'), status=document.getElementById('form-status'), submit=form.querySelector('button[type="submit"]');
 let sending=false;
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(sending||!form.reportValidity())return;
  const phone=form.elements.phone;
  if(phone.value.replace(/\D/g,'').length<10){phone.setCustomValidity('Укажите номер телефона с кодом города или страны');phone.reportValidity();phone.setCustomValidity('');return;}
  sending=true;submit.disabled=true;submit.textContent='Отправляем…';status.textContent='';
  const fd=new FormData(form);fd.append('page_url',location.origin+location.pathname);
  const params=new URLSearchParams(location.search);
  for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','yclid']){if(params.has(key))fd.append(key,params.get(key));}
  window.dataLayer=window.dataLayer||[];
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
  try{
   const res=await fetch('https://formspree.io/f/xbdvwyza',{method:'POST',headers:{Accept:'application/json'},body:fd,signal:controller.signal});
   if(!res.ok)throw new Error('http_'+res.status);
   window.dataLayer.push({event:'lead_success',form_id:'branch-form',lead_source:'offline_branch',branch:form.elements.branch.value});
   status.textContent='Спасибо! Заявка отправлена. Мы свяжемся с вами в рабочее время, чтобы согласовать пробное занятие.';form.reset();
  }catch(err){status.textContent='Не удалось подтвердить отправку. Попробуйте ещё раз или позвоните: +7 (931) 334-20-80.';window.dataLayer.push({event:'lead_error',form_id:'branch-form',error_type:String(err.message||'network')});}
  finally{clearTimeout(timer);sending=false;submit.disabled=false;submit.textContent='Записаться на бесплатное занятие';}
 });
 document.querySelectorAll('[data-format]').forEach(a=>a.addEventListener('click',()=>{form.elements.format.value=a.dataset.format;}));
})();