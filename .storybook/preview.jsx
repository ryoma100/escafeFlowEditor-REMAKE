import { withThemeByClassName } from "@storybook/addon-themes";
import { ThemeContext, makeThemeContext } from "../src/context/theme-context";
import "../src/index.css";

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
  },
  globalTypes: {
    locale: {
      name: "Locale",
      description: "Change locale",
      defaultValue: "en",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en", right: "🇺🇸", title: "English" },
          { value: "ja", right: "🇯🇵", title: "Japanese" },
        ],
      },
    },
    icon: {
      name: "Icon",
      description: "Change icon",
      defaultValue: "material",
      toolbar: {
        icon: "facehappy",
        items: [
          { value: "material", right: "", title: "Default (Used By Material Icons)" },
          {
            value: "crab",
            right: "🦀",
            title: "Crab (Made By Image Creator from Microsoft Designer)",
          },
        ],
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "light-theme",
        dark: "dark-theme",
      },
      defaultTheme: "light",
    }),
    (Story, { globals }) => {
      const value = makeThemeContext();
      value.setLocale(globals.locale);
      value.setTheme(globals.icon);
      return (
        <ThemeContext.Provider value={value}>
          <Story />
        </ThemeContext.Provider>
      );
    },
  ],
};

export default preview;
