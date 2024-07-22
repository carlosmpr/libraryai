import { Link } from "react-router-dom";
import { useInstructions } from "../context/UserInstructions";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
export default function CustomPromptLink() {
  const { userInstructions } = useInstructions();
  return (
    userInstructions && (
      <Link to={"/userPrompts"} className="btn btn-secondary rounded-2xl">
        <AdjustmentsHorizontalIcon className="w-8" />
        Custom Prompts{" "}
      </Link>
    )
  );
}
