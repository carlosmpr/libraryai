
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import MainLibrary from './pages/MainLibrary';
import LibraryDetails from './pages/LibraryDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mainlibrary" element={<MainLibrary />} />
        <Route path="/library/:repoName" element={<LibraryDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
