import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import FormViewer from './pages/FormViewer';
import AuthCallback from './pages/AuthCallback';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder" element={<FormBuilder />} />
        <Route path="/form/:id" element={<FormViewer />} />
      </Routes>
    </Router>
  );
}

export default App;