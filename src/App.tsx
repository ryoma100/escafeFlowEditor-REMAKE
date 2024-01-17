import { ToolIconButtons } from "./components/tool-icon-buttons/tool-icon-buttons";
import { DiagramZoom } from "./components/diagram-zoom/diagram-zoom";
import "./App.css";
import { ProsessList } from "./components/prosess-list/prosess-list";
import { ActorList } from "./components/actor-list/actor-list";

function App() {
  return (
    <div class="app">
      <div class="menu" />
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
            <div class="title">プロセス1</div>
            <canvas class="diagram" />
            <DiagramZoom />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
