import { ActorList } from "../list/actor-list";
import { DiagramZoom } from "../diagram-zoom/diagram-zoom";
import { Menu } from "../menu/menu";
import { ProcessList } from "../list/process-list";
import { ToolIconButtons } from "../tool-icon-buttons/tool-icon-buttons";
import "./app.css";

export function App() {
  return (
    <div class="main">
      <Menu />
      <div class="container">
        <div class="split-left">
          <ProcessList />
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
