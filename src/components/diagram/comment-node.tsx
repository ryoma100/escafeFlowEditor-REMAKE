import { createSignal, onMount } from "solid-js";
import { useAppContext } from "../../context/app-context";
import "./comment-node.css";

export function CommentNode(props: { id: number }) {
  const {
    commentModel: { commentList, toggleSelectComment, selectComments },
    diagram: { toolbar, setDragType },
  } = useAppContext();

  const comment = () => commentList.find((it) => it.id === props.id)!;

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
          toggleSelectComment(props.id);
          setDragType("none");
          e.stopPropagation();
        } else {
          if (!comment().selected) {
            selectComments([props.id]);
          }
          setDragType("moveComments");
        }
        break;
    }
  }

  let titleDiv: HTMLDivElement | undefined;
  return (
    <foreignObject
      x={comment().x}
      y={comment().y}
      width={width()}
      height={height()}
    >
      <div
        class="comment"
        classList={{
          "comment--selected": comment().selected,
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
