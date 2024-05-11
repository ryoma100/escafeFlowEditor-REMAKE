import type { Meta, StoryObj } from "storybook-solidjs";

import { ProcessDialogView } from "@/components/dialog/process-dialog";
import { i18nEnDict } from "@/constants/i18n";
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
    openDialog: { type: "process", process },
    activityList: [],
    dict: i18nEnDict,
  },
};
