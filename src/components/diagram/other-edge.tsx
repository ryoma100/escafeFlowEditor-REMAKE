import { JSXElement } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { CommentEdge, EndEdge, StartEdge } from "../../data-source/data-type";
import "./other-edge.css";

export function OtherEdgeContainer(props: { edge: CommentEdge | StartEdge | EndEdge }): JSXElement {
  const {
    otherNodeModel: { getCommentNode, getStartNode, getEndNode },
    activityModel: { getActivityNode },
  } = useAppContext();

  const fromToNode = () => {
    switch (props.edge.type) {
      case "commentEdge":
        return [getCommentNode(props.edge.fromCommentId), getActivityNode(props.edge.toActivityId)];
      case "startEdge":
        return [getStartNode(props.edge.fromStartId), getActivityNode(props.edge.toActivityId)];
      case "endEdge":
        return [getActivityNode(props.edge.fromActivityId), getEndNode(props.edge.toEndId)];
    }
  };

  return (
    <OtherEdgeView
      fromX={fromToNode()[0].x + fromToNode()[0].width / 2}
      fromY={fromToNode()[0].y + fromToNode()[0].height / 2}
      toX={fromToNode()[1].x + fromToNode()[1].width / 2}
      toY={fromToNode()[1].y + fromToNode()[1].height / 2}
    />
  );
}

export function OtherEdgeView(props: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}): JSXElement {
  return (
    <line class="other-edge" x1={props.fromX} y1={props.fromY} x2={props.toX} y2={props.toY} />
  );
}
