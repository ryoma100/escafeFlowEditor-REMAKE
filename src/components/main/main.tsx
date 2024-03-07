import { JSXElement } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { DiagramContainer } from "../diagram/diagram";

export function Main(): JSXElement {
  const {
    processModel: { selectedProcess },
    baseNodeModel: { maxRectangle },
    diagram: { zoom, setZoom, autoRectangle },
  } = useAppContext();

  function handleAutoZoomButtonClick() {
    const rect = maxRectangle();
    if (rect) {
      autoRectangle(rect);
    }
  }

  function handleNormalZoomButtonClick() {
    setZoom(1);
  }

  return (
    <div class="flex h-full flex-col">
      <h5>{selectedProcess().detail.name}</h5>
      <div class="flex-grow bg-background">
        <DiagramContainer />
      </div>
      <div class="mt-1 flex w-full flex-row justify-center gap-x-2">
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
