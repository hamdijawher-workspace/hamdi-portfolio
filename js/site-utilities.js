(() => {
  if (document.querySelector('.back-to-top')) return;
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'back-to-top'; button.hidden = true;
  button.setAttribute('aria-label', 'Back to top'); button.title = 'Back to top';
  button.dataset.noTranslate = '';
  button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 12 6-6 6 6M12 6v13"/></svg>';
  document.body.append(button);
  let queued = false;
  const update = () => { button.hidden = scrollY < 500; queued = false; };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  button.addEventListener('click', () => {
    const event = new Event('portfolio:back-to-top', { cancelable: true });
    if (dispatchEvent(event)) scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    const target = document.querySelector('main');
    if (target) { if (!target.hasAttribute('tabindex')) { target.tabIndex = -1; target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true }); } target.focus({ preventScroll: true }); }
  });
  update();
})();
