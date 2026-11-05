import type { Language } from '../../translations';

export type CountryCode = 'BN' | 'KH' | 'ID' | 'LA' | 'MY' | 'MM' | 'PH' | 'SG' | 'TH' | 'TL' | 'VN';

export interface Country {
  code: CountryCode;
  slug: string;
  name: Record<Language, string>;
  /** Official long form, shown on the country page. */
  officialName: Record<Language, string>;
  capital: Record<Language, string>;
}

/** The eleven ASEAN member states (Timor-Leste joined in October 2025). */
export const countries: Country[] = [
  { code: 'BN', slug: 'brunei', name: { en: 'Brunei', 'zh-tw': '汶萊' }, officialName: { en: 'Brunei Darussalam', 'zh-tw': '汶萊達魯薩蘭國' }, capital: { en: 'Bandar Seri Begawan', 'zh-tw': '斯里巴加灣市' } },
  { code: 'KH', slug: 'cambodia', name: { en: 'Cambodia', 'zh-tw': '柬埔寨' }, officialName: { en: 'Kingdom of Cambodia', 'zh-tw': '柬埔寨王國' }, capital: { en: 'Phnom Penh', 'zh-tw': '金邊' } },
  { code: 'ID', slug: 'indonesia', name: { en: 'Indonesia', 'zh-tw': '印尼' }, officialName: { en: 'Republic of Indonesia', 'zh-tw': '印度尼西亞共和國' }, capital: { en: 'Jakarta', 'zh-tw': '雅加達' } },
  { code: 'LA', slug: 'laos', name: { en: 'Laos', 'zh-tw': '寮國' }, officialName: { en: 'Lao People’s Democratic Republic', 'zh-tw': '寮人民民主共和國' }, capital: { en: 'Vientiane', 'zh-tw': '永珍' } },
  { code: 'MY', slug: 'malaysia', name: { en: 'Malaysia', 'zh-tw': '馬來西亞' }, officialName: { en: 'Malaysia', 'zh-tw': '馬來西亞' }, capital: { en: 'Kuala Lumpur', 'zh-tw': '吉隆坡' } },
  { code: 'MM', slug: 'myanmar', name: { en: 'Myanmar', 'zh-tw': '緬甸' }, officialName: { en: 'Republic of the Union of Myanmar', 'zh-tw': '緬甸聯邦共和國' }, capital: { en: 'Naypyidaw', 'zh-tw': '奈比多' } },
  { code: 'PH', slug: 'philippines', name: { en: 'Philippines', 'zh-tw': '菲律賓' }, officialName: { en: 'Republic of the Philippines', 'zh-tw': '菲律賓共和國' }, capital: { en: 'Manila', 'zh-tw': '馬尼拉' } },
  { code: 'SG', slug: 'singapore', name: { en: 'Singapore', 'zh-tw': '新加坡' }, officialName: { en: 'Republic of Singapore', 'zh-tw': '新加坡共和國' }, capital: { en: 'Singapore', 'zh-tw': '新加坡' } },
  { code: 'TH', slug: 'thailand', name: { en: 'Thailand', 'zh-tw': '泰國' }, officialName: { en: 'Kingdom of Thailand', 'zh-tw': '泰王國' }, capital: { en: 'Bangkok', 'zh-tw': '曼谷' } },
  { code: 'TL', slug: 'timor-leste', name: { en: 'Timor-Leste', 'zh-tw': '東帝汶' }, officialName: { en: 'Democratic Republic of Timor-Leste', 'zh-tw': '東帝汶民主共和國' }, capital: { en: 'Dili', 'zh-tw': '帝力' } },
  { code: 'VN', slug: 'vietnam', name: { en: 'Vietnam', 'zh-tw': '越南' }, officialName: { en: 'Socialist Republic of Vietnam', 'zh-tw': '越南社會主義共和國' }, capital: { en: 'Hanoi', 'zh-tw': '河內' } },
];

export const countryBySlug = (slug: string | undefined) => countries.find((c) => c.slug === slug);
export const countryByCode = (code: string) => countries.find((c) => c.code === code);

export type AgencyCategory =
  | 'business_registration'
  | 'foreign_investment'
  | 'tax'
  | 'customs'
  | 'trade_export'
  | 'standards'
  | 'food_biosecurity'
  | 'intellectual_property'
  | 'immigration'
  | 'employment'
  | 'dispute_resolution'
  | 'industry_development'
  | 'education'
  | 'tourism'
  | 'other';

/** Display order and labels for the directory. Framed as the task a business is trying to do. */
export const categoryOrder: AgencyCategory[] = [
  'business_registration',
  'foreign_investment',
  'tax',
  'customs',
  'trade_export',
  'standards',
  'food_biosecurity',
  'intellectual_property',
  'immigration',
  'employment',
  'dispute_resolution',
  'industry_development',
  'education',
  'tourism',
  'other',
];

export const categoryLabels: Record<AgencyCategory, Record<Language, string>> = {
  business_registration: { en: 'Register a company', 'zh-tw': '公司登記' },
  foreign_investment: { en: 'Invest or set up operations', 'zh-tw': '投資與設立營運據點' },
  tax: { en: 'Tax', 'zh-tw': '稅務' },
  customs: { en: 'Customs and import duties', 'zh-tw': '海關與進口關稅' },
  trade_export: { en: 'Trade and export promotion', 'zh-tw': '貿易與出口推廣' },
  standards: { en: 'Product standards and labelling', 'zh-tw': '產品標準與標示' },
  food_biosecurity: { en: 'Food, agriculture and biosecurity', 'zh-tw': '食品、農業與生物安全' },
  intellectual_property: { en: 'Intellectual property', 'zh-tw': '智慧財產權' },
  immigration: { en: 'Visas and immigration', 'zh-tw': '簽證與移民' },
  employment: { en: 'Employment and labour', 'zh-tw': '勞動與雇用' },
  dispute_resolution: { en: 'Dispute resolution', 'zh-tw': '爭議解決' },
  industry_development: { en: 'Industry and economic development', 'zh-tw': '產業與經濟發展' },
  education: { en: 'Education and research', 'zh-tw': '教育與研究' },
  tourism: { en: 'Tourism', 'zh-tw': '觀光' },
  other: { en: 'Other agencies', 'zh-tw': '其他機關' },
};
