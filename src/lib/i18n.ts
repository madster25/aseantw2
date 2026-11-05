import type { Language } from '../translations';

/** Page slugs. The home page has slug ''. */
export const PAGE_SLUGS = ['about', 'membership', 'events', 'opportunities', 'asean', 'contact'] as const;
export type PageSlug = (typeof PAGE_SLUGS)[number];
export type PageKey = PageSlug | 'home';

export const isPageSlug = (value: string | undefined): value is PageSlug =>
  (PAGE_SLUGS as readonly string[]).includes(value ?? '');

export const otherLanguage = (lang: Language): Language => (lang === 'en' ? 'zh-tw' : 'en');

/** Path to a page in a given language. */
export const pagePath = (lang: Language, page: PageKey = 'home') =>
  page === 'home' ? `/${lang}` : `/${lang}/${page}`;

/** Path for the same page in the other language, preserving any hash. */
export const switchPath = (target: Language, pathname: string, hash: string, search = '') => {
  const rest = pathname.replace(/^\/(en|zh-tw)(?=\/|$)/, '');
  return `/${target}${rest}${search || ''}${hash || ''}`;
};

export const htmlLang = (lang: Language) => (lang === 'en' ? 'en' : 'zh-TW');
