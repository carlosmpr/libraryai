/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";


export default function Footer({ footerData = [], brand }) {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <footer className="footer p-10    border border-t-2 border-black">
        {footerData.map((item, index) => (
          <nav key={index}>
            <h2 className="font-bold text-lg ">
              {item.title}
            </h2>
            {item.footerNav.map((footerItem, subIndex) => (
              <Link
                to={footerItem.href}
                key={subIndex}
                className="link link-hover"
              >
                {footerItem.link}
              </Link>
            ))}
          </nav>
        ))}

        <form>
          <h2 className="font-bold text-lg text-base-content/80">Newsletter</h2>
          <fieldset className="form-control w-80">
            <label className="label">
              <span className="label-text">Enter your email address</span>
            </label>
            <div className="join">
              <input
                type="text"
                placeholder="username@site.com"
                className="input text-black input-bordered join-item"
              />
              <button className="btn btn-white join-item">Subscribe</button>
            </div>
          </fieldset>
        </form>
      </footer>
      <footer className="footer px-10 py-4 border-t bg-base-300 text-base-content border-base-300">
        <aside className="items-center grid-flow-col">
          <img
            width={500}
            height={500}
            src={brand}
            className="w-8 bg-primary"
            alt="logo"
          />
          <p className="paragraph-small">
            © {currentYear} Saas. All rights reserved.
          </p>
        </aside>
        <nav className="md:place-self-center md:justify-self-end">
          <div className="grid grid-flow-col gap-4">
            <Link href="#">Facebook</Link>
            <Link href="#">Twitter</Link>
            <Link href="#">Instagram</Link>
          </div>
        </nav>
      </footer>
    </>
  );
}
