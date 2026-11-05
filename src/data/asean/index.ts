import type { Language } from '../../translations';
import agenciesEn from './agencies.en.json';
import agencyTextZh from './agency-text.zh.json';
import type { AgencyCategory, CountryCode } from './countries';

export interface ContactPoint {
  channel: 'phone' | 'email' | 'url' | 'postal' | 'web_form' | 'whatsapp';
  label: string;
  value: string;
}
export interface Office {
  id: string;
  name: string;
  city: string | null;
  hours: string | null;
  contacts: ContactPoint[];
}
export interface AgencyService {
  name: string;
  description: string;
  url: string;
  cost: string | null;
}
export interface Agency {
  id: string;
  slug: string;
  name: string;
  acronym: string | null;
  country: CountryCode;
  level: string;
  categories: AgencyCategory[];
  responsibilities: string | null;
  whenToContact: string | null;
  scope: string | null;
  website: string;
  lastVerified: string | null;
  status: string;
  offices: Office[];
  services: AgencyService[];
}

interface AgencyText {
  responsibilities: string | null;
  whenToContact: string | null;
  scope: string | null;
  services: { name: string; description: string }[];
  offices: { name: string; hours: string | null }[];
}

const en = agenciesEn as unknown as Agency[];
const zhText = agencyTextZh as unknown as Record<string, AgencyText>;

/** Agencies with descriptive text in the requested language. Names, URLs and contact details are shared. */
export const agenciesFor = (lang: Language): Agency[] => {
  if (lang === 'en') return en;
  return en.map((a) => {
    const t = zhText[a.id];
    if (!t) return a;
    return {
      ...a,
      responsibilities: t.responsibilities,
      whenToContact: t.whenToContact,
      scope: t.scope,
      services: a.services.map((s, i) => ({ ...s, name: t.services[i]?.name ?? s.name, description: t.services[i]?.description ?? s.description })),
      offices: a.offices.map((o, i) => ({ ...o, name: t.offices[i]?.name ?? o.name, hours: t.offices[i]?.hours ?? o.hours })),
    };
  });
};

export const agenciesForCountry = (lang: Language, code: CountryCode) =>
  agenciesFor(lang).filter((a) => a.country === code);

/** Most recent verification date across the directory, for the page note. */
export const directoryVerifiedDate = en.reduce<string | null>((latest, a) => {
  if (!a.lastVerified) return latest;
  return !latest || a.lastVerified > latest ? a.lastVerified : latest;
}, null);
