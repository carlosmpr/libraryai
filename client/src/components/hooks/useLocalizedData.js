// hooks/useLocalizedData.js
import { generalData as generalDataEn, homePageData as homePageDataEn, aboutPageData as aboutPageDataEn, privacyPolicyPageData as privacyPolicyPageDataEn} from '../../data/PageDataEn'
import { generalData as generalDataEs, homePageData as homePageDataEs, aboutPageData as aboutPageDataEs, privacyPolicyPageData as privacyPolicyPageDataEs } from '../../data/PageDataEs'

const useLocalizedData = () => {
  const userLanguage = navigator.language || navigator.userLanguage;
  const isSpanish = userLanguage.startsWith('es');

  const generalData = isSpanish ? generalDataEs : generalDataEn;
  const homePageData = isSpanish ? homePageDataEs : homePageDataEn;
  const aboutPageData = isSpanish ? aboutPageDataEs : aboutPageDataEn;
  const privacyPolicyPageData = isSpanish ? privacyPolicyPageDataEs : privacyPolicyPageDataEn

  return { generalData, homePageData, aboutPageData, privacyPolicyPageData };
};

export default useLocalizedData;
