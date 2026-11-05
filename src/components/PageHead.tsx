import { pagePath } from '../lib/i18n';
import { translations, type Language } from '../translations';
import type { PhotoSlot } from '../data/photos';
import { Breadcrumb, type Crumb } from './Breadcrumb';
import { Figure } from './Figure';

interface PageHeadProps {
  lang: Language;
  title: string;
  standfirst?: string;
  /** Crumbs after Home. */
  trail: Crumb[];
  /** Optional full-width photograph under the title. */
  photo?: PhotoSlot;
  /** Optional small label above the title. */
  label?: string;
}

/** Page opening: breadcrumb, a large title with the standfirst beside it, and optionally a full-width image. */
export const PageHead = ({ lang, title, standfirst, trail, photo, label }: PageHeadProps) => {
  const t = translations[lang];
  return (
    <header className="pt-(--header-h)">
      <div className="container-page pt-8 md:pt-12">
        <Breadcrumb lang={lang} items={[{ label: t.breadcrumb.home, to: pagePath(lang) }, ...trail]} />
        <div className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8" data-reveal>
            {label && <p className="label mb-4">{label}</p>}
            <h1 className="title-page">{title}</h1>
          </div>
          {standfirst && (
            <p className="lede max-w-[40ch] lg:col-span-4 lg:self-end" data-reveal data-reveal-delay="1">
              {standfirst}
            </p>
          )}
        </div>
      </div>
      {photo ? (
        <div className="container-page mt-10 md:mt-14" data-reveal data-reveal-delay="1">
          <Figure slot={photo} lang={lang} ratio="21 / 9" priority caption="overlay" sizes="(min-width: 88rem) 80rem, 100vw" />
        </div>
      ) : (
        <div className="container-page mt-10 md:mt-14">
          <hr className="border-0 border-t border-hair" />
        </div>
      )}
    </header>
  );
};
