/* eslint-disable react/prop-types */
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
export default function BentoCard({
  title,
  description,
  columnReverse = false,
  flexSize,
}) {
  const flexClass = columnReverse ? "flex-col-reverse" : "flex-col";

  return (
    <Link to={`/library/${title}`}
      className={`flex ${flexClass}  group justify-between bg-base-100 items-start  text-sm p-4 border-2 border-black  shadow-2xl rounded-2xl    w-[250px]  h-[290px]  shrink-0 ${flexSize}`}
    >
      <div>
        <h3 className="text-2xl font-medium  ">{title}</h3>
        <p className="text-base-content/70 line-clamp-5">{description}</p>
      </div>

      <div className="flex gap-4 text-primary group-hover:gap-8 transition-all duration-500 ease-in-out">
        <span className="text-sm">Open Library</span>
        <ArrowLongRightIcon className="w-6" />
      </div>
    </Link>
  );
}
