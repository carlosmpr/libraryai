
"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Bars4Icon, XMarkIcon } from "@heroicons/react/24/outline";

const MobileNavbar = ({ navItems = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prevState) => !prevState);

  return (
    <div className="sm:hidden">
      <div
        className="rounded-full p-2 cursor-pointer bg-base-300 shadow-xl"
        onClick={toggleMenu}
      >
        {isOpen ? (
          <XMarkIcon className="w-4 h-4" />
        ) : (
          <Bars4Icon className="w-4 h-4" />
        )}
      </div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed bottom-0 left-0 right-0 relative transform transition-transform duration-300 z-50 ${
            isOpen ? "translate-y-0" : "translate-y-full"
          } bg-base-100 shadow-lg`}
        >
          <button
            className="absolute right-10 bg-black text-white font-bold top-10 shadow-md rounded-full p-2 cursor-pointer"
            onClick={toggleMenu}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <div className="p-5 flex justify-center items-center min-h-screen">
            <ul className="text-center space-y-10">
              {navItems.map((item) => (
                <li
                  key={item.text}
                  className="text-xl hover:scale-105"
                  onClick={() => setIsOpen(false)}
                >
                  <Link to={item.href}>{item.text}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
