import { useRef, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function Showreel() {
  const ref = useScrollReveal<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [hasVideo] = useState(false); // flip true once /public/assets/showreel.mp4 exists

  const handlePlay = () => {
    if (!hasVideo) return;
    setPlaying(true);
    videoRef.current?.play();
  };

  return (
    <section id="showreel" className="relative bg-[var(--color-void)] pb-10 sm:pb-16 scroll-mt-24">
      <div ref={ref} className="container-page">
        <div data-reveal className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow mb-2 block text-pink-300 font-bold uppercase tracking-widest">Featured Reel</span>
            <h2 className="font-display max-w-lg text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-6xl text-white drop-shadow-[0_2px_12px_rgba(255,42,85,0.3)]">
              Watch
              <br />
              <span className="text-[var(--color-signal-2)] text-glow">the sky move.</span>
            </h2>
          </div>
        </div>

        <div
          data-reveal
          data-cursor={hasVideo ? 'explore' : undefined}
          data-cursor-label="Play"
          onClick={handlePlay}
          className="group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border border-white/10 bg-[var(--color-panel)]"
        >
          {hasVideo ? (
            <video ref={videoRef} src="/assets/showreel.mp4" muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(60% 60% at 50% 50%, rgba(242,10,131,0.14), transparent 70%)',
            }} />
          )}

          {!playing && (
            <button
              aria-label="Play showreel"
              className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-black/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
            >
              <span className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
            </button>
          )}

          <span className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {hasVideo ? 'Showreel' : 'Showreel — drop /public/assets/showreel.mp4 to enable'}
          </span>
        </div>
      </div>
    </section>
  );
}
