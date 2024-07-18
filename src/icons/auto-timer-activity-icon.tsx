import { Match, Switch } from "solid-js";

import AutoTimerActivitySvg from "@/assets/material-icons/auto-timer-activity.svg";
import { useThemeContext } from "@/context/theme-context";

export function AutoTimerActivityIcon() {
  const { theme } = useThemeContext();

  return (
    <Switch>
      <Match when={theme() === "material"}>
        <AutoTimerActivitySvg />
      </Match>
      <Match when={theme() === "crab"}>
        <img src="crab/auto-timer-activity.jpg" class="h-12 w-16" />
      </Match>
    </Switch>
  );
}
