import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import { generalData } from '../../data/PageData';
import { Outlet } from 'react-router-dom';

export default function DefaultLayout() {
  const { navbarContent, footerData } = generalData;
  
  return (
    <>
      <Navbar {...navbarContent} />
      <Outlet />
      <Footer {...footerData} />
    </>
  );
}
