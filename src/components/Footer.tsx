import { Link, useLocation } from 'react-router-dom';
import { translations, type Language } from '../translations';
import { otherLanguage, pagePath, switchPath, type PageSlug } from '../lib/i18n';

export const Footer = ({ lang }: { lang: Language }) => {
  const t = translations[lang];
  const location = useLocation();
  const other = otherLanguage(lang);
  const year = new Date().getFullYear();

  const sections: { id: PageSlug; label: string }[] = [
    { id: 'about', label: t.nav.about },
    { id: 'membership', label: t.nav.membership },
    { id: 'events', label: t.nav.events },
    { id: 'opportunities', label: t.nav.opportunities },
    { id: 'asean', label: t.nav.asean },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <footer className="rule-top-thin mt-16 bg-white md:mt-24">
      <div className="container-page pt-12 pb-8 md:pt-16">
        {/* Colophon wordmark */}
        <p
          aria-hidden="true"
          lang="zh-TW"
          className="select-none overflow-hidden whitespace-nowrap text-[clamp(2.4rem,10vw,8.5rem)] leading-none font-bold tracking-[0.04em] text-ink/90"
        >
          東協台灣商會
        </p>

        <div className="mt-12 grid gap-10 border-t border-hair pt-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-lg font-semibold tracking-[-0.01em]">{t.org.name}</p>
            <p lang={lang === 'en' ? 'zh-TW' : 'en'} className="text-ink-mute">
              {t.org.nameAlt}
            </p>
            <p className="measure-narrow mt-4 text-[0.95rem] text-ink-soft">{t.footer.about}</p>
          </div>

          <nav aria-label={t.a11y.footerNav} className="md:col-span-4">
            <h2 className="label block">{t.footer.sectionsHeading}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <Link to={pagePath(lang, s.id)} className="inline-block py-1 font-medium transition-colors hover:text-brick">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="label block">{t.footer.contactHeading}</h2>
            <p className="mt-4 text-[0.95rem] text-ink-soft">{t.footer.contactNote}</p>
            <Link to={pagePath(lang, 'contact')} className="more mt-3">
              {t.footer.enquiryLink}
            </Link>
            <h2 className="label mt-8 block">{t.footer.languagesHeading}</h2>
            <p className="mt-2 text-[0.95rem]">
              <span aria-current="true" className="font-semibold">
                {t.meta.langLabel}
              </span>
              <span aria-hidden="true" className="mx-2 text-hair">|</span>
              <Link
                to={switchPath(other, location.pathname, location.hash, location.search)}
                lang={other === 'en' ? 'en' : 'zh-TW'}
                hrefLang={other === 'en' ? 'en' : 'zh-TW'}
                className="link inline-block py-2"
              >
                {translations[other].meta.langLabel}
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-hair pt-6 text-[0.82rem] text-ink-mute md:flex-row md:justify-between">
          <p>
            © {year} {t.footer.copyright}. {t.footer.rights}
          </p>
          <p>{t.footer.noteSample}</p>
        </div>
      </div>
    </footer>
  );
};
