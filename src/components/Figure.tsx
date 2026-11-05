import { photos, type PhotoSlot } from '../data/photos';
import { translations, type Language } from '../translations';

interface FigureProps {
  slot: PhotoSlot;
  lang: Language;
  className?: string;
  /** CSS aspect ratio to crop to, e.g. "16 / 7". Defaults to the image's own ratio. */
  ratio?: string;
  /** A different crop below the lg breakpoint, e.g. "4 / 3" for a portrait that would be too tall on a phone. */
  ratioMobile?: string;
  /** Opening-section images load eagerly; everything else is lazy. */
  priority?: boolean;
  /** Hide the caption. */
  bare?: boolean;
  /** Approximate rendered width for srcset selection, as a sizes attribute. */
  sizes?: string;
  /** Caption placement: below the image, or overlaid on its lower edge (for full-bleed images). */
  caption?: 'below' | 'overlay';
  /** Enable the slow zoom on hover (used when the figure sits inside a link). */
  zoom?: boolean;
  /** Fade in on scroll. */
  reveal?: boolean;
  revealDelay?: 1 | 2 | 3;
}

/**
 * A photograph from the registry with its caption and credit. Temporary assets carry a visible badge
 * so nobody mistakes them for chamber photography.
 */
export const Figure = ({ slot, lang, className = '', ratio, priority = false, bare = false, sizes = '100vw', caption = 'below', zoom = false, reveal = false, revealDelay, ratioMobile }: FigureProps) => {
  const photo = photos[slot];
  const t = translations[lang].a11y;
  const srcSet = photo.srcSmall ? `${photo.srcSmall} 800w, ${photo.src} ${photo.width}w` : undefined;
  const captionText = (
    <>
      {photo.caption[lang]}
      {photo.temporary && <span className="opacity-70"> {t.temporaryNote}</span>}
    </>
  );
  return (
    <figure className={`relative ${className}`} data-reveal={reveal ? '' : undefined} data-reveal-delay={reveal ? revealDelay : undefined}>
      <div
        className={`relative overflow-hidden bg-wash ${zoom ? 'zoom' : ''} ${ratioMobile ? 'aspect-(--rm) lg:aspect-(--r)' : ''}`}
        style={
          ratioMobile
            ? ({ '--rm': ratioMobile, '--r': ratio } as React.CSSProperties)
            : ratio
              ? { aspectRatio: ratio }
              : undefined
        }
      >
        <img
          src={photo.src}
          srcSet={srcSet}
          sizes={sizes}
          width={photo.width}
          height={photo.height}
          alt={photo.alt[lang]}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding={priority ? 'sync' : 'async'}
          className={`block w-full ${ratio ? 'h-full object-cover' : 'h-auto'}`}
        />
        {photo.temporary && (
          <span className="absolute top-3 left-3 bg-ink/80 px-2 py-1 text-[0.68rem] font-semibold tracking-[0.12em] text-white uppercase backdrop-blur-sm">
            {t.temporaryImage}
          </span>
        )}
        {!bare && caption === 'overlay' && (
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-4 pt-10 pb-3 text-[0.8rem] text-white/90 sm:px-6">
            {captionText}
            <span className="block text-white/60">{t.photoCredit}: {photo.credit}</span>
          </figcaption>
        )}
      </div>
      {!bare && caption === 'below' && (
        <figcaption className="mt-3 flex flex-col gap-0.5 text-[0.82rem] leading-relaxed text-ink-mute">
          <span className="text-ink-soft">{captionText}</span>
          <span>{t.photoCredit}: {photo.credit}</span>
        </figcaption>
      )}
    </figure>
  );
};
