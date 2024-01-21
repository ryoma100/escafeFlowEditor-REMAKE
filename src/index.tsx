/* @refresh reload */
import { render } from "solid-js/web";
import "solid-devtools";

import "./styles.css";
import App from "./App";
import { OperationProvider, ModelProvider } from "./context";

render(
  () => (
    <ModelProvider>
      <OperationProvider>
        <App />
      </OperationProvider>
    </ModelProvider>
  ),
  document.getElementById("root") as HTMLElement
);
