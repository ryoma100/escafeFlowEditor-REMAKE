import type { Meta, StoryObj } from "storybook-solidjs";

import { ActivityDialogView } from "@/components/dialog/activity-dialog";
import { dataFactory } from "@/data-source/data-factory";

const meta = {
  title: "Dialog/Activity",
  component: ActivityDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ActivityDialogView>;
export default meta;

type Story = StoryObj<typeof ActivityDialogView>;

const process = dataFactory.createProcess([]);
const activity = dataFactory.createActivityNode(
  process.nodeList,
  process.actors[0].id,
  "autoActivity",
  0,
  0,
);

export const Activity: Story = {
  args: {
    openDialog: { type: "activity", activity },
    actorList: process.actors,
    applications: process.detail.applications,
  },
};
