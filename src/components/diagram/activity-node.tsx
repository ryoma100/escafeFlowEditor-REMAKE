import { JSXElement, createSignal, onMount } from "solid-js";
import { useAppContext } from "../../context/app-context";
import "./activity-node.css";
import { ActivityEntity } from "../../data-source/data-type";

export function ActivityNode(props: { activity: ActivityEntity }): JSXElement {
  const {
    activityModel: { layerTopActivity, selectActivities, toggleSelectActivity },
    actorModel: { actorList },
    transitionModel: { addTransition, transitionList },
    dialog: { setOpenActivityDialog },
    diagram: { toolbar, dragType, setDragType, setAddingLine },
  } = useAppContext();

  const fromTransitionsLenght = () =>
    transitionList.filter((it) => it.toActivityId === props.activity.id).length;
  const toTransitionsLength = () =>
    transitionList.filter((it) => it.fromActivityId === props.activity.id)
      .length;

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
    selectActivities([props.activity.id]);
    setDragType("resizeActivityLeft");
  }

  function handleRightMouseDown(_e: MouseEvent) {
    selectActivities([props.activity.id]);
    setDragType("resizeActivityRight");
  }

  function handleMouseDown(e: MouseEvent) {
    switch (toolbar()) {
      case "cursor":
        if (e.shiftKey) {
          toggleSelectActivity(props.activity.id);
          setDragType("none");
          e.stopPropagation();
        } else {
          if (!props.activity.selected) {
            selectActivities([props.activity.id]);
          }
          layerTopActivity(props.activity.id);
          setDragType("moveActivities");
        }
        break;
      case "transion":
        selectActivities([props.activity.id]);
        setAddingLine({
          fromX: props.activity.cx,
          fromY: props.activity.cy,
          toX: props.activity.cx,
          toY: props.activity.cy,
        });
        setDragType("addTransition");
        break;
    }
  }

  function handleMouseUp(_e: MouseEvent) {
    switch (dragType()) {
      case "addTransition":
        addTransition(props.activity.id);
        setDragType("none");
        break;
    }
  }

  function handleDblClick() {
    setOpenActivityDialog(props.activity);
  }

  let titleDiv: HTMLDivElement | undefined;
  return (
    <foreignObject
      data-id={props.activity.xpdlId}
      x={props.activity.cx - props.activity.width / 2}
      y={props.activity.cy - height() / 2}
      width={props.activity.width}
      height={height()}
      onMouseUp={handleMouseUp}
    >
      <div
        class="activity"
        classList={{
          "activity--selected": props.activity.selected,
        }}
      >
        <div
          class="activity__resize"
          classList={{ "activity__prev--many": fromTransitionsLenght() >= 2 }}
          onMouseDown={handleLeftMouseDown}
        >
          <div
            classList={{ "activity__prev--one": fromTransitionsLenght() >= 1 }}
          />
        </div>
        <div
          class="activity__main"
          onMouseDown={handleMouseDown}
          onDblClick={handleDblClick}
        >
          <div class="activity__actor">
            {actorList.find((it) => it.id === props.activity.actorId)?.name}
          </div>
          <div class="activity__icon">🐧</div>
          <div ref={titleDiv} class="activity__title">
            {props.activity.name}
          </div>
        </div>
        <div
          class="activity__resize"
          classList={{ "activity__next--many": toTransitionsLength() >= 2 }}
          onMouseDown={handleRightMouseDown}
        >
          <div
            classList={{ "activity__next--one": toTransitionsLength() >= 1 }}
          />
        </div>
      </div>
    </foreignObject>
  );
}
