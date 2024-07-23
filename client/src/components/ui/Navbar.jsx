/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import MobileNavbar from "./MobileNavbar";


export default function Navbar({ navItems=[], brand }) {
  return (
    <nav className="navbar sm:justify-end gap-4 fixed  bg-base-100 border-b-2 border-black z-40">
      
      <img
        width={500}
        height={500}
        src={brand}
        className="w-8 bg-primary"
        alt="logo"
      />
        <ul className="hidden sm:menu sm:menu-horizontal px-1">

          {navItems.map((item) => (
            <li key={item.text}>
              <Link to={item.href}>{item.text}</Link>
            </li>
          ))}
        </ul>
       
        <Link to={'/#'} className="hidden sm:btn sm:btn-primary sm:btn-sm">Button</Link>
        <MobileNavbar navItems={navItems} />
      
     
    </nav>
  );
}
