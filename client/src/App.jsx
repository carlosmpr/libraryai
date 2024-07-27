
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Homepage';
import Login from './components/pages/Login'
import MainLibrary from './components/pages/MainLibrary';
import LibraryDetails from './components/pages/LibraryDetails'
import CustomizePrompt from './components/pages/CustomizePrompt'
import UserPrompts from './components/pages/UserPrompts';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/library" element={<MainLibrary />} />
        <Route path="/library/:repoName" element={<LibraryDetails />} />
        <Route path="/customizeprompt" element={<CustomizePrompt />} />
        <Route path="/userPrompts" element={<UserPrompts />} />
      </Routes>
    </Router>
  );
}

export default App;
