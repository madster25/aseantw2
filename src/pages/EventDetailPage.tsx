import { Link, useParams } from 'react-router-dom';
import { useLang } from '../lib/useLang';
import { translations, type Language } from '../translations';
import { pagePath } from '../lib/i18n';
import { eventBySlug, formatEventDate, formatEventRange, type ChamberEvent } from '../data/events';
import { Breadcrumb } from '../components/Breadcrumb';
import { Figure } from '../components/Figure';
import { EventMeta } from '../components/EventCard';
import { NotFoundPage } from './NotFoundPage';

/** The one action that is honest for the event's registration state. */
const Action = ({ event, lang, className = '' }: { event: ChamberEvent; lang: Language; className?: string }) => {
  const t = translations[lang].events;
  const topic = event.category === 'trade-mission' ? 'partnership' : 'events';
  if (event.registration === 'open' && event.registrationUrl) {
    return (
      <a href={event.registrationUrl} className={`btn btn-brick ${className}`} rel="noopener noreferrer" target="_blank">
        {t.actions.openExternal}
      </a>
    );
  }
  const label = event.registration === 'open' ? t.actions.open : t.actions[event.registration];
  return (
    <Link to={`${pagePath(lang, 'contact')}?topic=${topic}&about=${encodeURIComponent(event.slug)}`} className={`btn btn-brick ${className}`}>
      {label}
    </Link>
  );
};

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} aria-labelledby={`${id}-h`} className="border-t border-ink pt-5">
    <h2 id={`${id}-h`} className="title-item">{title}</h2>
    <div className="mt-3">{children}</div>
  </section>
);

