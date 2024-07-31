

import { useInstructions } from "../context/UserInstructions";
import { useState } from "react";
import {
  PlusCircleIcon,
  MinusCircleIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Breadcrumbs from "../ui/BreadCrumbs";
import SideBar from "../ui/SideBar";

const ListPrompts = ({ id, name, instructions, model, onDelete }) => {
  const [expand, setExpand] = useState(false);

  const handleExpand = () => {
    setExpand(!expand);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div className="flex gap-5 bg-white justify-between mt-4 rounded-2xl w-full px-6 border border-zinc-700 shadow-xl p-10 transition-all">
      <div className="flex flex-col grow shrink-0 basis-0 w-fit transition-all">
        <h3 className="text-lg font-medium leading-7 text-gray-900">{name}</h3>

        <div
          className={`overflow-hidden transition-all duration-500 ${
            expand ? "max-h-96" : "max-h-0"
          }`}
        >
          <p className="mt-2 text-sm leading-6 text-slate-600 max-w-[500px]">
            {instructions}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <span>{model}</span>
          <div className="space-x-4">
            <button className="btn btn-error btn-sm" onClick={handleDelete}>
              <TrashIcon className="w-4" />
            </button>

            <Link
              to={`/customizeprompt?id=${id}`}
              className="btn btn-neutral btn-sm"
            >
              <PencilIcon className="w-4" />
            </Link>
          </div>
        </div>
      </div>

      {expand ? (
        <PlusCircleIcon
          className="self-start w-6 cursor-pointer"
          onClick={handleExpand}
        />
      ) : (
        <MinusCircleIcon
          className="self-start w-6 cursor-pointer"
          onClick={handleExpand}
        />
      )}
    </div>
  );
};

const UserPrompts = () => {
  const { userInstructions, setUserInstructions } = useInstructions();

  const handleDeleteInstruction = async (id) => {
    console.log(id);
    try {
      const response = await fetch("/api/delete-instruction", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setUserInstructions((prevInstructions) =>
          prevInstructions.filter((instruction) => instruction.id !== id)
        );
      } else {
        console.error("Failed to delete instruction");
      }
    } catch (error) {
      console.error("Failed to delete instruction:", error);
    }
  };

  if (userInstructions.length > 0) {
    return (
      <div className="flex bg-orange-100 h-screen">
        <SideBar />
        <div className="flex flex-col bg-orange-50 flex-1 h-screen px-20">
          <div className="py-6">
            <Breadcrumbs />
          </div>
          <div className="h-[90%] overflow-y-scroll ">
            {userInstructions.map((item) => (
              <div key={item.id}>
                <ListPrompts
                  key={item.id}
                  {...item}
                  onDelete={handleDeleteInstruction}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return <div>No user default instructions</div>;
  }
};

export default UserPrompts;
