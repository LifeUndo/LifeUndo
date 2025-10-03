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
        const nsObj = (messages as any)[ns] ?? {};
        const val = key.split('.').reduce((acc, k) => (acc && acc[k]) ?? undefined, nsObj);
        return (typeof val === 'string') ? val : key; // fallback на ключ, если не найдено
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
