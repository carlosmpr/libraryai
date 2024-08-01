import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import { useLocalization } from '../context/LocalizationContext';
import { Outlet } from 'react-router-dom';

export default function DefaultLayout() {
  const { generalData} = useLocalization();
  const { navbarContent, footerData } = generalData;
  return (
    <>
      <Navbar {...navbarContent} />
      <Outlet />
      <Footer {...footerData} />
    </>
  );
}
