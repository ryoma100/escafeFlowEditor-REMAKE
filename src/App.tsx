import { ToolIconButtons } from "./components/tool-icon-buttons/tool-icon-buttons";
import { DiagramZoom } from "./components/diagram-zoom/diagram-zoom";
import "./App.css";
import { ProsessList } from "./components/prosess-list/prosess-list";
import { ActorList } from "./components/actor-list/actor-list";
import { Menu } from "./components/menu/menu";

function App() {
  return (
    <div class="app">
      <Menu />
      <div class="main">
        <div class="split-left">
          <ProsessList />
          <div class="v-divide"></div>
          <ActorList />
        </div>
        <div class="h-divide"></div>
        <div class="split-right">
          <ToolIconButtons />
          <div class="editor">
            <h5>プロセス1</h5>
            <canvas class="diagram" />
            <DiagramZoom />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
