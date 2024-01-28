import { useModel } from "../context/model-context";
import { useOperation } from "../context/operation-context";

export function TransitionEdge(props: { id: number }) {
  const {
    activity: { activityList },
    transition: { transitionList },
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
      <path
        class="transition"
        d={`M${fromActivity().x + fromActivity().width / 2},${fromActivity().y}L${toActivity().x - toActivity().width / 2},${toActivity().y}`}
      />
      <path
        class="transition--hover"
        onDblClick={onDlbClick}
        d={`M${fromActivity().x + fromActivity().width / 2},${fromActivity().y}L${toActivity().x - toActivity().width / 2},${toActivity().y}`}
      />
    </>
  );
}
