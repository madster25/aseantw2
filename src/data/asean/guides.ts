import type { Language } from '../../translations';
import type { CountryCode } from './countries';

export type GuideCategory =
  | 'Business setup'
  | 'Tax and finance'
  | 'People and visas'
  | 'Trade and logistics'
  | 'Digital and IP'
  | 'Rights and compliance'
  | 'Sustainability';

export interface GuideText {
  title: string;
  standfirst: string;
  metaDescription: string;
  body: string;
}

export interface Guide {
  slug: string;
  category: GuideCategory;
  countries: CountryCode[];
  preparedAt: string;
  readingMinutes: number;
  en: GuideText;
  zh: GuideText;
  sources: { title: string; url: string; retrievedAt: string }[];
}

const modules = import.meta.glob<{ default: Guide }>('./guides/*.json', { eager: true });

export const guideCategoryOrder: GuideCategory[] = [
  'Business setup',
  'Tax and finance',
  'People and visas',
  'Trade and logistics',
  'Digital and IP',
  'Rights and compliance',
  'Sustainability',
];

export const guideCategoryLabels: Record<GuideCategory, Record<Language, string>> = {
  'Business setup': { en: 'Business setup', 'zh-tw': '設立事業' },
  'Tax and finance': { en: 'Tax and finance', 'zh-tw': '稅務與金融' },
  'People and visas': { en: 'People and visas', 'zh-tw': '人員與簽證' },
  'Trade and logistics': { en: 'Trade and logistics', 'zh-tw': '貿易與物流' },
  'Digital and IP': { en: 'Digital and intellectual property', 'zh-tw': '數位與智慧財產權' },
  'Rights and compliance': { en: 'Rights and compliance', 'zh-tw': '權利與法遵' },
  'Sustainability': { en: 'Sustainability', 'zh-tw': '永續' },
};

export const guides: Guide[] = Object.values(modules)
  .map((m) => m.default)
  .sort(
    (a, b) =>
      guideCategoryOrder.indexOf(a.category) - guideCategoryOrder.indexOf(b.category) ||
      a.en.title.localeCompare(b.en.title),
  );

export const guideText = (g: Guide, lang: Language): GuideText => (lang === 'en' ? g.en : g.zh);
export const guideBySlug = (slug: string | undefined) => guides.find((g) => g.slug === slug);
export const guidesForCountry = (code: CountryCode) => guides.filter((g) => g.countries.includes(code));
