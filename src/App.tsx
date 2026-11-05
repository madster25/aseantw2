import { useEffect, useRef } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { MembershipPage } from './pages/MembershipPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { ContactPage } from './pages/ContactPage';
import { AseanPage } from './pages/AseanPage';
import { CountryPage } from './pages/CountryPage';
import { GuidePage } from './pages/GuidePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { isLanguage, translations, type Language } from './translations';
import { htmlLang, isPageSlug, type PageKey } from './lib/i18n';
import { useReveal } from './lib/useReveal';
import { countryBySlug } from './data/asean/countries';
import { guideBySlug, guideText } from './data/asean/guides';
import { eventBySlug } from './data/events';

const setMeta = (selector: string, value: string) => {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    const [, name, val] = selector.match(/\[([\w:]+)="([^"]+)"\]/) ?? [];
    if (name && val) el.setAttribute(name, val);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

function LanguageLayout() {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  if (!isLanguage(lang)) {
    return <Navigate to={`/en${location.hash}`} replace />;
  }
  return <SiteShell lang={lang} />;
}

function SiteShell({ lang }: { lang: Language }) {
  const location = useLocation();
  const t = translations[lang];
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(location.pathname);
  useReveal();

  // Traditional Chinese fonts are only needed on the Chinese route.
  useEffect(() => {
    if (lang === 'zh-tw') void import('./fonts/tc.css');
  }, [lang]);

  // Page metadata
  const segments = location.pathname.split('/');
  const segment = segments[2];
  const page: PageKey = isPageSlug(segment) ? segment : 'home';
  const detail = segment === 'asean' || segment === 'events' ? segments.slice(3).join('/') : '';
  useEffect(() => {
    document.documentElement.lang = htmlLang(lang);
    const p = t.pages[page];
    let pageTitle = p.metaTitle;
    let description = 'metaDescription' in p ? p.metaDescription : t.meta.description;
    if (detail.startsWith('guides/')) {
      const g = guideBySlug(detail.slice('guides/'.length));
      if (g) {
        pageTitle = guideText(g, lang).title;
        description = guideText(g, lang).metaDescription;
      }
    } else if (detail && segment === 'events') {
      const ev = eventBySlug(detail);
      if (ev) {
        pageTitle = ev.title[lang];
        description = ev.summary[lang];
      }
    } else if (detail) {
      const c = countryBySlug(detail);
      if (c) pageTitle = `${c.name[lang]} · ${t.asean.navLabel}`;
    }
    const title = page === 'home' ? t.meta.title : `${pageTitle} · ${t.meta.title}`;
    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:locale"]', lang === 'en' ? 'en_US' : 'zh_TW');
  }, [lang, page, detail, t]);

  // On navigation: scroll to the hash if there is one, otherwise to the top, and move focus to main.
  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) {
        requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
        return;
      }
    }
    if (previousPath.current !== location.pathname) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      mainRef.current?.focus({ preventScroll: true });
    }
    previousPath.current = location.pathname;
  }, [location.pathname, location.hash]);

  return (
    <>
      <a href="#main" className="skip-link">
        {t.a11y.skip}
      </a>
      <Header lang={lang} />
      <main id="main" ref={mainRef} tabIndex={-1} className="outline-none">
        <Outlet context={{ lang }} />
      </main>
      <Footer lang={lang} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:lang" element={<LanguageLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="membership" element={<MembershipPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:slug" element={<EventDetailPage />} />
          <Route path="opportunities" element={<OpportunitiesPage />} />
          <Route path="asean" element={<AseanPage />} />
          <Route path="asean/guides/:slug" element={<GuidePage />} />
          <Route path="asean/:country" element={<CountryPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/en" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
