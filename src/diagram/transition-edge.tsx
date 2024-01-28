import { useModel } from "../context/model-context";

export function TransitionEdge(props: { id: number }) {
  const {
    activity: { activityList },
    transition: { transitionList },
  } = useModel();

  const transition = () => transitionList.find((it) => it.id === props.id)!;
  const fromActivity = () =>
    activityList.find((it) => it.id === transition().fromActivityId)!;
  const toActivity = () =>
    activityList.find((it) => it.id === transition().toActivityId)!;

  return (
    <path
      stroke="gray"
      stroke-width="2"
      fill="none"
      d={`M${fromActivity().x + fromActivity().width / 2},${fromActivity().y}L${toActivity().x - toActivity().width / 2},${toActivity().y}`}
    />
  );
}
