import { useEffect, useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { members as membersApi, users as usersApi } from '../api/client';
import { useToast } from '../components/Toast';

export default function TeamPage() {
  const { currentProject } = useProject();
  const { show } = useToast();
  const [memberList, setMemberList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ userId: '', role: 'DEVELOPER' });
  const [adding, setAdding] = useState(false);

  const load = async () => {
    if (!currentProject) return;
    setLoading(true);
    try {
      const [m, u] = await Promise.all([
        membersApi.getByProject(currentProject.id),
        usersApi.getAll(),
      ]);
      setMemberList(m);
      setAllUsers(u);
    } catch (e) { show(e.message, 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [currentProject]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await membersApi.add(currentProject.id, { userId: Number(form.userId), role: form.role });
      show('Membre ajouté', 'success');
      setShowModal(false);
      setForm({ userId: '', role: 'DEVELOPER' });
      load();
    } catch (e) { show(e.message, 'error'); }
    finally { setAdding(false); }
  };

  const handleRemove = async (member) => {
    if (!confirm(`Retirer ${member.fullName} de l'équipe ?`)) return;
    try {
      await membersApi.remove(currentProject.id, member.id);
      show('Membre retiré', 'success');
      load();
    } catch (e) { show(e.message, 'error'); }
  };

  const memberIds = new Set(memberList.map(m => m.userId));
  const availableUsers = allUsers.filter(u => !memberIds.has(u.id));

  if (!currentProject) return (
    <div className="empty-state" style={{ height: '60vh' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={40} height={40}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      <h3>Aucun projet sélectionné</h3>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #dfe1e6' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#172b4d' }}>Équipe</h1>
          <p style={{ color: '#5e6c84', fontSize: '13px', marginTop: '2px' }}>{currentProject.name} · {memberList.length} membre{memberList.length > 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={14} height={14}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter un membre
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #dfe1e6', borderTopColor: '#0052cc', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
        </div>
      ) : memberList.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={40} height={40}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          <h3>Équipe vide</h3>
          <p>Ajoutez des membres à votre équipe</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {memberList.map(member => {
            const initials = member.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            const roleLabel = member.role === 'ADMIN' ? 'Admin' : member.role === 'PRODUCT_OWNER' ? 'Product Owner' : member.role === 'SCRUM_MASTER' ? 'Scrum Master' : 'Développeur';
            return (
              <div key={member.id} style={{ background: '#fff', border: '1px solid #dfe1e6', borderRadius: 3, padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 1px 2px rgba(9,30,66,.08)', transition: 'box-shadow .1s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 8px rgba(9,30,66,.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 2px rgba(9,30,66,.08)'}
              >
                <div style={{ width: 42, height: 42, borderRadius: '50%', flexShrink: 0, background: '#0052cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff' }}>
                  {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#172b4d' }}>{member.fullName}</div>
                  <div style={{ fontSize: '12px', color: '#5e6c84', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.email}</div>
                  <span style={{ display: 'inline-block', marginTop: 5, fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 3, background: '#e9f2ff', color: '#0052cc', textTransform: 'uppercase', letterSpacing: '.3px' }}>{roleLabel}</span>
                </div>
                <button className="icon-btn danger" title="Retirer" onClick={() => handleRemove(member)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <h3>Ajouter un membre</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAdd}>
              {availableUsers.length === 0 ? (
                <p style={{ color: '#5e6c84', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
                  Tous les utilisateurs sont déjà membres du projet
                </p>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Utilisateur *</label>
                    <select className="form-select" required value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))}>
                      <option value="">Sélectionner un utilisateur</option>
                      {availableUsers.map(u => <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rôle dans le projet</label>
                    <select className="form-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                      <option value="DEVELOPER">Développeur</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </>
              )}
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Annuler</button>
                {availableUsers.length > 0 && (
                  <button type="submit" className="btn btn-primary" disabled={adding || !form.userId}>
                    {adding ? <span className="spinner" /> : 'Ajouter'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
