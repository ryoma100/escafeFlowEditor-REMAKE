import type { Meta, StoryObj } from "storybook-solidjs";

import { CommentDialogView } from "@/components/dialog/comment-dialog";
import { dataFactory } from "@/data-source/data-factory";

const meta = {
  title: "Dialog/Comment",
  component: CommentDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof CommentDialogView>;
export default meta;

type Story = StoryObj<typeof CommentDialogView>;

const comment = dataFactory.createCommentNode([], 0, 0);

export const Comment: Story = {
  args: {
    openDialog: { type: "comment", comment },
  },
};
