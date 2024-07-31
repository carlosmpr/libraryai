import { useMainLibrary } from "../context/MainLibraryContext";
import PromptNavigations from "./NavigationButton";
import { useState } from "react";
import {  Bars4Icon, XMarkIcon } from "@heroicons/react/24/outline";

const SideBar = ({ children }) => {
  const { userProfile } = useMainLibrary();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Floating action button for mobile devices */}
      <button
        className="sm:hidden fixed bottom-5 right-5 p-4 bg-secondary text-white rounded-full shadow-lg z-50"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars4Icon className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed sm:relative p-4 w-[90%] sm:w-[20%] h-full bg-base-100 border-r-2 border-black shadow-2xl overflow-y-scroll flex flex-col transform transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        {userProfile && (
          <div className="avatar items-center gap-2">
            <div className="w-12 rounded-full">
              <img src={userProfile.photos[0].value} alt="Profile" className="rounded-full" />
            </div>
            <p className="font-semibold">{userProfile.username}</p>
          </div>
        )}
        {children}
        <PromptNavigations />
      </div>
    </>
  );
};

export default SideBar;
