import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from './Button';
import { Language, translations } from '../translations';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  lang: Language;
}

export const Navbar = ({ lang }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = translations[lang];
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.home, href: '#' },
    { name: t.nav.about, href: '#' },
    { name: t.nav.benefits, href: '#' },
    { name: t.nav.events, href: '#' },
    { name: t.nav.opportunities, href: '#' },
  ];

  const getSwitchPath = (targetLang: Language) => {
    return `/${targetLang}`;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container-custom flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`text-xl md:text-2xl font-serif font-bold tracking-tight transition-colors duration-300 ${isScrolled ? 'text-navy' : 'text-white'}`}>
            {lang === 'en' ? (
              <>ASEAN <span className="text-gold">Taiwan</span> Chamber <span className="text-gold">of</span> Commerce</>
            ) : (
              <>{t.nav.logo}</>
            )}
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-300 relative group ${isScrolled ? 'text-navy/70 hover:text-gold' : 'text-white/80 hover:text-white'}`}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
            </a>
          ))}
          
          <div className={`flex items-center border-l pl-6 border-white/20 gap-3 text-xs font-semibold ${isScrolled ? 'text-navy/60' : 'text-white/60'}`}>
            <Link 
              to="/en" 
              className={`hover:text-gold transition-colors ${lang === 'en' ? 'text-gold' : ''}`}
            >
              EN
            </Link>
            <span className="opacity-30">|</span>
            <Link 
              to="/zh-tw" 
              className={`hover:text-gold transition-colors ${lang === 'zh-tw' ? 'text-gold' : ''}`}
            >
              繁中
            </Link>
          </div>

          <Button variant={isScrolled ? "primary" : "outline"} className="ml-2">
            {t.nav.join}
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <div className={`flex items-center gap-2 text-xs font-bold ${isScrolled ? 'text-navy' : 'text-white'}`}>
            <Link to="/en" className={lang === 'en' ? 'text-gold' : ''}>EN</Link>
            <span className="opacity-30">|</span>
            <Link to="/zh-tw" className={lang === 'zh-tw' ? 'text-gold' : ''}>繁中</Link>
          </div>
          <button 
            className={`transition-colors ${isScrolled ? 'text-navy' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-surface-dim overflow-hidden"
          >
            <div className="container-custom py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-navy hover:text-gold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <Button variant="primary" className="w-full mt-4">
                {t.nav.join}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
