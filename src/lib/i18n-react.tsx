// src/lib/i18n-react.tsx
'use client';
import React, {createContext, useContext, useMemo} from 'react';

type Dict = Record<string, any>;
type Ctx = { t: (ns: string, key: string) => string };

const I18nCtx = createContext<Ctx>({ t: () => '' });

export function I18nProvider({messages, children}: {messages: Record<string, Dict>, children: React.ReactNode}) {
  const value = useMemo(() => ({
    t(ns: string, key: string) {
      try {
        // Простая обработка - ищем ключ напрямую в namespace
        const nsObj = (messages as any)[ns] ?? {};
        
        // Если ключ содержит точки, разбиваем его
        if (key.includes('.')) {
          const keys = key.split('.');
          let val = nsObj;
          for (const k of keys) {
            val = val?.[k];
            if (val === undefined) break;
          }
          return (typeof val === 'string') ? val : key;
        } else {
          // Простой ключ без точек
          const val = nsObj[key];
          return (typeof val === 'string') ? val : key;
        }
      } catch (error) {
        console.error('i18n error:', error);
        return key; // fallback на ключ при ошибке
      }
    }
  }), [messages]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useT(ns: string) {
  const {t} = useContext(I18nCtx);
  return (key: string) => t(ns, key);
}
