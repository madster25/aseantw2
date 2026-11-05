import { Link } from 'react-router-dom';
import { useLang } from '../lib/useLang';
import { translations } from '../translations';
import { pagePath } from '../lib/i18n';
import { allEvents, splitEvents } from '../data/events';
import { guides, guideText } from '../data/asean/guides';
import { photos } from '../data/photos';
import { EventCard } from '../components/EventCard';
import { Figure } from '../components/Figure';
import { aseanPath } from './AseanPage';

export const HomePage = () => {
  const lang = useLang();
  const t = translations[lang];
  const { upcoming, past } = splitEvents(allEvents, new Date());
  const featured = guides.slice(0, 3);
  const lead = photos['home-lead'];

  return (
    <>
      {/* Hero: full-bleed photograph with the headline set over its lower half */}
      <section aria-labelledby="hero-title" className="relative isolate min-h-[88svh] overflow-hidden bg-ink text-white">
        <img
          src={lead.src}
          srcSet={lead.srcSmall ? `${lead.srcSmall} 800w, ${lead.src} ${lead.width}w` : undefined}
          sizes="100vw"
          width={lead.width}
          height={lead.height}
          alt={lead.alt[lang]}
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/20" />
        <div className="container-page flex min-h-[88svh] flex-col justify-end pt-(--header-h) pb-10 md:pb-16">
          <p className="label !text-white/80" data-reveal>{t.hero.kicker}</p>
          <h1 id="hero-title" className="display mt-4 max-w-[16ch] text-white" data-reveal data-reveal-delay="1">
            {t.hero.title}
          </h1>
          <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-end" data-reveal data-reveal-delay="2">
            <p className="lede max-w-[46ch] !text-white/85 md:col-span-7">{t.hero.lede}</p>
            <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
              <Link to={pagePath(lang, 'contact') + '?topic=membership'} className="btn btn-brick">
                {t.hero.primary}
              </Link>
              <Link to={pagePath(lang, 'membership')} className="btn btn-light">
                {t.hero.secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Economies strip */}
      <section aria-label={t.hero.panelHeading} className="border-b border-hair">
        <div className="container-page flex flex-col gap-3 py-6 md:flex-row md:items-baseline md:gap-10">
          <h2 className="label shrink-0">{t.hero.panelHeading}</h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[0.9rem] font-medium text-ink-soft">
            {t.economies.map((name, i) => (
              <li key={name} className={i === 0 ? 'text-brick' : ''}>{name}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* What the chamber does: split, statement left, portrait photograph right */}
      <section aria-labelledby="home-about" className="section-pad">
        <div className="container-page grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7" data-reveal>
            <h2 id="home-about" className="label">{t.about.heading}</h2>
            <p className="title-section mt-5 max-w-[26ch]">{t.about.body1}</p>
            <ul className="mt-8 grid gap-x-8 border-t border-hair sm:grid-cols-2">
              {t.about.serves.map((row) => (
                <li key={row.who} className="border-b border-hair py-3 text-[0.95rem] font-medium">
                  {row.who}
                </li>
              ))}
            </ul>
            <Link to={pagePath(lang, 'about')} className="more mt-6">{t.home.aboutLink}</Link>
          </div>
          <Figure slot="taipei" lang={lang} className="lg:col-span-5" ratio="4 / 5" ratioMobile="4 / 3" sizes="(min-width: 64rem) 36vw, 100vw" reveal />
        </div>
      </section>

      {/* Coming up: feature or honest empty state, on a soft ground */}
      <section aria-labelledby="home-events" className="section-pad bg-wash-soft">
        <div className="container-page">
          <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between" data-reveal>
            <h2 id="home-events" className="title-section">{t.home.eventsFeatured}</h2>
            <Link to={pagePath(lang, 'events')} className="more self-start">{t.home.eventsLink}</Link>
          </div>
          <div className="mt-10" data-reveal data-reveal-delay="1">
            {upcoming.length > 0 ? (
              <>
                <EventCard event={upcoming[0]} lang={lang} variant="feature" />
                {upcoming.length > 1 && (
                  <div className="mt-6 grid gap-x-10 md:grid-cols-2">
                    {upcoming.slice(1, 3).map((ev) => (
                      <EventCard key={ev.slug} event={ev} lang={lang} variant="row" />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                <Figure slot="exhibition" lang={lang} className="lg:col-span-7" ratio="16 / 9" sizes="(min-width: 64rem) 55vw, 100vw" />
                <div className="lg:col-span-5">
                  <p className="title-item">{t.events.emptyTitle}</p>
                  <p className="measure-narrow mt-3 text-ink-soft">{t.events.emptyBody}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to={pagePath(lang, 'contact') + '?topic=events'} className="btn btn-brick">{t.events.emptyCta}</Link>
                    {past.length > 0 && (
                      <Link to={pagePath(lang, 'events') + '?view=past'} className="btn btn-line">{t.home.eventsPastLink}</Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Membership: four services as a numbered register beside a vertical photograph */}
      <section aria-labelledby="home-membership" className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Figure slot="reception" lang={lang} className="order-last lg:order-first lg:col-span-5" ratio="4 / 5" ratioMobile="4 / 3" sizes="(min-width: 64rem) 36vw, 100vw" reveal />
          <div className="lg:col-span-7" data-reveal data-reveal-delay="1">
            <h2 id="home-membership" className="title-section">{t.home.membershipHeading}</h2>
            <ol className="mt-8 border-t border-hair">
              {t.benefits.items.map((item, i) => (
                <li key={item.title} className="grid gap-1 border-b border-hair py-5 sm:grid-cols-[3rem_1fr] sm:gap-4">
                  <span className="numeral text-[1.1rem] pt-1" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="title-item">{item.title}</h3>
                    <p className="mt-1.5 max-w-[56ch] text-[0.98rem] text-ink-soft">{item.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link to={pagePath(lang, 'membership')} className="more mt-6">{t.home.membershipLink}</Link>
          </div>
        </div>
      </section>

      {/* Region: full-width photograph, then the guides */}
      <section aria-labelledby="home-asean" className="bg-ink text-white">
        <Figure slot="ho-chi-minh" lang={lang} ratio="21 / 9" caption="overlay" sizes="100vw" />
        <div className="container-page grid gap-10 py-16 md:py-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5" data-reveal>
            <h2 id="home-asean" className="title-section text-white">{t.home.aseanHeading}</h2>
            <p className="measure-narrow mt-4 text-white/75">{t.home.aseanBody}</p>
            <Link to={pagePath(lang, 'asean')} className="btn btn-light mt-7">{t.home.aseanLink}</Link>
          </div>
          <div className="lg:col-span-7" data-reveal data-reveal-delay="1">
            <h3 className="label !text-white/70">{t.home.guidesLabel}</h3>
            <ul className="mt-4 border-t border-white/20">
              {featured.map((g) => {
                const gt = guideText(g, lang);
                return (
                  <li key={g.slug} className="border-b border-white/20">
                    <Link to={aseanPath(lang, `/guides/${g.slug}`)} className="group block py-5 transition-colors hover:text-white">
                      <span className="title-item block text-white group-hover:underline group-hover:decoration-brick group-hover:underline-offset-4">{gt.title}</span>
                      <span className="mt-1.5 block text-[0.95rem] text-white/70">{gt.standfirst}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Opportunities: three photographs, then the standfirst */}
      <section aria-labelledby="home-opportunities" className="section-pad">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-3" data-reveal>
            <Figure slot="factory" lang={lang} ratio="4 / 3" bare sizes="(min-width: 48rem) 33vw, 100vw" />
            <Figure slot="singapore" lang={lang} ratio="4 / 3" bare sizes="(min-width: 48rem) 33vw, 100vw" />
            <Figure slot="port-vertical" lang={lang} ratio="4 / 3" bare sizes="(min-width: 48rem) 33vw, 100vw" />
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-16" data-reveal>
            <h2 id="home-opportunities" className="label lg:col-span-3">{t.opportunities.heading}</h2>
            <div className="lg:col-span-9">
              <p className="lede md:title-section md:max-w-[30ch]">{t.opportunities.standfirst}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {t.opportunities.themes.map((theme) => (
                  <li key={theme.title} className="border border-hair px-3 py-1.5 text-[0.85rem] font-medium text-ink-soft">{theme.title}</li>
                ))}
              </ul>
              <Link to={pagePath(lang, 'opportunities')} className="more mt-7">{t.home.opportunitiesLink}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section aria-labelledby="home-cta" className="bg-brick text-white">
        <div className="container-page flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between md:py-20" data-reveal>
          <div className="max-w-[44ch]">
            <h2 id="home-cta" className="title-section text-white">{t.home.ctaHeading}</h2>
            <p className="mt-3 text-white/85">{t.home.ctaBody}</p>
          </div>
          <Link to={pagePath(lang, 'contact') + '?topic=membership'} className="btn btn-light shrink-0 self-start md:self-auto">
            {t.home.contactLink}
          </Link>
        </div>
      </section>
    </>
  );
};
