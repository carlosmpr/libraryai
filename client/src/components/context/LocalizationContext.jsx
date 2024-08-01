// context/LocalizationContext.js
import  { createContext, useMemo, useContext } from 'react';
import { generalData as generalDataEn, homePageData as homePageDataEn, aboutPageData as aboutPageDataEn, privacyPolicyPageData as privacyPolicyPageDataEn ,mainLibraryPageData as mainLibraryPageDataEn } from '../../data/PageDataEn';
import { generalData as generalDataEs, homePageData as homePageDataEs, aboutPageData as aboutPageDataEs, privacyPolicyPageData as privacyPolicyPageDataEs, mainLibraryPageData as mainLibraryPageDataEs } from '../../data/PageDataEs';

const LocalizationContext = createContext();

export const LocalizationProvider = ({ children }) => {
  const localizationData = useMemo(() => {
    const userLanguage = navigator.language || navigator.userLanguage;
    const isSpanish = userLanguage.startsWith('es');

    const generalData = isSpanish ? generalDataEs : generalDataEn;
    const homePageData = isSpanish ? homePageDataEs : homePageDataEn;
    const aboutPageData = isSpanish ? aboutPageDataEs : aboutPageDataEn;
    const privacyPolicyPageData = isSpanish ? privacyPolicyPageDataEs : privacyPolicyPageDataEn;
    const mainLibraryPageData = isSpanish ? mainLibraryPageDataEs : mainLibraryPageDataEn

    return { generalData, homePageData, aboutPageData, privacyPolicyPageData, isSpanish, mainLibraryPageData  };
  }, []);

  return (
    <LocalizationContext.Provider value={localizationData}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  return useContext(LocalizationContext);
};
