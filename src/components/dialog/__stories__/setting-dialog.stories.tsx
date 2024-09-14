import type { Meta, StoryObj } from "storybook-solidjs";

import { SettingDialogView } from "@/components/dialog/setting-dialog";

const meta = {
  title: "Dialog/Setting",
  component: SettingDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SettingDialogView>;
export default meta;

type Story = StoryObj<typeof SettingDialogView>;

export const Setting: Story = {};
