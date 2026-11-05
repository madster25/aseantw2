import type { ChamberEvent } from './events';

/**
 * LAYOUT SAMPLES. Not real chamber activities.
 *
 * These records exist so the listing and the trade-mission detail layout can be reviewed before the
 * chamber confirms its first mission. They are included only when the build runs with
 * VITE_SHOW_SAMPLE_EVENTS=true (set in .env.development, not in production). Every sample carries
 * status 'sample', which renders a visible "Sample content" banner. Delete this file's entries once
 * real records exist.
 */
export const sampleEvents: ChamberEvent[] = [
  {
    slug: 'sample-trade-mission',
    category: 'trade-mission',
    date: '2027-03-15',
    endDate: '2027-03-18',
    title: {
      en: 'Sample: Trade mission to an ASEAN market',
      'zh-tw': '版面範例：東協市場商務考察團',
    },
    summary: {
      en: 'A sample record showing how a confirmed trade mission will be presented. Dates, visits and fees shown here are placeholders.',
      'zh-tw': '此為版面範例，顯示已確認的商務考察團將如何呈現。日期、參訪與費用皆為示意。',
    },
    location: { en: 'Destination city, country', 'zh-tw': '目的地城市，國家' },
    status: 'sample',
    registration: 'expressions',
    photo: 'mission-sample',
    mission: {
      destination: { en: 'Destination city, country', 'zh-tw': '目的地城市，國家' },
      purpose: {
        en: 'This paragraph states what the mission is for: the market question it answers, the counterparts it will meet and what delegates should come away with.',
        'zh-tw': '此段說明考察團的目的：要回答的市場問題、將會見的對口單位，以及團員應獲得的成果。',
      },
      industries: [
        { en: 'Industry one', 'zh-tw': '產業一' },
        { en: 'Industry two', 'zh-tw': '產業二' },
        { en: 'Industry three', 'zh-tw': '產業三' },
      ],
      whoShouldAttend: [
        { en: 'Decision-makers from companies evaluating the market', 'zh-tw': '正在評估該市場的企業決策者' },
        { en: 'Members with an existing presence seeking partners', 'zh-tw': '已在當地經營、尋求夥伴的會員' },
      ],
      eligibility: {
        en: 'Open to chamber members. Non-members may express interest and will be contacted about membership.',
        'zh-tw': '限商會會員參加。非會員可表達興趣，秘書處將聯繫說明入會事宜。',
      },
      plannedVisits: [
        { en: 'Company visit: a manufacturer in the relevant sector', 'zh-tw': '企業參訪：相關產業製造商' },
        { en: 'Meeting: the national investment promotion agency', 'zh-tw': '會議：該國投資促進機構' },
        { en: 'Exhibition: an industry trade fair taking place during the mission', 'zh-tw': '展覽：考察期間舉行的產業展' },
      ],
      itinerary: [
        {
          day: { en: 'Day 1', 'zh-tw': '第一天' },
          items: [
            { en: 'Arrival and welcome briefing', 'zh-tw': '抵達與歡迎說明會' },
            { en: 'Evening reception with local counterparts', 'zh-tw': '與當地對口單位的晚間交流' },
          ],
        },
        {
          day: { en: 'Day 2', 'zh-tw': '第二天' },
          items: [
            { en: 'Company visits', 'zh-tw': '企業參訪' },
            { en: 'Meeting with the investment agency', 'zh-tw': '與投資機構會談' },
          ],
        },
        {
          day: { en: 'Day 3', 'zh-tw': '第三天' },
          items: [
            { en: 'Trade fair visit and one-to-one meetings', 'zh-tw': '參觀展覽與一對一洽談' },
          ],
        },
        {
          day: { en: 'Day 4', 'zh-tw': '第四天' },
          items: [{ en: 'Debrief and departure', 'zh-tw': '總結與返程' }],
        },
      ],
      fees: {
        en: 'Participation fee appears here exactly as supplied by the chamber.',
        'zh-tw': '參團費用將依商會提供之內容如實顯示於此。',
      },
      feesIncludes: [
        { en: 'What the fee covers, item by item', 'zh-tw': '費用包含的項目，逐項列出' },
        { en: 'What delegates arrange themselves', 'zh-tw': '團員須自行安排的項目' },
      ],
      applicationDeadline: '2027-02-15',
      applicationProcess: [
        { en: 'Express interest through the enquiry form', 'zh-tw': '透過洽詢表單表達興趣' },
        { en: 'The secretariat confirms eligibility and sends the application', 'zh-tw': '秘書處確認資格並寄送申請表' },
        { en: 'Places are confirmed on receipt of the completed application', 'zh-tw': '收到完整申請後確認名額' },
      ],
    },
  },
  {
    slug: 'sample-market-briefing',
    category: 'forum',
    date: '2027-01-20',
    title: { en: 'Sample: Market briefing', 'zh-tw': '版面範例：市場簡報會' },
    summary: {
      en: 'A sample seminar record. Shows a single-day event with a venue and registration state.',
      'zh-tw': '範例研討會資料，顯示單日活動的場地與報名狀態。',
    },
    location: { en: 'Taipei', 'zh-tw': '台北' },
    venue: { en: 'Venue name', 'zh-tw': '場地名稱' },
    body: [
      {
        en: 'This paragraph describes the briefing: the market or sector covered, who is speaking and what attendees will take away.',
        'zh-tw': '此段說明簡報會內容：涵蓋的市場或產業、講者，以及參加者可獲得的收穫。',
      },
    ],
    status: 'sample',
    registration: 'members-only',
    photo: 'seminar',
  },
];
