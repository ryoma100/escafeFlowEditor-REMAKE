import type { Meta, StoryObj } from "storybook-solidjs";

import { TransitionDialogView } from "@/components/dialog/transition-dialog";
import { dataFactory, toNodeId } from "@/data-source/data-factory";

const meta = {
  title: "Dialog/Transition",
  component: TransitionDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof TransitionDialogView>;
export default meta;

type Story = StoryObj<typeof TransitionDialogView>;

const transition = dataFactory.createTransitionEdge([], toNodeId(1), toNodeId(2));

export const Transition: Story = {
  args: { transition },
};
