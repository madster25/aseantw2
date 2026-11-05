import { motion } from 'motion/react';
import { Language, translations } from '../translations';

interface MissionProps {
  lang: Language;
}

export const Mission = ({ lang }: MissionProps) => {
  const t = translations[lang];
  
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-8 leading-tight">
              {t.mission.title}
            </h2>
            
            <div className="space-y-6 text-navy/70 leading-relaxed text-lg">
              <p>
                {t.mission.p1}
              </p>
              <p>
                {t.mission.p2}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute -top-6 -left-6 w-full h-full bg-gold/5 rounded-sm -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200" 
              alt="Business Meeting"
              className="w-full h-auto rounded-sm shadow-2xl relative z-10"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
