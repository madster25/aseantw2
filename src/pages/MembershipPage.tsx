import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../lib/useLang';
import { translations } from '../translations';
import { pagePath } from '../lib/i18n';
import { ENQUIRY_ENABLED } from '../lib/enquiry';
import { Breadcrumb } from '../components/Breadcrumb';
import { Figure } from '../components/Figure';

export const MembershipPage = () => {
  const lang = useLang();
  const t = translations[lang];
  const m = t.membershipPage;
  const num = (i: number) => String(i + 1).padStart(2, '0');

  return (
    <>
      {/* Introduction: the lead statement at display scale beside a photograph */}
      <header className="pt-(--header-h)">
        <div className="container-page pt-8 md:pt-12">
          <Breadcrumb lang={lang} items={[{ label: t.breadcrumb.home, to: pagePath(lang) }, { label: t.pages.membership.title }]} />
          <div className="mt-10 grid items-end gap-10 md:mt-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7" data-reveal>
              <h1 className="label">{t.pages.membership.title}</h1>
              <p className={`display mt-5 ${lang === 'en' ? 'max-w-[18ch]' : 'max-w-[14em]'}`}>{m.lead}</p>
              <p className="lede mt-8 max-w-[44ch]">{m.leadBody}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#how-to-enquire" className="btn btn-brick">{m.openForm}</a>
                <a href="#service-1" className="btn btn-line">{m.glanceHeading}</a>
              </div>
            </div>
            <Figure slot="reception" lang={lang} className="lg:col-span-5" ratio="4 / 5" ratioMobile="4 / 3" priority sizes="(min-width: 64rem) 36vw, 100vw" reveal revealDelay={1} />
          </div>
        </div>
      </header>

      <div className="container-page grid gap-10 pt-16 pb-12 md:pt-24 lg:grid-cols-12 lg:gap-16 md:pb-20">
        {/* Index of the four services, stays in view on wide screens */}
        <aside className="lg:col-span-3">
          <nav aria-label={m.glanceHeading} className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <h2 className="label">{m.glanceHeading}</h2>
            <ol className="mt-4 border-t border-hair">
              {t.benefits.items.map((item, i) => (
                <li key={item.title} className="border-b border-hair">
                  <a href={`#service-${i + 1}`} className="flex gap-3 py-2.5 text-[0.95rem] font-medium transition-colors hover:text-brick">
                    <span className="tabular-nums text-brick" aria-hidden="true">{num(i)}</span>
                    {item.title}
                  </a>
                </li>
              ))}
              <li className="border-b border-hair">
                <a href="#how-to-enquire" className="flex gap-3 py-2.5 text-[0.95rem] font-medium transition-colors hover:text-brick">
                  <span aria-hidden="true" className="text-brick">→</span>
                  {m.pathwayHeading}
                </a>
              </li>
            </ol>
          </nav>
        </aside>

        <div className="lg:col-span-9">
          {t.benefits.items.map((item, i) => (
            <Fragment key={item.title}>
              {i === 2 && (
                <Figure slot="factory" lang={lang} className="my-12" ratio="21 / 9" sizes="(min-width: 64rem) 70vw, 100vw" reveal />
              )}
              <section
                id={`service-${i + 1}`}
                aria-labelledby={`service-${i + 1}-title`}
                className="grid gap-5 border-t border-hair py-10 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-10 md:py-14"
                data-reveal
              >
                <p className="numeral text-[3.5rem] md:col-span-3 md:text-[5rem]" aria-hidden="true">{num(i)}</p>
                <div className="md:col-span-9">
                  <h2 id={`service-${i + 1}-title`} className="title-section">{item.title}</h2>
                  <p className="lede mt-4 max-w-[46ch]">{item.summary}</p>
                  <h3 className="label mt-8">{m.includes}</h3>
                  <ul className="bullets mt-3 max-w-[56ch] space-y-2 text-[0.98rem]">
                    {item.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </section>
            </Fragment>
          ))}

          {/* Enquiry pathway */}
          <section id="how-to-enquire" aria-labelledby="pathway-title" className="mt-6 bg-wash-soft px-6 py-10 sm:px-10 md:py-14" data-reveal>
            <h2 id="pathway-title" className="title-section">{m.pathwayHeading}</h2>
            <ol className="mt-8 grid gap-8 md:grid-cols-2">
              {m.steps.map((s, i) => (
                <li key={s.title} className="border-t border-ink pt-4">
                  <p className="numeral text-[1.5rem]" aria-hidden="true">{i + 1}</p>
                  <h3 className="title-item mt-3">{s.title}</h3>
                  <p className="mt-2 text-ink-soft">{s.body}</p>
                </li>
              ))}
            </ol>
            <p className="measure mt-8 text-[0.95rem] text-ink-soft">{t.benefits.feesNote}</p>
            <Link to={pagePath(lang, 'contact') + '?topic=membership'} className="btn btn-brick mt-6">
              {m.openForm}
            </Link>
            {!ENQUIRY_ENABLED && <p className="measure mt-5 text-[0.85rem] text-ink-mute">{m.noEndpointNote}</p>}
          </section>
        </div>
      </div>
    </>
  );
};
