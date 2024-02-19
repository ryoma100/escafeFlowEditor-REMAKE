import type { Meta, StoryObj } from "storybook-solidjs";
import {
  AutoActivityIcon,
  AutoTimerActivityIcon,
  CommentIcon,
  EndIcon,
  LineIcon,
  ManualActivityIcon,
  ManualTimerActivityIcon,
  PointIcon,
  StartIcon,
  UserActivityIcon,
} from "../components/icons/material-icons";

function Material() {
  const iconBorder = { border: "1px solid gray" };
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <div style={iconBorder}>
        <PointIcon />
      </div>
      <div style={iconBorder}>
        <LineIcon />
      </div>
      <div style={iconBorder}>
        <ManualActivityIcon />
      </div>
      <div style={iconBorder}>
        <AutoActivityIcon />
      </div>
      <div style={iconBorder}>
        <ManualTimerActivityIcon />
      </div>
      <div style={iconBorder}>
        <AutoTimerActivityIcon />
      </div>
      <div style={iconBorder}>
        <UserActivityIcon />
      </div>
      <div style={iconBorder}>
        <StartIcon />
      </div>
      <div style={iconBorder}>
        <EndIcon />
      </div>
      <div style={iconBorder}>
        <CommentIcon />
      </div>
    </div>
  );
}

const meta = {
  title: "Icon/MaterialIcon",
  component: Material,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Material>;
type Story = StoryObj<typeof meta>;

export default meta;

export const MaterialIcon: Story = {};
