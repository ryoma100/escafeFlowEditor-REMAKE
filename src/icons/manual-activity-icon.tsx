import { Match, Switch } from "solid-js";

import ManualActivitySvg from "@/assets/material-icons/manual-activity.svg";
import { useThemeContext } from "@/context/theme-context";

export function ManualActivityIcon() {
  const { theme } = useThemeContext();

  return (
    <Switch>
      <Match when={theme() === "material"}>
        <ManualActivitySvg />
      </Match>
      <Match when={theme() === "crab"}>
        <img src="crab/manual-activity.jpg" class="h-12 w-16" />
      </Match>
    </Switch>
  );
}
