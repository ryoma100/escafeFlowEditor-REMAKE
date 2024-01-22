/* @refresh reload */
import { render } from "solid-js/web";
import "solid-devtools";
import "./styles.css";
import App from "./App";
import { ModelProvider } from "./context/model-context";
import { OperationProvider } from "./context/operation-context";

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
1;
