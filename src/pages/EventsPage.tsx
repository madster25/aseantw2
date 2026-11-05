import { Link, useSearchParams } from 'react-router-dom';
import { useLang } from '../lib/useLang';
import { translations } from '../translations';
import { pagePath } from '../lib/i18n';
import { allEvents, eventCategories, splitEvents, type EventCategory } from '../data/events';
import { PageHead } from '../components/PageHead';
import { EventCard } from '../components/EventCard';
import { Figure } from '../components/Figure';

type View = 'upcoming' | 'past';
const isCategory = (v: string | null): v is EventCategory => eventCategories.includes(v as EventCategory);

/**
 * Listing. The view (upcoming / past) and the type filter live in the URL (?view=past&type=forum) so
 * that the state survives a reload, can be linked to, and is carried across the language switch.
 */
export const EventsPage = () => {
  const lang = useLang();
  const t = translations[lang];
  const e = t.events;
  const p = t.pages.events;
  const [params, setParams] = useSearchParams();
  const view: View = params.get('view') === 'past' ? 'past' : 'upcoming';
  const type = isCategory(params.get('type')) ? (params.get('type') as EventCategory) : null;

  const { upcoming, past } = splitEvents(allEvents, new Date());
  const source = view === 'upcoming' ? upcoming : past;
  const items = type ? source.filter((x) => x.category === type) : source;
  const countOf = (cat: EventCategory | null) => (cat ? source.filter((x) => x.category === cat).length : source.length);

  const setQuery = (next: { view?: View; type?: EventCategory | null }) => {
    const q = new URLSearchParams(params);
    const v = next.view ?? view;
    const ty = next.type === undefined ? type : next.type;
    if (v === 'past') q.set('view', 'past'); else q.delete('view');
    if (ty) q.set('type', ty); else q.delete('type');
    setParams(q, { preventScrollReset: true });
  };
  const href = (v: View, ty: EventCategory | null) => {
    const q = new URLSearchParams();
    if (v === 'past') q.set('view', 'past');
    if (ty) q.set('type', ty);
    const qs = q.toString();
    return `${pagePath(lang, 'events')}${qs ? `?${qs}` : ''}`;
  };

  const hasAnyPast = past.length > 0;

  return (
    <>
      <PageHead lang={lang} title={p.title} standfirst={p.standfirst} trail={[{ label: p.title }]} photo="seminar" />

      <div className="container-page">
        {/* View switch and type filter */}
        <div className="mt-10 flex flex-col gap-4 border-b border-hair py-4 md:mt-14 md:flex-row md:items-center md:justify-between">
          <nav aria-label={e.heading} className="flex gap-1">
            {(['upcoming', 'past'] as View[]).map((v) => (
              <Link
                key={v}
                to={href(v, type)}
                onClick={(ev) => { ev.preventDefault(); setQuery({ view: v }); }}
                aria-current={view === v ? 'page' : undefined}
                className={`inline-flex min-h-11 items-center px-4 text-[0.9rem] font-medium transition-colors ${view === v ? 'bg-ink text-white' : 'hover:bg-wash-soft'}`}
              >
                {e.views[v]}
                <span className="ml-2 text-[0.75rem] opacity-70">{v === 'upcoming' ? upcoming.length : past.length}</span>
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={e.filterLabel}>
            <span className="mr-1 label !text-ink-mute">{e.filterLabel}</span>
            {([null, ...eventCategories] as (EventCategory | null)[]).map((cat) => {
              const active = type === cat;
              return (
                <Link
                  key={cat ?? 'all'}
                  to={href(view, cat)}
                  onClick={(ev) => { ev.preventDefault(); setQuery({ type: cat }); }}
                  aria-pressed={active}
                  className={`inline-flex min-h-10 items-center gap-2 border px-3.5 text-[0.85rem] font-medium transition-colors ${
                    active ? 'border-brick bg-brick text-white' : 'border-hair hover:border-ink'
                  }`}
                >
                  {cat ? e.categoriesPlural[cat] : e.all}
                  <span className={`text-[0.8rem] tabular-nums ${active ? 'text-white/80' : 'text-ink-mute'}`}>{countOf(cat)}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <p className="sr-only" role="status">{e.count(items.length)}</p>

        {view === 'past' && hasAnyPast && (
          <p className="mt-4 max-w-[70ch] text-[0.9rem] text-ink-mute">{e.pastNote}</p>
        )}

        {/* Listings */}
        {items.length === 0 ? (
          <div className="grid gap-8 py-10 lg:grid-cols-12 lg:gap-12 md:py-14">
            <div className="lg:col-span-6">
              <p className="title-section">
                {view === 'past' ? e.emptyPastTitle : type ? e.emptyFilteredTitle : e.emptyTitle}
              </p>
              <p className="measure mt-4 text-ink-soft">{type ? e.emptyFilteredBody : e.emptyBody}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {type && (
                  <Link to={href(view, null)} onClick={(ev) => { ev.preventDefault(); setQuery({ type: null }); }} className="btn btn-line">
                    {e.clearFilter}
                  </Link>
                )}
                <Link to={pagePath(lang, 'contact') + '?topic=events'} className="btn btn-brick">
                  {e.emptyCta}
                </Link>
              </div>
            </div>
            {view === 'upcoming' && (
              <Figure slot="reception" lang={lang} className="lg:col-span-6" ratio="3 / 2" sizes="(min-width: 64rem) 45vw, 100vw" />
            )}
          </div>
        ) : (
          <div className="py-10 md:py-14">
            {view === 'upcoming' ? (
              <>
                <EventCard event={items[0]} lang={lang} variant="feature" as="h2" />
                {items.length > 1 && (
                  <div className="mt-10">
                    {items.slice(1).map((ev) => (
                      <EventCard key={ev.slug} event={ev} lang={lang} variant="row" as="h2" />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="max-w-[72ch]">
                {items.map((ev) => (
                  <EventCard key={ev.slug} event={ev} lang={lang} variant="compact" as="h2" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cross-links between views */}
        <p className="border-t border-hair py-5 text-[0.95rem]">
          {view === 'upcoming' && hasAnyPast && (
            <Link to={href('past', type)} onClick={(ev) => { ev.preventDefault(); setQuery({ view: 'past' }); }} className="more">
              {t.home.eventsPastLink}
            </Link>
          )}
          {view === 'past' && (
            <Link to={href('upcoming', type)} onClick={(ev) => { ev.preventDefault(); setQuery({ view: 'upcoming' }); }} className="more">
              {e.views.upcoming}
            </Link>
          )}
        </p>
      </div>

      {/* What the four types are, with images */}
      <section aria-labelledby="ev-types" className="section-pad bg-wash-soft">
        <div className="container-page">
          <h2 id="ev-types" className="title-section">{e.typesHeading}</h2>
          <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
            {(
              [
                ['trade-mission', 'factory', '16 / 10'],
                ['networking', 'reception', '16 / 10'],
                ['forum', 'seminar', '16 / 10'],
                ['exhibition', 'exhibition', '16 / 10'],
              ] as const
            ).map(([cat, slot, ratio]) => (
              <div key={cat}>
                <Figure slot={slot} lang={lang} ratio={ratio} bare zoom sizes="(min-width: 80rem) 22vw, (min-width: 48rem) 45vw, 100vw" />
                <h3 className="title-item mt-4">{e.categoriesPlural[cat]}</h3>
                <Link to={href('upcoming', cat)} onClick={(ev) => { ev.preventDefault(); setQuery({ view: 'upcoming', type: cat }); window.scrollTo({ top: 0 }); }} className="more mt-1 text-[0.95rem]">
                  {e.upcomingOf(e.categoriesPlural[cat])}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
