
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
      className={`rounded-2xl hidden lg:flex items-center gap-2  relative z-30`}
    >
      {Icon && <Icon className="w-6 " />}
      <p className="text-sm">{title}</p>
    </Link>
  );
}

export default function PromptNavigations() {
  const handleSignOut = async () => {
    try {
      const response = await fetch('/signout', {
        method: 'GET',
        credentials: 'include', // To include cookies
      });

      if (response.ok) {
        // Server will handle the redirect
        window.location.href = '/'; // Fallback in case server does not handle redirect
      } else {
        console.error('Failed to sign out');
      }
    } catch (error) {
      console.error('An error occurred during sign out', error);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-auto  ">
      <NavigationButton
        to="/userPrompts"
        icon={AdjustmentsHorizontalIcon}
        title={"Custom Prompts"}
      />

      <NavigationButton
        to="/customizeprompt"
        icon={Cog6ToothIcon}
        title={"Create Prompt"}
      />

      <button className="btn btn-secondary btn-sm" onClick={handleSignOut}>
        Sign out
      </button>
    </div>
  );
}
