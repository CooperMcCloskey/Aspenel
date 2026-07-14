export function onCommit(el: HTMLElement, callback: (e: FocusEvent, el: HTMLElement)=>void) {
  const onEnter = (e: KeyboardEvent)=>{ if (e.key === 'Enter') el.blur() }
  const onBlur = (e: FocusEvent)=>callback(e, el);
  el.addEventListener('keydown', onEnter);
  el.addEventListener('blur', onBlur);
  return {
    destroy() { 
      el.removeEventListener('keydown', onEnter);
      el.removeEventListener('blur', onBlur);
    }
  }
}