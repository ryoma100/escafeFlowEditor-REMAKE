import { DiagramZoom } from "../diagram-zoom/diagram-zoom";
import "./main.css";
import { useModel } from "../../context";

export function Main() {
  const {
    process: { selectedProcess },
  } = useModel();

  return (
    <div class="main">
      <h5>{selectedProcess().title}</h5>
      <canvas class="main__diagram" />
      <DiagramZoom />
    </div>
  );
}
