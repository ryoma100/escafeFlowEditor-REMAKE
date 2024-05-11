import type { Meta, StoryObj } from "storybook-solidjs";

import { ConfirmDialogView } from "@/components/dialog/confirm-dialog";
import { i18nEnDict } from "@/constants/i18n";
import { dataFactory } from "@/data-source/data-factory";

const meta = {
  title: "Dialog/Confirm",
  component: ConfirmDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ConfirmDialogView>;
export default meta;

type Story = StoryObj<typeof ConfirmDialogView>;

const process = dataFactory.createProcess([]);

export const InitAll: Story = {
  args: {
    openDialog: { type: "initAll" },
    dict: i18nEnDict,
  },
};

export const DeleteProcess: Story = {
  args: {
    openDialog: { type: "deleteProcess", process },
    dict: i18nEnDict,
  },
};
