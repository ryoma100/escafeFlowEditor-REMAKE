import { Match, Switch } from "solid-js";

import UserActivitySvg from "@/assets/material-icons/user-activity.svg";
import { useThemeContext } from "@/context/theme-context";

export function UserActivityIcon(props: Parameters<typeof UserActivitySvg>[0]) {
  const { theme } = useThemeContext();

  return (
    <Switch>
      <Match when={theme() === "material"}>
        <UserActivitySvg {...props} />
      </Match>
      <Match when={theme() === "crab"}>
        <img src="crab/user-activity.jpg" class="h-12 w-16" />
      </Match>
    </Switch>
  );
}
