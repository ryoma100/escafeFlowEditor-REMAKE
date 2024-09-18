import { JSXElement } from "solid-js";

import { DiagramContainer } from "@/components/diagram/diagram";
import { useModelContext } from "@/context/model-context";

export function Main(): JSXElement {
  const {
    processModel: { selectedProcess },
    diagramModel: { zoom, changeZoom, fitViewBox },
  } = useModelContext();

  function handleAutoZoomButtonClick() {
    fitViewBox();
  }

  function handleNormalZoomButtonClick() {
    changeZoom(1.0);
  }

  return (
    <div class="flex h-full w-full flex-col">
      <div class="h-6">
        <h5 class="leading-6">{selectedProcess().detail.name}</h5>
      </div>
      <div class="grow bg-background size-full">
        <DiagramContainer />
      </div>
      <div class="mt-1 flex w-full h-7 flex-row justify-center gap-x-2">
        <button type="button" onClick={handleAutoZoomButtonClick}>
          Auto
        </button>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.01"
          value={zoom()}
          onInput={(e) => changeZoom(Number(e.target.value))}
        />
        <button type="button" onClick={handleNormalZoomButtonClick}>
          {Math.trunc(zoom() * 100)}%
        </button>
      </div>
    </div>
  );
}
