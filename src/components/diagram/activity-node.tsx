import { JSXElement, Match, Switch, onMount } from "solid-js";
import { ACTIVITY_MIN_HEIGHT } from "../../constants/app-const";
import { useAppContext } from "../../context/app-context";
import { ActivityNodeEntity, JoinType, SplitType } from "../../data-source/data-type";
import { ManualActivityIcon } from "../icons/material-icons";
import "./activity-node.css";

export function ActivityNode(props: { activity: ActivityNodeEntity }): JSXElement {
  const {
    activityModel: {
      layerTopActivity,
      selectActivities,
      toggleSelectActivity,
      resizeActivityHeight,
    },
    commentModel: { selectComments },
    actorModel: { actorList },
    transitionModel: { addTransition, transitionList },
    dialog: { setOpenActivityDialog },
    diagram: { toolbar, dragType, setDragType, setAddingLine },
  } = useAppContext();

  const joinType = () => {
    const length = transitionList.filter((it) => it.toActivityId === props.activity.id).length;
    return length > 1 ? "xorJoin" : length > 0 ? "oneJoin" : "notJoin";
  };

  const splitType = () => {
    const length = transitionList.filter((it) => it.fromActivityId === props.activity.id).length;
    return length > 1 ? "xorSplit" : length > 0 ? "oneSplit" : "notSplit";
  };

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
      case "transition":
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

  return (
    <foreignObject
      data-id={props.activity.xpdlId}
      x={props.activity.x}
      y={props.activity.y}
      width={props.activity.width}
      height={props.activity.height}
      onMouseUp={handleMouseUp}
    >
      <ActivityNodeView
        type="manualActivity"
        name={props.activity.name}
        actorName={actorList.find((it) => it.id === props.activity.actorId)?.name ?? ""}
        joinType={joinType()}
        splitType={splitType()}
        selected={props.activity.selected}
        width={props.activity.width}
        onLeftMouseDown={handleLeftMouseDown}
        onMouseDown={handleMouseDown}
        onRightMouseDown={handleRightMouseDown}
        onDblClick={handleDblClick}
        onChangeHeight={(height) => resizeActivityHeight(props.activity, height)}
      />
    </foreignObject>
  );
}

export function ActivityNodeView(props: {
  type: string;
  name: string;
  actorName: string;
  joinType: JoinType;
  splitType: SplitType;
  selected: boolean;
  width: number;
  onLeftMouseDown?: (e: MouseEvent) => void;
  onMouseDown?: (e: MouseEvent) => void;
  onRightMouseDown?: (e: MouseEvent) => void;
  onDblClick?: (e: MouseEvent) => void;
  onChangeHeight?: (height: number) => void;
}): JSXElement {
  onMount(() => {
    const observer = new ResizeObserver(() => {
      if (titleDiv) {
        const height = titleDiv.clientHeight + ACTIVITY_MIN_HEIGHT;
        props.onChangeHeight?.(height);
      }
    });
    if (titleDiv) {
      observer.observe(titleDiv);
    }
  });

  let titleDiv: HTMLDivElement | undefined;
  return (
    <div
      style={{ width: `${props.width}px` }}
      class="activity"
      classList={{ "activity--selected": props.selected }}
    >
      <div class="activity__resize" onMouseDown={props.onLeftMouseDown}>
        <Switch>
          <Match when={props.joinType === "oneJoin"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path class="activity__svg-line" d="M 0 50 L 10 50" />
            </svg>
          </Match>
          <Match when={props.joinType === "xorJoin"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path class="activity__svg-line" d="M 0 50 L 10 50 M 1 0 L 1 100" />
            </svg>
          </Match>
          <Match when={props.joinType === "andJoin"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path class="activity__svg-line" d="M 0 0 L 10 50 L 0 100 M 5 25 L 5 75" />
            </svg>
          </Match>
        </Switch>
      </div>

      <div class="activity__main" onMouseDown={props.onMouseDown} onDblClick={props.onDblClick}>
        <div class="activity__actor">{props.actorName}</div>
        <div class="activity__icon">
          <ManualActivityIcon />
        </div>
        <div ref={titleDiv} class="activity__title">
          {props.name}
        </div>
      </div>

      <div class="activity__resize" onMouseDown={props.onRightMouseDown}>
        <Switch>
          <Match when={props.splitType === "oneSplit"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path class="activity__svg-line" d="M 0 50 L 10 50" />
            </svg>
          </Match>
          <Match when={props.splitType === "xorSplit"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path class="activity__svg-line" d="M 0 50 L 9 50 M 9 0 L 9 100" />
            </svg>
          </Match>
          <Match when={props.splitType === "andSplit"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path class="activity__svg-line" d="M 10 0 L 0 50 L 10 100 M 5 25 L 5 75" />
            </svg>
          </Match>
        </Switch>
      </div>
    </div>
  );
}
