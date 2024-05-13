import type { Meta, StoryObj } from "storybook-solidjs";

import { ActorDialogView } from "@/components/dialog/actor-dialog";
import { i18nEnDict } from "@/constants/i18n";
import { dataFactory } from "@/data-source/data-factory";

const meta = {
  title: "Dialog/Actor",
  component: ActorDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ActorDialogView>;
export default meta;

type Story = StoryObj<typeof ActorDialogView>;

const actor = dataFactory.createActorEntity([]);

export const Actor: Story = {
  args: {
    openDialog: { type: "actor", actor },
    dict: i18nEnDict,
  },
};
