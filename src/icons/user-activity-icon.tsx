import UserActivitySvg from "@/assets/material-icons/user-activity.svg";
import { useThemeContext } from "@/context/theme-context";
import { Match, Switch } from "solid-js";

export function UserActivityIcon() {
  const { theme } = useThemeContext();

  return (
    <Switch>
      <Match when={theme() === "material"}>
        <UserActivitySvg />
      </Match>
      <Match when={theme() === "crab"}>
        <img src="crab/user-activity.jpg" class="h-12 w-16" />
      </Match>
    </Switch>
  );
}
