import { photos, type PhotoSlot } from '../data/photos';
import type { Language } from '../translations';

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
  /** Kept for call sites; captions are not rendered. */
  bare?: boolean;
  /** Approximate rendered width for srcset selection, as a sizes attribute. */
  sizes?: string;
  /** Kept for call sites; captions are not rendered. */
  caption?: 'below' | 'overlay';
  /** Enable the slow zoom on hover (used when the figure sits inside a link). */
  zoom?: boolean;
  /** Fade in on scroll. */
  reveal?: boolean;
  revealDelay?: 1 | 2 | 3;
}

/**
 * A photograph from the registry. Alt text is applied; captions and credits are not shown.
 */
export const Figure = ({ slot, lang, className = '', ratio, priority = false, sizes = '100vw', zoom = false, reveal = false, revealDelay, ratioMobile }: FigureProps) => {
  const photo = photos[slot];
  const srcSet = photo.srcSmall ? `${photo.srcSmall} 800w, ${photo.src} ${photo.width}w` : undefined;
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
      </div>
    </figure>
  );
};
