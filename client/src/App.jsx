import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/HomePage';
import MainLibrary from './components/pages/MainLibrary';
import LibraryDetails from './components/pages/LibraryDetails';
import CustomizePrompt from './components/pages/CustomizePrompt';
import UserPrompts from './components/pages/UserPrompts';
import DefaultLayout from './components/pages/DefaultLayout';
import FeaturesPage from './components/pages/FeaturesPage';
import  AboutPage  from './components/pages/AboutPage';
import PrivacyPage from './components/pages/PrivacyPage';
import useLocalizedData from './components/hooks/useLocalizedData';

function App() {
  const { generalData, homePageData, aboutPageData, privacyPolicyPageData } = useLocalizedData();
  console.log(generalData, homePageData)

  return (
    <Router>
      <Routes>
        <Route element={<DefaultLayout generalData={generalData}/>}>
          <Route path="/" element={<Home generalData={generalData} homePageData={homePageData} />} />
          <Route path="/features" element={<FeaturesPage generalData={generalData}/>} />
          <Route path="/about" element={<AboutPage aboutPageData={aboutPageData} generalData={generalData}/>} />
          <Route path="/privacy" element={<PrivacyPage content={privacyPolicyPageData}/>} />
        </Route>
        <Route path="/library" element={<MainLibrary />} />
        <Route path="/library/:repoName" element={<LibraryDetails />} />
        <Route path="/customizeprompt" element={<CustomizePrompt />} />
        <Route path="/userPrompts" element={<UserPrompts />} />
      </Routes>
    </Router>
  );
}

export default App;
