import { motion } from 'motion/react';
import { Users, BarChart3, Globe, Calendar, ArrowUpRight } from 'lucide-react';
import { Language, translations } from '../translations';

interface BenefitsProps {
  lang: Language;
}

export const Benefits = ({ lang }: BenefitsProps) => {
  const t = translations[lang];

  const benefitCards = [
    {
      title: t.benefits.networking.title,
      description: t.benefits.networking.desc,
      icon: <Users className="w-6 h-6 text-white" />,
      iconBg: 'bg-navy',
      link: '#',
      image: null
    },
    {
      title: t.benefits.investment.title,
      description: t.benefits.investment.desc,
      icon: <BarChart3 className="w-6 h-6 text-gold" />,
      iconBg: 'bg-navy/10',
      link: '#',
      bgClass: 'bg-navy text-white',
      descClass: 'text-white/70'
    },
    {
      title: t.benefits.market.title,
      description: t.benefits.market.desc,
      icon: <Globe className="w-6 h-6 text-navy" />,
      iconBg: 'bg-surface-dim',
      link: '#',
      bgClass: 'bg-white',
    },
    {
      title: t.benefits.events.title,
      description: t.benefits.events.desc,
      icon: <Calendar className="w-6 h-6 text-gold" />,
      iconBg: 'bg-gold/10',
      link: '#',
      bgClass: 'bg-white relative overflow-hidden',
      hasImageOverlay: true
    }
  ];

  return (
    <section className="py-24 bg-surface">
      <div className="container-custom">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">{t.benefits.title}</h2>
          <div className="w-20 h-1 bg-gold"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefitCards.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group p-10 shadow-sm border border-navy/5 flex flex-col justify-between min-h-[320px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${benefit.bgClass || 'bg-white'}`}
            >
              <div>
                <div className={`w-12 h-12 ${benefit.iconBg} flex items-center justify-center mb-8`}>
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 font-serif">{benefit.title}</h3>
                <p className={`${benefit.descClass || 'text-navy/65'} mb-8 leading-relaxed`}>
                  {benefit.description}
                </p>
              </div>
              
              <a 
                href={benefit.link} 
                className={`inline-flex items-center gap-2 text-sm font-bold tracking-wider uppercase group-hover:gap-3 transition-all ${benefit.bgClass?.includes('bg-navy') ? 'text-gold' : 'text-gold'}`}
              >
                {t.benefits.learnMore} <ArrowUpRight className="w-4 h-4" />
              </a>

              {benefit.hasImageOverlay && (
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 grayscale group-hover:opacity-20 transition-opacity pointer-events-none">
                   <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" 
                    alt="Corporate"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
