import { JSXElement } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { CommentEdgeEntity } from "../../data-source/data-type";
import "./comment-edge.css";

export function CommentEdge(props: { commentEdge: CommentEdgeEntity }): JSXElement {
  const {
    commentModel: { commentList },
    activityModel: { activityList },
  } = useAppContext();

  const fromComment = () => commentList.find((it) => it.id === props.commentEdge.fromCommentId)!;
  const toActivity = () => activityList.find((it) => it.id === props.commentEdge.toActivityId)!;

  return (
    <>
      <line
        class="comment-edge"
        x1={fromComment().x + fromComment().width}
        y1={fromComment().y + fromComment().height / 2}
        x2={toActivity().x}
        y2={toActivity().y + toActivity().height / 2}
        marker-end="url(#arrow-end)"
      />
    </>
  );
}
