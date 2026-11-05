import { Link } from 'react-router-dom';
import { translations, type Language } from '../translations';

export interface Crumb {
  label: string;
  to?: string;
}

export const Breadcrumb = ({ items, lang }: { items: Crumb[]; lang: Language }) => (
  <nav aria-label={translations[lang].a11y.breadcrumb} className="text-[0.82rem] text-ink-mute">
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <li key={`${c.label}-${i}`} className="flex items-center gap-2">
            {c.to && !last ? (
              <Link to={c.to} className="link inline-block py-2">
                {c.label}
              </Link>
            ) : (
              <span aria-current={last ? 'page' : undefined} className={last ? 'font-medium text-ink' : ''}>
                {c.label}
              </span>
            )}
            {!last && <span aria-hidden="true">/</span>}
          </li>
        );
      })}
    </ol>
  </nav>
);
