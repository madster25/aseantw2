/**
 * Chamber mark. Colours come from --logo-navy / --logo-gold in index.css and are the colours of the
 * original site's wordmark. They are deliberately outside the site palette. Replace this component
 * with the official logo file once the chamber supplies it.
 */
export const Logo = ({ size = 40 }: { size?: number }) => (
  <span
    aria-hidden="true"
    lang="zh-TW"
    className="relative inline-grid shrink-0 place-items-center text-white"
    style={{
      width: size,
      height: size,
      background: 'var(--logo-navy)',
      fontSize: size * 0.58,
      fontWeight: 700,
      lineHeight: 1,
    }}
  >
    東
    <span className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: 'var(--logo-gold)' }} />
  </span>
);
