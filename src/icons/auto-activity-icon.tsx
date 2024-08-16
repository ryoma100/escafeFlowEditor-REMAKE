import { Match, Switch } from "solid-js";

import AutoActivitySvg from "@/assets/material-icons/auto-activity.svg";
import { useThemeContext } from "@/context/theme-context";

export function AutoActivityIcon(props: Parameters<typeof AutoActivitySvg>[0]) {
  const { theme } = useThemeContext();

  return (
    <Switch>
      <Match when={theme() === "material"}>
        <AutoActivitySvg {...props} />
      </Match>
      <Match when={theme() === "crab"}>
        <img src="crab/auto-activity.jpg" class="h-12 w-16" />
      </Match>
    </Switch>
  );
}
