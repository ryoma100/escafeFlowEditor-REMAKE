// cSpell:ignoreRegExp .*\.svg\";$
import { JSXElement } from "solid-js";
import PointSvg from "../../assets/material-icons/arrow_selector_tool_FILL0_wght400_GRAD0_opsz24.svg";
import CommentSvg from "../../assets/material-icons/comment_FILL0_wght400_GRAD0_opsz24.svg";
import AutoActivitySvg from "../../assets/material-icons/computer_FILL0_wght400_GRAD0_opsz24.svg";
import LineSvg from "../../assets/material-icons/north_east_FILL0_wght400_GRAD0_opsz24.svg";
import HandActivitySvg from "../../assets/material-icons/pan_tool_FILL0_wght400_GRAD0_opsz24.svg";
import PauseSvg from "../../assets/material-icons/pause_circle_FILL0_wght400_GRAD0_opsz24.svg";
import ManualActivitySvg from "../../assets/material-icons/person_check_FILL0_wght400_GRAD0_opsz24.svg";
import StartSvg from "../../assets/material-icons/play_arrow_FILL0_wght400_GRAD0_opsz24.svg";
import PlaySvg from "../../assets/material-icons/play_circle_FILL0_wght400_GRAD0_opsz24.svg";
import TimeSvg from "../../assets/material-icons/schedule_FILL0_wght400_GRAD0_opsz24.svg";
import EndSvg from "../../assets/material-icons/stop_FILL0_wght400_GRAD0_opsz24.svg";

export function PointIcon(): JSXElement {
  return (
    <div class="flex items-center justify-center">
      <PointSvg width={28} height={28} />
    </div>
  );
}

export function LineIcon(): JSXElement {
  return (
    <div class="flex items-center justify-center">
      <LineSvg width={28} height={28} />
    </div>
  );
}

export function ManualActivityIcon(): JSXElement {
  return (
    <div class="flex items-center justify-center">
      <PauseSvg width={20} height={20} />
      <ManualActivitySvg width={40} height={40} />
    </div>
  );
}

export function AutoActivityIcon(): JSXElement {
  return (
    <div class="flex items-center justify-center">
      <PlaySvg width={20} height={20} />
      <AutoActivitySvg width={40} height={40} />
    </div>
  );
}

export function ManualTimerActivityIcon(): JSXElement {
  return (
    <div class="flex items-center justify-center">
      <div class="flex flex-col">
        <PauseSvg width={20} height={20} />
        <TimeSvg width={20} height={20} />
      </div>
      <ManualActivitySvg width={40} height={40} />
    </div>
  );
}

export function AutoTimerActivityIcon(): JSXElement {
  return (
    <div class="flex items-center justify-center">
      <div class="flex flex-col">
        <PauseSvg width={20} height={20} />
        <TimeSvg width={20} height={20} />
      </div>
      <AutoActivitySvg width={40} height={40} />
    </div>
  );
}

export function UserActivityIcon(): JSXElement {
  return (
    <div class="flex items-center justify-center">
      <PlaySvg width={20} height={20} />
      <HandActivitySvg width={40} height={40} />
    </div>
  );
}

export function StartIcon(): JSXElement {
  return (
    <div class="flex items-center justify-center">
      <StartSvg width={40} height={40} />
    </div>
  );
}

export function EndIcon(): JSXElement {
  return (
    <div class="flex items-center justify-center">
      <EndSvg width={40} height={40} />
    </div>
  );
}

export function CommentIcon(): JSXElement {
  return (
    <div class="flex items-center justify-center">
      <CommentSvg width={40} height={40} />
    </div>
  );
}
