import { JSXElement } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { TransitionEdgeEntity } from "../../data-source/data-type";
import "./transition-edge.css";

export function TransitionEdge(props: {
  transition: TransitionEdgeEntity;
}): JSXElement {
  const {
    activityModel: { activityList },
    dialog: { setOpenTransitionDialog },
  } = useAppContext();

  const fromActivity = () =>
    activityList.find((it) => it.id === props.transition.fromActivityId)!;
  const toActivity = () =>
    activityList.find((it) => it.id === props.transition.toActivityId)!;

  function onDlbClick(_e: MouseEvent) {
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
        onDblClick={onDlbClick}
        x1={fromActivity().x + fromActivity().width}
        y1={fromActivity().y + fromActivity().height / 2}
        x2={toActivity().x}
        y2={toActivity().y + toActivity().height / 2}
      />
    </>
  );
}
