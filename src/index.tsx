/* @refresh reload */
import { render } from "solid-js/web";
import "solid-devtools";

import "./styles.css";
import App from "./App";
import { ModelProvider } from "./context";

render(
  () => (
    <ModelProvider>
      <App />
    </ModelProvider>
  ),
  document.getElementById("root") as HTMLElement
);
