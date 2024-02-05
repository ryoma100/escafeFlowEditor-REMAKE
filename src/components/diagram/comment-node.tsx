import { JSXElement, createSignal, onMount } from "solid-js";
import { useAppContext } from "../../context/app-context";
import "./comment-node.css";
import { CommentEntity } from "../../data-source/data-type";

export function CommentNode(props: { comment: CommentEntity }): JSXElement {
  const {
    commentModel: { toggleSelectComment, selectComments },
    diagram: { toolbar, setDragType },
  } = useAppContext();

  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);
  onMount(() => {
    const observer = new ResizeObserver(() => {
      setWidth((titleDiv?.clientWidth ?? 0) + 24);
      setHeight((titleDiv?.clientHeight ?? 0) + 9);
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
          }
          setDragType("moveComments");
        }
        break;
    }
  }

  let titleDiv: HTMLDivElement | undefined;
  return (
    <foreignObject
      x={props.comment.x}
      y={props.comment.y}
      width={width()}
      height={height()}
    >
      <div
        class="comment"
        classList={{
          "comment--selected": props.comment.selected,
        }}
        onMouseDown={handleMouseDown}
      >
        <div class="comment__icon">※</div>
        <div ref={titleDiv} class="comment__title">
          {`コメント\ncomment\n吾輩は猫である。名前はまだ無い。`}
        </div>
      </div>
    </foreignObject>
  );
}
