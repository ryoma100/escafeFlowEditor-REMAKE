import { JSXElement, onMount } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { CommentNodeEntity } from "../../data-source/data-type";
import { CommentIcon } from "../icons/material-icons";
import "./comment-node.css";

export function CommentNode(props: { comment: CommentNodeEntity }): JSXElement {
  const {
    commentModel: { toggleSelectComment, selectComments, resizeCommentSize },
    activityModel: { selectActivities },
    diagram: { toolbar, setDragType },
    dialog: { setOpenCommentDialog },
  } = useAppContext();

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

  return (
    <foreignObject
      x={props.comment.x}
      y={props.comment.y}
      width={props.comment.width}
      height={props.comment.height}
    >
      <CommentNodeView
        comment={props.comment.comment}
        selected={props.comment.selected}
        onMouseDown={handleMouseDown}
        onDblClick={handleDblClick}
        onChangeSize={(w, h) => resizeCommentSize(props.comment, w, h)}
      />
    </foreignObject>
  );
}

export function CommentNodeView(props: {
  comment: string;
  selected: boolean;
  onMouseDown?: (e: MouseEvent) => void;
  onDblClick?: (e: MouseEvent) => void;
  onChangeSize?: (width: number, height: number) => void;
}) {
  onMount(() => {
    const observer = new ResizeObserver(() => {
      if (titleDiv) {
        const width = titleDiv.clientWidth + 48;
        const height = titleDiv.clientHeight + 8;
        props.onChangeSize?.(width, height);
      }
    });
    if (titleDiv) {
      observer.observe(titleDiv);
    }
  });

  let titleDiv: HTMLDivElement | undefined;
  return (
    <div
      class="comment"
      classList={{
        "comment--selected": props.selected,
      }}
      onMouseDown={(e) => props.onMouseDown?.(e)}
      onDblClick={(e) => props.onDblClick?.(e)}
    >
      <div class="comment__icon">
        <CommentIcon />
      </div>
      <div ref={titleDiv} class="comment__title">
        {props.comment}
      </div>
    </div>
  );
}
