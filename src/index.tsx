/* @refresh reload */
import "solid-devtools";

import { render } from "solid-js/web";

import App from "@/App";
import { ModelProvider } from "@/context/model-context";
import { ThemeProvider } from "@/context/theme-context";
import "@/index.css";

render(
  () => (
    <ThemeProvider>
      <ModelProvider>
        <App />
      </ModelProvider>
    </ThemeProvider>
  ),
  document.getElementById("root") as HTMLElement,
);
