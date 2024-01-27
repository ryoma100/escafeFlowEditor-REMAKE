import { createSignal, onMount } from "solid-js";
import { useModel } from "../context/model-context";

export function ActivityNode(props: { id: number; zoom: number }) {
  const {
    activity: {
      activityList,
      moveSelectedActivities,
      resizeLeft,
      resizeRight,
      layerTopActivity,
      selectActivities,
      toggleSelectActivity,
    },
  } = useModel();

  type DragType = "none" | "move" | "leftResize" | "rightResize";
  let dragType: DragType = "none";

  const activity = () => {
    const target = activityList.find((it) => it.id === props.id);
    if (!target) {
      throw new Error("ActivityNode: cannot find activity");
    }
    return target;
  };

  function handleMouseDown(type: DragType, e: MouseEvent) {
    e.stopPropagation();
    dragType = type;

    switch (dragType) {
      case "move":
        if (e.shiftKey) {
          toggleSelectActivity(props.id);
        } else {
          if (!activity().selected) {
            selectActivities([props.id]);
          }
          layerTopActivity(props.id);
        }
        break;
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
    const moveX = e.movementX / props.zoom;
    const moveY = e.movementY / props.zoom;

    switch (dragType) {
      case "move":
        moveSelectedActivities(moveX, moveY);
        break;
      case "leftResize":
        resizeLeft(props.id, moveX);
        break;
      case "rightResize":
        resizeRight(props.id, moveX);
        break;
    }
  }

  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    dragType = "none";
  }

  onMount(() => {
    const observer = new ResizeObserver(() => {
      console.log("titleDiv", titleDiv?.clientWidth, titleDiv?.clientHeight);
      setTitleDivHeight(titleDiv?.clientHeight ?? 0);
    });
    if (titleDiv) {
      observer.observe(titleDiv);
    }
  });

  const [titleDivHeight, setTitleDivHeight] = createSignal(0);

  const width = () => activity().width;
  const height = () => titleDivHeight() + 64; // TODO: 計算できないか？
  const x = () => activity().x - activity().width / 2;
  const y = () => activity().y - height() / 2;

  let titleDiv: HTMLDivElement | undefined;
  return (
    <foreignObject
      data-id={activity().xpdlId}
      x={x()}
      y={y()}
      width={width()}
      height={height()}
    >
      <div
        class={activity().selected ? "activity activity--selected" : "activity"}
      >
        <div
          class="activity__resize"
          onMouseDown={[handleMouseDown, "leftResize"]}
        ></div>
        <div class="activity__main" onMouseDown={[handleMouseDown, "move"]}>
          <div class="activity__actor">アクター1アクター1アクター1</div>
          <div class="activity__icon">🐧</div>
          <div ref={titleDiv} class="activity__title">
            {activity().title}
          </div>
        </div>
        <div
          class="activity__resize"
          onMouseDown={[handleMouseDown, "rightResize"]}
        ></div>
      </div>
    </foreignObject>
  );
}
