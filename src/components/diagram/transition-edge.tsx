import { type JSXElement, createSignal, onMount } from "solid-js";

import { ACTIVITY_EAR_WIDTH } from "@/constants/app-const";
import { useModelContext } from "@/context/model-context";
import type { Line, NodeId, Rectangle, TransitionEdge } from "@/data-source/data-type";
import { computeLine, extendLine } from "@/utils/line-utils";

function adjustActivityRect(rect: Rectangle): Rectangle {
  return {
    x: rect.x - ACTIVITY_EAR_WIDTH,
    y: rect.y,
    width: rect.width + ACTIVITY_EAR_WIDTH * 2,
    height: rect.height,
  };
}

export function TransitionEdgeContainer(props: {
  readonly transition: TransitionEdge;
  readonly onFromPointerDown: (e: PointerEvent, endNodeId: NodeId) => void;
  readonly onToPointerDown: (e: PointerEvent, startNodeId: NodeId) => void;
}): JSXElement {
  const { activityNodeModel, nodeModel, edgeModel, dialogModel } = useModelContext();

  const fromRect = () => adjustActivityRect(activityNodeModel.getActivityNode(props.transition.fromNodeId));
  const toRect = () => adjustActivityRect(activityNodeModel.getActivityNode(props.transition.toNodeId));
  const line = () =>
    computeLine(fromRect(), toRect(), {
      p1: {
        x: fromRect().x + fromRect().width,
        y: fromRect().y + fromRect().height / 2,
      },
      p2: {
        x: toRect().x,
        y: toRect().y + toRect().height / 2,
      },
    });

  function handlePointerDown(e: PointerEvent) {
    if (e.shiftKey) {
      edgeModel.changeSelectEdges("toggle", [props.transition.id]);
    } else if (!props.transition.selected) {
      nodeModel.changeSelectNodes("clearAll");
      edgeModel.changeSelectEdges("select", [props.transition.id]);
    }
  }

  function handleDlbClick(_e: MouseEvent) {
    dialogModel.setOpenDialog({
      type: "transition",
      transition: props.transition,
    });
  }

  function handleFromPointerDown(e: PointerEvent) {
    props.onFromPointerDown(e, props.transition.toNodeId);
  }

  function handleToPointerDown(e: PointerEvent) {
    props.onToPointerDown(e, props.transition.fromNodeId);
  }

  return (
    <TransitionEdgeView
      line={line()}
      ognl={props.transition.ognl}
      selected={props.transition.selected}
      disabled={props.transition.disabled}
      onPointerDown={handlePointerDown}
      onDblClick={handleDlbClick}
      onFromPointerDown={handleFromPointerDown}
      onToPointerDown={handleToPointerDown}
    />
  );
}

export function TransitionEdgeView(props: {
  readonly line: Line;
  readonly ognl: string;
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly onPointerDown?: (e: PointerEvent) => void;
  readonly onDblClick?: (e: MouseEvent) => void;
  readonly onFromPointerDown?: (e: PointerEvent) => void;
  readonly onToPointerDown?: (e: PointerEvent) => void;
}): JSXElement {
  const connectors = () => extendLine(props.line, -5);
  const [ognlTextWidth, setOgnlTextWidth] = createSignal(0);

  onMount(() => {
    const observer = new ResizeObserver(() => {
      if (textRef) {
        setOgnlTextWidth(textRef.getBBox().width);
      }
    });
    if (textRef) {
      observer.observe(textRef);
    }
  });

  let textRef: SVGTextElement | undefined;
  return (
    <>
      <line
        class="fill-none stroke-1 [vector-effect:non-scaling-stroke]"
        classList={{
          "[stroke:var(--foreground-color)]": !props.disabled,
          "[stroke:var(--gridline-color)]": props.disabled,
        }}
        x1={props.line.p1.x}
        y1={props.line.p1.y}
        x2={props.line.p2.x}
        y2={props.line.p2.y}
        marker-end={props.ognl !== "" ? "url(#ognl-arrow-end)" : "url(#arrow-end)"}
      />
      <line
        class="fill-none stroke-5 hover:cursor-pointer hover:stroke-primary"
        classList={{
          "stroke-transparent": !props.selected,
          "stroke-primary": props.selected,
        }}
        onDblClick={(e) => props.onDblClick?.(e)}
        onPointerDown={(e) => props.onPointerDown?.(e)}
        x1={props.line.p1.x}
        y1={props.line.p1.y}
        x2={props.line.p2.x}
        y2={props.line.p2.y}
      />
      <circle
        class="fill-none stroke-transparent hover:cursor-pointer hover:fill-primary"
        onPointerDown={(e) => props.onFromPointerDown?.(e)}
        cx={connectors().p1.x}
        cy={connectors().p1.y}
        r={10}
      />
      <circle
        class="fill-none stroke-transparent hover:cursor-pointer hover:fill-primary"
        onPointerDown={(e) => props.onToPointerDown?.(e)}
        cx={connectors().p2.x}
        cy={connectors().p2.y}
        r={10}
      />
      <text
        x={(props.line.p1.x + props.line.p2.x) / 2 - ognlTextWidth() / 2}
        y={(props.line.p1.y + props.line.p2.y) / 2}
        classList={{ hidden: props.ognl === "" }}
        ref={textRef}
      >
        {props.ognl}
      </text>
    </>
  );
}
