import { JSXElement, Match, Switch, onMount } from "solid-js";

import { ACTIVITY_MIN_HEIGHT } from "@/constants/app-const";
import { useModelContext } from "@/context/model-context";
import {
  ActivityJoinType,
  ActivityNode,
  ActivityNodeType,
  ActivitySplitType,
} from "@/data-source/data-type";
import { AutoActivityIcon } from "@/icons/auto-activity-icon";
import { AutoTimerActivityIcon } from "@/icons/auto-timer-activity-icon";
import { ManualActivityIcon } from "@/icons/manual-activity-icon";
import { ManualTimerActivityIcon } from "@/icons/manual-timer-activity-icon";
import { UserActivityIcon } from "@/icons/user-activity-icon";

export function ActivityNodeContainer(props: { activity: ActivityNode }): JSXElement {
  const {
    activityNodeModel: { resizeActivityHeight, updateJoinType, updateSplitType },
    actorModel: { actorList },
    nodeModel: { changeSelectNodes, changeTopLayer },
    edgeModel: { changeSelectEdges },
    extendEdgeModel: { addCommentEdge, addStartEdge },
    transitionEdgeModel: { addTransitionEdge, getTransitionEdges },
    dialogModel: { setModalDialog },
    diagramModel: { toolbar, dragMode: dragType, setDragMode: setDragType, setAddingLineFrom },
  } = useModelContext();

  function handleLeftMouseDown(_e: MouseEvent) {
    changeSelectNodes("select", [props.activity.id]);
    setDragType({ type: "resizeActivityLeft" });
  }

  function handleRightMouseDown(_e: MouseEvent) {
    changeSelectNodes("select", [props.activity.id]);
    setDragType({ type: "resizeActivityRight" });
  }

  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation();

    switch (toolbar()) {
      case "cursor":
        if (e.shiftKey) {
          changeSelectNodes("toggle", [props.activity.id]);
          setDragType({ type: "none" });
        } else {
          if (!props.activity.selected) {
            changeSelectNodes("select", [props.activity.id]);
            changeSelectEdges("clearAll");
          }
          changeTopLayer(props.activity.id);
          setDragType({ type: "moveNodes" });
        }
        break;
      case "transition":
        changeSelectNodes("select", [props.activity.id]);
        setAddingLineFrom(
          props.activity.x + props.activity.width,
          props.activity.y + props.activity.height / 2,
        );
        setDragType({ type: "addTransition", fromActivity: props.activity });
        break;
    }
  }

  function handleMouseUp(_e: MouseEvent) {
    switch (dragType().type) {
      case "addTransition":
        {
          const transition = addTransitionEdge(props.activity.id);
          if (transition) {
            updateJoinType(
              transition.toNodeId,
              getTransitionEdges().filter((it) => it.toNodeId === transition.toNodeId).length,
            );
            updateSplitType(
              transition.fromNodeId,
              getTransitionEdges().filter((it) => it.fromNodeId === transition.fromNodeId).length,
            );
          }
          setDragType({ type: "none" });
        }
        break;
      case "addCommentEdge":
        addCommentEdge(props.activity.id);
        setDragType({ type: "none" });
        break;
      case "addStartEdge":
        addStartEdge(props.activity.id);
        setDragType({ type: "none" });
        break;
    }
  }

  function handleDblClick() {
    setModalDialog({ type: "activity", activity: props.activity });
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
        activityType={props.activity.activityType}
        name={props.activity.name}
        actorName={actorList.find((it) => it.id === props.activity.actorId)?.name ?? ""}
        joinType={props.activity.joinType}
        splitType={props.activity.splitType}
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
  activityType: ActivityNodeType;
  name: string;
  actorName: string;
  joinType: ActivityJoinType;
  splitType: ActivitySplitType;
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
      data-select={props.selected}
      class="
        flex h-full w-full flex-row justify-between border-2 border-solid border-transparent
        data-[select=true]:border-primary1"
    >
      <div
        class="w-[10px] hover:cursor-ew-resize hover:bg-primary3"
        onMouseDown={(e) => props.onLeftMouseDown?.(e)}
      >
        <Switch>
          <Match when={props.joinType === "oneJoin"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path class="stroke-black [vector-effect:non-scaling-stroke]" d="M 0 50 L 10 50" />
            </svg>
          </Match>
          <Match when={props.joinType === "xorJoin"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path
                class="stroke-black [vector-effect:non-scaling-stroke]"
                d="M 0 50 L 10 50 M 1 0 L 1 100"
              />
            </svg>
          </Match>
          <Match when={props.joinType === "andJoin"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path
                class="fill-none stroke-black [vector-effect:non-scaling-stroke]"
                d="M 0 0 L 10 50 L 0 100 M 5 25 L 5 75"
              />
            </svg>
          </Match>
        </Switch>
      </div>

      <div
        class="
          flex h-full w-full cursor-move select-none flex-col border border-solid border-black bg-background
          hover:bg-primary3"
        onMouseDown={(e) => props.onMouseDown?.(e)}
        onDblClick={(e) => props.onDblClick?.(e)}
      >
        <div class="mx-0.5 w-full overflow-ellipsis whitespace-nowrap text-xs">
          {props.actorName}
        </div>
        <div class="flex h-full justify-center">
          <Switch>
            <Match when={props.activityType === "manualActivity"}>
              <ManualActivityIcon />
            </Match>
            <Match when={props.activityType === "autoActivity"}>
              <AutoActivityIcon />
            </Match>
            <Match when={props.activityType === "manualTimerActivity"}>
              <ManualTimerActivityIcon />
            </Match>
            <Match when={props.activityType === "autoTimerActivity"}>
              <AutoTimerActivityIcon />
            </Match>
            <Match when={props.activityType === "userActivity"}>
              <UserActivityIcon />
            </Match>
          </Switch>
        </div>
        <div ref={titleDiv} class="mx-0.5 text-xs">
          {props.name}
        </div>
      </div>

      <div
        class="w-[10px] hover:cursor-ew-resize hover:bg-primary3"
        onMouseDown={(e) => props.onRightMouseDown?.(e)}
      >
        <Switch>
          <Match when={props.splitType === "oneSplit"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path class="stroke-black [vector-effect:non-scaling-stroke]" d="M 0 50 L 10 50" />
            </svg>
          </Match>
          <Match when={props.splitType === "xorSplit"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path
                class="stroke-black [vector-effect:non-scaling-stroke]"
                d="M 0 50 L 9 50 M 9 0 L 9 100"
              />
            </svg>
          </Match>
          <Match when={props.splitType === "andSplit"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path
                class="fill-none stroke-black [vector-effect:non-scaling-stroke]"
                d="M 10 0 L 0 50 L 10 100 M 5 25 L 5 75"
              />
            </svg>
          </Match>
        </Switch>
      </div>
    </div>
  );
}
