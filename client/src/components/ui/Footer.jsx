
import { Link } from "react-router-dom";

const Footer = ({  brand }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <>
  
  <footer className="footer px-10 py-4 border border-t-2 border-black">
  <aside >
    <div className="flex gap-4 items-center">
    <img
      width={500}
      height={500}
      src={brand}
      className="w-8 bg-neutral"
      alt="logo"
    />
     <p className="text-xs w-64 text-base-content/70">
      Code Library is still in beta. Please verify and validate the AI-generated content.
    </p>
    
    </div>
    <p className="paragraph-small">
      © {currentYear} CodingNutella. All rights reserved.
    </p>
  </aside>
  
  <nav className="md:place-self-center md:justify-self-end">
    <div className="grid grid-flow-col gap-4">
      <Link to="#">Facebook</Link>
      <Link to="#">Twitter</Link>
      <Link to="#">Instagram</Link>
    </div>
  </nav>
  
</footer>

    </>
  );
};

export default Footer;
