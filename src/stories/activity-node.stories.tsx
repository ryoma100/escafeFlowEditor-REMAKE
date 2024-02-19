import type { Meta, StoryObj } from "storybook-solidjs";
import { ActivityNodeView } from "../components/diagram/activity-node";

const meta = {
  title: "Node/Activity",
  component: ActivityNodeView,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: [
        "manualActivity",
        "autoActivity",
        "manualTimerActivity",
        "autoTimerActivity",
        "userActivity",
      ],
    },
    joinType: {
      control: "select",
      options: ["notJoin", "oneJoin", "xorJoin", "andJoin"],
    },
    splitType: {
      control: "select",
      options: ["notSplit", "oneSplit", "xorSplit", "andSplit"],
    },
    width: {
      control: { type: "range", min: 100, max: 500, step: 10 },
    },
  },
} satisfies Meta<typeof ActivityNodeView>;
export default meta;

type Story = StoryObj<typeof ActivityNodeView>;

export const ManualActivity: Story = {
  args: {
    type: "manualActivity",
    name: "Manual Activity",
    actorName: "Actor 1",
    joinType: "notJoin",
    splitType: "notSplit",
    selected: false,
    width: 100,
  },
};

export const AutoActivity: Story = {
  args: {
    type: "autoActivity",
    name: "Auto Activity",
    actorName: "Actor 1",
    joinType: "notJoin",
    splitType: "notSplit",
    selected: false,
    width: 100,
  },
};

export const ManualTimerActivity: Story = {
  args: {
    type: "manualTimerActivity",
    name: "Manual Timer Activity",
    actorName: "Actor 1",
    joinType: "notJoin",
    splitType: "notSplit",
    selected: false,
    width: 100,
  },
};

export const AutoTimerActivity: Story = {
  args: {
    type: "autoTimerActivity",
    name: "Auto Timer Activity",
    actorName: "Actor 1",
    joinType: "notJoin",
    splitType: "notSplit",
    selected: false,
    width: 100,
  },
};

export const UserActivity: Story = {
  args: {
    type: "userActivity",
    name: "User Activity",
    actorName: "Actor 1",
    joinType: "notJoin",
    splitType: "notSplit",
    selected: false,
    width: 100,
  },
};
