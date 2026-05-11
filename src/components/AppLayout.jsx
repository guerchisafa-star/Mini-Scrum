import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { ProjectProvider } from '../context/ProjectContext';

export default function AppLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <ProjectProvider>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {/* Topbar */}
          <header style={{
            height: 52, background: '#fff', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            padding: '0 20px', flexShrink: 0, gap: 8
          }}>
            <button style={{
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', borderRadius: '50%',
              color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative', transition: 'background .1s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={18} height={18}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: '#de350b', border: '2px solid #fff' }} />
            </button>
          </header>
          <main style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 20px', background: 'var(--bg-app)' }}>
            <Outlet />
          </main>
        </div>
      </div>
    </ProjectProvider>
  );
}
