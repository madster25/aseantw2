import { Link } from 'react-router-dom';
import { useLang } from '../lib/useLang';
import { translations } from '../translations';
import { pagePath } from '../lib/i18n';
import { PageHead } from '../components/PageHead';
import { Figure } from '../components/Figure';

export const OpportunitiesPage = () => {
  const lang = useLang();
  const t = translations[lang];
  const p = t.pages.opportunities;
  const o = t.opportunities;
  return (
    <>
      <PageHead lang={lang} title={p.title} standfirst={p.standfirst} trail={[{ label: p.title }]} photo="factory" />

      {/* Standfirst and body */}
      <section className="section-pad">
        <div className="container-text">
          <h2 className="title-section max-w-[24ch]" data-reveal>{o.heading}</h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-16">
            <p className="lede lg:col-span-7" data-reveal>{o.standfirst}</p>
            <p className="text-ink-soft lg:col-span-5 lg:pt-2" data-reveal data-reveal-delay="1">{o.body}</p>
          </div>
        </div>
      </section>

      {/* Themes: numbered list beside a photograph */}
      <section aria-labelledby="themes" className="bg-wash-soft">
        <div className="container-page grid gap-10 py-16 md:py-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7" data-reveal>
            <h2 id="themes" className="title-section">{o.themesHeading}</h2>
            <ol className="mt-8 border-t border-hair">
              {o.themes.map((theme, i) => (
                <li key={theme.title} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-hair py-5">
                  <span className="numeral pt-1 text-[1.1rem]" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="title-item">{theme.title}</h3>
                    <p className="mt-1.5 max-w-[56ch] text-ink-soft">{theme.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-[0.85rem] text-ink-mute">{o.themesNote}</p>
          </div>
          <Figure slot="ho-chi-minh" lang={lang} className="lg:col-span-5" ratio="4 / 5" ratioMobile="4 / 3" sizes="(min-width: 64rem) 36vw, 100vw" reveal revealDelay={1} />
        </div>
      </section>

      {/* Region in pictures, then the ASEAN guides lead-in */}
      <section aria-labelledby="opp-asean" className="section-pad">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-12" data-reveal>
            <Figure slot="jakarta" lang={lang} className="md:col-span-5" ratio="3 / 2" sizes="(min-width: 48rem) 40vw, 100vw" />
            <Figure slot="bangkok" lang={lang} className="md:col-span-4" ratio="3 / 2" sizes="(min-width: 48rem) 33vw, 100vw" />
            <Figure slot="kuala-lumpur" lang={lang} className="md:col-span-3" ratio="3 / 2" sizes="(min-width: 48rem) 25vw, 100vw" />
          </div>
          <div className="mt-14 flex flex-col gap-6 border-t border-hair pt-10 md:flex-row md:items-end md:justify-between" data-reveal>
            <div>
              <h2 id="opp-asean" className="title-section">{o.guidesHeading}</h2>
              <p className="measure mt-3 text-ink-soft">{o.guidesBody}</p>
            </div>
            <Link to={pagePath(lang, 'asean')} className="btn btn-ink shrink-0">{t.home.aseanLink}</Link>
          </div>
        </div>
      </section>
    </>
  );
};
