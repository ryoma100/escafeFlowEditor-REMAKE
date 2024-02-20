import { JSXElement } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { CommentEdge, EndEdge, StartEdge } from "../../data-source/data-type";
import "./other-edge.css";

export function OtherEdgeContainer(props: { edge: CommentEdge | StartEdge | EndEdge }): JSXElement {
  const {
    otherNodeModel: { otherNodeList },
    activityModel: { activityList },
  } = useAppContext();

  switch (props.edge.type) {
    case "commentEdge": {
      const commentEdge = props.edge;
      const fromNode = otherNodeList.find((it) => it.id === commentEdge.fromCommentId)!;
      const toNode = activityList.find((it) => it.id === commentEdge.toActivityId)!;
      return (
        <CommentEdgeContainer
          fromX={fromNode.x + fromNode.width / 2}
          fromY={fromNode.y + fromNode.height / 2}
          toX={toNode.x + toNode.width / 2}
          toY={toNode.y + toNode.height / 2}
        />
      );
    }
    case "startEdge":
      return <div />;
    case "endEdge":
      return <div />;
  }
}

export function CommentEdgeContainer(props: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}): JSXElement {
  return (
    <line class="comment-line" x1={props.fromX} y1={props.fromY} x2={props.toX} y2={props.toY} />
  );
}
