import { useRef, type ReactNode, type ElementType, type ComponentPropsWithoutRef } from 'react';
import { gsap } from '@/lib/gsap';

interface MagneticButtonProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  cursorLabel?: string;
  [key: string]: unknown;
}

export default function MagneticButton({
  children,
  as: Tag = 'button',
  className = '',
  cursorLabel,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, { x: relX * 0.3, y: relY * 0.4, duration: 0.4, ease: 'power2.out' });
  };

  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
  };

  return (
    <Tag
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-cursor="cta"
      data-cursor-label={cursorLabel}
      className={className}
      {...(rest as ComponentPropsWithoutRef<'button'>)}
    >
      {children}
    </Tag>
  );
}
