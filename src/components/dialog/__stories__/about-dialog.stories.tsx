import type { Meta, StoryObj } from "storybook-solidjs";

import { AboutDialogView } from "@/components/dialog/about-dialog";

const meta = {
  title: "Dialog/About",
  component: AboutDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof AboutDialogView>;
export default meta;

type Story = StoryObj<typeof AboutDialogView>;

export const About: Story = {
  args: { open: true },
};
