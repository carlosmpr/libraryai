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
  buttonStyle = "btn-primary",
}) {
  return (
    <Link
      to={to}
      className={`btn ${buttonStyle} rounded-2xl flex items-center`}
    >
      {Icon && <Icon className="w-8 mr-2" />}
      {title}
    </Link>
  );
}

export default function PromptNavigations() {
  return (
    <div className="flex gap-4">
      <NavigationButton
        to="/userPrompts"
        icon={AdjustmentsHorizontalIcon}
        title={"My Custom Prompts"}
        buttonStyle="btn-secondary"
      />

      <NavigationButton
        to="/customizeprompt"
        icon={Cog6ToothIcon}
        buttonStyle="btn-neutral"
        title={"Create Prompt"}
      />
    </div>
  );
}
