// dc-hover.js — makes `style-hover="..."` attributes work in plain HTML.
// The Claude Design sources use inline `style-hover` declarations that the
// design runtime applies on hover. Inline styles can't carry a :hover rule,
// so we apply them imperatively: on mouseenter set the hover declarations,
// on mouseleave restore whatever was there before.
(() => {
  function parse(decls) {
    const out = [];
    for (const part of decls.split(';')) {
      const i = part.indexOf(':');
      if (i === -1) continue;
      const prop = part.slice(0, i).trim();
      const val = part.slice(i + 1).trim();
      if (prop) out.push([prop, val]);
    }
    return out;
  }

  function wire(el) {
    const decls = parse(el.getAttribute('style-hover') || '');
    if (!decls.length) return;
    el.addEventListener('mouseenter', () => {
      el._dcPrev = decls.map(([p]) => [p, el.style.getPropertyValue(p)]);
      for (const [p, v] of decls) el.style.setProperty(p, v);
    });
    el.addEventListener('mouseleave', () => {
      const prev = el._dcPrev || [];
      for (const [p, v] of prev) {
        if (v) el.style.setProperty(p, v);
        else el.style.removeProperty(p);
      }
    });
  }

  function init() {
    document.querySelectorAll('[style-hover]').forEach(wire);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
