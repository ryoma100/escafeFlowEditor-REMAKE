import * as i18n from "@solid-primitives/i18n";
import { createContext, createEffect, createMemo, createSignal, JSX, useContext } from "solid-js";

import { i18nEnDict } from "@/constants/i18n";
import { i18nJaDict } from "@/constants/i18n-ja";
import { setDataFactoryDict } from "@/data-source/data-factory";

export type Theme = "material" | "crab";
export type Appearance = "light" | "dark" | "auto";

export function makeThemeContext() {
  const LOCALE_KEY = "locale";
  const defaultLocale = (localStorage.getItem(LOCALE_KEY) || navigator.language)
    .toLowerCase()
    .startsWith("ja")
    ? "ja"
    : "en";

  const THEME_KEY = "theme";
  const defaultTheme = (localStorage.getItem(THEME_KEY) as Theme) || "material";
  const APPEARANCE_KEY = "appearance";
  const defaultAppearance = (localStorage.getItem(APPEARANCE_KEY) as Appearance) || "auto";

  const dictionaries = { ja: i18nJaDict, en: i18nEnDict };
  const [locale, setLocale] = createSignal<keyof typeof dictionaries>(defaultLocale);
  const dict = createMemo(() => i18n.flatten(dictionaries[locale()]));
  createEffect(() => {
    localStorage.setItem(LOCALE_KEY, locale());
    setDataFactoryDict(dict());
  });

  const [theme, setTheme] = createSignal<Theme>(defaultTheme);
  createEffect(() => {
    localStorage.setItem(THEME_KEY, theme());
  });

  const [appearance, setAppearance] = createSignal<Appearance>(defaultAppearance);
  createEffect(() => {
    localStorage.setItem(APPEARANCE_KEY, appearance());
    document.body.classList.remove("light-theme");
    document.body.classList.remove("dark-theme");
    switch (appearance()) {
      case "light":
        document.body.classList.add("light-theme");
        break;
      case "dark":
        document.body.classList.add("dark-theme");
        break;
    }
  });

  return { dict, locale, setLocale, theme, setTheme, appearance, setAppearance };
}

const themeContextValue = {
  ...makeThemeContext(),
};

export const ThemeContext = createContext(themeContextValue);

export function ThemeProvider(props: { readonly children: JSX.Element }) {
  return <ThemeContext.Provider value={themeContextValue}>{props.children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
