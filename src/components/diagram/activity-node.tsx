import { JSXElement, onMount } from "solid-js";
import { produce } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { ActivityNodeEntity } from "../../data-source/data-type";
import { ManualActivityIcon } from "../icons/material-icons";
import "./activity-node.css";

export function ActivityNode(props: { activity: ActivityNodeEntity }): JSXElement {
  const {
    activityModel: { layerTopActivity, selectActivities, toggleSelectActivity, setActivityList },
    commentModel: { selectComments },
    actorModel: { actorList },
    transitionModel: { addTransition, transitionList },
    dialog: { setOpenActivityDialog },
    diagram: { toolbar, dragType, setDragType, setAddingLine },
  } = useAppContext();

  const fromTransitionsLenght = () =>
    transitionList.filter((it) => it.toActivityId === props.activity.id).length;
  const toTransitionsLength = () =>
    transitionList.filter((it) => it.fromActivityId === props.activity.id).length;

  onMount(() => {
    const observer = new ResizeObserver(() => {
      const height = (titleDiv?.clientHeight ?? 0) + 80;
      setActivityList(
        (it) => it.id === props.activity.id,
        produce((it) => {
          it.y -= (height - it.height) / 2;
          it.height = height;
        }),
      );
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
            selectComments([]);
          }
          layerTopActivity(props.activity.id);
          setDragType("moveNodes");
        }
        break;
      case "transion":
        selectActivities([props.activity.id]);
        setAddingLine({
          fromX: props.activity.x,
          fromY: props.activity.y,
          toX: props.activity.x,
          toY: props.activity.y,
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
      x={props.activity.x}
      y={props.activity.y}
      width={props.activity.width}
      height={props.activity.height}
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
          <div classList={{ "activity__prev--one": fromTransitionsLenght() >= 1 }} />
        </div>
        <div class="activity__main" onMouseDown={handleMouseDown} onDblClick={handleDblClick}>
          <div class="activity__actor">
            {actorList.find((it) => it.id === props.activity.actorId)?.name}
          </div>
          <div class="activity__icon">
            <ManualActivityIcon />
          </div>
          <div ref={titleDiv} class="activity__title">
            {props.activity.name}
          </div>
        </div>
        <div
          class="activity__resize"
          classList={{ "activity__next--many": toTransitionsLength() >= 2 }}
          onMouseDown={handleRightMouseDown}
        >
          <div classList={{ "activity__next--one": toTransitionsLength() >= 1 }} />
        </div>
      </div>
    </foreignObject>
  );
}
