import { JSXElement, createSignal, onMount } from "solid-js";

import { useModelContext } from "@/context/model-context";
import { Line, TransitionEdge } from "@/data-source/data-type";
import { computeLine } from "@/utils/line-utils";

export function TransitionEdgeContainer(props: {
  readonly transition: TransitionEdge;
}): JSXElement {
  const {
    activityNodeModel: { getActivityNode },
    nodeModel: { changeSelectNodes },
    edgeModel: { changeSelectEdges },
    diagramModel: { setDragMode: setDragType },
    dialogModel: { setModalDialog: setOpenDialog },
  } = useModelContext();

  const fromActivity = () => getActivityNode(props.transition.fromNodeId);
  const toActivity = () => getActivityNode(props.transition.toNodeId);
  const line = () =>
    computeLine(fromActivity(), toActivity(), {
      p1: {
        x: fromActivity().x + fromActivity().width - 10,
        y: fromActivity().y + fromActivity().height / 2,
      },
      p2: {
        x: toActivity().x + 10,
        y: toActivity().y + toActivity().height / 2,
      },
    });

  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation();

    if (e.shiftKey) {
      changeSelectEdges("toggle", [props.transition.id]);
      setDragType({ type: "none" });
    } else if (!props.transition.selected) {
      changeSelectNodes("clearAll");
      changeSelectEdges("select", [props.transition.id]);
    }
  }

  function handleDlbClick(_e: MouseEvent) {
    setOpenDialog({ type: "transition", transition: props.transition });
  }

  return (
    <TransitionEdgeView
      line={line()}
      ognl={props.transition.ognl}
      selected={props.transition.selected}
      handleMouseDown={handleMouseDown}
      handleDblClick={handleDlbClick}
    />
  );
}

export function TransitionEdgeView(props: {
  readonly line: Line;
  readonly ognl: string;
  readonly selected: boolean;
  readonly handleMouseDown?: (e: MouseEvent) => void;
  readonly handleDblClick?: (e: MouseEvent) => void;
}): JSXElement {
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

  const [ognlTextWidth, setOgnlTextWidth] = createSignal(0);
  let textRef: SVGTextElement | undefined;
  return (
    <>
      <line
        class="fill-none stroke-gray-500 stroke-1 [vector-effect:non-scaling-stroke]"
        x1={props.line.p1.x}
        y1={props.line.p1.y}
        x2={props.line.p2.x}
        y2={props.line.p2.y}
        marker-end={props.ognl !== "" ? "url(#ognl-arrow-end)" : "url(#arrow-end)"}
      />
      <line
        class="
          fill-none stroke-[5]
          hover:cursor-pointer hover:stroke-primary2"
        classList={{
          "stroke-transparent": !props.selected,
          "stroke-primary1": props.selected,
        }}
        onDblClick={(e) => props.handleDblClick?.(e)}
        onMouseDown={(e) => props.handleMouseDown?.(e)}
        x1={props.line.p1.x}
        y1={props.line.p1.y}
        x2={props.line.p2.x}
        y2={props.line.p2.y}
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
