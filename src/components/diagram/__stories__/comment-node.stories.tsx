import type { Meta, StoryObj } from "storybook-solidjs";

import { CommentNodeView } from "@/components/diagram/extend-node";

const meta = {
  title: "Node/Comment",
  component: CommentNodeView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof CommentNodeView>;
export default meta;

type Story = StoryObj<typeof CommentNodeView>;

export const Comment: Story = {
  args: {
    comment: "Comment",
    selected: false,
  },
};
