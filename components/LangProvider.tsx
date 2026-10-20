"use client";

import { createContext, useContext } from "react";
import { defaultLang, translate, type Lang } from "@/lib/i18n";

const LangContext = createContext<Lang>(defaultLang);

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
export const useT = () => translate(useLang());
