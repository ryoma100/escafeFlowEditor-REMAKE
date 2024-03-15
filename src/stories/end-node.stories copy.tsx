import type { Meta, StoryObj } from "storybook-solidjs";
import { EndNodeView } from "../components/diagram/extend-node";

const meta = {
  title: "Node/End",
  component: EndNodeView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof EndNodeView>;
export default meta;

type Story = StoryObj<typeof EndNodeView>;

export const Start: Story = {
  args: {
    selected: false,
  },
};
