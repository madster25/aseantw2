import { motion } from 'motion/react';
import { Briefcase, LineChart, ChevronRight } from 'lucide-react';
import { Language, translations } from '../translations';

interface OpportunitiesProps {
  lang: Language;
}

export const Opportunities = ({ lang }: OpportunitiesProps) => {
  const t = translations[lang];

  const opportunities = [
    {
      title: t.opportunities.strategic.title,
      description: t.opportunities.strategic.desc,
      icon: <Briefcase className="w-5 h-5 text-gold" />,
    },
    {
      title: t.opportunities.briefings.title,
      description: t.opportunities.briefings.desc,
      icon: <LineChart className="w-5 h-5 text-gold" />,
    }
  ];

  const events = [
    {
      date: t.opportunities.event1Date,
      title: t.opportunities.event1Title,
      description: t.opportunities.event1Desc
    },
    {
      date: t.opportunities.event2Date,
      title: t.opportunities.event2Title,
      description: t.opportunities.event2Desc
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-4xl font-bold text-navy mb-4">{t.opportunities.title}</h2>
            <p className="text-navy/60 mb-12 text-lg">
              {t.opportunities.subtitle}
            </p>

            <div className="space-y-6">
              {opportunities.map((opp, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 bg-surface-dim/40 border border-navy/5 rounded-sm hover:bg-surface-dim transition-colors"
                >
                  <div className="mt-1">{opp.icon}</div>
                  <div>
                    <h4 className="font-bold text-navy mb-1">{opp.title}</h4>
                    <p className="text-sm text-navy/60">{opp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-navy text-white p-10 rounded-sm shadow-2xl lg:translate-y-[-40px]"
          >
            <h3 className="text-2xl font-bold mb-10 pb-4 border-b border-white/10">{t.opportunities.upcomingTitle}</h3>
            
            <div className="space-y-12">
              {events.map((event, index) => (
                <div key={index} className="group cursor-pointer">
                  <span className="text-gold text-xs font-bold tracking-widest block mb-2 uppercase">{event.date}</span>
                  <h4 className="text-lg font-bold mb-2 group-hover:text-gold transition-colors">{event.title}</h4>
                  <p className="text-white/60 text-sm leading-relaxed">{event.description}</p>
                </div>
              ))}
            </div>

            <button className="mt-12 w-full py-4 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest hover:bg-gold/10 transition-all flex items-center justify-center gap-2">
              {t.opportunities.viewCalendar} <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
