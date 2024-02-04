import { useModel } from "../context/model-context";
import { useOperation } from "../context/operation-context";

export function TransitionEdge(props: { id: number }) {
  const {
    activityModel: { activityList },
    transitionModel: { transitionList },
  } = useModel();
  const {
    transition: { setOpenTransitionDialogId },
  } = useOperation();

  const transition = () => transitionList.find((it) => it.id === props.id)!;
  const fromActivity = () =>
    activityList.find((it) => it.id === transition().fromActivityId)!;
  const toActivity = () =>
    activityList.find((it) => it.id === transition().toActivityId)!;

  function onDlbClick(_e: MouseEvent) {
    setOpenTransitionDialogId(transition().id);
  }

  return (
    <>
      <line
        class="transition"
        x1={fromActivity().cx + fromActivity().width / 2}
        y1={fromActivity().cy}
        x2={toActivity().cx - toActivity().width / 2}
        y2={toActivity().cy}
        marker-end="url(#arrow-end)"
      />
      <line
        class="transition--hover"
        onDblClick={onDlbClick}
        x1={fromActivity().cx + fromActivity().width / 2}
        y1={fromActivity().cy}
        x2={toActivity().cx - toActivity().width / 2}
        y2={toActivity().cy}
      />
    </>
  );
}
