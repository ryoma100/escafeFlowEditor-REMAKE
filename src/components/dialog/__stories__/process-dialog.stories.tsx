import type { Meta, StoryObj } from "storybook-solidjs";

import { ProcessDialogView } from "@/components/dialog/process-dialog";
import { dataFactory } from "@/data-source/data-factory";

const meta = {
  title: "Dialog/Process",
  component: ProcessDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ProcessDialogView>;
export default meta;

type Story = StoryObj<typeof ProcessDialogView>;

const process = dataFactory.createProcess([]);

export const Process: Story = {
  args: {
    process,
    activityList: [],
  },
};
