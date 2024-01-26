import { produce } from "solid-js/store";
import { useModel } from "../context/model-context";

export function ActivityNode(props: { id: string; zoom: number }) {
  const {
    activity: { activityList, setActivityList },
  } = useModel();

  type DragType = "none" | "move" | "leftResize" | "rightResize";
  let dragType: DragType = "none";

  const activity = () => {
    const target = activityList.find((it) => it.id === props.id);
    if (!target) {
      throw new Error("ActivityNode: cannot find a activity");
    }
    return target;
  };

  function handleMouseDown(type: DragType, e: MouseEvent) {
    e.stopPropagation();

    dragType = type;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
    const moveX = e.movementX / props.zoom;
    const moveY = e.movementY / props.zoom;

    switch (dragType) {
      case "move":
        setActivityList(
          (it) => it.id === props.id,
          produce((it) => {
            it.x += moveX;
            it.y += moveY;
          })
        );
        break;
      case "leftResize":
        setActivityList(
          (it) => it.id === props.id,
          produce((it) => {
            if (100 <= it.width - moveX) {
              it.x += moveX / 2;
              it.width -= moveX;
            }
          })
        );
        break;
      case "rightResize":
        setActivityList(
          (it) => it.id === props.id,
          produce((it) => {
            if (100 <= it.width + moveX) {
              it.x += moveX / 2;
              it.width += moveX;
            }
          })
        );
        break;
    }
  }

  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    dragType = "none";
  }

  return (
    <g onMouseDown={[handleMouseDown, "move"]}>
      <rect
        x={activity().x - activity().width / 2 - 10}
        y={activity().y - 51}
        width={10}
        height={activity().height + 2}
        class="actor-select"
        onMouseDown={[handleMouseDown, "leftResize"]}
      />
      <rect
        x={activity().x + activity().width / 2}
        y={activity().y - 51}
        width={10}
        height={activity().height + 2}
        class="actor-select"
        onMouseDown={[handleMouseDown, "rightResize"]}
      />
      <rect
        x={activity().x - activity().width / 2}
        y={activity().y - activity().height / 2}
        width={activity().width}
        height={activity().height}
        class="actor"
      />
      <text color="blue" x={activity().x} y={activity().y}>
        {activity().id}
      </text>
    </g>
  );
}
