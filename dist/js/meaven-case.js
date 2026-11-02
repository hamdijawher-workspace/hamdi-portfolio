'use strict';
(() => {
 const frames=[...document.querySelectorAll('[data-screen-frame]')];
 function size(frame){const iframe=frame.querySelector('iframe');if(!iframe)return;iframe.style.transform=`scale(${frame.getBoundingClientRect().width/1600})`;}
 const observer=new ResizeObserver(entries=>entries.forEach(({target})=>size(target)));
 frames.forEach(frame=>{observer.observe(frame);size(frame)});
 const tabs=[...document.querySelectorAll('.ms-tabs [role="tab"]')];
 function selectTab(tab,focus=false){
  tabs.forEach(item=>{const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!selected;});
  if(focus)tab.focus();
 }
 tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>selectTab(tab));
  tab.addEventListener('keydown',event=>{
   let next;
   if(event.key==='ArrowRight')next=(index+1)%tabs.length;
   if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
   if(event.key==='Home')next=0;
   if(event.key==='End')next=tabs.length-1;
   if(next!==undefined){event.preventDefault();selectTab(tabs[next],true);}
  });
 });
 const annotationTargets={
  'Driving information stays here.':[.17,.34],
  'Map and apps share this area.':[.72,.35],
  'Next turn, above the car.':[.71,.23],
  'Battery and range stay together.':[.12,.84],
  'Arrival and distance, together.':[.18,.47],
  'Music controls':[.25,.87],
  'A/C controls':[.75,.87],
  'A visible way to start listening.':[.91,.5]
 };
 document.querySelectorAll('.ms-figure').forEach(figure=>{
  const picture=figure.querySelector('img');
  const overlay=document.createElementNS('http://www.w3.org/2000/svg','svg');
  overlay.classList.add('ms-arrow-layer');overlay.setAttribute('aria-hidden','true');figure.append(overlay);
  function drawArrows(){
   const r=figure.getBoundingClientRect(),im=picture.getBoundingClientRect();
   overlay.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);overlay.replaceChildren();
   figure.querySelectorAll('.ms-note').forEach(note=>{
    const label=note.querySelector('span'),target=annotationTargets[label.textContent.trim()];if(!target)return;
    const nr=label.getBoundingClientRect(),tx=im.left-r.left+im.width*target[0],ty=im.top-r.top+im.height*target[1];
    const sx=nr.left-r.left+nr.width/2,sy=ty>nr.bottom-r.top?nr.bottom-r.top+8:nr.top-r.top-9;
    const dx=tx-sx,dy=ty-sy,angle=Math.atan2(dy,dx),path=document.createElementNS(overlay.namespaceURI,'path');
    path.setAttribute('d',`M${sx} ${sy} C${sx+dx*.1} ${sy+dy*.55},${sx+dx*.8} ${ty-dy*.15},${tx} ${ty} M${tx-8*Math.cos(angle-.5)} ${ty-8*Math.sin(angle-.5)} L${tx} ${ty} L${tx-8*Math.cos(angle+.5)} ${ty-8*Math.sin(angle+.5)}`);
    overlay.append(path);
   });
  }
  new ResizeObserver(drawArrows).observe(figure);picture.addEventListener('load',drawArrows);drawArrows();
 });
 // Enhance the editorial story without delaying access to the screen gallery.
 if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const items=[...document.querySelectorAll('.mc-section:not(#final-design) > :not(.mc-chapter-note)')];
  const reveal=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add('mc-is-visible');
    reveal.unobserve(entry.target);
   });
  },{threshold:0,rootMargin:'0px 0px -28px 0px'});
  items.forEach(item=>{item.classList.add('mc-reveal');reveal.observe(item)});
 }
})();
