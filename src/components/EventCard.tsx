import { Link } from 'react-router-dom';
import { translations, type Language } from '../translations';
import { pagePath } from '../lib/i18n';
import { formatEventRange, type ChamberEvent } from '../data/events';
import { photos } from '../data/photos';

export const eventPath = (lang: Language, slug: string) => `${pagePath(lang, 'events')}/${slug}`;

/** Small type and status line used on cards and detail pages. */
export const EventMeta = ({ event, lang, className = '' }: { event: ChamberEvent; lang: Language; className?: string }) => {
  const t = translations[lang].events;
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] font-medium ${className}`}>
      <span className="label">{t.categories[event.category]}</span>
      {event.status === 'supplied-unverified' && <span className="text-ink-mute">{t.unverified}</span>}
      {event.status === 'sample' && <span className="bg-ink px-1.5 py-0.5 text-white">{t.sample}</span>}
    </p>
  );
};

const Thumb = ({ event, lang, ratio }: { event: ChamberEvent; lang: Language; ratio: string }) => {
  const photo = event.photo ? photos[event.photo] : undefined;
  const t = translations[lang].a11y;
  if (!photo) {
    // No image: a typographic block with the date so listings stay visually consistent without faking a photo.
    const [, m, d] = event.date.split('-');
    return (
      <div className="flex items-end bg-wash p-4" style={{ aspectRatio: ratio }} aria-hidden="true">
        <span className="numeral text-[3rem] leading-none">
          {d}
          <span className="block text-[1rem] font-semibold text-ink">{m}</span>
        </span>
      </div>
    );
  }
  return (
    <div className="zoom relative bg-wash" style={{ aspectRatio: ratio }}>
      <img
        src={photo.src}
        srcSet={photo.srcSmall ? `${photo.srcSmall} 800w, ${photo.src} ${photo.width}w` : undefined}
        sizes="(min-width: 64rem) 40vw, 100vw"
        width={photo.width}
        height={photo.height}
        alt={photo.alt[lang]}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
      {photo.temporary && (
        <span className="absolute top-2 left-2 bg-ink/85 px-2 py-1 text-[0.72rem] font-semibold tracking-wide text-white uppercase">
          {t.temporaryImage}
        </span>
      )}
    </div>
  );
};

/**
 * Listing entry. `variant` controls the composition:
 *   feature  image on the left, large title, used for the first upcoming item
 *   row      image thumbnail, title and meta in a ruled row
 *   compact  no image, used for past records
 */
export const EventCard = ({ event, lang, variant = 'row', as: Title = 'h3' }: { event: ChamberEvent; lang: Language; variant?: 'feature' | 'row' | 'compact'; as?: 'h2' | 'h3' }) => {
  const t = translations[lang].events;
  const to = eventPath(lang, event.slug);
  const dateText = formatEventRange(event.date, event.endDate, lang);
  const place = event.location ? event.location[lang] : t.locationUnknown;
  const action = event.category === 'trade-mission' ? t.viewMission : t.viewDetails;

  if (variant === 'feature') {
    return (
      <article className="group grid gap-6 lg:grid-cols-12 lg:gap-12">
        <Link to={to} className="block lg:col-span-7" tabIndex={-1} aria-hidden="true">
          <Thumb event={event} lang={lang} ratio="16 / 9" />
        </Link>
        <div className="flex flex-col lg:col-span-5">
          <EventMeta event={event} lang={lang} />
          <Title className="title-section mt-3">
            <Link to={to} className="hover:text-brick">{event.title[lang]}</Link>
          </Title>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.95rem]">
            <dt className="font-semibold">{event.endDate ? t.details.dates : t.details.date}</dt>
            <dd><time dateTime={event.date}>{dateText}</time></dd>
            <dt className="font-semibold">{t.details.location}</dt>
            <dd>{place}</dd>
            <dt className="font-semibold">{t.details.status}</dt>
            <dd>{t.registration[event.registration]}</dd>
          </dl>
          <p className="mt-4 text-ink-soft">{event.summary[lang]}</p>
          <Link to={to} className="more mt-auto self-start pt-4">{action}</Link>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="grid gap-2 border-t border-hair py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
        <time dateTime={event.date} className="text-[0.95rem] font-semibold text-ink-soft">{dateText}</time>
        <div>
          <EventMeta event={event} lang={lang} />
          <Title className="mt-1 title-item">
            <Link to={to} className="hover:text-brick">{event.title[lang]}</Link>
          </Title>
          <p className="mt-1 text-[0.95rem] text-ink-soft">{place}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="group grid gap-5 border-t border-hair py-8 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <Link to={to} className="block" tabIndex={-1} aria-hidden="true">
        <Thumb event={event} lang={lang} ratio="3 / 2" />
      </Link>
      <div className="flex flex-col">
        <EventMeta event={event} lang={lang} />
        <Title className="mt-2 title-item">
          <Link to={to} className="hover:text-brick">{event.title[lang]}</Link>
        </Title>
        <p className="mt-2 text-[0.95rem]">
          <time dateTime={event.date} className="font-semibold">{dateText}</time>
          <span className="text-ink-soft"> · {place}</span>
        </p>
        <p className="mt-1 text-[0.95rem] text-ink-soft">{t.registration[event.registration]}</p>
        <Link to={to} className="more mt-3 self-start">{action}</Link>
      </div>
    </article>
  );
};
