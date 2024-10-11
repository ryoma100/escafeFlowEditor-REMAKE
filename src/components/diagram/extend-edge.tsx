import { JSXElement } from "solid-js";

import { useModelContext } from "@/context/model-context";
import { CommentEdge, EndEdge, StartEdge } from "@/data-source/data-type";

export function ExtendEdgeContainer(props: {
  readonly edge: CommentEdge | StartEdge | EndEdge;
}): JSXElement {
  const {
    extendNodeModel: { getCommentNode, getStartNode, getEndNode },
    activityNodeModel: { getActivityNode },
    nodeModel: { changeSelectNodes },
    edgeModel: { changeSelectEdges },
  } = useModelContext();

  const fromToNode = () => {
    switch (props.edge.type) {
      case "commentEdge":
        return [getCommentNode(props.edge.fromNodeId), getActivityNode(props.edge.toNodeId)];
      case "startEdge":
        return [getStartNode(props.edge.fromNodeId), getActivityNode(props.edge.toNodeId)];
      case "endEdge":
        return [getActivityNode(props.edge.fromNodeId), getEndNode(props.edge.toNodeId)];
    }
  };

  function handlePointerDown(e: PointerEvent) {
    e.stopPropagation();

    if (e.shiftKey) {
      changeSelectEdges("toggle", [props.edge.id]);
    } else if (!props.edge.selected) {
      changeSelectEdges("select", [props.edge.id]);
      changeSelectNodes("clearAll");
    }
  }

  return (
    <OtherEdgeView
      fromX={fromToNode()[0].x + fromToNode()[0].width / 2}
      fromY={fromToNode()[0].y + fromToNode()[0].height / 2}
      toX={fromToNode()[1].x + fromToNode()[1].width / 2}
      toY={fromToNode()[1].y + fromToNode()[1].height / 2}
      selected={props.edge.selected}
      onPointerDown={handlePointerDown}
    />
  );
}

export function OtherEdgeView(props: {
  readonly fromX: number;
  readonly fromY: number;
  readonly toX: number;
  readonly toY: number;
  readonly selected: boolean;
  readonly onPointerDown?: (e: PointerEvent) => void;
}): JSXElement {
  return (
    <>
      <line
        /* eslint-disable-next-line tailwindcss/no-custom-classname */
        class="stroke fill-none [stroke:var(--foreground-color)] [vector-effect:non-scaling-stroke]"
        x1={props.fromX}
        y1={props.fromY}
        x2={props.toX}
        y2={props.toY}
      />
      <line
        class="fill-none stroke-[5] hover:cursor-pointer hover:stroke-primary"
        classList={{
          "stroke-transparent": !props.selected,
          "stroke-primary": props.selected,
        }}
        onPointerDown={(e) => props.onPointerDown?.(e)}
        x1={props.fromX}
        y1={props.fromY}
        x2={props.toX}
        y2={props.toY}
      />
    </>
  );
}
