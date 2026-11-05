import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Language, translations } from '../translations';

interface HeroProps {
  lang: Language;
}

export const Hero = ({ lang }: HeroProps) => {
  const t = translations[lang];
  
  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden bg-navy">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
          alt="Office Background"
          className="w-full h-full object-cover opacity-30 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent"></div>
      </div>

      <div className="container-custom relative z-10 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-0.5 w-8 bg-gold"></span>
            <span className="text-gold uppercase tracking-[0.2em] text-xs font-bold">{t.hero.badge}</span>
            <span className="h-0.5 w-8 bg-gold"></span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
            {t.hero.title}
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="gold" className="group">
              {t.hero.ctaMember}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline">
              {t.hero.ctaEvents}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Subtle bottom gradient for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent"></div>
    </section>
  );
};
