import { useMemo } from "react";

const RTL_LANGUAGES = new Set(["ar"]);

export function useI18n(lang: string) {
  const dir = RTL_LANGUAGES.has(lang) ? "rtl" : "ltr";
  
  function label(t: Record<string, string>, fallback = "en"): string {
    return t[lang] ?? t[fallback] ?? "";
  }
  
  return useMemo(() => ({ 
    lang, 
    dir, 
    label 
  }), [lang, dir]);
}

export default useI18n;