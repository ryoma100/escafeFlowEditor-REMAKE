import { ActorList } from "./components/actor-list/actor-list";
import { DiagramZoom } from "./components/diagram-zoom/diagram-zoom";
import { Menu } from "./components/menu/menu";
import { ProcessList } from "./components/process-list/process-list";
import { ToolIconButtons } from "./components/tool-icon-buttons/tool-icon-buttons";
import "./app.css";
import { useModel } from "./context";
import { ProcessDialog } from "./components/dialog/process-dialog";

function App() {
  const {
    process: { selectedProcess },
  } = useModel();

  return (
    <>
      <div class="app">
        <Menu />
        <div class="main">
          <div class="split-left">
            <ProcessList />
            <div class="v-divide"></div>
            <ActorList />
          </div>
          <div class="h-divide"></div>
          <div class="split-right">
            <ToolIconButtons />
            <div class="editor">
              <h5>{selectedProcess().title}</h5>
              <canvas class="diagram" />
              <DiagramZoom />
            </div>
          </div>
        </div>
      </div>

      <ProcessDialog />
    </>
  );
}

export default App;
