import type { Meta, StoryObj } from "storybook-solidjs";

import { MessageDialogView } from "@/components/dialog/message-dialog";
import { jaDict } from "@/constants/i18n-ja";

const meta = {
  title: "Dialog/Message",
  component: MessageDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof MessageDialogView>;
export default meta;

type Story = StoryObj<typeof MessageDialogView>;

export const Message: Story = {
  args: {
    message: jaDict.duplicateApplicationId,
  },
};
