import ManualTimerActivitySvg from "@/assets/material-icons/manual-timer-activity.svg";
import { useAppContext } from "@/context/app-context";
import { Match, Switch } from "solid-js";

export function ManualTimerActivityIcon() {
  const {
    i18n: { theme },
  } = useAppContext();

  return (
    <Switch>
      <Match when={theme() === "material"}>
        <ManualTimerActivitySvg />
      </Match>
      <Match when={theme() === "crab"}>
        <img src="crab/manual-timer-activity.jpg" class="h-12 w-16" />
      </Match>
    </Switch>
  );
}
