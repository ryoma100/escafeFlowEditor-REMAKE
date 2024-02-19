import type { Meta, StoryObj } from "storybook-solidjs";
import { StartEndNodeView } from "../components/diagram/start-end-node";

const meta = {
  title: "Node/StartEnd",
  component: StartEndNodeView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof StartEndNodeView>;
export default meta;

type Story = StoryObj<typeof StartEndNodeView>;

export const Start: Story = {
  args: {
    type: "startNode",
    selected: false,
  },
};

export const End: Story = {
  args: {
    type: "endNode",
    selected: false,
  },
};
