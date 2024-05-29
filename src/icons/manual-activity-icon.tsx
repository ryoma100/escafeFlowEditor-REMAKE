import ManualActivitySvg from "@/assets/material-icons/manual-activity.svg";
import { useAppContext } from "@/context/app-context";
import { Match, Switch } from "solid-js";

export function ManualActivityIcon() {
  const {
    i18n: { theme },
  } = useAppContext();

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
