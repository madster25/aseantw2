import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { translations, type Language } from '../translations';
import { otherLanguage, pagePath, switchPath, type PageSlug } from '../lib/i18n';
import { Logo } from './Logo';

const shortLabel = (l: Language) => (l === 'en' ? 'EN' : '繁中');

/** Segmented language control: the current language is a plain marked label, the other is a link. */
const LangToggle = ({ lang }: { lang: Language }) => {
  const t = translations[lang];
  const location = useLocation();
  const other = otherLanguage(lang);
  return (
    <div role="group" aria-label={t.a11y.languageSwitch} className="inline-flex whitespace-nowrap border border-hair text-[0.8rem] font-semibold tracking-wide">
      <span aria-current="true" className="inline-flex min-h-10 items-center bg-ink px-3.5 text-white">
        {shortLabel(lang)}
      </span>
      <Link
        to={switchPath(other, location.pathname, location.hash, location.search)}
        lang={other === 'en' ? 'en' : 'zh-TW'}
        hrefLang={other === 'en' ? 'en' : 'zh-TW'}
        aria-label={t.meta.switchTo}
        className="inline-flex min-h-10 items-center px-3.5 transition-colors hover:bg-wash-soft"
      >
        {shortLabel(other)}
      </Link>
    </div>
  );
};

export const Header = ({ lang }: { lang: Language }) => {
  const t = translations[lang];
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const navItems: { id: PageSlug; label: string }[] = [
    { id: 'about', label: t.nav.about },
    { id: 'membership', label: t.nav.membership },
    { id: 'events', label: t.nav.events },
    { id: 'opportunities', label: t.nav.opportunities },
    { id: 'contact', label: t.nav.contact },
  ];

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Escape closes; focus moves into the panel on open and is kept within it.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'Tab') {
        const items = [toggleRef.current, ...focusables()].filter(Boolean) as HTMLElement[];
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 80rem)');
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-(--header-h) border-b border-hair bg-white/95 backdrop-blur-sm">
      <div className="container-page flex h-full items-stretch justify-between gap-3">
        <Link
          to={pagePath(lang)}
          className="flex min-w-0 items-center gap-3"
          aria-label={t.org.name}
          onClick={() => setOpen(false)}
        >
          <Logo size={38} />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate text-[1rem] font-semibold tracking-[-0.01em]">
              <span className="sm:hidden">{t.org.shortName}</span>
              <span className="hidden sm:inline">{t.org.name}</span>
            </span>
            <span lang={lang === 'en' ? 'zh-TW' : 'en'} className="mt-1 truncate text-[0.78rem] font-medium text-ink-mute">
              {t.org.nameAlt}
            </span>
          </span>
        </Link>

        <nav aria-label={t.a11y.primaryNav} className="hidden items-stretch xl:flex">
          <ul className="flex items-stretch">
            {navItems.map((item) => (
              <li key={item.id} className="flex">
                <NavLink
                  to={pagePath(lang, item.id)}
                  className={({ isActive }) =>
                    `group relative flex items-center whitespace-nowrap px-3.5 text-[0.9rem] font-medium transition-colors hover:text-brick ${
                      isActive ? 'text-ink' : 'text-ink-soft'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <span className="relative py-1">
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-brick transition-transform duration-300 ${
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="ml-5 flex items-center gap-3">
            <LangToggle lang={lang} />
            <Link to={pagePath(lang, 'contact') + '?topic=membership'} className="btn btn-brick min-h-10 whitespace-nowrap px-4 py-1.5">
              {t.nav.enquire}
            </Link>
          </div>
        </nav>

        <div className="flex items-center gap-2 xl:hidden">
          <LangToggle lang={lang} />
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex min-h-10 items-center whitespace-nowrap border border-ink px-3.5 text-[0.8rem] font-semibold tracking-wide"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t.nav.close : t.nav.menu}
          </button>
        </div>
      </div>

      {open && (
        <div
          id={menuId}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.a11y.primaryNav}
          className="absolute inset-x-0 top-full h-[calc(100dvh-var(--header-h))] overflow-y-auto bg-white xl:hidden"
        >
          <nav aria-label={t.a11y.primaryNav} className="container-page py-6">
            <ol className="border-t border-ink">
              {navItems.map((item, i) => (
                <li key={item.id} className="border-b border-hair">
                  <NavLink
                    to={pagePath(lang, item.id)}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-baseline gap-4 py-4 text-[1.6rem] font-semibold tracking-[-0.02em] ${isActive ? 'text-brick' : ''}`
                    }
                  >
                    <span className="w-8 text-[0.8rem] font-semibold tabular-nums text-brick" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ol>
            <Link
              to={pagePath(lang, 'contact') + '?topic=membership'}
              onClick={() => setOpen(false)}
              className="btn btn-brick mt-8 w-full"
            >
              {t.nav.enquire}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
