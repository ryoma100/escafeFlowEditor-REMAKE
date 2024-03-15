import { JSXElement } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { CommentEdge, EndEdge, StartEdge } from "../../data-source/data-type";

export function ExtendEdgeContainer(props: {
  edge: CommentEdge | StartEdge | EndEdge;
}): JSXElement {
  const {
    extendNodeModel: { getCommentNode, getStartNode, getEndNode },
    activityNodeModel: { getActivityNode },
    nodeModel: { changeSelectNodes },
    edgeModel: { changeSelectEdges },
  } = useAppContext();

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

  function handleMouseDown(e: MouseEvent) {
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
      onMouseDown={handleMouseDown}
    />
  );
}

export function OtherEdgeView(props: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  selected: boolean;
  onMouseDown: (e: MouseEvent) => void;
}): JSXElement {
  return (
    <>
      <line
        class="stroke fill-none stroke-gray-300 [vector-effect:non-scaling-stroke]"
        x1={props.fromX}
        y1={props.fromY}
        x2={props.toX}
        y2={props.toY}
      />
      <line
        data-select={props.selected}
        class="
          fill-none stroke-transparent stroke-[5px]
          hover:cursor-pointer hover:stroke-primary2
          data-[select=true]:fill-none data-[select=true]:stroke-primary1 data-[select=true]:stroke-[5px]"
        onMouseDown={(e) => props.onMouseDown(e)}
        x1={props.fromX}
        y1={props.fromY}
        x2={props.toX}
        y2={props.toY}
      />
    </>
  );
}
