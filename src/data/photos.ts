import type { Language } from '../translations';

/**
 * Photography registry.
 *
 * STATUS: no approved chamber photographs have been supplied yet. Three entries (home-lead, reception,
 * singapore) are stock photographs chosen by the chamber (Unsplash). The rest are generated documentary-style
 * scenes of regional places and industry with no identifiable people. None depicts a chamber event, and no
 * caption may say otherwise. `placeholder: true` marks an image that should still be replaced; it renders
 * nothing on the page. Files live in /public/photos as <slot>.jpg and <slot>-800.jpg; `taipei` is the one
 * slot still loaded from its original URL because the file has not been supplied.
 *
 * TO REPLACE AN IMAGE
 *   1. Put the approved file in /public/photos/ (JPEG or WebP, 1600px on the long side; a 800px copy
 *      for `srcSmall` keeps phone downloads small).
 *   2. Change `src` (and `srcSmall`) to '/photos/<file>', set width/height to the file's pixel size,
 *      write alt text and a caption that says what, where and when, add the photographer credit,
 *      and set `placeholder: false`.
 *   3. Nothing else changes: every page reads from this file.
 *
 * NEVER describe a stock or generated image as a chamber event, or imply that pictured people are members.
 */
export type PhotoSlot =
  | 'home-lead'
  | 'taipei'
  | 'singapore'
  | 'ho-chi-minh'
  | 'bangkok'
  | 'kuala-lumpur'
  | 'jakarta'
  | 'factory'
  | 'exhibition'
  | 'reception'
  | 'port-vertical'
  | 'seminar'
  | 'mission-sample';

export interface Photo {
  src: string;
  /** Smaller rendition for phones; optional. */
  srcSmall?: string;
  width: number;
  height: number;
  alt: Record<Language, string>;
  caption: Record<Language, string>;
  credit: string;
  placeholder: boolean;
}

/* Slots whose files are in /public/photos. Anything not listed is still loaded from its original URL. */
const LOCAL_SLOTS = new Set(['home-lead', 'reception', 'singapore', 'ho-chi-minh', 'bangkok', 'kuala-lumpur', 'jakarta', 'factory', 'exhibition', 'port-vertical', 'seminar', 'mission-sample']);
const isLocal = (slot?: string) => !!slot && LOCAL_SLOTS.has(slot);
const localName = (slot: string) => (slot === 'mission-sample' ? 'exhibition' : slot);
const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Kcig8MTgncU7AXxhtgFJTcZLe4/';
const tmp = (file: string, width: number, height: number, alt: Record<Language, string>, caption: Record<Language, string>, slot?: string): Photo => ({
  src: isLocal(slot) ? `/photos/${localName(slot!)}.jpg` : `${CDN}${file}.png`,
  srcSmall: isLocal(slot) ? `/photos/${localName(slot!)}-800.jpg` : `${CDN}${file}_min.webp`,
  width,
  height,
  alt,
  caption,
  credit: 'Illustrative image',
  placeholder: true,
});

const UNSPLASH = 'https://images.unsplash.com/';
const stock = (id: string, w: number, h: number, alt: Record<Language, string>, caption: Record<Language, string>, slot?: string): Photo => ({
  src: isLocal(slot) ? `/photos/${slot}.jpg` : `${UNSPLASH}${id}?auto=format&fit=crop&q=80&w=${w}&h=${h}`,
  srcSmall: isLocal(slot) ? `/photos/${slot}-800.jpg` : `${UNSPLASH}${id}?auto=format&fit=crop&q=75&w=800&h=${Math.round((800 * h) / w)}`,
  width: w,
  height: h,
  alt,
  caption,
  credit: 'Unsplash',
  placeholder: false,
});

