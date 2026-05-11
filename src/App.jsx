import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BacklogPage from './pages/BacklogPage';
import SprintsPage from './pages/SprintsPage';
import TeamPage from './pages/TeamPage';
import KanbanPage from './pages/KanbanPage';

function CanManage({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user?.role;
  if (role === 'DEVELOPER') return <Navigate to="/kanban" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/backlog" element={<CanManage><BacklogPage /></CanManage>} />
              <Route path="/sprints" element={<CanManage><SprintsPage /></CanManage>} />
              <Route path="/team" element={<CanManage><TeamPage /></CanManage>} />
              <Route path="/kanban" element={<KanbanPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
