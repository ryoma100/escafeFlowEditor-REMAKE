import type { Meta, StoryObj } from "storybook-solidjs";

import { AppView } from "@/App";

const meta = {
  title: "App/App",
  component: AppView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof AppView>;
export default meta;

type Story = StoryObj<typeof AppView>;

export const App: Story = {};
