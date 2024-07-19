
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import MainLibrary from './pages/MainLibrary';
import LibraryDetails from './pages/LibraryDetails';
import CustomizePrompt from './pages/CustomizePrompt';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/library" element={<MainLibrary />} />
        <Route path="/library/:repoName" element={<LibraryDetails />} />
        <Route path="/library/:repoName/customizeprompt" element={<CustomizePrompt />} />
      </Routes>
    </Router>
  );
}

export default App;
