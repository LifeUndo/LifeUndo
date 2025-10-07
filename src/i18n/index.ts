// src/i18n/index.ts
import en from './en';
import ru from './ru';
import hi from './hi';
import zh from './zh';
import ar from './ar';
import kk from './kk';
import tr from './tr';

const dicts = { en, ru, hi, zh, ar, kk, tr } as const;

// Deep merge function that doesn't overwrite null/undefined values
function deepMerge(target: any, source: any): any {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] !== null && source[key] !== undefined) {
      if (typeof source[key] === 'object' && !Array.isArray(source[key]) && 
          typeof target[key] === 'object' && !Array.isArray(target[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
}

export function getT(locale: keyof typeof dicts) {
  const base = dicts.en;
  const loc = dicts[locale] ?? base;
  return deepMerge(base, loc);
}

export type Locale = keyof typeof dicts;
export { dicts };
