import { useEffect, useRef } from 'react';
import { useIsTouch } from '@/hooks/useMediaQuery';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();

  useEffect(() => {
    if (isTouch) return;
    document.documentElement.classList.add('has-custom-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
    };
    window.addEventListener('pointermove', onMove);

    let raf: number;
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const setState = (state: 'default' | 'hover' | 'cta' | 'explore') => {
      const ring = ringRef.current;
      if (!ring) return;
      ring.dataset.state = state;
    };

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement;
      const el = target.closest('[data-cursor]') as HTMLElement | null;
      if (el) {
        setState((el.dataset.cursor as 'hover' | 'cta' | 'explore') || 'hover');
        if (labelRef.current) labelRef.current.textContent = el.dataset.cursorLabel ?? '';
      } else if (target.closest('a,button')) {
        setState('hover');
        if (labelRef.current) labelRef.current.textContent = '';
      } else {
        setState('default');
        if (labelRef.current) labelRef.current.textContent = '';
      }
    };
    window.addEventListener('pointerover', onOver);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      cancelAnimationFrame(raf);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] hidden md:block">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white will-change-transform"
      />
      <div
        ref={ringRef}
        data-state="default"
        className="cursor-ring fixed left-0 top-0 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 transition-[width,height,border-color,background-color] duration-200 ease-out will-change-transform
          data-[state=hover]:h-12 data-[state=hover]:w-12 data-[state=hover]:border-white
          data-[state=cta]:h-14 data-[state=cta]:w-14 data-[state=cta]:border-[var(--color-signal-2)] data-[state=cta]:bg-[var(--color-signal-soft)]
          data-[state=explore]:h-16 data-[state=explore]:w-16 data-[state=explore]:border-[var(--color-signal-2)]"
      >
        <div ref={labelRef} className="font-mono text-[9px] uppercase tracking-[0.2em] text-white" />
      </div>
    </div>
  );
}
