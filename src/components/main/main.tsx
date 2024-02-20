import { JSXElement } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { DiagramContainer } from "../diagram/diagram";
import "./main.css";

export function Main(): JSXElement {
  const {
    processModel: { selectedProcess },
    diagram: { zoom, setZoom },
  } = useAppContext();

  function handleAutoZoomButtonClick() {
    // TODO: auto zoom
  }

  function handleNormalZoomButtonClick() {
    setZoom(1);
  }

  return (
    <div class="main">
      <h5>{selectedProcess().name}</h5>
      <div class="main__diagram">
        <DiagramContainer />
      </div>
      <div class="main__zoom">
        <button onClick={handleAutoZoomButtonClick}>Auto</button>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.01"
          value={zoom()}
          onInput={(e) => setZoom(Number(e.target.value))}
        />
        <button onClick={handleNormalZoomButtonClick}>100%</button>
      </div>
    </div>
  );
}