export const photos: Record<PhotoSlot, Photo> = {
  'home-lead': stock(
    'photo-1497366216548-37526070297c',
    2000,
    1125,
    { en: 'Modern office interior with meeting tables and large windows', 'zh-tw': '現代辦公空間，會議桌與大片窗戶' },
    { en: 'Where the work gets done: introductions, briefings and follow-ups between Taiwan and ASEAN.', 'zh-tw': '工作實際發生的地方：台灣與東協之間的引介、簡報與後續追蹤。' },
    'home-lead',
  ),
  taipei: tmp(
    'hf_20261104_084838_96050c6a-601f-407c-a111-26ddb7a8c6a6',
    1024,
    688,
    { en: 'Taipei skyline on a clear morning seen from a hillside', 'zh-tw': '晴朗早晨自山坡眺望的台北市景' },
    { en: 'Taipei, where the chamber is based.', 'zh-tw': '台北，商會所在地。' },
    'taipei',
  ),
  singapore: stock(
    'photo-1486406146926-c627a92ad1ab',
    1200,
    800,
    { en: 'Glass office tower seen from below against the sky', 'zh-tw': '自下方仰望的玻璃帷幕辦公大樓' },
    { en: 'Corporate offices in a regional financial centre.', 'zh-tw': '區域金融中心的企業辦公大樓。' },
    'singapore',
  ),
  'ho-chi-minh': tmp(
    'hf_20261104_084837_e30d6b67-70cf-4b58-a6e1-2ef5d0d660d5',
    1024,
    688,
    { en: 'Motorbikes in motion on a wide city boulevard with office towers behind', 'zh-tw': '寬闊大道上行駛的機車，後方為辦公大樓' },
    { en: 'Ho Chi Minh City. Vietnam is among the most frequent destinations for Taiwanese manufacturers.', 'zh-tw': '胡志明市。越南是台灣製造業最常見的目的地之一。' },
    'ho-chi-minh',
  ),
  bangkok: tmp(
    'hf_20261104_084837_468f709f-2730-4638-99ef-4e6be8f14bba',
    1024,
    688,
    { en: 'City skyline along a river at golden hour', 'zh-tw': '黃昏時分河畔的城市天際線' },
    { en: 'Bangkok, on the Chao Phraya.', 'zh-tw': '湄南河畔的曼谷。' },
    'bangkok',
  ),
  'kuala-lumpur': tmp(
    'hf_20261104_084839_12f238b1-5da1-451e-9e30-6af12f2589ad',
    688,
    1024,
    { en: 'Looking up at twin office towers between other buildings', 'zh-tw': '仰望大樓之間的雙塔' },
    { en: 'Kuala Lumpur.', 'zh-tw': '吉隆坡。' },
    'kuala-lumpur',
  ),
  jakarta: tmp(
    'hf_20261104_084930_21e02190-9283-47a6-8d04-95048e3c5c3e',
    1024,
    688,
    { en: 'Central business district with towers and elevated roads in morning haze', 'zh-tw': '晨霧中的中央商業區，高樓與高架道路' },
    { en: 'Jakarta’s business district.', 'zh-tw': '雅加達商業區。' },
    'jakarta',
  ),
  factory: tmp(
    'hf_20261104_084838_0d645173-5172-4c35-b284-1880876f9292',
    1024,
    688,
    { en: 'Surface-mount assembly machines and printed circuit boards on an electronics line', 'zh-tw': '電子生產線上的表面黏著設備與印刷電路板' },
    { en: 'Electronics assembly, the sector most represented in Taiwan–ASEAN manufacturing investment.', 'zh-tw': '電子組裝，台灣對東協製造投資中最具代表性的產業。' },
    'factory',
  ),
  exhibition: tmp(
    'hf_20261104_084837_cf7541d3-6148-4dae-8c81-efef8d95f310',
    1344,
    752,
    { en: 'Trade exhibition hall seen from above with rows of booths and aisles', 'zh-tw': '自上方俯瞰的展覽館，成排的攤位與走道' },
    { en: 'A trade exhibition hall. Chamber delegations visit regional fairs as part of trade missions.', 'zh-tw': '展覽館。商會代表團在考察行程中參觀區域展會。' },
    'exhibition',
  ),
  reception: stock(
    'photo-1542744173-8e7e53415bb0',
    1200,
    800,
    { en: 'Business meeting around a table with laptops and notes', 'zh-tw': '圍桌進行的商務會議，桌上有筆電與筆記' },
    { en: 'A working meeting between business counterparts.', 'zh-tw': '商務對口之間的工作會議。' },
    'reception',
  ),
  'port-vertical': tmp(
    'hf_20261104_084838_fda7ea5f-f3a1-472a-a93d-68a723457a18',
    688,
    1024,
    { en: 'Container ship being loaded under cranes in early morning light', 'zh-tw': '清晨光線下起重機裝載中的貨櫃船' },
    { en: 'Loading at a Southeast Asian port.', 'zh-tw': '東南亞港口的裝載作業。' },
    'port-vertical',
  ),
  seminar: tmp(
    'hf_20261104_084930_67ca27ca-bf8c-4684-b383-9c3ddb5fdc44',
    1024,
    688,
    { en: 'Seminar room with delegates seen from behind facing a stage', 'zh-tw': '研討會現場，背對鏡頭面向講台的與會者' },
    { en: 'A seminar in progress. Not a chamber event; shown to illustrate the format.', 'zh-tw': '進行中的研討會。此非商會活動，僅示意形式。' },
    'seminar',
  ),
  'mission-sample': tmp(
    'hf_20261104_084837_cf7541d3-6148-4dae-8c81-efef8d95f310',
    1344,
    752,
    { en: 'Trade exhibition hall seen from above', 'zh-tw': '自上方俯瞰的展覽館' },
    { en: 'Sample image for the mission layout.', 'zh-tw': '考察團版面示意圖。' },
    'mission-sample',
  ),
};
