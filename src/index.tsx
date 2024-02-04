/* @refresh reload */
import { render } from "solid-js/web";
import "solid-devtools";
import "./styles.css";
import App from "./App";
import { AppProvider } from "./context/app-context";

document.onselectstart = () => {
  return false;
};

render(
  () => (
    <AppProvider>
      <App />
    </AppProvider>
  ),
  document.getElementById("root") as HTMLElement
);
