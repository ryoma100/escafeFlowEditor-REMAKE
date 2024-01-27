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

  return (
    <g data-id={activity().xpdlId} onMouseDown={[handleMouseDown, "move"]}>
      <rect
        x={activity().x - activity().width / 2 - 10}
        y={activity().y - activity().height / 2 - 2}
        width={activity().width + 20}
        height={activity().height + 4}
        class={
          activity().selected ? "actor__select--selected" : "actor__select"
        }
      />
      <rect
        x={activity().x - activity().width / 2 - 10}
        y={activity().y - 51}
        width={10}
        height={activity().height + 2}
        class="actor__resize"
        onMouseDown={[handleMouseDown, "leftResize"]}
      />
      <rect
        x={activity().x + activity().width / 2}
        y={activity().y - 51}
        width={10}
        height={activity().height + 2}
        class="actor__resize"
        onMouseDown={[handleMouseDown, "rightResize"]}
      />
      <rect
        x={activity().x - activity().width / 2}
        y={activity().y - activity().height / 2}
        width={activity().width}
        height={activity().height}
        class="actor"
      />
      <text x={activity().x} y={activity().y}>
        {activity().id}
      </text>
    </g>
  );
}
