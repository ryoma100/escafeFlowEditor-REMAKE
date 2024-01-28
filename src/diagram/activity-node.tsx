import { createSignal, onMount } from "solid-js";
import { useModel } from "../context/model-context";
import { useOperation } from "../context/operation-context";
import { DragType } from "./disgram";
import { useDiagram } from "../context/diagram-context";

export function ActivityNode(props: { id: number }) {
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
    actor: { actorList },
  } = useModel();
  const {
    activity: { setOpenActivityDialogById },
  } = useOperation();
  const {
    diagram: { zoom },
  } = useDiagram();

  let dragType: DragType = "none";

  const activity = () => {
    return activityList.find((it) => it.id === props.id)!;
  };

  function handleMouseDown(type: DragType, e: MouseEvent) {
    e.stopPropagation();

    dragType = type;
    switch (dragType) {
      case "moveActivity":
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
    const moveX = e.movementX / zoom();
    const moveY = e.movementY / zoom();

    switch (dragType) {
      case "moveActivity":
        moveSelectedActivities(moveX, moveY);
        break;
      case "resizeActivityLeft":
        resizeLeft(props.id, moveX);
        break;
      case "resizeActivityRight":
        resizeRight(props.id, moveX);
        break;
    }
  }

  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    dragType = "none";
  }

  function handleDblClick() {
    setOpenActivityDialogById(props.id);
  }

  onMount(() => {
    const observer = new ResizeObserver(() => {
      setHeight((titleDiv?.clientHeight ?? 0) + 64); // TODO: 高さを調整
    });
    if (titleDiv) {
      observer.observe(titleDiv);
    }
  });

  const [height, setHeight] = createSignal(0);

  let titleDiv: HTMLDivElement | undefined;
  return (
    <foreignObject
      data-id={activity().xpdlId}
      x={activity().x - activity().width / 2}
      y={activity().y - height() / 2}
      width={activity().width}
      height={height()}
    >
      <div
        class="activity"
        classList={{
          "activity--selected": activity().selected,
        }}
      >
        <div
          class="activity__resize"
          classList={{ "activity__prev--many": true }}
          onMouseDown={[handleMouseDown, "resizeActivityLeft"]}
        >
          <div classList={{ "activity__prev--one": true }}></div>
        </div>
        <div
          class="activity__main"
          onMouseDown={[handleMouseDown, "moveActivity"]}
          onDblClick={handleDblClick}
        >
          <div class="activity__actor">
            {actorList().find((it) => it.id === activity().actorId)?.title}
          </div>
          <div class="activity__icon">🐧</div>
          <div ref={titleDiv} class="activity__title">
            {activity().title}
          </div>
        </div>
        <div
          class="activity__resize"
          classList={{ "activity__next--many": true }}
          onMouseDown={[handleMouseDown, "resizeActivityRight"]}
        >
          <div classList={{ "activity__next--one": true }}></div>
        </div>
      </div>
    </foreignObject>
  );
}
