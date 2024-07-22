/* eslint-disable react/prop-types */

import { useInstructions } from "../context/UserInstructions";
import { useState } from "react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";

function ListPrompts({ id, name,instructions, model }) {
  const [expand, setExpand] = useState(false);
  const handleExpand = () => {
    setExpand(!expand);
  };
  return (
    <div className="flex gap-5  bg-white justify-between mt-4 rounded-2xl w-full px-6 border border-zinc-700  shadow-xl p-10 transition-all">
      <div className="flex flex-col grow shrink-0 basis-0 w-fit transition-all">
        <h3 className="text-lg font-medium leading-7 text-gray-900 ">
          {name}
        </h3>

      
        <div
          className={`overflow-hidden transition-all duration-500 ${
            expand ? "max-h-96" : "max-h-0"
          }`}
        >
          <p className="mt-2 text-sm leading-6 text-slate-600 max-w-[500px] ">
            {instructions}
          </p>
        </div>
        <span>{model}</span>
      </div>

      {expand ? (
        <PlusCircleIcon
          className=" self-start w-6 cursor-pointer"
          onClick={handleExpand}
        />
      ) : (
        <MinusCircleIcon
          className=" self-start w-6 cursor-pointer"
          onClick={handleExpand}
        />
      )}
    </div>
  );
}

export default function UserPrompts() {
  const { userInstructions } = useInstructions();
  if (userInstructions.length > 0) {
    return (
      <section className=" w-full px-32 bg-base-200/40">
        {userInstructions.map((item) => (
          <div key={item.title}>
            <ListPrompts key={item.title} {...item} />
          </div>
        ))}
      </section>
    );
  } else {
    return <div>No user default instructions</div>;
  }
}
