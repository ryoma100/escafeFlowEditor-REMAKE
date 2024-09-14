import type { Meta, StoryObj } from "storybook-solidjs";

import { SaveDialogView } from "@/components/dialog/save-dialog";
import { dataFactory } from "@/data-source/data-factory";

const meta = {
  title: "Dialog/Save",
  component: SaveDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SaveDialogView>;
export default meta;

type Story = StoryObj<typeof SaveDialogView>;

const project = dataFactory.createProject();

export const Save: Story = {
  args: { project },
};
