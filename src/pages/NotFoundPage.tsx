import { Link } from 'react-router-dom';
import { useLang } from '../lib/useLang';
import { translations } from '../translations';
import { pagePath } from '../lib/i18n';

export const NotFoundPage = () => {
  const lang = useLang();
  const t = translations[lang];
  return (
    <section className="pt-(--header-h)">
      <div className="container-page section-pad">
        <p className="numeral text-[6rem] md:text-[9rem]" aria-hidden="true">404</p>
        <h1 className="title-page mt-2">{t.notFound.title}</h1>
        <p className="measure mt-4 text-ink-soft">{t.notFound.body}</p>
        <Link to={pagePath(lang)} className="btn btn-brick mt-8">{t.notFound.link}</Link>
      </div>
    </section>
  );
};
