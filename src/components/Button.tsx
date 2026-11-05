import React from 'react';
import { motion } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold';
  children: React.ReactNode;
  className?: string;
}

export const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  const baseStyles = "px-8 py-3 font-semibold transition-all duration-300 text-sm tracking-wide inline-flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-navy text-white hover:bg-navy/90 border border-navy",
    secondary: "bg-white text-navy hover:bg-surface-dim border border-navy/10",
    outline: "bg-transparent text-white border border-white hover:bg-white hover:text-navy",
    gold: "bg-gold text-white hover:bg-gold/90 border border-gold shadow-lg shadow-gold/20",
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
