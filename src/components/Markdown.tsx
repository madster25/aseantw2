import { Fragment, type ReactNode } from 'react';

/**
 * Renders the restricted Markdown used by the guides: paragraphs, "## " headings,
 * bullet and numbered lists, pipe tables, **bold** and [links](https://...).
 * Everything is built as React elements, so no HTML from the source is ever injected.
 */

const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\((https?:\/\/[^)\s]+)\))/g;

const renderInline = (text: string, keyPrefix: string): ReactNode[] => {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    const token = m[0];
    if (token.startsWith('**')) {
      out.push(<strong key={`${keyPrefix}-b${i}`}>{token.slice(2, -2)}</strong>);
    } else {
      const label = token.slice(1, token.indexOf(']('));
      const href = m[2];
      out.push(
        <a key={`${keyPrefix}-a${i}`} href={href} className="link" rel="noopener noreferrer" target="_blank">
          {label}
        </a>,
      );
    }
    last = start + token.length;
    i += 1;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
};

const stripTrailingColon = (s: string) => s.replace(/[:：]\s*$/, '');

type Block =
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'table'; header: string[]; rows: string[][] };

const parse = (md: string): Block[] => {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) {
      blocks.push({ kind: 'p', text: para.join(' ') });
      para = [];
    }
  };
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const t = line.trim();
    if (!t) {
      flush();
      continue;
    }
    if (t.startsWith('### ')) {
      flush();
      blocks.push({ kind: 'h3', text: stripTrailingColon(t.slice(4)) });
      continue;
    }
    if (t.startsWith('## ') || t.startsWith('# ')) {
      flush();
      blocks.push({ kind: 'h2', text: stripTrailingColon(t.replace(/^#+\s*/, '')) });
      continue;
    }
    if (/^[-*] /.test(t)) {
      flush();
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i].trim())) {
        items.push(lines[i].trim().slice(2));
        i += 1;
      }
      i -= 1;
      blocks.push({ kind: 'ul', items });
      continue;
    }
    if (/^\d+\. /.test(t)) {
      flush();
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\. /, ''));
        i += 1;
      }
      i -= 1;
      blocks.push({ kind: 'ol', items });
      continue;
    }
    if (t.startsWith('|')) {
      flush();
      const rowsRaw: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rowsRaw.push(lines[i].trim());
        i += 1;
      }
      i -= 1;
      const cells = (r: string) =>
        r
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((c) => c.trim());
      const body = rowsRaw.filter((r) => !/^\|?\s*:?-{2,}/.test(r.replace(/\|/g, ' ').trim()));
      const [header, ...rows] = body.map(cells);
      if (header) blocks.push({ kind: 'table', header, rows });
      continue;
    }
    para.push(t);
  }
  flush();
  return blocks;
};

export const Markdown = ({ source, lang }: { source: string; lang: 'en' | 'zh-tw' }) => {
  const blocks = parse(source);
  const zh = lang === 'zh-tw';
  return (
    <div className={`guide-body ${zh ? 'guide-body-zh' : ''}`}>
      {blocks.map((b, idx) => {
        const k = `b${idx}`;
        switch (b.kind) {
          case 'h2':
            return (
              <h2 key={k} className="mt-10 text-[1.55rem] leading-snug first:mt-0">
                {renderInline(b.text, k)}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={k} className="mt-7 text-[1.2rem] leading-snug">
                {renderInline(b.text, k)}
              </h3>
            );
          case 'p':
            return (
              <p key={k} className="mt-4">
                {renderInline(b.text, k)}
              </p>
            );
          case 'ul':
            return (
              <ul key={k} className="mt-4 space-y-2 pl-5 marker:text-brick" style={{ listStyleType: 'square' }}>
                {b.items.map((it, j) => (
                  <li key={`${k}-${j}`}>{renderInline(it, `${k}-${j}`)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={k} className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-brick">
                {b.items.map((it, j) => (
                  <li key={`${k}-${j}`}>{renderInline(it, `${k}-${j}`)}</li>
                ))}
              </ol>
            );
          case 'table':
            return (
              <div key={k} className="mt-5 overflow-x-auto">
                <table className="w-full border-collapse text-[0.95rem]">
                  <thead>
                    <tr>
                      {b.header.map((h, j) => (
                        <th key={`${k}-h${j}`} scope="col" className="border-b border-ink py-2 pr-4 text-left font-semibold">
                          {renderInline(h, `${k}-h${j}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={`${k}-r${r}`}>
                        {row.map((c, j) => (
                          <td key={`${k}-r${r}c${j}`} className="border-b border-hair py-2 pr-4 align-top">
                            {renderInline(c, `${k}-r${r}c${j}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return <Fragment key={k} />;
        }
      })}
    </div>
  );
};
