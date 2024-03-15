import { JSXElement } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { TransitionEdge } from "../../data-source/data-type";

export function TransitionEdgeContainer(props: { transition: TransitionEdge }): JSXElement {
  const {
    activityNodeModel: { getActivityNode },
    baseNodeModel: { changeSelectNodes },
    baseEdgeModel: { setSelectedEdges },
    diagram: { setDragType },
    dialog: { setOpenTransitionDialog },
  } = useAppContext();

  const fromActivity = () => getActivityNode(props.transition.fromNodeId);
  const toActivity = () => getActivityNode(props.transition.toNodeId);

  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation();
    if (e.shiftKey) {
      setSelectedEdges("toggle", [props.transition.id]);
      setDragType("none");
    } else if (!props.transition.selected) {
      changeSelectNodes("clearAll");
      setSelectedEdges("select", [props.transition.id]);
    }
  }

  function handleDlbClick(_e: MouseEvent) {
    setOpenTransitionDialog(props.transition);
  }

  return (
    <>
      <line
        class="fill-none stroke-gray-500 stroke-1 [vector-effect:non-scaling-stroke]"
        x1={fromActivity().x + fromActivity().width}
        y1={fromActivity().y + fromActivity().height / 2}
        x2={toActivity().x}
        y2={toActivity().y + toActivity().height / 2}
        marker-end="url(#arrow-end)"
      />
      <line
        data-select={props.transition.selected}
        class="
          fill-none stroke-transparent stroke-[5]
          hover:cursor-pointer hover:stroke-primary2
          data-[select=true]:fill-none
          data-[select=true]:stroke-primary1
          data-[select=true]:stroke-[5]"
        onDblClick={handleDlbClick}
        onMouseDown={handleMouseDown}
        x1={fromActivity().x + fromActivity().width}
        y1={fromActivity().y + fromActivity().height / 2}
        x2={toActivity().x}
        y2={toActivity().y + toActivity().height / 2}
      />
    </>
  );
}
