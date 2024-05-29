import AutoTimerActivitySvg from "@/assets/material-icons/auto-timer-activity.svg";
import { useAppContext } from "@/context/app-context";
import { Match, Switch } from "solid-js";

export function AutoTimerActivityIcon() {
  const {
    i18n: { theme },
  } = useAppContext();

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
