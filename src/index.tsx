/* @refresh reload */
import "solid-devtools";
import { render } from "solid-js/web";
import App from "./App";
import { AppProvider } from "./context/app-context";
import "./reset.css";
import "./styles.css";

document.onselectstart = () => {
  return false;
};

render(
  () => (
    <AppProvider>
      <App />
    </AppProvider>
  ),
  document.getElementById("root") as HTMLElement,
);
