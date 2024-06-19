import { Preview } from "storybook-solidjs";

import "../src/index.css";

const preview: Preview = {
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
};

export default preview;
