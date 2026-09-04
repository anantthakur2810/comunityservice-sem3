import { useEffect, useRef, useState } from 'react';

export function useInView({ threshold = 0.12, rootMargin = '0px 0px -40px 0px' } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      setInView(true);
      obs.disconnect();
      clearInterval(poll);
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) settle();
      },
      { threshold, rootMargin }
    );
    obs.observe(el);

    // Fallback for environments where IntersectionObserver callbacks never
    // fire (e.g. some embedded webviews) — reveal once the element is in the
    // viewport. Harmless in normal browsers since IO settles first.
    const checkVisible = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Reveal once the element's top has crossed into the viewport — even if
      // the user scrolled past it in a fast jump, they've reached this content.
      return rect.top < vh - 40;
    };
    const poll = setInterval(() => {
      if (checkVisible()) settle();
    }, 300);

    return () => {
      clearInterval(poll);
      obs.disconnect();
    };
  }, [threshold, rootMargin]);

  return [ref, inView];
}

/**
 * Wrapper that fades/slides children in when they scroll into view.
 * Pass `delay` (ms) to stagger sibling elements.
 */
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'reveal-visible' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/** Counts from 0 to `target` with ease-out once `start` is true.
    Timer-based (setInterval) rather than requestAnimationFrame so it also
    works in throttled/background contexts where rAF never fires. */
export function useCountUp(target, { duration = 1400, start = true } = {}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return undefined;
    const t0 = performance.now();
    const iv = setInterval(() => {
      const p = Math.min((performance.now() - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p >= 1) clearInterval(iv);
    }, 16);
    return () => clearInterval(iv);
  }, [start, target, duration]);

  return value;
}