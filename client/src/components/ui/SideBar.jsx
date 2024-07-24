/* eslint-disable react/prop-types */

import PromptNavigations from "./NavigationButton";
export default function SideBar({ children }) {
  return (
    <div className="p-4 w-[20%] bg-base-100  border-r-2 border-black shadow-2xl overflow-y-scroll flex flex-col ">
      <div className="avatar items-center gap-2 ">
        <div className="w-12 rounded-full">
          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
        <p className="font-semibold">Jhon Doe</p>
      </div>
  
      {children}
     
      <PromptNavigations />
     
     
    </div>
  );
}
