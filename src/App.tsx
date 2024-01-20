import { ActorList } from "./components/list/actor-list";
import { Menu } from "./components/menu/menu";
import { ProcessList } from "./components/list/process-list";
import { ToolIconButtons } from "./components/tool-icon-buttons/tool-icon-buttons";
import "./app.css";
import { ProcessDialog } from "./components/dialog/process-dialog";
import { PackageDialog } from "./components/dialog/package-dialog";
import { Main } from "./components/main/main";

function App() {
  return (
    <>
      <div class="app">
        <div class="app__menu">
          <Menu />
        </div>
        <div class="app__process-list">
          <ProcessList />
        </div>
        <div class="app__actor-list">
          <ActorList />
        </div>
        <div class="app__tool-button">
          <ToolIconButtons />
        </div>
        <div class="app__main">
          <Main />
        </div>
      </div>

      <PackageDialog />
      <ProcessDialog />
    </>
  );
}

export default App;
