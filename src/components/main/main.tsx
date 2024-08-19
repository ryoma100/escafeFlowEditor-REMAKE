import { JSXElement } from "solid-js";

import { DiagramContainer } from "@/components/diagram/diagram";
import { useModelContext } from "@/context/model-context";

export function Main(): JSXElement {
  const {
    processModel: { selectedProcess },
    nodeModel: { computeMaxRectangle: maxRectangle },
    diagramModel: { zoom, setZoom, autoRectangle },
  } = useModelContext();

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
      <div class="grow bg-background">
        <DiagramContainer />
      </div>
      <div class="mt-1 flex w-full flex-row justify-center gap-x-2">
        <button type="button" onClick={handleAutoZoomButtonClick}>
          Auto
        </button>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.01"
          value={zoom()}
          onInput={(e) => setZoom(Number(e.target.value))}
        />
        <button type="button" onClick={handleNormalZoomButtonClick}>
          {Math.trunc(zoom() * 100)}%
        </button>
      </div>
    </div>
  );
}
