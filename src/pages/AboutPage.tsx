import { Link } from 'react-router-dom';
import { useLang } from '../lib/useLang';
import { translations } from '../translations';
import { pagePath } from '../lib/i18n';
import { PageHead } from '../components/PageHead';
import { Figure } from '../components/Figure';

export const AboutPage = () => {
  const lang = useLang();
  const t = translations[lang];
  const p = t.pages.about;
  return (
    <>
      <PageHead lang={lang} title={p.title} standfirst={p.standfirst} trail={[{ label: p.title }]} photo="taipei" />

      {/* Statement */}
      <section className="section-pad">
        <div className="container-text grid gap-8 lg:grid-cols-12 lg:gap-16">
          <p className="lede lg:col-span-7" data-reveal>{t.about.body1}</p>
          <p className="text-ink-soft lg:col-span-5 lg:pt-2" data-reveal data-reveal-delay="1">{t.about.body2}</p>
        </div>
      </section>

      {/* Who the chamber serves: split with a portrait photograph */}
      <section aria-labelledby="serves" className="bg-wash-soft">
        <div className="container-page grid gap-10 py-16 md:py-20 lg:grid-cols-12 lg:gap-16">
          <Figure slot="port-vertical" lang={lang} className="lg:col-span-4" ratio="3 / 4" ratioMobile="4 / 3" sizes="(min-width: 64rem) 30vw, 100vw" reveal />
          <div className="lg:col-span-8" data-reveal data-reveal-delay="1">
            <h2 id="serves" className="title-section">{t.about.servesHeading}</h2>
            <dl className="mt-8 border-t border-hair">
              {t.about.serves.map((row) => (
                <div key={row.who} className="grid gap-1 border-b border-hair py-5 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-8">
                  <dt className="title-item">{row.who}</dt>
                  <dd className="text-ink-soft">{row.what}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Closing image and invitation */}
      <section className="section-pad">
        <div className="container-page">
          <Figure slot="reception" lang={lang} ratio="21 / 9" sizes="(min-width: 88rem) 80rem, 100vw" reveal />
          <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between" data-reveal>
            <p className="title-item max-w-[40ch]">{t.home.ctaBody}</p>
            <Link to={pagePath(lang, 'contact') + '?topic=membership'} className="btn btn-brick shrink-0 self-start md:self-auto">
              {t.home.ctaHeading}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
