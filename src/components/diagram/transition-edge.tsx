import { JSXElement, createSignal, onMount } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { TransitionEdge } from "../../data-source/data-type";
import { computeLine } from "../../utils/line-utils";

export function TransitionEdgeContainer(props: { transition: TransitionEdge }): JSXElement {
  const {
    activityNodeModel: { getActivityNode },
    nodeModel: { changeSelectNodes },
    edgeModel: { changeSelectEdges },
    diagram: { setDragType },
    dialog: { setOpenTransitionDialog },
  } = useAppContext();

  const fromActivity = () => getActivityNode(props.transition.fromNodeId);
  const toActivity = () => getActivityNode(props.transition.toNodeId);

  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation();
    if (e.shiftKey) {
      changeSelectEdges("toggle", [props.transition.id]);
      setDragType("none");
    } else if (!props.transition.selected) {
      changeSelectNodes("clearAll");
      changeSelectEdges("select", [props.transition.id]);
    }
  }

  function handleDlbClick(_e: MouseEvent) {
    setOpenTransitionDialog(props.transition);
  }

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

  const [textWidth, setTextWidth] = createSignal(0);

  onMount(() => {
    const observer = new ResizeObserver(() => {
      if (textRef) {
        setTextWidth(textRef.getBBox().width);
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
        class="fill-none stroke-gray-500 stroke-1 [vector-effect:non-scaling-stroke]"
        x1={line().p1.x}
        y1={line().p1.y}
        x2={line().p2.x}
        y2={line().p2.y}
        marker-end={`url(#${props.transition.ognl !== "" ? "ognl-" : ""}arrow-end)`}
      />
      <line
        class="
          fill-none stroke-transparent stroke-[5]
          hover:cursor-pointer hover:stroke-primary2"
        classList={{ "fill-none stroke-primary1 stroke-[5]": props.transition.selected }}
        onDblClick={handleDlbClick}
        onMouseDown={handleMouseDown}
        x1={line().p1.x}
        y1={line().p1.y}
        x2={line().p2.x}
        y2={line().p2.y}
      />
      <text
        x={(line().p1.x + line().p2.x) / 2 - textWidth() / 2}
        y={(line().p1.y + line().p2.y) / 2}
        classList={{ hidden: props.transition.ognl === "" }}
        ref={textRef}
      >
        {props.transition.ognl}
      </text>
    </>
  );
}
