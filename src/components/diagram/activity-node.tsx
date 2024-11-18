import { JSXElement, Match, onMount, Switch } from "solid-js";

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

export function ActivityNodeContainer(props: {
  readonly activity: ActivityNode;
  readonly onActivityLeftPointerDown?: (e: PointerEvent, activity: ActivityNode) => void;
  readonly onActivityRightPointerDown?: (e: PointerEvent, activity: ActivityNode) => void;
  readonly onActivityPointerDown?: (e: PointerEvent, activity: ActivityNode) => void;
}): JSXElement {
  const { activityNodeModel, actorModel, dialogModel } = useModelContext();

  function handleLeftPointerDown(e: PointerEvent) {
    props.onActivityLeftPointerDown?.(e, props.activity);
  }

  function handleRightPointerDown(e: PointerEvent) {
    props.onActivityRightPointerDown?.(e, props.activity);
  }

  function handlePointerDown(e: PointerEvent) {
    props.onActivityPointerDown?.(e, props.activity);
  }

  function handleDblClick() {
    dialogModel.setOpenDialog({ type: "activity", activity: props.activity });
  }

  return (
    <foreignObject
      data-id={props.activity.xpdlId}
      x={props.activity.x}
      y={props.activity.y}
      width={props.activity.width}
      height={props.activity.height}
    >
      <ActivityNodeView
        activityType={props.activity.activityType}
        name={props.activity.name}
        actorName={actorModel.actorList.find((it) => it.id === props.activity.actorId)?.name ?? ""}
        joinType={props.activity.joinType}
        splitType={props.activity.splitType}
        selected={props.activity.selected}
        width={props.activity.width}
        onLeftPointerDown={handleLeftPointerDown}
        onPointerDown={handlePointerDown}
        onRightPointerDown={handleRightPointerDown}
        onDblClick={handleDblClick}
        onChangeHeight={(height) => activityNodeModel.resizeActivityHeight(props.activity, height)}
      />
    </foreignObject>
  );
}

export function ActivityNodeView(props: {
  readonly activityType: ActivityNodeType;
  readonly name: string;
  readonly actorName: string;
  readonly joinType: ActivityJoinType;
  readonly splitType: ActivitySplitType;
  readonly selected: boolean;
  readonly width: number;
  readonly onLeftPointerDown?: (e: PointerEvent) => void;
  readonly onPointerDown?: (e: PointerEvent) => void;
  readonly onRightPointerDown?: (e: PointerEvent) => void;
  readonly onDblClick?: (e: MouseEvent) => void;
  readonly onChangeHeight?: (height: number) => void;
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
      class="flex size-full flex-row justify-between border-2 border-solid border-transparent data-[select=true]:border-primary"
    >
      <div
        class="w-[10px] hover:cursor-ew-resize hover:bg-secondary"
        onPointerDown={(e) => props.onLeftPointerDown?.(e)}
      >
        <Switch>
          <Match when={props.joinType === "oneJoin"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path
                class="stroke-foreground [vector-effect:non-scaling-stroke]"
                d="M 0 50 L 10 50"
              />
            </svg>
          </Match>
          <Match when={props.joinType === "xorJoin"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path
                class="stroke-foreground [vector-effect:non-scaling-stroke]"
                d="M 0 50 L 10 50 M 1 0 L 1 100"
              />
            </svg>
          </Match>
          <Match when={props.joinType === "andJoin"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path
                class="fill-none stroke-foreground [vector-effect:non-scaling-stroke]"
                d="M 0 0 L 10 50 L 0 100 M 5 25 L 5 75"
              />
            </svg>
          </Match>
        </Switch>
      </div>

      <div
        class="flex size-full cursor-move select-none flex-col border border-solid border-foreground bg-background hover:bg-secondary"
        onPointerDown={(e) => props.onPointerDown?.(e)}
        onDblClick={(e) => props.onDblClick?.(e)}
      >
        <div class="mx-0.5 w-full text-ellipsis whitespace-nowrap text-xs">{props.actorName}</div>
        <div class="flex h-full justify-center">
          <Switch>
            <Match when={props.activityType === "manualActivity"}>
              <ManualActivityIcon class="fill-foreground" />
            </Match>
            <Match when={props.activityType === "autoActivity"}>
              <AutoActivityIcon class="fill-foreground" />
            </Match>
            <Match when={props.activityType === "manualTimerActivity"}>
              <ManualTimerActivityIcon class="fill-foreground" />
            </Match>
            <Match when={props.activityType === "autoTimerActivity"}>
              <AutoTimerActivityIcon class="fill-foreground" />
            </Match>
            <Match when={props.activityType === "userActivity"}>
              <UserActivityIcon class="fill-foreground" />
            </Match>
          </Switch>
        </div>
        <div ref={titleDiv} class="mx-0.5 text-xs">
          {props.name}
        </div>
      </div>

      <div
        class="w-[10px] hover:cursor-ew-resize hover:bg-secondary"
        onPointerDown={(e) => props.onRightPointerDown?.(e)}
      >
        <Switch>
          <Match when={props.splitType === "oneSplit"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path
                class="stroke-foreground [vector-effect:non-scaling-stroke]"
                d="M 0 50 L 10 50"
              />
            </svg>
          </Match>
          <Match when={props.splitType === "xorSplit"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path
                class="stroke-foreground [vector-effect:non-scaling-stroke]"
                d="M 0 50 L 9 50 M 9 0 L 9 100"
              />
            </svg>
          </Match>
          <Match when={props.splitType === "andSplit"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path
                class="fill-none stroke-foreground [vector-effect:non-scaling-stroke]"
                d="M 10 0 L 0 50 L 10 100 M 5 25 L 5 75"
              />
            </svg>
          </Match>
        </Switch>
      </div>
    </div>
  );
}
