import type { Meta, StoryObj } from "storybook-solidjs";

import { SaveDialogView } from "@/components/dialog/save-dialog";
import { dataFactory, toDateTime } from "@/data-source/data-factory";

const meta = {
  title: "Dialog/Save",
  component: SaveDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SaveDialogView>;
export default meta;

type Story = StoryObj<typeof SaveDialogView>;

const project = dataFactory.createProject(toDateTime("2025-01-01T00:00:00Z"));

export const Save: Story = {
  args: { project },
};
