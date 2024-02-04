import { createSignal, onMount } from "solid-js";
import { useAppContext } from "../../context/app-context";

export function ActivityNode(props: { id: number }) {
  const {
    activityModel: {
      activityList,
      layerTopActivity,
      selectActivities,
      toggleSelectActivity,
    },
    actorModel: { actorList },
    transitionModel: { addTransition, transitionList },
    dialog: { setOpenActivityDialogId },
    diagram: { toolbar, dragType, setDragType, setAddingLine },
  } = useAppContext();

  const activity = () => activityList.find((it) => it.id === props.id)!;
  const fromTransitionsLenght = () =>
    transitionList.filter((it) => it.toActivityId === props.id).length;
  const toTransitionsLength = () =>
    transitionList.filter((it) => it.fromActivityId === props.id).length;

  const [height, setHeight] = createSignal(0);
  onMount(() => {
    const observer = new ResizeObserver(() => {
      setHeight((titleDiv?.clientHeight ?? 0) + 64); // TODO: 高さを調整
    });
    if (titleDiv) {
      observer.observe(titleDiv);
    }
  });

  function handleLeftMouseDown(_e: MouseEvent) {
    selectActivities([props.id]);
    setDragType("resizeActivityLeft");
  }

  function handleRightMouseDown(_e: MouseEvent) {
    selectActivities([props.id]);
    setDragType("resizeActivityRight");
  }

  function handleMouseDown(e: MouseEvent) {
    switch (toolbar()) {
      case "cursor":
        if (e.shiftKey) {
          toggleSelectActivity(props.id);
          setDragType("none");
          e.stopPropagation();
        } else {
          if (!activity().selected) {
            selectActivities([props.id]);
          }
          layerTopActivity(props.id);
          setDragType("moveActivities");
        }
        break;
      case "transion":
        selectActivities([props.id]);
        setAddingLine({
          fromX: activity().cx,
          fromY: activity().cy,
          toX: activity().cx,
          toY: activity().cy,
        });
        setDragType("addTransition");
        break;
    }
  }

  function handleMouseUp(_e: MouseEvent) {
    switch (dragType()) {
      case "addTransition":
        addTransition(activity().id);
        setDragType("none");
        break;
    }
  }

  function handleDblClick() {
    setOpenActivityDialogId(props.id);
  }

  let titleDiv: HTMLDivElement | undefined;
  return (
    <foreignObject
      data-id={activity().xpdlId}
      x={activity().cx - activity().width / 2}
      y={activity().cy - height() / 2}
      width={activity().width}
      height={height()}
      onMouseUp={handleMouseUp}
    >
      <div
        class="activity"
        classList={{
          "activity--selected": activity().selected,
        }}
      >
        <div
          class="activity__resize"
          classList={{ "activity__prev--many": fromTransitionsLenght() >= 2 }}
          onMouseDown={handleLeftMouseDown}
        >
          <div
            classList={{ "activity__prev--one": fromTransitionsLenght() >= 1 }}
          ></div>
        </div>
        <div
          class="activity__main"
          onMouseDown={handleMouseDown}
          onDblClick={handleDblClick}
        >
          <div class="activity__actor">
            {actorList.find((it) => it.id === activity().actorId)?.name}
          </div>
          <div class="activity__icon">🐧</div>
          <div ref={titleDiv} class="activity__title">
            {activity().name}
          </div>
        </div>
        <div
          class="activity__resize"
          classList={{ "activity__next--many": toTransitionsLength() >= 2 }}
          onMouseDown={handleRightMouseDown}
        >
          <div
            classList={{ "activity__next--one": toTransitionsLength() >= 1 }}
          ></div>
        </div>
      </div>
    </foreignObject>
  );
}
