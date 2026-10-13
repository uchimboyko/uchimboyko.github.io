(()=>{
 'use strict';
 const header=document.getElementById('nav');
 const burger=header.querySelector('.nav-burger');
 const menu=header.querySelector('.nav-menu');
 const learning=header.querySelector('.nav-learning');
 const close=()=>{header.classList.remove('menu-open');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Открыть меню');learning.open=false;};
 burger.addEventListener('click',()=>{const opened=header.classList.toggle('menu-open');burger.setAttribute('aria-expanded',String(opened));burger.setAttribute('aria-label',opened?'Закрыть меню':'Открыть меню');});
 menu.addEventListener('click',e=>{if(e.target.closest('a'))close();});
 document.addEventListener('click',e=>{if(!header.contains(e.target))close();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const opened=header.classList.contains('menu-open');const drop=learning.open;close();if(opened)burger.focus();else if(drop)learning.querySelector('summary').focus();}});
 header.addEventListener('focusout',()=>{setTimeout(()=>{if(!header.contains(document.activeElement))close();},0);});
 const form=document.querySelector('.sp-form');if(!form)return;
 const phone=form.elements.phone;
 const validatePhone=()=>{const n=phone.value.replace(/\D/g,'').length;phone.setCustomValidity(n>=10&&n<=15?'':'Укажите телефон с кодом страны: от 10 до 15 цифр.');};
 phone.addEventListener('input',validatePhone);
 document.querySelectorAll('[data-format]').forEach(link=>link.addEventListener('click',()=>{form.elements.format.value=link.dataset.format;}));
 let sending=false;
 form.addEventListener('submit',async e=>{
  e.preventDefault();validatePhone();if(sending||!form.reportValidity())return;
  sending=true;const button=form.querySelector('button[type=submit]'),status=form.querySelector('.sp-status');
  const label=button.textContent;button.disabled=true;button.textContent='Отправляем…';status.textContent='';
  const fd=new FormData(form);fd.set('page_url',location.href);const params=new URLSearchParams(location.search);
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','yclid'].forEach(k=>{if(params.has(k))fd.set(k,params.get(k));});
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
  window.dataLayer=window.dataLayer||[];
  try{
   const response=await fetch(form.action,{method:'POST',headers:{Accept:'application/json'},body:fd,signal:controller.signal});
   if(!response.ok)throw new Error('http_'+response.status);
   window.dataLayer.push({event:'lead_success',form_id:'site-page-form',source_page:form.elements.source_page.value});
   status.textContent='Спасибо! Заявка отправлена. Мы свяжемся с вами, чтобы согласовать время пробного занятия.';form.reset();phone.setCustomValidity('');
  }catch(error){
   status.textContent='Не удалось подтвердить отправку. Попробуйте ещё раз или позвоните: +7 (931) 334-20-80.';
   window.dataLayer.push({event:'lead_error',form_id:'site-page-form',error_type:controller.signal.aborted?'timeout':'request_failed'});
  }finally{clearTimeout(timer);sending=false;button.disabled=false;button.textContent=label;}
 });
})();
