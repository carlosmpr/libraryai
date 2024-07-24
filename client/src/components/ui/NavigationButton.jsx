/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import {
  AdjustmentsHorizontalIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

function NavigationButton({
  to,
  icon: Icon,
  title,

}) {
  return (
    <Link
      to={to}
      className={`rounded-2xl flex items-center gap-2`}
    >
      {Icon && <Icon className="w-6 " />}
      <p className="text-sm">{title}</p>
    </Link>
  );
}

export default function PromptNavigations() {
  return (
    <div className="flex flex-col gap-4 mt-auto">
      <NavigationButton
        to="/userPrompts"
        icon={AdjustmentsHorizontalIcon}
        title={"Custom Prompts"}
        buttonStyle="btn-secondary"
      />

      <NavigationButton
        to="/customizeprompt"
        icon={Cog6ToothIcon}
        buttonStyle="btn-neutral"
        title={"Create Prompt"}
      />

<button className="btn btn-secondary btn-sm ">Sign out</button>
    </div>
  );
}
