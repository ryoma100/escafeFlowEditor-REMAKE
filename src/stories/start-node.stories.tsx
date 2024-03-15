import type { Meta, StoryObj } from "storybook-solidjs";
import { StartNodeView } from "../components/diagram/extend-node";

const meta = {
  title: "Node/Start",
  component: StartNodeView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof StartNodeView>;
export default meta;

type Story = StoryObj<typeof StartNodeView>;

export const Start: Story = {
  args: {
    selected: false,
  },
};
