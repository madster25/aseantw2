import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLang } from '../lib/useLang';
import { translations } from '../translations';
import { pagePath } from '../lib/i18n';
import { countries } from '../data/asean/countries';
import { agenciesFor } from '../data/asean';
import { guideBySlug, guideCategoryLabels, guideCategoryOrder, guideText, guides } from '../data/asean/guides';
import { PageHead } from '../components/PageHead';

export const aseanPath = (lang: 'en' | 'zh-tw', rest = '') => `${pagePath(lang, 'asean')}${rest}`;

export const AseanPage = () => {
  const lang = useLang();
  const t = translations[lang];
  const a = t.asean;
  const p = t.pages.asean;
  const all = agenciesFor(lang);
  const countPerCountry = Object.fromEntries(countries.map((c) => [c.code, all.filter((x) => x.country === c.code).length]));
  const cats = guideCategoryOrder.filter((cat) => guides.some((g) => g.category === cat));

  return (
    <>
      <PageHead lang={lang} title={p.title} standfirst={p.standfirst} trail={[{ label: p.title }]} photo="singapore" />

      <div className="container-page pt-12 pb-4 md:pt-16">
        <p className="lede max-w-[52ch]" data-reveal>{a.intro}</p>
        <nav aria-label={a.jumpTo} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-hair py-3 text-[0.9rem] font-medium">
          <span className="text-ink-mute">{a.jumpTo}</span>
          <a href="#asean-countries" className="link inline-block py-2">{a.countriesHeading}</a>
          <a href="#asean-guides" className="link inline-block py-2">{a.guidesHeading}</a>
          <a href="#asean-faq" className="link inline-block py-2">{a.faqHeading}</a>
        </nav>
      </div>

      {/* Countries: two-column index with the country name large */}
      <section id="asean-countries" aria-labelledby="asean-countries-h" className="section-pad">
        <div className="container-page grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 id="asean-countries-h" className="title-section">{a.countriesHeading}</h2>
            <p className="measure-narrow mt-4 text-ink-soft">{a.countriesIntro}</p>
          </div>
          <ul className="grid border-t border-hair sm:grid-cols-2 sm:gap-x-8 lg:col-span-8">
            {countries.map((c) => (
              <li key={c.code} className="border-b border-hair">
                <Link to={aseanPath(lang, `/${c.slug}`)} className="group flex items-baseline justify-between gap-4 py-3.5">
                  <span>
                    <span className="title-item block transition-colors group-hover:text-brick">{c.name[lang]}</span>
                    <span className="block text-[0.85rem] text-ink-mute">{c.officialName[lang]}</span>
                  </span>
                  <span className="shrink-0 text-[0.85rem] tabular-nums text-ink-mute">
                    {countPerCountry[c.code]} {a.agenciesCount}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Guides: on grey, categories as columns */}
      <section id="asean-guides" aria-labelledby="asean-guides-h" className="section-pad bg-wash-soft">
        <div className="container-page">
          <div className="max-w-[60ch]">
            <h2 id="asean-guides-h" className="title-section">{a.guidesHeading}</h2>
            <p className="mt-3 text-ink-soft">{a.guidesIntro}</p>
          </div>
          <div className="mt-8 grid gap-x-10 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
            {cats.map((cat) => (
              <div key={cat}>
                <h3 className="label">{guideCategoryLabels[cat][lang]}</h3>
                <ul className="mt-2 border-t border-ink">
                  {guides.filter((g) => g.category === cat).map((g) => {
                    const gt = guideText(g, lang);
                    return (
                      <li key={g.slug} className="border-b border-hair">
                        <Link to={aseanPath(lang, `/guides/${g.slug}`)} className="group block py-3.5">
                          <span className="block font-medium leading-snug group-hover:text-brick">{gt.title}</span>
                          <span className="mt-1 block text-[0.9rem] text-ink-mute">{g.readingMinutes} {a.readingTime}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="asean-faq" aria-labelledby="asean-faq-h" className="section-pad">
        <div className="container-page grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 id="asean-faq-h" className="title-section">{a.faqHeading}</h2>
            <p className="measure-narrow mt-4 text-ink-soft">{a.faqIntro}</p>
          </div>
          <div className="border-t border-ink lg:col-span-8">
            {a.faq.map((f) => {
              const g = guideBySlug(f.guide);
              return (
                <details key={f.q} className="faq border-b border-hair py-4">
                  <summary>
                    <span className="title-item">{f.q}</span>
                  </summary>
                  <div className="mt-3 text-ink-soft">
                    <p className="measure">{f.a}</p>
                    {g && (
                      <Link to={aseanPath(lang, `/guides/${g.slug}`)} className="more mt-3 text-ink">
                        {a.faqReadGuide}: {guideText(g, lang).title}
                        <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
                      </Link>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      <section aria-label={a.membersLink} className="bg-ink text-white">
        <div className="container-page flex flex-col gap-5 py-10 md:flex-row md:items-center md:justify-between">
          <p className="measure text-[1.1rem] text-white">{a.membersNote}</p>
          <Link to={pagePath(lang, 'contact') + '?topic=membership'} className="btn btn-brick shrink-0 self-start border-white md:self-auto">
            {a.membersLink}
          </Link>
        </div>
      </section>
    </>
  );
};
