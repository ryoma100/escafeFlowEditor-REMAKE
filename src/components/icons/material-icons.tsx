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
import "./icons.css";

export function PointIcon(): JSXElement {
  return (
    <div class="icon__tool">
      <PointSvg width={28} height={28} />
    </div>
  );
}

export function LineIcon(): JSXElement {
  return (
    <div class="icon__tool">
      <LineSvg width={28} height={28} />
    </div>
  );
}

export function ManualActivityIcon(): JSXElement {
  return (
    <div class="icon__tool-activity">
      <PauseSvg width={24} height={24} />
      <ManualActivitySvg width={44} height={44} />
    </div>
  );
}

export function AutoActivityIcon(): JSXElement {
  return (
    <div class="icon__tool-activity">
      <PlaySvg width={24} height={24} />
      <AutoActivitySvg width={44} height={44} />
    </div>
  );
}

export function ManualTimerActivityIcon(): JSXElement {
  return (
    <div class="icon__tool-activity">
      <div>
        <PauseSvg width={24} height={24} />
        <TimeSvg width={24} height={24} />
      </div>
      <ManualActivitySvg width={44} height={44} />
    </div>
  );
}

export function AutoTimerActivityIcon(): JSXElement {
  return (
    <div class="icon__tool-activity">
      <div>
        <PauseSvg width={24} height={24} />
        <TimeSvg width={24} height={24} />
      </div>
      <AutoActivitySvg width={44} height={44} />
    </div>
  );
}

export function UserActivityIcon(): JSXElement {
  return (
    <div class="icon__tool-activity">
      <PlaySvg width={24} height={24} />
      <HandActivitySvg width={44} height={44} />
    </div>
  );
}

export function StartIcon(): JSXElement {
  return (
    <div class="icon__tool">
      <StartSvg width={44} height={44} />
    </div>
  );
}

export function EndIcon(): JSXElement {
  return (
    <div class="icon__tool">
      <EndSvg width={44} height={44} />
    </div>
  );
}

export function CommentIcon(): JSXElement {
  return (
    <div class="icon__tool">
      <CommentSvg width={40} height={40} />
    </div>
  );
}
