import * as i18n from "@solid-primitives/i18n";
import {
  type JSX,
  createContext,
  createEffect,
  createMemo,
  createRenderEffect,
  createSignal,
  useContext,
} from "solid-js";

import { i18nEnDict } from "@/constants/i18n";
import { i18nJaDict } from "@/constants/i18n-ja";
import { setDataFactoryDict } from "@/data-source/data-factory";

export type Appearance = "light" | "dark" | "auto";
export type Theme = "material" | "crab";
export type Color = "green" | "red";

export function makeThemeContext() {
  const localeKey = "locale";
  const defaultLocale = (localStorage.getItem(localeKey) || navigator.language).toLowerCase().startsWith("ja")
    ? "ja"
    : "en";
  const dictionaries = { ja: i18nJaDict, en: i18nEnDict };
  const [locale, setLocale] = createSignal<keyof typeof dictionaries>(defaultLocale);
  const dict = createMemo(() => i18n.flatten(dictionaries[locale()]));
  createRenderEffect(() => {
    localStorage.setItem(localeKey, locale());
    setDataFactoryDict(dict());
  });

  const appearanceKey = "appearance";
  const defaultAppearance = (localStorage.getItem(appearanceKey) as Appearance) || "auto";
  const [appearance, setAppearance] = createSignal<Appearance>(defaultAppearance);
  createEffect(() => {
    localStorage.setItem(appearanceKey, appearance());

    switch (appearance()) {
      case "light":
        document.body.classList.add("light-theme");
        document.body.classList.remove("dark-theme");
        break;
      case "dark":
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        break;
      case "auto":
        document.body.classList.remove("dark-theme");
        document.body.classList.remove("dark-theme");
        break;
    }
  });

  const themeKey = "theme";
  const defaultTheme = (localStorage.getItem(themeKey) as Theme) || "material";
  const [theme, setTheme] = createSignal<Theme>(defaultTheme);
  createEffect(() => {
    localStorage.setItem(themeKey, theme());
  });

  const colorKey = "color";
  const defaultColor = (localStorage.getItem(colorKey) as Color) || "green";
  const [color, setColor] = createSignal<Color>(defaultColor);
  createEffect(() => {
    localStorage.setItem(colorKey, color());

    if (color() === "red") {
      document.documentElement.style.setProperty("--THEME1-COLOR", "#C2185B");
      document.documentElement.style.setProperty("--THEME2-COLOR", "#F48FB1");
    } else {
      document.documentElement.style.setProperty("--THEME1-COLOR", "#388e3c");
      document.documentElement.style.setProperty("--THEME2-COLOR", "#8bc34a");
    }
  });

  return {
    dict,
    locale,
    setLocale,
    appearance,
    setAppearance,
    theme,
    setTheme,
    color,
    setColor,
  };
}

const dummyValue = undefined as unknown as ReturnType<typeof makeThemeContext>;
export const ThemeContext = createContext(dummyValue);

export function ThemeProvider(props: { readonly children: JSX.Element }) {
  const value = makeThemeContext();
  return <ThemeContext.Provider value={value}>{props.children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
