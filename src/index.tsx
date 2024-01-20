/* @refresh reload */
import { render } from "solid-js/web";
import "solid-devtools";

import "./styles.css";
import App from "./App";
import { DialogProvider, ModelProvider } from "./context";

render(
  () => (
    <ModelProvider>
      <DialogProvider>
        <App />
      </DialogProvider>
    </ModelProvider>
  ),
  document.getElementById("root") as HTMLElement
);
