import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface Options {
  y?: number;
  duration?: number;
  delay?: number;
  start?: string;
  stagger?: number;
}

/** Attach a one-shot fade/slide-up reveal to every direct [data-reveal] child. */
export function useScrollReveal<T extends HTMLElement>(opts: Options = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = root.hasAttribute('data-reveal')
      ? [root]
      : Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y: opts.y ?? 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: opts.duration ?? 0.9,
          delay: opts.delay ?? 0,
          stagger: opts.stagger ?? 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: root,
            start: opts.start ?? 'top 78%',
          },
        }
      );
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

export { gsap, ScrollTrigger };