export const EventDetailPage = () => {
  const lang = useLang();
  const { slug } = useParams<{ slug: string }>();
  const event = eventBySlug(slug);
  if (!event) return <NotFoundPage />;

  const t = translations[lang];
  const e = t.events;
  const m = event.mission;
  const dateText = formatEventRange(event.date, event.endDate, lang);
  const place = event.location ? event.location[lang] : e.locationUnknown;

  // Mission sections that actually have content, for the in-page index.
  const missionSections: { id: string; title: string }[] = m
    ? [
        { id: 'purpose', title: e.mission.purpose },
        ...(m.whoShouldAttend.length ? [{ id: 'who', title: e.mission.who }] : []),
        ...(m.plannedVisits?.length ? [{ id: 'visits', title: e.mission.visits }] : []),
        ...(m.itinerary?.length ? [{ id: 'itinerary', title: e.mission.itinerary }] : []),
        { id: 'fees', title: e.mission.fees },
        { id: 'apply', title: e.mission.process },
      ]
    : [];

  return (
    <>
      <header className="pt-(--header-h)">
        <div className="container-page pt-8 pb-8 md:pt-12">
          <Breadcrumb
            lang={lang}
            items={[
              { label: t.breadcrumb.home, to: pagePath(lang) },
              { label: t.pages.events.title, to: pagePath(lang, 'events') },
              { label: event.title[lang] },
            ]}
          />
          {event.status === 'sample' && (
            <p role="note" className="mt-6 border border-hair bg-wash-soft px-4 py-3 text-[0.9rem] font-medium">
              {e.sample}: {e.sampleNote}
            </p>
          )}
          <div className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <EventMeta event={event} lang={lang} />
              <h1 className="title-page mt-3">{event.title[lang]}</h1>
              <p className="lede mt-5 max-w-[56ch] text-ink-soft">{event.summary[lang]}</p>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 self-end text-[0.95rem] lg:col-span-4">
              <dt className="font-semibold">{event.endDate ? e.details.dates : e.details.date}</dt>
              <dd><time dateTime={event.date}>{dateText}</time></dd>
              <dt className="font-semibold">{m ? e.mission.destination : e.details.location}</dt>
              <dd>{m ? m.destination[lang] : place}</dd>
              {event.venue && (
                <>
                  <dt className="font-semibold">{e.details.venue}</dt>
                  <dd>{event.venue[lang]}</dd>
                </>
              )}
              <dt className="font-semibold">{e.details.status}</dt>
              <dd>{e.registration[event.registration]}</dd>
              {m?.applicationDeadline && (
                <>
                  <dt className="font-semibold">{e.mission.deadline}</dt>
                  <dd><time dateTime={m.applicationDeadline}>{formatEventDate(m.applicationDeadline, lang)}</time></dd>
                </>
              )}
            </dl>
          </div>
          <div className="mt-6">
            <Action event={event} lang={lang} />
          </div>
        </div>
        {event.photo && (
          <div className="container-page mt-10 md:mt-14">
            <Figure slot={event.photo} lang={lang} ratio="21 / 9" priority caption="overlay" sizes="(min-width: 88rem) 83rem, 100vw" />
          </div>
        )}
      </header>

      <div className="container-page grid gap-10 pt-12 pb-12 md:pt-16 lg:grid-cols-12 lg:gap-16 md:pb-20">
        {/* Index for missions; status note for plain events */}
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            {m ? (
              <nav aria-label={e.mission.onThisPage}>
                <p className="label">{e.mission.onThisPage}</p>
                <ol className="mt-2 border-t border-ink">
                  {missionSections.map((s, i) => (
                    <li key={s.id} className="border-b border-hair">
                      <a href={`#${s.id}`} className="flex min-h-11 items-center gap-3 py-1.5 text-[0.95rem] font-semibold hover:text-brick">
                        <span className="tabular-nums text-brick" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}
            <div className={`${m ? 'mt-8' : ''} hidden border-t border-ink pt-4 lg:block`}>
              <p className="label">{e.details.status}</p>
              <p className="mt-1 font-semibold">{e.registration[event.registration]}</p>
              <p className="mt-2 text-[0.9rem] text-ink-soft">{e.mission.applyNote}</p>
              <Action event={event} lang={lang} className="mt-4 w-full" />
            </div>
          </div>
        </aside>

        <div className="space-y-10 lg:col-span-9">
          {event.body?.length ? (
            <Section id="about" title={e.details.about}>
              <div className="measure space-y-4 text-[1.05rem]">
                {event.body.map((pgh) => <p key={pgh[lang]}>{pgh[lang]}</p>)}
              </div>
            </Section>
          ) : null}

          {m && (
            <>
              <Section id="purpose" title={e.mission.purpose}>
                <p className="lede max-w-[50ch]">{m.purpose[lang]}</p>
                {m.industries.length > 0 && (
                  <>
                    <h3 className="label mt-6">{e.mission.industries}</h3>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {m.industries.map((x) => (
                        <li key={x[lang]} className="border border-ink px-3 py-1.5 text-[0.9rem] font-semibold">{x[lang]}</li>
                      ))}
                    </ul>
                  </>
                )}
              </Section>

              {m.whoShouldAttend.length > 0 && (
                <Section id="who" title={e.mission.who}>
                  <ul className="bullets max-w-[56ch] space-y-1.5">
                    {m.whoShouldAttend.map((x) => <li key={x[lang]}>{x[lang]}</li>)}
                  </ul>
                  {m.eligibility && (
                    <>
                      <h3 className="label mt-5">{e.mission.eligibility}</h3>
                      <p className="measure mt-1 text-ink-soft">{m.eligibility[lang]}</p>
                    </>
                  )}
                </Section>
              )}

              {m.plannedVisits?.length ? (
                <Section id="visits" title={e.mission.visits}>
                  <ol className="max-w-[56ch] border-t border-hair">
                    {m.plannedVisits.map((x, i) => (
                      <li key={x[lang]} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-hair py-3">
                        <span className="numeral text-[1.25rem]" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                        <span>{x[lang]}</span>
                      </li>
                    ))}
                  </ol>
                </Section>
              ) : null}

              {m.itinerary?.length ? (
                <Section id="itinerary" title={e.mission.itinerary}>
                  <ol className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                    {m.itinerary.map((d) => (
                      <li key={d.day[lang]} className="border-t border-ink pt-3">
                        <h3 className="font-semibold">{d.day[lang]}</h3>
                        <ul className="bullets mt-2 space-y-1 text-[0.95rem] text-ink-soft">
                          {d.items.map((x) => <li key={x[lang]}>{x[lang]}</li>)}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </Section>
              ) : null}

              <Section id="fees" title={e.mission.fees}>
                {m.fees ? (
                  <>
                    <p className="text-[1.1rem] font-semibold">{m.fees[lang]}</p>
                    {m.feesIncludes?.length ? (
                      <>
                        <h3 className="label mt-4">{e.mission.feesIncludes}</h3>
                        <ul className="bullets mt-2 max-w-[56ch] space-y-1.5">
                          {m.feesIncludes.map((x) => <li key={x[lang]}>{x[lang]}</li>)}
                        </ul>
                      </>
                    ) : null}
                  </>
                ) : (
                  <p className="measure text-ink-soft">{e.mission.feesNotSupplied}</p>
                )}
              </Section>

              <Section id="apply" title={e.mission.process}>
                {m.applicationDeadline && (
                  <p className="font-semibold">
                    {e.mission.deadline}: <time dateTime={m.applicationDeadline}>{formatEventDate(m.applicationDeadline, lang)}</time>
                  </p>
                )}
                {m.applicationProcess?.length ? (
                  <ol className="mt-3 grid max-w-[60ch] gap-4">
                    {m.applicationProcess.map((x, i) => (
                      <li key={x[lang]} className="grid grid-cols-[2.5rem_1fr] gap-2">
                        <span className="numeral text-[1.5rem]" aria-hidden="true">{i + 1}</span>
                        <span className="pt-1">{x[lang]}</span>
                      </li>
                    ))}
                  </ol>
                ) : null}
                <p className="measure mt-4 text-[0.9rem] text-ink-mute">{e.mission.applyNote}</p>
                <Action event={event} lang={lang} className="mt-5" />
              </Section>
            </>
          )}

          {!m && !event.body?.length && (
            <p className="measure text-ink-soft">{e.mission.applyNote}</p>
          )}

          <p className="border-t border-hair pt-5">
            <Link to={pagePath(lang, 'events')} className="more">{e.backToList}</Link>
          </p>
        </div>
      </div>
    </>
  );
};
