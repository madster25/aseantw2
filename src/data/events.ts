import type { Language } from '../translations';
import type { PhotoSlot } from './photos';
import { sampleEvents } from './events.sample';

export type EventCategory = 'trade-mission' | 'networking' | 'forum' | 'exhibition';
export const eventCategories: EventCategory[] = ['trade-mission', 'networking', 'forum', 'exhibition'];

/**
 * confirmed            Verified by the chamber.
 * supplied-unverified  Came with the original site; shown as pending verification.
 * sample               Layout sample used during development only. Never shown in production
 *                      unless VITE_SHOW_SAMPLE_EVENTS=true (see events.sample.ts).
 */
export type EventStatus = 'confirmed' | 'supplied-unverified' | 'sample';

/**
 * open             Registration or applications are open (a link or the enquiry form).
 * expressions      Not yet open; visitors can express interest through the enquiry form.
 * closed           Registration has closed.
 * members-only     Open to members; non-members enquire.
 * not-announced    Nothing has been confirmed, so no registration claim is made.
 */
export type RegistrationStatus = 'open' | 'expressions' | 'closed' | 'members-only' | 'not-announced';

type Text = Record<Language, string>;

export interface ItineraryDay {
  /** ISO date or a label such as "Day 1". */
  day: Text;
  items: Text[];
}

export interface MissionDetails {
  destination: Text;
  purpose: Text;
  industries: Text[];
  whoShouldAttend: Text[];
  eligibility?: Text;
  plannedVisits?: Text[];
  itinerary?: ItineraryDay[];
  /** Only when supplied by the chamber. Shown verbatim. */
  fees?: Text;
  feesIncludes?: Text[];
  applicationDeadline?: string;
  applicationProcess?: Text[];
}

export interface ChamberEvent {
  slug: string;
  category: EventCategory;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** ISO date for multi-day events. */
  endDate?: string;
  title: Text;
  summary: Text;
  /** Longer description, plain paragraphs. */
  body?: Text[];
  /** City and country, if recorded. */
  location?: Text;
  venue?: Text;
  status: EventStatus;
  registration: RegistrationStatus;
  /** External registration URL when the chamber has supplied one. */
  registrationUrl?: string;
  /** Photo registry slot for the listing and detail header. */
  photo?: PhotoSlot;
  mission?: MissionDetails;
}

/**
 * Event records.
 *
 * The two 2024 entries were supplied with the original site and have not been verified by the
 * chamber. They are kept as historical entries only. Add confirmed events with status 'confirmed';
 * the listing sorts them into upcoming and past by date automatically. For a trade mission, fill
 * the `mission` block; fields left out are simply not shown.
 */
export const events: ChamberEvent[] = [
  {
    slug: 'taiwan-asean-digital-trade-summit-2024',
    category: 'forum',
    date: '2024-10-15',
    title: {
      en: 'Taiwan–ASEAN Digital Trade Summit',
      'zh-tw': '台灣–東協數位貿易高峰會',
    },
    summary: {
      en: 'Cross-border e-commerce and digital logistics between Taiwan and ASEAN markets.',
      'zh-tw': '台灣與東協市場之間的跨境電子商務與數位物流。',
    },
    status: 'supplied-unverified',
    registration: 'closed',
  },
  {
    slug: 'regional-networking-evening-singapore-2024',
    category: 'networking',
    date: '2024-11-02',
    title: {
      en: 'Regional Networking Evening',
      'zh-tw': '區域商務交流晚會',
    },
    summary: {
      en: 'An evening for chamber members and invited guests.',
      'zh-tw': '為商會會員與受邀賓客舉辦的交流晚會。',
    },
    location: { en: 'Singapore', 'zh-tw': '新加坡' },
    status: 'supplied-unverified',
    registration: 'closed',
  },
];

const showSamples = import.meta.env.VITE_SHOW_SAMPLE_EVENTS === 'true';

/** Everything the site should list: real records, plus layout samples only when enabled. */
export const allEvents: ChamberEvent[] = showSamples ? [...events, ...sampleEvents] : events;

export const eventBySlug = (slug: string | undefined) => allEvents.find((e) => e.slug === slug);

export const splitEvents = (all: ChamberEvent[], today: Date) => {
  const todayKey = today.toISOString().slice(0, 10);
  const upcoming = all
    .filter((e) => (e.endDate ?? e.date) >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = all
    .filter((e) => (e.endDate ?? e.date) < todayKey)
    .sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
};

const fmt = (lang: Language, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'zh-TW', { timeZone: 'UTC', ...opts });

const utc = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export const formatEventDate = (iso: string, lang: Language) =>
  fmt(lang, { year: 'numeric', month: 'long', day: 'numeric' }).format(utc(iso));

/** "15–18 March 2027" style range, collapsing shared month and year. */
export const formatEventRange = (start: string, end: string | undefined, lang: Language) => {
  if (!end || end === start) return formatEventDate(start, lang);
  const s = utc(start);
  const e = utc(end);
  if (lang === 'zh-tw') {
    const sameMonth = s.getUTCFullYear() === e.getUTCFullYear() && s.getUTCMonth() === e.getUTCMonth();
    return sameMonth
      ? `${fmt(lang, { year: 'numeric', month: 'long' }).format(s)}${s.getUTCDate()}日至${e.getUTCDate()}日`
      : `${formatEventDate(start, lang)}至${formatEventDate(end, lang)}`;
  }
  if (s.getUTCFullYear() === e.getUTCFullYear() && s.getUTCMonth() === e.getUTCMonth()) {
    return `${s.getUTCDate()}–${e.getUTCDate()} ${fmt(lang, { month: 'long', year: 'numeric' }).format(s)}`;
  }
  if (s.getUTCFullYear() === e.getUTCFullYear()) {
    return `${fmt(lang, { day: 'numeric', month: 'long' }).format(s)} – ${formatEventDate(end, lang)}`;
  }
  return `${formatEventDate(start, lang)} – ${formatEventDate(end, lang)}`;
};
