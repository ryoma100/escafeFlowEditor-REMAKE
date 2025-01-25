import type { Meta, StoryObj } from "storybook-solidjs";

import { ActivityDialogView } from "@/components/dialog/activity-dialog";
import { dataFactory } from "@/data-source/data-factory";
import { ActivityNodeType } from "@/data-source/data-type";

const meta = {
  title: "Dialog/Activity",
  component: ActivityDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ActivityDialogView>;
export default meta;

type Story = StoryObj<typeof ActivityDialogView>;

const process = dataFactory.createProcess([]);
function createActivity(type: ActivityNodeType) {
  return dataFactory.createActivityNode(process.nodeList, process.actors[0].id, type, 0, 0);
}

export const ManualActivity: Story = {
  args: {
    activity: createActivity("manualActivity"),
    actorList: process.actors,
    applications: process.detail.applications,
  },
};

export const AutoActivity: Story = {
  args: {
    activity: createActivity("autoActivity"),
    actorList: process.actors,
    applications: process.detail.applications,
  },
};

export const ManualTimerActivity: Story = {
  args: {
    activity: createActivity("manualTimerActivity"),
    actorList: process.actors,
    applications: process.detail.applications,
  },
};

export const AutoTimerActivity: Story = {
  args: {
    activity: createActivity("autoTimerActivity"),
    actorList: process.actors,
    applications: process.detail.applications,
  },
};

export const UserActivity: Story = {
  args: {
    activity: createActivity("userActivity"),
    actorList: process.actors,
    applications: process.detail.applications,
  },
};
