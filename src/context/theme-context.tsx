import * as i18n from "@solid-primitives/i18n";
import { JSX, createContext, createEffect, createMemo, createSignal, useContext } from "solid-js";

import { i18nEnDict } from "@/constants/i18n";
import { i18nJaDict } from "@/constants/i18n-ja";
import { setDataFactoryDict } from "@/data-source/data-factory";

export type Theme = "material" | "crab";
export type Color = "green" | "red";
const themeColorMap: Record<Theme, Color> = { material: "green", crab: "red" };

export function makeThemeContext() {
  const LOCALE_KEY = "locale";
  const defaultLocale = (localStorage.getItem(LOCALE_KEY) || navigator.language)
    .toLowerCase()
    .startsWith("ja")
    ? "ja"
    : "en";

  const THEME_KEY = "theme";
  const defaultTheme = (localStorage.getItem(THEME_KEY) as Theme) || "material";
  const COLOR_KEY = "color";
  const defaultColor = (localStorage.getItem(COLOR_KEY) as Color) || "green";

  const dictionaries = { ja: i18nJaDict, en: i18nEnDict };
  const [locale, setLocale] = createSignal<keyof typeof dictionaries>(defaultLocale);
  const dict = createMemo(() => i18n.flatten(dictionaries[locale()]));
  createEffect(() => {
    localStorage.setItem(LOCALE_KEY, locale());
    setDataFactoryDict(dict());
  });

  const [color, setColor] = createSignal<Color>(defaultColor);
  createEffect(() => {
    localStorage.setItem(COLOR_KEY, color());
  });

  const [theme, setTheme] = createSignal<Theme>(defaultTheme);
  createEffect(() => {
    localStorage.setItem(THEME_KEY, theme());
    setColor(themeColorMap[theme()]);
  });

  return { dict, locale, setLocale, theme, setTheme, color, setColor };
}

const themeContextValue = {
  ...makeThemeContext(),
};

const ThemeContext = createContext(themeContextValue);

export function ThemeProvider(props: { children: JSX.Element }) {
  return <ThemeContext.Provider value={themeContextValue}>{props.children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
