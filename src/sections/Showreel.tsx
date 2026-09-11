import React, { useEffect, useCallback, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { getCMSMediaAsync, type MediaItem } from '@/utils/cmsStorage';

// Map size field → Tailwind aspect-ratio class and label
const SIZE_CONFIG: Record<string, { aspect: string; label: string }> = {
  reel:   { aspect: 'aspect-[9/16]',  label: '9:16 Reel'  },
  post:   { aspect: 'aspect-[4/5]',   label: '4:5 Post'   },
  square: { aspect: 'aspect-square',  label: '1:1 Square' },
};

function getSizeConfig(size?: string) {
  return SIZE_CONFIG[size ?? 'reel'] ?? SIZE_CONFIG['reel'];
}

// ── Individual Media Card ─────────────────────────────────────────────────────
function MediaCard({ item, index }: { item: MediaItem; index: number }) {
  const { aspect, label } = getSizeConfig(item.size);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-rose-500/20 bg-[#16060c] transition-all duration-300 hover:border-pink-400/60 hover:shadow-[0_0_20px_rgba(255,77,109,0.2)]">
      {/* ── Media ── */}
      <div className={`relative w-full overflow-hidden ${aspect}`}>
        {item.type === 'video' ? (
          <video
            src={item.url}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-cover bg-black"
            style={{ display: 'block' }}
          />
        ) : (
          <img
            src={item.url}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}

        {/* Gradient overlay — only for images (video has native controls) */}
        {item.type === 'image' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
        )}

        {/* Top-left badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-pink-300 bg-pink-500/30 border border-pink-400/40 px-2 py-0.5 rounded-full backdrop-blur-md">
            0{index + 1}
          </span>
          <span className="font-mono text-[9px] font-bold text-white/80 bg-black/60 border border-white/15 px-1.5 py-0.5 rounded-full">
            {label}
          </span>
        </div>
      </div>

      {/* ── Info below media ── */}
      <div className="p-3">
        <h3 className="font-display text-sm font-bold uppercase text-white leading-tight line-clamp-1 group-hover:text-pink-300 transition-colors">
          {item.title}
        </h3>
        {item.tagline && (
          <p className="font-mono text-[10px] text-pink-300/80 font-semibold mt-0.5 line-clamp-1">
            {item.tagline}
          </p>
        )}
        {item.description && (
          <p className="text-[10px] text-white/60 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ── View More Sheet ───────────────────────────────────────────────────────────
function ViewMoreSheet({
  items,
  onClose,
}: {
  items: MediaItem[];
  onClose: () => void;
}) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[130] bg-black/90 backdrop-blur-xl flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-4xl max-h-[90vh] bg-[#16060c] border border-rose-500/30 rounded-t-3xl sm:rounded-2xl p-5 overflow-y-auto shadow-[0_0_60px_rgba(255,42,85,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 sticky top-0 bg-[#16060c] z-10">
          <div>
            <span className="eyebrow text-pink-300 font-bold uppercase text-xs">All Media</span>
            <h3 className="font-display text-lg font-extrabold uppercase text-white mt-0.5">
              Full Gallery ({items.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition text-sm"
          >
            ✕
          </button>
        </div>

        {/* Grid — inline playback here too */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((item, i) => (
            <MediaCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Showreel Section ─────────────────────────────────────────────────────
export default function Showreel() {
  const ref = useScrollReveal<HTMLDivElement>();
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [showAll, setShowAll] = useState(false);

  const loadMedia = useCallback(async () => {
    const media = await getCMSMediaAsync();
    setMediaList(media);
  }, []);

  useEffect(() => {
    loadMedia();
    window.addEventListener('c2a_cms_updated', loadMedia);
    return () => window.removeEventListener('c2a_cms_updated', loadMedia);
  }, [loadMedia]);

  const visibleMedia = mediaList.slice(0, 3);
  const extraCount = Math.max(0, mediaList.length - 3);

  return (
    <section id="showreel" className="relative bg-[var(--color-void)] pt-8 pb-3 sm:pt-10 sm:pb-4 scroll-mt-24">
      <div ref={ref} className="container-page">

        {/* ── Header ── */}
        <div data-reveal className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="eyebrow mb-1 block text-pink-300 font-bold uppercase tracking-widest text-xs">
              Featured Reel &amp; Media
            </span>
            <h2 className="font-display text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl text-white drop-shadow-[0_2px_12px_rgba(255,42,85,0.3)]">
              Watch{' '}
              <span className="text-[var(--color-signal-2)] text-glow">the sky move.</span>
            </h2>
          </div>

          {extraCount > 0 && (
            <button
              onClick={() => setShowAll(true)}
              className="px-5 py-2.5 rounded-full border border-pink-500/40 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 font-mono text-xs font-bold uppercase tracking-wider transition hover:scale-105 active:scale-95"
            >
              View All ({extraCount} more) →
            </button>
          )}
        </div>

        {/* ── Media Grid / Fallback ── */}
        {mediaList.length === 0 ? (
          /* Fallback when no media uploaded */
          <div
            data-reveal
            className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-r from-[#240913]/90 via-[#1a060e]/90 to-[#100308]/90 p-8 sm:p-12 text-center shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />
            <div className="w-12 h-12 bg-pink-500/20 border border-pink-400 text-pink-300 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
              🚁
            </div>
            <span className="eyebrow block text-pink-300 font-bold uppercase tracking-widest text-xs mb-1.5">
              Aerial Display Excellence
            </span>
            <h3 className="font-display text-xl sm:text-3xl font-extrabold uppercase text-white tracking-tight">
              High-Impact Synchronized Drone Light Performances
            </h3>
            <p className="mt-3 max-w-lg mx-auto text-sm text-white/75 leading-relaxed">
              Transforming city skylines into vivid LED canvases — engineered for brand launches, live concerts, and grand celebrations.
            </p>
            <div className="mt-3 font-mono text-xs text-white/35">
              Upload media via <code className="text-pink-300">/admin</code> → Featured Media Reel
            </div>
          </div>
        ) : (
          /*
           * Responsive grid:
           *   Mobile  (< sm) : 1 col — full width cards, easy swipe-scroll
           *   Tablet  (sm)   : 2 cols
           *   Desktop (md+)  : 3 cols
           */
          <div
            data-reveal
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {visibleMedia.map((item, idx) => (
              <MediaCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        )}
      </div>

      {/* View All Sheet */}
      {showAll && (
        <ViewMoreSheet items={mediaList} onClose={() => setShowAll(false)} />
      )}
    </section>
  );
}
