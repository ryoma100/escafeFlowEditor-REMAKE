import { JSXElement, createSignal, onMount } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { TransitionEdge } from "../../data-source/data-type";

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

  const x1 = () => fromActivity().x + fromActivity().width;
  const y1 = () => fromActivity().y + fromActivity().height / 2;
  const x2 = () => toActivity().x;
  const y2 = () => toActivity().y + toActivity().height / 2;
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
        x1={x1()}
        y1={y1()}
        x2={x2()}
        y2={y2()}
        marker-end="url(#arrow-end)"
      />
      <line
        class="
          fill-none stroke-transparent stroke-[5]
          hover:cursor-pointer hover:stroke-primary2"
        classList={{ "fill-none stroke-primary1 stroke-[5]": props.transition.selected }}
        onDblClick={handleDlbClick}
        onMouseDown={handleMouseDown}
        x1={x1()}
        y1={y1()}
        x2={x2()}
        y2={y2()}
      />
      <text
        x={(x1() + x2()) / 2 - textWidth() / 2}
        y={(y1() + y2()) / 2}
        classList={{ hidden: props.transition.ognl === "" }}
        ref={textRef}
      >
        {props.transition.ognl}
      </text>
    </>
  );
}
