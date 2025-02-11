import type { JSXElement } from "solid-js";

import { DiagramContainer } from "@/components/diagram/diagram";
import { useModelContext } from "@/context/model-context";
import { Button } from "../parts/button";
import { RangeInput } from "../parts/range-input";

export function Main(): JSXElement {
  const { processModel, diagramModel } = useModelContext();

  function handleAutoZoomButtonClick() {
    diagramModel.fitViewBox();
  }

  function handleNormalZoomButtonClick() {
    diagramModel.changeZoom(1.0);
  }

  return (
    <div class="flex size-full flex-col">
      <div class="h-6">
        <h5 class="leading-6">{processModel.selectedProcess().detail.name}</h5>
      </div>
      <div class="size-full grow bg-background">
        <DiagramContainer />
      </div>
      <div class="mt-1 flex h-7 w-full flex-row justify-center gap-x-2">
        <Button type="button" onClick={handleAutoZoomButtonClick}>
          Auto
        </Button>
        <RangeInput
          min="0.1"
          max="2"
          step="0.01"
          value={diagramModel.zoom()}
          onInput={(e) => diagramModel.changeZoom(Number(e.target.value))}
        />
        <Button type="button" onClick={handleNormalZoomButtonClick}>
          {Math.trunc(diagramModel.zoom() * 100)}%
        </Button>
      </div>
    </div>
  );
}
