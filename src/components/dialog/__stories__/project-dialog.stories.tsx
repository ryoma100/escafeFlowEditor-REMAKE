import type { Meta, StoryObj } from "storybook-solidjs";

import { ProjectDialogView } from "@/components/dialog/project-dialog";
import { i18nEnDict } from "@/constants/i18n";
import { dataFactory } from "@/data-source/data-factory";

const meta = {
  title: "Dialog/Project",
  component: ProjectDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ProjectDialogView>;
export default meta;

type Story = StoryObj<typeof ProjectDialogView>;

const project = dataFactory.createProject();

export const Project: Story = {
  args: {
    openDialog: { type: "project", project },
    dict: i18nEnDict,
  },
};
