import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import HomePage from './pages/Dashboard/HomePage';
import GradesPage from './pages/Dashboard/GradesPage';
import AttendancePage from './pages/Dashboard/AttendancePage';
import UsersPage from './pages/DashE/UsersPage';
import StudentsPage from './pages/DashE/StudentsPage';

function App() {
  return (
    <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/dashboard" element={<HomePage />} />
    <Route path="/dashboard/grades" element={<GradesPage />} />
    <Route path="/dashboard/attendance" element={<AttendancePage />} />
    <Route path="/dashE/users" element={<UsersPage />} />
    <Route path="/dashE/students" element={<StudentsPage />} />
  </Routes>
  );
}

export default App;
