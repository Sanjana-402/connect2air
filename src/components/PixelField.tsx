import { useEffect, useRef } from 'react';

type Particle = {
  // idle scattered position (phase 0)
  ix: number;
  iy: number;
  // wordmark position (phase 1)
  wx: number;
  wy: number;
  // dispersed / dust position (phase 2)
  dx: number;
  dy: number;
  size: number;
  seed: number;
  hue: 'ink' | 'signal';
};

function sampleTextPoints(text: string, width: number, height: number, count: number) {
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const ctx = off.getContext('2d')!;
  ctx.fillStyle = '#fff';
  const fontSize = Math.min(width / (text.length * 0.62), height * 0.62);
  ctx.font = `800 ${fontSize}px Manrope, Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  const { data } = ctx.getImageData(0, 0, width, height);
  const points: { x: number; y: number }[] = [];
  const step = 3;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 120) points.push({ x, y });
    }
  }
  // shuffle then take/expand to `count`
  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
  }
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    out.push(points[i % points.length] ?? { x: width / 2, y: height / 2 });
  }
  return out;
}

interface PixelFieldProps {
  /** 0 -> idle scattered field, 0.5 -> wordmark formed, 1 -> dispersed dust */
  progressRef: React.MutableRefObject<number>;
  label?: string;
  className?: string;
}

/**
 * The site's recurring signature motif: a canvas pixel matrix that stands in
 * for the LED display itself. It idles as a sparse field in the hero, draws
 * itself into the wordmark, then disperses into ambient dust that seeds the
 * next section — this is the mechanism that makes section transitions read
 * as one continuous surface rather than a hard cut.
 */
export default function PixelField({ progressRef, label = 'CONNECT2AIR', className }: PixelFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | undefined>(undefined);
  const dprRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmall = window.innerWidth < 768;
    const COUNT = reduced ? 0 : isSmall ? 420 : 900;

    function build() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;

      const wordPoints = sampleTextPoints(label, w, h, COUNT);
      const particles: Particle[] = [];
      for (let i = 0; i < COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * Math.max(w, h) * 0.62;
        particles.push({
          ix: w / 2 + Math.cos(angle) * radius * 0.5 + (Math.random() - 0.5) * w * 0.7,
          iy: h * 0.15 + Math.random() * h * 0.7,
          wx: wordPoints[i].x,
          wy: wordPoints[i].y,
          dx: Math.random() * w,
          dy: Math.random() * h,
          size: Math.random() * 1.6 + 0.6,
          seed: Math.random() * 1000,
          hue: Math.random() < 0.08 ? 'signal' : 'ink',
        });
      }
      particlesRef.current = particles;
    }

    build();
    window.addEventListener('resize', build);

    function ease(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function draw(t: number) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = dprRef.current;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);

      const p = progressRef.current; // 0..1 overall scroll-driven progress
      // three phases mapped across the progress range
      const formPhase = ease(Math.min(Math.max((p - 0.15) / 0.25, 0), 1)); // idle -> word
      const holdEnd = 0.62;
      const dispersePhase = ease(Math.min(Math.max((p - holdEnd) / 0.3, 0), 1)); // word -> dust
      const idleFade = 1 - ease(Math.min(Math.max((p - 0.9) / 0.1, 0), 1));

      const time = t * 0.001;

      for (const particle of particlesRef.current) {
        const drift = Math.sin(time * 0.6 + particle.seed) * 4;
        const driftY = Math.cos(time * 0.5 + particle.seed) * 4;

        let x: number, y: number, alpha: number;

        if (dispersePhase > 0) {
          x = particle.wx + (particle.dx - particle.wx) * dispersePhase;
          y = particle.wy + (particle.dy - particle.wy) * dispersePhase;
          alpha = (1 - dispersePhase * 0.85) * idleFade;
        } else {
          x = particle.ix + (particle.wx - particle.ix) * formPhase;
          y = particle.iy + (particle.wy - particle.iy) * formPhase;
          alpha = 0.35 + formPhase * 0.65;
        }

        x += drift * (1 - formPhase * 0.7);
        y += driftY * (1 - formPhase * 0.7);

        const flicker = 0.75 + Math.sin(time * 3 + particle.seed) * 0.25;
        ctx!.globalAlpha = Math.max(0, Math.min(1, alpha * flicker));
        ctx!.fillStyle = particle.hue === 'signal' ? '#ff1493' : '#ffffff';
        ctx!.fillRect(x, y, particle.size, particle.size);
      }
      ctx!.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', build);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? 'absolute inset-0 h-full w-full'}
    />
  );
}
