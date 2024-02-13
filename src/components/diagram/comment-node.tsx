import { JSXElement, onMount } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { CommentNodeEntity } from "../../data-source/data-type";
import "./comment-node.css";

export function CommentNode(props: { comment: CommentNodeEntity }): JSXElement {
  const {
    commentModel: { toggleSelectComment, selectComments, resizeCommentSize },
    activityModel: { selectActivities },
    diagram: { toolbar, setDragType },
    dialog: { setOpenCommentDialog },
  } = useAppContext();

  onMount(() => {
    const observer = new ResizeObserver(() => {
      const width = (titleDiv?.clientWidth ?? 0) + 32;
      const height = (titleDiv?.clientHeight ?? 0) + 9;
      resizeCommentSize(props.comment, width, height);
    });
    if (titleDiv) {
      observer.observe(titleDiv);
    }
  });

  function handleMouseDown(e: MouseEvent) {
    switch (toolbar()) {
      case "cursor":
        if (e.shiftKey) {
          toggleSelectComment(props.comment.id);
          setDragType("none");
          e.stopPropagation();
        } else {
          if (!props.comment.selected) {
            selectComments([props.comment.id]);
            selectActivities([]);
          }
          setDragType("moveNodes");
        }
        break;
    }
  }

  function handleDblClick(_e: MouseEvent) {
    setOpenCommentDialog(props.comment);
  }

  let titleDiv: HTMLDivElement | undefined;
  return (
    <foreignObject
      x={props.comment.x}
      y={props.comment.y}
      width={props.comment.width}
      height={props.comment.height}
    >
      <div
        class="comment"
        classList={{
          "comment--selected": props.comment.selected,
        }}
        onMouseDown={handleMouseDown}
        onDblClick={handleDblClick}
      >
        <div class="comment__icon">※</div>
        <div ref={titleDiv} class="comment__title">
          {props.comment.comment}
        </div>
      </div>
    </foreignObject>
  );
}
