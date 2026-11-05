import { useLang } from '../lib/useLang';
import { translations } from '../translations';
import { PageHead } from '../components/PageHead';
import { Enquiry } from '../components/Enquiry';

export const ContactPage = () => {
  const lang = useLang();
  const p = translations[lang].pages.contact;
  return (
    <>
      <PageHead lang={lang} title={p.title} standfirst={p.standfirst} trail={[{ label: p.title }]} photo="bangkok" />
      <Enquiry lang={lang} />
    </>
  );
};
