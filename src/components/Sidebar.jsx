import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { projects as projectsApi } from '../api/client';
import { useToast } from './Toast';

const NavItem = ({ to, icon, label }) => (
  <NavLink to={to} style={({ isActive }) => ({
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '8px 12px', borderRadius: '3px', textDecoration: 'none',
    fontSize: '14px', fontWeight: 500, transition: 'background .1s',
    color: isActive ? '#fff' : 'rgba(255,255,255,.7)',
    background: isActive ? 'rgba(255,255,255,.15)' : 'transparent',
  })}
    onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'rgba(255,255,255,.08)'; }}
    onMouseLeave={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'transparent'; }}
  >
    <span style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default function Sidebar() {
  const { user, logout, canManage } = useAuth();
  const { projectList, currentProject, setCurrentProject, loadProjects } = useProject();
  const { show } = useToast();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);

  const initials = (user?.fullName ?? '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const roleLabel = user?.role === 'ADMIN' ? 'Admin' : user?.role === 'PRODUCT_OWNER' ? 'Product Owner' : user?.role === 'SCRUM_MASTER' ? 'Scrum Master' : 'Développeur';

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const p = await projectsApi.create(user.userId, form);
      await loadProjects();
      setCurrentProject(p);
      setShowModal(false);
      setForm({ name: '', description: '' });
      show('Projet créé', 'success');
    } catch (err) { show(err.message, 'error'); }
    finally { setCreating(false); }
  };

  return (
    <aside style={{
      width: 'var(--sidebar-w)', minWidth: 'var(--sidebar-w)', height: '100vh',
      background: 'var(--bg-sidebar)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,.12)' }}>
        <div style={{ width: 30, height: 30, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#0052cc" strokeWidth="2.5" width={16} height={16}>
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-.2px' }}>MiniScrum</span>
      </div>

      {/* Project selector */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,.12)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 6 }}>Projet</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {projectList.length > 0 ? (
            <select
              style={{ flex: 1, padding: '6px 8px', fontSize: 13, fontWeight: 500, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', color: '#fff', borderRadius: 3, cursor: 'pointer' }}
              value={currentProject?.id || ''}
              onChange={e => setCurrentProject(projectList.find(p => p.id === Number(e.target.value)))}
            >
              {projectList.map(p => <option key={p.id} value={p.id} style={{ background: '#0052cc', color: '#fff' }}>{p.name}</option>)}
            </select>
          ) : (
            <span style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,.4)', padding: '6px 4px' }}>Aucun projet</span>
          )}
          {canManage && (
            <button onClick={() => setShowModal(true)} title="Nouveau projet"
              style={{ width: 28, height: 28, borderRadius: 3, border: '1px solid rgba(255,255,255,.25)', background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: 'background .1s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.1)'}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={14} height={14}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        <span style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.45)', letterSpacing: '.8px', padding: '6px 12px 4px', textTransform: 'uppercase' }}>Général</span>
        <NavItem to="/dashboard" label="Dashboard" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={16} height={16}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>} />
        <NavItem to="/kanban" label="Board" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={16} height={16}><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg>} />
        <NavItem to="/backlog" label="Backlog" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={16} height={16}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1.5" fill="currentColor"/><circle cx="3" cy="12" r="1.5" fill="currentColor"/><circle cx="3" cy="18" r="1.5" fill="currentColor"/></svg>} />
        <NavItem to="/sprints" label="Sprints" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={16} height={16}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />

        {canManage && (
          <>
            <span style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.45)', letterSpacing: '.8px', padding: '12px 12px 4px', textTransform: 'uppercase' }}>Gestion</span>
            <NavItem to="/team" label="Équipe" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={16} height={16}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
          </>
        )}
      </nav>

      {/* User */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, border: '2px solid rgba(255,255,255,.3)' }}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.fullName}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>{roleLabel}</div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} title="Déconnexion"
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', padding: 4, borderRadius: 3 }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.5)'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={16} height={16}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>

      {/* Modal nouveau projet */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <h3>Nouveau projet</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Nom du projet *</label>
                <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Mini-Scrum App" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description optionnelle" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? <span className="spinner" /> : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}
