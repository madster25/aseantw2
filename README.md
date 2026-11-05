# ASEAN Taiwan Chamber of Commerce — website

Bilingual (English / 繁體中文) multi-page site. React 19, TypeScript, Vite 6, Tailwind CSS v4, React Router, Lucide. No animation library; the only motion is CSS colour transitions, disabled under `prefers-reduced-motion`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build in dist/
npm run preview  # serve dist/
npm run lint     # tsc --noEmit (strict)
```

Routes, in each language (`/en/...` and `/zh-tw/...`):

| Page | Path |
| --- | --- |
| Home (overview) | `/en`, `/zh-tw` |
| About | `/en/about` |
| Membership | `/en/membership` |
| Events | `/en/events` |
| Opportunities | `/en/opportunities` |
| Doing business in ASEAN (guides, FAQ, country index) | `/en/asean` |
| Country page, e.g. Vietnam | `/en/asean/vietnam` |
| Guide | `/en/asean/guides/<slug>` |
| Contact (enquiry form) | `/en/contact` |

`/` redirects to `/en`; an unknown language prefix redirects to `/en`; an unknown page under a valid language shows a not-found page. The language switch keeps you on the same page. `vercel.json` rewrites every path to `index.html` so deep links work.

## Where things live

| What | Where |
| --- | --- |
| All interface text, both languages | `src/translations.ts` (typed: `zh-tw` must match the shape of `en`) |
| Event and trade-mission records | `src/data/events.ts` (real records) and `src/data/events.sample.ts` (layout samples, development only) |
| ASEAN agency directory (138 agencies, 11 member states) | `src/data/asean/agencies.en.json`, Chinese descriptions in `agency-text.zh.json` |
| ASEAN guides (14, each with English and Traditional Chinese) | `src/data/asean/guides/*.json` (one file per guide; add a file to publish a new one) |
| Member states and directory categories | `src/data/asean/countries.ts` |
| FAQ and all ASEAN-section interface text | `src/translations.ts` → `asean` |
| Design tokens, type system, utilities | `src/index.css` |
| Pages (routing targets) | `src/pages/` |
| Section components used by pages | `src/components/` |
| Chinese fonts (loaded on `/zh-tw` only) | `src/fonts/tc.css` |
| Approved photography registry (empty) | `src/data/photos.ts`, rendered by `src/components/Figure.tsx` |
| Logo mark and its colours | `src/components/Logo.tsx`, `--logo-navy` / `--logo-gold` in `src/index.css` |
| Favicon | `public/favicon.svg` |

## Content that still needs the chamber's input

- **Contact details.** No office address, telephone or email is published; the footer says so. Add them to `translations.ts` → `footer` once confirmed.
- **Enquiry form endpoint.** Set `VITE_ENQUIRY_ENDPOINT` (see `.env.example`) to an HTTPS URL that accepts a JSON POST. Until it is set, the form explains that online submission is not configured and offers a copyable enquiry; it never shows a false success.
- **Events and trade missions.** The two 2024 entries were supplied with the original site and are shown as past events marked "pending verification". Add confirmed events to `src/data/events.ts` with `status: 'confirmed'`, a `category` (`trade-mission`, `networking`, `forum`, `exhibition`) and a `registration` state; they sort into upcoming/past by date automatically. A trade mission takes a `mission` block (destination, purpose, industries, who should attend, eligibility, planned visits, itinerary, fees, deadline, process); fields left out are not shown, and fees are shown only when supplied. The two records in `events.sample.ts` are layout samples: they appear only when `VITE_SHOW_SAMPLE_EVENTS=true` (set in `.env.development`), carry a visible "Sample content" banner, and are absent from the production build.
- **Membership categories and fees.** Not published; the membership section directs people to the enquiry form.
- **Photography.** No approved chamber photographs have been supplied. Three images are stock photographs the chamber chose (Unsplash: office interior for the home hero, a business meeting, a corporate tower), stored in `public/photos/`. The rest are generated documentary-style scenes of regional places and industry with no identifiable people, marked `placeholder: true` in `src/data/photos.ts`; all but `taipei` are stored in `public/photos/` as `<slot>.jpg` with an 800px `<slot>-800.jpg` for phones (`taipei` is still loaded from its original URL until the file is supplied; `npm run fetch-photos` downloads any missing one). To replace an image, drop the new file in under the same name, or edit the entry's alt, caption, credit and set `placeholder: false`. Never caption a stock or generated image as a chamber event or imply pictured people are members.
- **Logo.** No official logo file was supplied. `src/components/Logo.tsx` is a placeholder mark set in the original site's wordmark colours (navy `#002147`, gold `#C5A059`), kept as `--logo-navy` / `--logo-gold` in `src/index.css`, deliberately outside the site palette. Do not change these without the chamber's approval; replace the component and `public/favicon.svg` with the official asset when it is available.

## Events & Trade Missions

`/:lang/events` lists everything with an Upcoming / Past view and a type filter. Both live in the URL (`?view=past&type=forum`), so a filtered view can be linked, reloaded, and switched between languages. `/:lang/events/:slug` is the detail page; a record with a `mission` block gets the trade-mission layout with an in-page index. The action on each record follows its `registration` state: an external link only when `registrationUrl` is supplied and registration is open; otherwise the enquiry form, pre-filled with the event (`?topic=…&about=<slug>`). Nothing on the site confirms a place; the secretariat does.

## Design system

Palette (all in `src/index.css` `@theme`): white `#FFFFFF` background, charcoal `#242424` text, brick `#A33A32` for actions, the active navigation state, numbering and labels, and grey `#E7E7E3` for the few sections set on a tinted ground. Contrast of the combinations actually used: charcoal on white 15.5:1, brick text on white 6.5:1, white on brick 6.5:1, white on charcoal 15.5:1, muted grey `#5C5C5C` on white 6.7:1 and on `#E7E7E3` 5.4:1, brick on `#E7E7E3` 5.3:1, all above AA for body text. Logo colours are separate (see above).

Typography is a sans-serif system. English uses Archivo (variable: weight and width axes); headlines are set heavy and slightly condensed through `font-stretch`, body text at normal width. Traditional Chinese uses Noto Sans TC 400/500/700/900 with its own rules in `index.css` (line-height 1.9 for body, 1.3 for headings, no negative tracking, `line-break: strict`, `text-spacing-trim`); the width axis is forced to 100% under `:lang(zh-TW)`. Newsreader (serif) is used in one place only: the long-form body of English guides. All fonts are self-hosted via `@fontsource`; Chinese fonts load only on `/zh-tw`, plus a 6-character Noto Sans TC Bold subset of 東協台灣商會 for the masthead and footer on every page.

## The ASEAN section

Guides and the agency directory were adapted from supplied material and edited so that nothing refers to Australia: Australian agencies, programmes, embassies, legal references and source links were removed, and guide text was rewritten for a general business audience. Notes for reviewers:

- Guides keep their source links; several lost claims' original citations when Australian sources were removed (for example the APEC Business Travel Card stay and validity figures, Malaysian halal labelling for dairy, Indonesia first-to-file). Re-source or soften these before relying on them publicly.
- The directory lists names, responsibilities, websites, and the offices and online services recorded in the supplied data. The supplied data has no "when to contact" or "scope of assistance" text, so those fields are not shown. Details were checked against official sources on the dates shown on each country page; five agencies have no check date recorded.
- Timor-Leste is included as the eleventh ASEAN member (joined October 2025).
- The only statements about Taiwan are that Taiwan participates in APEC as Chinese Taipei and the APEC Business Travel Card, and that Taiwan is not a Madrid System member, so trade marks are filed country by country or through a local agent.
- Guides are general information, not legal, tax or immigration advice; each guide page says so.
