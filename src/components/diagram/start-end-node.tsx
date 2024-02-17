import { JSXElement, Match, Switch } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { StartEndNodeEntity } from "../../data-source/data-type";
import { EndIcon, StartIcon } from "../icons/material-icons";
import "./start-end-node.css";

export function StartEndNode(props: { startEnd: StartEndNodeEntity }): JSXElement {
  const {
    activityModel: { selectActivities },
    diagram: { toolbar, setDragType },
    startEndModel: { toggleSelectStartEnd, selectStartEnds },
  } = useAppContext();

  function handleMouseDown(e: MouseEvent) {
    switch (toolbar()) {
      case "cursor":
        if (e.shiftKey) {
          toggleSelectStartEnd(props.startEnd.id);
          setDragType("none");
          e.stopPropagation();
        } else {
          if (!props.startEnd.selected) {
            selectStartEnds([props.startEnd.id]);
            selectActivities([]);
          }
          setDragType("moveNodes");
        }
        break;
    }
  }

  return (
    <foreignObject
      x={props.startEnd.x}
      y={props.startEnd.y}
      width={props.startEnd.width}
      height={props.startEnd.height}
    >
      <StartEndNodeView
        type={props.startEnd.type}
        selected={props.startEnd.selected}
        onMouseDown={handleMouseDown}
      />
    </foreignObject>
  );
}

export function StartEndNodeView(props: {
  type: "startNode" | "endNode";
  selected: boolean;
  onMouseDown?: (e: MouseEvent) => void;
}) {
  return (
    <div
      class="start-end"
      classList={{ "start-end--selected": props.selected }}
      onMouseDown={(e) => props.onMouseDown?.(e)}
    >
      <Switch>
        <Match when={props.type === "startNode"}>
          <StartIcon />
        </Match>
        <Match when={props.type === "endNode"}>
          <EndIcon />
        </Match>
      </Switch>
    </div>
  );
}
