import type { Meta, StoryObj } from "storybook-solidjs";

import { TransitionDialogView } from "@/components/dialog/transition-dialog";
import { dataFactory } from "@/data-source/data-factory";

const meta = {
  title: "Dialog/Transition",
  component: TransitionDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof TransitionDialogView>;
export default meta;

type Story = StoryObj<typeof TransitionDialogView>;

const transition = dataFactory.createTransitionEdge([], 1, 2);

export const Transition: Story = {
  args: {
    openDialog: { type: "transition", transition },
  },
};
