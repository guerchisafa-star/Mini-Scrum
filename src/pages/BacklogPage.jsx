import { useEffect, useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { stories as storiesApi, sprints as sprintsApi } from '../api/client';
import { useToast } from '../components/Toast';

const PRIORITY_LABELS = { HIGH: 'Haute', MEDIUM: 'Moyenne', LOW: 'Basse' };
const STATUS_LABELS = { NOT_PLANNED: 'Non planifié', PLANNED: 'Planifié', IN_PROGRESS: 'En cours', DONE: 'Terminé' };
const PRIORITY_COLOR = { HIGH: '#de350b', MEDIUM: '#ff991f', LOW: '#0052cc' };
const PRIORITY_BADGE = { HIGH: 'badge-red', MEDIUM: 'badge-orange', LOW: 'badge-blue' };
const STATUS_BADGE = { NOT_PLANNED: 'badge-gray', PLANNED: 'badge-blue', IN_PROGRESS: 'badge-orange', DONE: 'badge-green' };

function StoryModal({ story, onClose, onSave, sprints }) {
  const [form, setForm] = useState({ title: story?.title || '', description: story?.description || '', priority: story?.priority || 'MEDIUM' });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); try { await onSave(form); } finally { setLoading(false); } };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <h3>{story ? 'Modifier la story' : 'Nouvelle User Story'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Titre *</label>
            <input className="form-input" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="En tant qu'utilisateur, je veux..." />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Détails..." />
          </div>
          <div className="form-group">
            <label className="form-label">Priorité</label>
            <select className="form-select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              <option value="HIGH">🔴 Haute</option>
              <option value="MEDIUM">🟠 Moyenne</option>
              <option value="LOW">🟢 Basse</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <span className="spinner" /> : (story ? 'Enregistrer' : 'Créer')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AssignModal({ story, sprints, onClose, onAssign }) {
  const [sprintId, setSprintId] = useState(story.sprintId || '');
  const [loading, setLoading] = useState(false);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <h3>Assigner au Sprint</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>{story.title}</p>
        <div className="form-group">
          <label className="form-label">Sprint cible</label>
          <select className="form-select" value={sprintId} onChange={e => setSprintId(e.target.value)}>
            <option value="">Backlog (aucun sprint)</option>
            {sprints.map(s => <option key={s.id} value={s.id}>{s.name} — {s.status}</option>)}
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" disabled={loading || !sprintId} onClick={async () => { setLoading(true); await onAssign(sprintId); setLoading(false); }}>
            {loading ? <span className="spinner" /> : 'Assigner'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BacklogPage() {
  const { currentProject } = useProject();
  const { canManage } = useAuth();
  const { show } = useToast();
  const [storyList, setStoryList] = useState([]);
  const [sprintList, setSprintList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const load = async () => {
    if (!currentProject) return;
    setLoading(true);
    try {
      const [s, sp] = await Promise.all([storiesApi.getByProject(currentProject.id), sprintsApi.getByProject(currentProject.id)]);
      setStoryList(s); setSprintList(sp);
    } catch (e) { show(e.message, 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [currentProject]);

  const handleSave = async (form) => {
    try {
      if (modal.story) { await storiesApi.update(currentProject.id, modal.story.id, form); show('Story modifiée', 'success'); }
      else { await storiesApi.create(currentProject.id, form); show('Story créée', 'success'); }
      setModal(null); load();
    } catch (e) { show(e.message, 'error'); }
  };

  const handleAssign = async (sprintId) => {
    try { await storiesApi.assignToSprint(currentProject.id, modal.story.id, sprintId); show('Story assignée', 'success'); setModal(null); load(); }
    catch (e) { show(e.message, 'error'); }
  };

  const handleDelete = async (story) => {
    if (!confirm(`Supprimer "${story.title}" ?`)) return;
    try { await storiesApi.delete(currentProject.id, story.id); show('Story supprimée', 'success'); load(); }
    catch (e) { show(e.message, 'error'); }
  };

  const filtered = storyList.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'backlog' && !s.sprintId) || (filter === 'sprint' && !!s.sprintId);
    return matchSearch && matchFilter;
  });

  if (!currentProject) return (
    <div className="empty-state" style={{ height: '60vh' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={40} height={40}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg>
      <h3>Aucun projet sélectionné</h3>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Backlog</div>
          <div className="page-subtitle">{filtered.length} user stor{filtered.length > 1 ? 'ies' : 'y'}</div>
        </div>
        {canManage && (
          <button className="btn btn-primary" onClick={() => setModal({ type: 'create' })}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={14} height={14}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            User Story
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '7px 12px', flex: 1, minWidth: 200 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 13 }} />
        </div>
        {[['all', 'Toutes'], ['backlog', 'Backlog'], ['sprint', 'Dans un sprint']].map(([val, label]) => (
          <button key={val} className={`btn btn-sm ${filter === val ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(val)}>{label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div style={{ width: 36, height: 36, border: '3px solid #dfe1e6', borderTopColor: '#0052cc', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={40} height={40}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg>
          <p>Aucune user story trouvée.</p>
          {canManage && <button className="btn btn-primary" onClick={() => setModal({ type: 'create' })}>+ Ajouter une story</button>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(story => (
            <div key={story.id} style={{ background: '#fff', border: '1px solid #dfe1e6', borderRadius: 3, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 2px rgba(9,30,66,.08)', transition: 'box-shadow .1s, border-color .1s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0052cc'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,82,204,.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#dfe1e6'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(9,30,66,.08)'; }}
            >
              <div style={{ width: 4, height: 40, borderRadius: 2, flexShrink: 0, background: PRIORITY_COLOR[story.priority] }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{story.title}</div>
                {story.description && <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{story.description}</div>}
                {story.sprintName && <div style={{ fontSize: 11, color: '#0052cc', marginTop: 3 }}>📅 {story.sprintName}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span className={`badge ${PRIORITY_BADGE[story.priority]}`}>{PRIORITY_LABELS[story.priority]}</span>
                <span className={`badge ${STATUS_BADGE[story.status]}`}>{STATUS_LABELS[story.status]}</span>
              </div>
              {canManage && (
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button className="icon-btn" title="Assigner à un sprint" onClick={() => setModal({ type: 'assign', story })}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </button>
                  <button className="icon-btn" title="Modifier" onClick={() => setModal({ type: 'edit', story })}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button className="icon-btn danger" title="Supprimer" onClick={() => handleDelete(story)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {(modal?.type === 'create' || modal?.type === 'edit') && (
        <StoryModal story={modal.story} sprints={sprintList} onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {modal?.type === 'assign' && (
        <AssignModal story={modal.story} sprints={sprintList} onClose={() => setModal(null)} onAssign={handleAssign} />
      )}
    </div>
  );
}
