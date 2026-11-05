import { useOutletContext } from 'react-router-dom';
import type { Language } from '../translations';

export const useLang = () => useOutletContext<{ lang: Language }>().lang;
