import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';

import { Outlet } from 'react-router-dom';

export default function DefaultLayout({generalData}) {
  const { navbarContent, footerData } = generalData;
  console.log(navbarContent)
  return (
    <>
      <Navbar {...navbarContent} />
      <Outlet />
      <Footer {...footerData} />
    </>
  );
}
