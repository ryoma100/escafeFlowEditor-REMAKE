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
    const swipeWidth = 24;
    const pageX = e.touches[0].pageX;
    if (!(pageX > swipeWidth && pageX < window.innerWidth - swipeWidth)) {
      e.preventDefault();
    }
  },
  { passive: false },
);

// cancel touch panel zoom on mac
window.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
  },
  { passive: false },
);
