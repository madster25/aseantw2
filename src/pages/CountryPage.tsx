import { Link, useParams } from 'react-router-dom';
import { useLang } from '../lib/useLang';
import { translations } from '../translations';
import { pagePath } from '../lib/i18n';
import {
  categoryLabels,
  categoryOrder,
  countries,
  countryBySlug,
  type AgencyCategory,
} from '../data/asean/countries';
import { agenciesForCountry, directoryVerifiedDate, type Agency } from '../data/asean';
import { guideText, guidesForCountry } from '../data/asean/guides';
import { Breadcrumb } from '../components/Breadcrumb';
import { NotFoundPage } from './NotFoundPage';
import { aseanPath } from './AseanPage';

const safeHost = (url: string) => {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const contactHref = (channel: string, value: string) => {
  if (channel === 'email') return `mailto:${value}`;
  if (channel === 'phone') return `tel:${value.replace(/[^\d+]/g, '')}`;
  if (channel === 'url' || channel === 'web_form') return /^https?:\/\//.test(value) ? value : undefined;
  return undefined;
};

const AgencyEntry = ({ agency, lang }: { agency: Agency; lang: 'en' | 'zh-tw' }) => {
  const a = translations[lang].asean;
  return (
    <li className="grid gap-4 border-b border-hair py-6 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-6">
      <h4 className="title-item">{agency.name}</h4>
      {agency.responsibilities && <p className="mt-2 text-ink-soft">{agency.responsibilities}</p>}
      {agency.whenToContact && (
        <p className="measure mt-2 text-[0.95rem] text-ink-soft">
          <span className="font-semibold text-ink">{a.whenToContact}: </span>
          {agency.whenToContact}
        </p>
      )}
      {agency.scope && (
        <p className="measure mt-1 text-[0.95rem] text-ink-soft">
          <span className="font-semibold text-ink">{a.scope}: </span>
          {agency.scope}
        </p>
      )}
      </div>
      <div className="md:col-span-6">
      <p className="text-[0.95rem]">
        <span className="font-semibold text-ink">{a.website}: </span>
        <a href={agency.website} className="link break-all" rel="noopener noreferrer" target="_blank">
          {safeHost(agency.website)}
        </a>
      </p>

      {agency.services.length > 0 && (
        <div className="mt-4">
          <p className="label">{a.services}</p>
          <ul className="mt-1 space-y-2">
            {agency.services.map((s) => (
              <li key={`${s.name}-${s.url}`} className="text-[0.95rem] text-ink-soft">
                <a href={s.url} className="link font-semibold" rel="noopener noreferrer" target="_blank">
                  {s.name}
                </a>
                {s.cost ? <span className="text-ink-mute"> ({a.cost}: {s.cost})</span> : null}
                <span className="block">{s.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {agency.offices.some((o) => o.contacts.length > 0) && (
        <div className="mt-4">
          <p className="label">{a.offices}</p>
          <ul className="mt-1 space-y-3">
            {agency.offices
              .filter((o) => o.contacts.length > 0)
              .map((o) => (
                <li key={o.id} className="text-[0.95rem] text-ink-soft">
                  <span className="font-semibold text-ink">{o.name}</span>
                  {o.hours ? <span> · {a.hours}: {o.hours}</span> : null}
                  <ul className="mt-1 space-y-0.5">
                    {o.contacts.map((c) => {
                      const href = contactHref(c.channel, c.value);
                      return (
                        <li key={`${c.channel}-${c.value}`}>
                          <span className="text-ink-mute">{c.label || a.channel[c.channel]}: </span>
                          {href ? (
                            <a href={href} className="link break-all" {...(href.startsWith('http') ? { rel: 'noopener noreferrer', target: '_blank' } : {})}>
                              {c.value}
                            </a>
                          ) : (
                            <span className="break-words">{c.value}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
          </ul>
        </div>
      )}
      </div>
    </li>
  );
};

export const CountryPage = () => {
  const lang = useLang();
  const { country: slug } = useParams<{ country: string }>();
  const country = countryBySlug(slug);
  if (!country) return <NotFoundPage />;

  const t = translations[lang];
  const a = t.asean;
  const agencies = agenciesForCountry(lang, country.code);
  const relatedGuides = guidesForCountry(country.code);
  const groups: { cat: AgencyCategory; items: Agency[] }[] = categoryOrder
    .map((cat) => ({ cat, items: agencies.filter((x) => (x.categories[0] ?? 'other') === cat) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <header className="pt-(--header-h)">
        <div className="container-page pt-8 pb-10 md:pt-12 md:pb-14">
          <Breadcrumb
            lang={lang}
            items={[
              { label: t.breadcrumb.home, to: pagePath(lang) },
              { label: a.countryBreadcrumb, to: aseanPath(lang) },
              { label: country.name[lang] },
            ]}
          />
          <div className="mt-10 grid gap-4 md:mt-14 lg:grid-cols-12 lg:gap-12">
            <h1 className="title-page lg:col-span-8">{country.name[lang]}</h1>
            <p className="lede text-ink-soft lg:col-span-4 lg:self-end">
              {country.officialName[lang]}
              <span className="mt-1 block text-[1rem] font-normal text-ink-mute">{country.capital[lang]}</span>
            </p>
          </div>
        </div>
      </header>

      <section aria-labelledby="country-agencies" className="pt-12 pb-12 md:pt-16 md:pb-20">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-3">
            <h2 id="country-agencies" className="title-section">{a.countryAgenciesHeading}</h2>
            <p className="measure-narrow mt-4 text-ink-soft">{a.countryAgenciesIntro}</p>
            <p className="mt-5 text-[0.9rem] leading-relaxed text-ink-mute">
              {a.verifiedNote}
              {directoryVerifiedDate ? ` ${a.verifiedOn} ${directoryVerifiedDate}.` : ''}
            </p>

            {groups.length > 1 && (
              <nav aria-label={a.jumpTo} className="mt-6">
                <p className="label">{a.jumpTo}</p>
                <ol className="mt-2 border-t border-ink">
                  {groups.map(({ cat, items }) => (
                    <li key={cat} className="border-b border-hair">
                      <a href={`#cat-${cat}`} className="flex min-h-11 items-center justify-between gap-3 py-1.5 text-[0.95rem] font-semibold hover:text-brick">
                        {categoryLabels[cat][lang]}
                        <span className="text-[0.85rem] font-semibold tabular-nums text-ink-mute">{items.length}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>

          <div className="lg:col-span-9">
            {groups.length === 0 ? (
              <p className="text-ink-soft">—</p>
            ) : (
              groups.map(({ cat, items }) => (
                <div key={cat} id={`cat-${cat}`} className="mb-10 last:mb-0">
                  <h3 className="label">{categoryLabels[cat][lang]}</h3>
                  <ul className="mt-2 border-t border-ink">
                    {items.map((ag) => (
                      <AgencyEntry key={ag.id} agency={ag} lang={lang} />
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <nav aria-label={a.otherCountries} className="container-page pb-12 md:pb-16">
        <p className="label">{a.otherCountries}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {countries
            .filter((c) => c.code !== country.code)
            .map((c) => (
              <li key={c.code}>
                <Link to={aseanPath(lang, `/${c.slug}`)} className="inline-flex min-h-10 items-center border border-ink px-3 text-[0.9rem] font-semibold hover:bg-wash">
                  {c.name[lang]}
                </Link>
              </li>
            ))}
        </ul>
      </nav>

      <section aria-labelledby="country-guides" className="section-pad bg-wash-soft">
        <div className="container-page grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 id="country-guides" className="title-section">{a.countryGuidesHeading}</h2>
          </div>
          <div className="lg:col-span-8">
            {relatedGuides.length === 0 ? (
              <p className="text-ink-soft">{a.noGuides}</p>
            ) : (
              <ul className="border-t border-ink">
                {relatedGuides.map((g) => (
                  <li key={g.slug} className="border-b border-hair">
                    <Link to={aseanPath(lang, `/guides/${g.slug}`)} className="group block py-4">
                      <span className="block title-item group-hover:text-brick">
                        {guideText(g, lang).title}
                      </span>
                      <span className="mt-1 block text-[0.95rem] text-ink-soft">{guideText(g, lang).standfirst}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
