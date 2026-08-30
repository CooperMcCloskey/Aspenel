//TODO: Remove

export function onCommit<T extends HTMLElement>(el: T, callback: (e: FocusEvent, el: T)=>void) {
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