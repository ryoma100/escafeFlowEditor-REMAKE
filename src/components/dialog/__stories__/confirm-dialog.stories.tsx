import type { Meta, StoryObj } from "storybook-solidjs";

import { ConfirmDialogView } from "@/components/dialog/confirm-dialog";

const meta = {
  title: "Dialog/Confirm",
  component: ConfirmDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ConfirmDialogView>;
export default meta;

type Story = StoryObj<typeof ConfirmDialogView>;

export const Confirm: Story = {
  args: { type: "initAll" },
};
