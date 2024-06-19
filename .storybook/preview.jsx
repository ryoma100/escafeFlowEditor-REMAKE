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
  },
  globalTypes: {
    locale: {
      name: "Locale",
      description: "Change locale",
      defaultValue: "en",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en", right: "en", title: "English" },
          { value: "ja", right: "ja", title: "Japanese" },
        ],
      },
    },
  },
  decorators: [
    (Story, { globals }) => {
      const value = makeThemeContext();
      value.setLocale(globals.locale);
      return (
        <ThemeContext.Provider value={value}>
          <Story />
        </ThemeContext.Provider>
      );
    },
  ],
};

export default preview;
