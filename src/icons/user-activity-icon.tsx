import UserActivitySvg from "@/assets/material-icons/user-activity.svg";
import { useAppContext } from "@/context/app-context";
import { Match, Switch } from "solid-js";

export function UserActivityIcon() {
  const {
    i18n: { theme },
  } = useAppContext();

  return (
    <Switch>
      <Match when={theme() === "material"}>
        <UserActivitySvg />
      </Match>
      <Match when={theme() === "crab"}>
        <img src="crab/auto-activity.jpg" class="h-12 w-16" />
      </Match>
    </Switch>
  );
}
