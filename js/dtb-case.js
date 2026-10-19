/* Portfolio image review only. The banking screens are static artwork. */
(() => {
 const dialog=document.querySelector('.lightbox');
 if(!dialog)return;
 const updateLabel=()=>dialog.setAttribute('aria-label',document.documentElement.lang==='fr'?'Image du projet DTB agrandie':'Enlarged DTB design image');
 updateLabel();
 new MutationObserver(updateLabel).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 document.addEventListener('keydown',event=>{
  if(event.key==='Tab'&&dialog.classList.contains('is-open')){
   event.preventDefault();dialog.querySelector('button')?.focus();
  }
 });
})();
