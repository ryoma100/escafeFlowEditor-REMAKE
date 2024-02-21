import { JSXElement } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { TransitionEdge } from "../../data-source/data-type";
import "./transition-edge.css";

export function TransitionEdgeContainer(props: { transition: TransitionEdge }): JSXElement {
  const {
    activityModel: { getActivityNode, selectActivities },
    transitionModel: { selectTransitions, toggleSelectTransition },
    otherNodeModel: { selectNodes },
    diagram: { setDragType },
    dialog: { setOpenTransitionDialog },
  } = useAppContext();

  const fromActivity = () => getActivityNode(props.transition.fromActivityId);
  const toActivity = () => getActivityNode(props.transition.toActivityId);

  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation();
    if (e.shiftKey) {
      toggleSelectTransition(props.transition.id);
      setDragType("none");
    } else if (!props.transition.selected) {
      selectTransitions([props.transition.id]);
      selectActivities([]);
      selectNodes([]);
    }
  }

  function handleDlbClick(_e: MouseEvent) {
    setOpenTransitionDialog(props.transition);
  }

  return (
    <>
      <line
        class="transition"
        x1={fromActivity().x + fromActivity().width}
        y1={fromActivity().y + fromActivity().height / 2}
        x2={toActivity().x}
        y2={toActivity().y + toActivity().height / 2}
        marker-end="url(#arrow-end)"
      />
      <line
        class="transition--hover"
        classList={{ "transition--selected": props.transition.selected }}
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
