import "./main.css";
import { Diagram } from "../../diagram/disgram";
import { createSignal } from "solid-js";
import { useModel } from "../../context/model-context";

export function Main() {
  const {
    process: { selectedProcess },
  } = useModel();

  const [zoom, setZoom] = createSignal(100);

  function handleAutoZoomButtonClick() {
    //
  }

  function handleNomalZoomButtonClick() {
    setZoom(100);
  }

  return (
    <div class="main">
      <h5>{selectedProcess().title}</h5>
      <div class="main__diagram">
        <Diagram zoom={zoom() / 100} />
      </div>
      <div class="main__zoom">
        <button onClick={handleAutoZoomButtonClick}>Auto</button>
        <input
          type="range"
          min="5"
          max="200"
          step="1"
          value={zoom()}
          onInput={(e) => setZoom(Number(e.target.value))}
        />
        <button onClick={handleNomalZoomButtonClick}>100%</button>
      </div>
    </div>
  );
}
