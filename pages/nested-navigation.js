(()=>{
 const nav=document.getElementById('nav');
 const root=nav?.querySelector('.nav-learning');
 if(!root)return;
 const groups=[...root.querySelectorAll('.nav-submenu')];
 const hover=window.matchMedia('(min-width: 1025px) and (hover: hover) and (pointer: fine)');
 let timer;
 function select(group){
  groups.forEach(other=>{if(other!==group)other.open=false;});
  group.classList.remove('opens-left');
  if(hover.matches){
   const list=group.querySelector('.nav-dropdown-list');
   const box=group.getBoundingClientRect();
   if(box.right+list.offsetWidth+12>document.documentElement.clientWidth)group.classList.add('opens-left');
  }
 }
 function reset(){clearTimeout(timer);groups.forEach(g=>g.open=false);}
 root.addEventListener('pointerenter',()=>{clearTimeout(timer);if(hover.matches)root.open=true;});
 root.addEventListener('pointerleave',()=>{if(hover.matches)timer=setTimeout(()=>{if(!root.contains(document.activeElement)){root.open=false;reset();}},220);});
 root.addEventListener('toggle',()=>{if(!root.open)reset();});
 groups.forEach(group=>{
  group.addEventListener('pointerenter',()=>{if(hover.matches){group.open=true;select(group);}});
  group.addEventListener('toggle',()=>{if(group.open)select(group);});
  group.querySelector('summary').addEventListener('focus',()=>{groups.forEach(g=>{if(g!==group)g.open=false;});});
 });
 // Close the inner level first, before the existing page navigation handler.
 document.addEventListener('keydown',event=>{
  if(event.key!=='Escape'||!root.open)return;
  const opened=groups.find(g=>g.open);
  if(opened){event.preventDefault();event.stopImmediatePropagation();opened.open=false;opened.querySelector('summary').focus();}
 },true);
 hover.addEventListener('change',()=>{reset();root.open=false;});
})();
