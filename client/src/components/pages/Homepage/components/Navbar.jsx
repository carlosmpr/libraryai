/* eslint-disable react/prop-types */


import { Link } from "react-router-dom";
import MobileNavbar from "./MobileNavbar";

export default function Navbar({ navItems, brand }) {
  return (
    <nav className="navbar sm:justify-center gap-4 fixed bg-base-100 z-40 border-b-2 border-black">
      
      <img
        width={500}
        height={500}
        src={brand}
        className="w-8 bg-neutral"
        alt="logo"
      />
        <ul className="hidden sm:menu sm:menu-horizontal px-1">

          {navItems.map((item) => (
            <li key={item.text}>
              <Link to={item.href}>{item.text}</Link>
            </li>
          ))}
        </ul>
       
        <a href={'/auth/github'} className="hidden sm:btn sm:btn-neutral sm:btn-sm">Login</a>
        <MobileNavbar navItems={navItems} />
      
     
    </nav>
  );
}
