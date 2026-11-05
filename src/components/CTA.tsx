import { motion } from 'motion/react';
import { Button } from './Button';
import { Language, translations } from '../translations';

interface CTAProps {
  lang: Language;
}

export const CTA = ({ lang }: CTAProps) => {
  const t = translations[lang];

  return (
    <section className="py-24 bg-surface-dim border-y border-navy/5">
      <div className="container-custom text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy/80 mb-8 leading-tight">
             {t.cta.text}
          </h2>
          
          <Button variant="gold" className="px-12 py-4 text-white hover:scale-105 transition-transform">
            {t.cta.button}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
