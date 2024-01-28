import "./main.css";
import { Diagram } from "../../diagram/disgram";
import { useModel } from "../../context/model-context";
import { useDiagram } from "../../context/diagram-context";

export function Main() {
  const {
    process: { selectedProcess },
  } = useModel();
  const {
    diagram: { zoom, setZoom },
  } = useDiagram();

  function handleAutoZoomButtonClick() {
    //
  }

  function handleNomalZoomButtonClick() {
    setZoom(1);
  }

  return (
    <div class="main">
      <h5>{selectedProcess().title}</h5>
      <div class="main__diagram">
        <Diagram />
      </div>
      <div class="main__zoom">
        <button onClick={handleAutoZoomButtonClick}>Auto</button>
        <input
          type="range"
          min="10"
          max="200"
          step="1"
          value={zoom() * 100}
          onInput={(e) => setZoom(Number(e.target.value) / 100)}
        />
        <button onClick={handleNomalZoomButtonClick}>100%</button>
      </div>
    </div>
  );
}
