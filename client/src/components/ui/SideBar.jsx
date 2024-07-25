/* eslint-disable react/prop-types */
import { useMainLibrary } from "../context/MainLibraryContext";
import PromptNavigations from "./NavigationButton";

export default function SideBar({ children }) {
  const { userProfile } = useMainLibrary();

  return (
    <div className="p-4 w-[20%] bg-base-100 border-r-2 border-black shadow-2xl overflow-y-scroll flex flex-col ">
      {userProfile && (
        <div className="avatar items-center gap-2 ">
          <div className="w-12 rounded-full">
            <img src={userProfile.photos[0].value} alt="Profile" className="rounded-full" />
          </div>
          <p className="font-semibold">{userProfile.username}</p>
        </div>
      )}
      {children}
      <PromptNavigations />
    </div>
  );
}
