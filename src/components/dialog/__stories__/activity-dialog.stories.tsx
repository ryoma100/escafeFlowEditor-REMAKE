import { userEvent, within } from "@storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs";

import { ActivityDialogView } from "@/components/dialog/activity-dialog";
import { dataFactory } from "@/data-source/data-factory";
import type { ActivityNodeType } from "@/data-source/data-type";

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

export const ManualActivityBeginning: Story = {
  name: "ManualActivity(Beginning)",
  args: {
    activity: createActivity("manualActivity"),
    actorList: process.actors,
    applications: process.detail.applications,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId("tab-join"));
  },
};

export const ManualActivity: Story = {
  name: "ManualActivity",
  args: {
    activity: createActivity("manualActivity"),
    actorList: process.actors,
    applications: process.detail.applications,
  },
};

export const ManualActivityTermination: Story = {
  name: "ManualActivity(Termination)",
  args: {
    activity: createActivity("manualActivity"),
    actorList: process.actors,
    applications: process.detail.applications,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId("tab-split"));
  },
};

export const AutoActivity: Story = {
  name: "AutoActivity",
  args: {
    activity: createActivity("autoActivity"),
    actorList: process.actors,
    applications: process.detail.applications,
  },
};

export const ManualTimerActivity: Story = {
  name: "ManualTimerActivity",
  args: {
    activity: createActivity("manualTimerActivity"),
    actorList: process.actors,
    applications: process.detail.applications,
  },
};

export const AutoTimerActivity: Story = {
  name: "AutoTimerActivity",
  args: {
    activity: createActivity("autoTimerActivity"),
    actorList: process.actors,
    applications: process.detail.applications,
  },
};

export const UserActivity: Story = {
  name: "UserActivity",
  args: {
    activity: createActivity("userActivity"),
    actorList: process.actors,
    applications: process.detail.applications,
  },
};
