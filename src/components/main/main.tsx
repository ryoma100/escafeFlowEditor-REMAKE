import "./main.css";
import { Diagram } from "../../diagram/disgram";
import { useModel } from "../../context/model-context";
import { useDiagram } from "../../context/diagram-context";
import { createEffect, createSignal } from "solid-js";

export function Main() {
  const {
    process: { selectedProcess },
  } = useModel();
  const {
    diagram: { setZoom },
  } = useDiagram();

  const [percentZoom, setPersentZoom] = createSignal(100);

  function handleAutoZoomButtonClick() {
    //
  }

  function handleNomalZoomButtonClick() {
    setPersentZoom(100);
  }

  createEffect(() => {
    setZoom(percentZoom() / 100);
  });

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
          value={percentZoom()}
          onInput={(e) => setPersentZoom(Number(e.target.value))}
        />
        <button onClick={handleNomalZoomButtonClick}>100%</button>
      </div>
    </div>
  );
}
