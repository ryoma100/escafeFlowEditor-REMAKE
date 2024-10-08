/* @refresh reload */
import "solid-devtools";
import "@/index.css";

import { render } from "solid-js/web";

import App from "@/App";
import { ModelProvider } from "@/context/model-context";
import { ThemeProvider } from "@/context/theme-context";

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

// cancel iOS back swipe
window.addEventListener(
  "touchstart",
  (e) => {
    const SWIPE_WIDTH = 24;
    const pageX = e.touches[0].pageX;
    if (!(pageX > SWIPE_WIDTH && pageX < window.innerWidth - SWIPE_WIDTH)) {
      e.preventDefault();
    }
  },
  { passive: false },
);
