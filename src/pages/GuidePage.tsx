import { Link, useParams } from 'react-router-dom';
import { useLang } from '../lib/useLang';
import { translations } from '../translations';
import { pagePath } from '../lib/i18n';
import { countryByCode } from '../data/asean/countries';
import { guideBySlug, guideCategoryLabels, guideText, guides } from '../data/asean/guides';
import { Breadcrumb } from '../components/Breadcrumb';
import { Markdown } from '../components/Markdown';
import { NotFoundPage } from './NotFoundPage';
import { aseanPath } from './AseanPage';

const safeHost = (url: string) => {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export const GuidePage = () => {
  const lang = useLang();
  const { slug } = useParams<{ slug: string }>();
  const guide = guideBySlug(slug);
  if (!guide) return <NotFoundPage />;

  const t = translations[lang];
  const a = t.asean;
  const gt = guideText(guide, lang);
  const more = guides.filter((g) => g.slug !== guide.slug && g.category === guide.category).slice(0, 3);
  const fallback = guides.filter((g) => g.slug !== guide.slug).slice(0, 3);
  const suggestions = more.length ? more : fallback;

  return (
    <>
      <header className="pt-(--header-h)">
        <div className="container-page pt-8 pb-10 md:pt-12 md:pb-14">
          <Breadcrumb
            lang={lang}
            items={[
              { label: t.breadcrumb.home, to: pagePath(lang) },
              { label: a.countryBreadcrumb, to: aseanPath(lang) },
              { label: gt.title },
            ]}
          />
          <div className="mt-10 md:mt-14">
            <p className="label">{guideCategoryLabels[guide.category][lang]}</p>
            <h1 className="title-page mt-3 max-w-[22ch]">{gt.title}</h1>
            <p className="lede mt-6 max-w-[60ch] text-ink-soft">{gt.standfirst}</p>
            <p className="mt-4 text-[0.9rem] font-semibold text-ink-mute">
              {guide.readingMinutes} {a.readingTime} · {a.guidePrepared} {guide.preparedAt}
            </p>
          </div>
        </div>
      </header>

      <article className="pt-12 pb-12 md:pt-16 md:pb-20">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <div className="measure-prose">
              <Markdown source={gt.body} lang={lang} />
            </div>
            <p className="mt-10 border-t border-hair pt-5 text-[0.9rem] leading-relaxed text-ink-mute">{a.guideNote}</p>
          </div>

          <aside className="space-y-8 border-t border-ink pt-5 lg:col-span-4 lg:border-t-0 lg:pt-0" aria-label={a.guideSources}>
            <div>
              <h2 className="label">{a.guideMarkets}</h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {guide.countries.map((code) => {
                  const c = countryByCode(code);
                  return c ? (
                    <li key={code}>
                      <Link to={aseanPath(lang, `/${c.slug}`)} className="inline-flex min-h-10 items-center border border-ink px-3 text-[0.9rem] font-semibold hover:bg-wash">
                        {c.name[lang]}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>

            {guide.sources.length > 0 && (
              <div>
                <h2 className="label">{a.guideSources}</h2>
                <ul className="mt-2 space-y-2 text-[0.95rem]">
                  {guide.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} className="link" rel="noopener noreferrer" target="_blank">
                        {s.title}
                      </a>
                      <span className="block text-[0.85rem] text-ink-mute">{safeHost(s.url)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h2 className="label">{a.guideMore}</h2>
              <ul className="mt-2 space-y-2">
                {suggestions.map((g) => (
                  <li key={g.slug}>
                    <Link to={aseanPath(lang, `/guides/${g.slug}`)} className="link">
                      {guideText(g, lang).title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to={aseanPath(lang)} className="link font-semibold">
                    {a.allGuides}
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
};
