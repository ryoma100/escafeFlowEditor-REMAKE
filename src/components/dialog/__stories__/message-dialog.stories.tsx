import type { Meta, StoryObj } from "storybook-solidjs";

import { MessageDialogView } from "@/components/dialog/message-dialog";

const meta = {
  title: "Dialog/Message",
  component: MessageDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof MessageDialogView>;
export default meta;

type Story = StoryObj<typeof MessageDialogView>;

export const Message: Story = {
  args: {
    message: "duplicateApplicationId",
  },
};
