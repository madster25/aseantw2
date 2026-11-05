import { useId, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { translations, type Language } from '../translations';
import { ENQUIRY_ENDPOINT as ENDPOINT } from '../lib/enquiry';
import { eventBySlug, formatEventRange } from '../data/events';

interface EnquiryProps {
  lang: Language;
}

type FieldName = 'name' | 'company' | 'email' | 'market' | 'interest' | 'message';
type FormValues = Record<FieldName, string>;
type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'failed'; summary: string }
  | { kind: 'no-endpoint'; summary: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const empty: FormValues = {
  name: '',
  company: '',
  email: '',
  market: '',
  interest: 'membership',
  message: '',
};

export const Enquiry = ({ lang }: EnquiryProps) => {
  const t = translations[lang];
  const f = t.enquiry.fields;
  const [params] = useSearchParams();
  const topic = params.get('topic');
  const initialInterest = f.interestOptions.some((o) => o.value === topic) ? (topic as string) : empty.interest;
  const about = eventBySlug(params.get('about') ?? undefined);
  const initialMessage = about
    ? `${t.enquiry.aboutEvent}: ${about.title[lang]} (${formatEventRange(about.date, about.endDate, lang)})\n\n`
    : '';
  const [values, setValues] = useState<FormValues>({ ...empty, interest: initialInterest, message: initialMessage });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const baseId = useId();
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const id = (name: FieldName) => `${baseId}-${name}`;
  const errId = (name: FieldName) => `${baseId}-${name}-error`;

  const update = (name: FieldName) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<FieldName, string>> = {};
    if (!values.name.trim()) next.name = t.enquiry.errors.name;
    if (!EMAIL_RE.test(values.email.trim())) next.email = t.enquiry.errors.email;
    if (values.message.trim().length < 10) next.message = t.enquiry.errors.message;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildSummary = () => {
    const interestLabel =
      f.interestOptions.find((o) => o.value === values.interest)?.label ?? values.interest;
    return [
      `${f.interest}: ${interestLabel}`,
      `${f.name}: ${values.name.trim()}`,
      values.company.trim() ? `${f.company}: ${values.company.trim()}` : null,
      `${f.email}: ${values.email.trim()}`,
      values.market.trim() ? `${f.market}: ${values.market.trim()}` : null,
      '',
      values.message.trim(),
    ]
      .filter((line) => line !== null)
      .join('\n');
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCopyState('idle');
    if (!validate()) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const summary = buildSummary();

    if (!ENDPOINT) {
      setStatus({ kind: 'no-endpoint', summary });
      requestAnimationFrame(() => statusRef.current?.focus());
      return;
    }

    setStatus({ kind: 'sending' });
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          lang,
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus({ kind: 'sent' });
      setValues({ ...empty, interest: initialInterest });
    } catch {
      setStatus({ kind: 'failed', summary });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const copySummary = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };

  const errorList = (Object.entries(errors) as [FieldName, string | undefined][]).filter(
    ([, msg]) => Boolean(msg),
  );

  const fieldLabel = (label: string, required: boolean, htmlFor: string) => (
    <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-3 text-[0.95rem] font-semibold text-ink">
      <span>{label}</span>
      <span className="text-[0.8rem] font-normal text-ink-mute">{required ? f.required : f.optional}</span>
    </label>
  );

  const fieldError = (name: FieldName) =>
    errors[name] ? (
      <p id={errId(name)} className="mt-1.5 text-[0.9rem] text-brick">
        {errors[name]}
      </p>
    ) : null;

  return (
    <section id="enquiry" aria-label={t.enquiry.heading} className="pb-16 md:pb-24">
      <div className="container-page">
        <div className="grid gap-10 pt-12 md:pt-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="title-section">{t.enquiry.heading}</h2>
            <p className="measure-narrow mt-4 text-ink-soft">{t.enquiry.intro}</p>
            <p className="mt-4 text-[0.9rem] text-ink-mute">{t.enquiry.privacyNote}</p>
          </div>

          <div className="lg:col-span-8">
            {status.kind === 'sent' ? (
              <div
                ref={statusRef}
                tabIndex={-1}
                role="status"
                className="border-l-4 border-ok bg-white p-6 outline-none"
              >
                <p className="text-[1.5rem] font-semibold">{t.enquiry.sent.title}</p>
                <p className="mt-2 text-ink-soft">{t.enquiry.sent.body}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid gap-6 md:grid-cols-2">
                {errorList.length > 0 && (
                  <div
                    ref={summaryRef}
                    tabIndex={-1}
                    role="alert"
                    className="border-l-4 border-brick bg-white p-4 outline-none md:col-span-2"
                  >
                    <p className="font-semibold text-ink">{t.enquiry.errors.summary}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.95rem] text-ink-soft">
                      {errorList.map(([name, msg]) => (
                        <li key={name}>
                          <a href={`#${id(name)}`} className="link">
                            {msg}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  {fieldLabel(f.name, true, id('name'))}
                  <input
                    id={id('name')}
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="field mt-2"
                    value={values.name}
                    onChange={update('name')}
                    aria-invalid={errors.name ? 'true' : undefined}
                    aria-describedby={errors.name ? errId('name') : undefined}
                  />
                  {fieldError('name')}
                </div>

                <div>
                  {fieldLabel(f.company, false, id('company'))}
                  <input
                    id={id('company')}
                    name="company"
                    type="text"
                    autoComplete="organization"
                    className="field mt-2"
                    value={values.company}
                    onChange={update('company')}
                  />
                </div>

                <div>
                  {fieldLabel(f.email, true, id('email'))}
                  <input
                    id={id('email')}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    className="field mt-2"
                    value={values.email}
                    onChange={update('email')}
                    aria-invalid={errors.email ? 'true' : undefined}
                    aria-describedby={errors.email ? errId('email') : undefined}
                  />
                  {fieldError('email')}
                </div>

                <div>
                  {fieldLabel(f.market, false, id('market'))}
                  <input
                    id={id('market')}
                    name="market"
                    type="text"
                    className="field mt-2"
                    placeholder={f.marketPlaceholder}
                    value={values.market}
                    onChange={update('market')}
                  />
                </div>

                <div className="md:col-span-2">
                  {fieldLabel(f.interest, true, id('interest'))}
                  <select
                    id={id('interest')}
                    name="interest"
                    className="field mt-2"
                    value={values.interest}
                    onChange={update('interest')}
                  >
                    {f.interestOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  {fieldLabel(f.message, true, id('message'))}
                  <textarea
                    id={id('message')}
                    name="message"
                    rows={6}
                    required
                    className="field mt-2 resize-y"
                    placeholder={f.messagePlaceholder}
                    value={values.message}
                    onChange={update('message')}
                    aria-invalid={errors.message ? 'true' : undefined}
                    aria-describedby={errors.message ? errId('message') : undefined}
                  />
                  {fieldError('message')}
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="btn btn-brick disabled:cursor-wait disabled:opacity-70"
                    disabled={status.kind === 'sending'}
                  >
                    {status.kind === 'sending' ? t.enquiry.sending : t.enquiry.submit}
                  </button>
                </div>

                {(status.kind === 'no-endpoint' || status.kind === 'failed') && (
                  <div
                    ref={statusRef}
                    tabIndex={-1}
                    role="status"
                    className="border-l-4 border-ink bg-white p-6 outline-none md:col-span-2"
                  >
                    <p className="text-[1.4rem] font-semibold">
                      {status.kind === 'failed' ? t.enquiry.failed.title : t.enquiry.noEndpoint.title}
                    </p>
                    <p className="mt-2 text-ink-soft">
                      {status.kind === 'failed' ? t.enquiry.failed.body : t.enquiry.noEndpoint.body}
                    </p>
                    <pre className="mt-4 overflow-x-auto border border-hair bg-wash/60 p-4 font-sans text-[0.95rem] leading-relaxed whitespace-pre-wrap text-ink">
                      {status.summary}
                    </pre>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        className="btn btn-line"
                        onClick={() => copySummary(status.summary)}
                      >
                        {t.enquiry.noEndpoint.copy}
                      </button>
                      <span role="status" className="text-[0.95rem] text-ink-soft">
                        {copyState === 'copied' && t.enquiry.noEndpoint.copied}
                        {copyState === 'failed' && t.enquiry.noEndpoint.copyFailed}
                      </span>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
