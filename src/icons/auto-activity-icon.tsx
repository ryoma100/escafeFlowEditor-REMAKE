import AutoActivitySvg from "@/assets/material-icons/auto-activity.svg";
import { useAppContext } from "@/context/app-context";
import { Match, Switch } from "solid-js";

export function AutoActivityIcon() {
  const {
    i18n: { theme },
  } = useAppContext();

  return (
    <Switch>
      <Match when={theme() === "material"}>
        <AutoActivitySvg />
      </Match>
      <Match when={theme() === "crab"}>
        <img src="crab/auto-activity.jpg" class="h-12 w-16" />
      </Match>
    </Switch>
  );
}
