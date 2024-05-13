import type { Meta, StoryObj } from "storybook-solidjs";

import { SettingDialogView } from "@/components/dialog/setting-dialog";
import { i18nEnDict } from "@/constants/i18n";

const meta = {
  title: "Dialog/Setting",
  component: SettingDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SettingDialogView>;
export default meta;

type Story = StoryObj<typeof SettingDialogView>;

export const Setting: Story = {
  args: { open: true, dict: i18nEnDict },
};
