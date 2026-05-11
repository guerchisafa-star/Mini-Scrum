import { useEffect, useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { sprints as sprintsApi, stories as storiesApi } from '../api/client';
import { useToast } from '../components/Toast';

const STATUS_BADGE = { PLANNED: 'badge-blue', ACTIVE: 'badge-green', COMPLETED: 'badge-gray' };
const STATUS_LABELS = { PLANNED: 'Planifié', ACTIVE: 'En cours', COMPLETED: 'Terminé' };

function SprintModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await onSave(form); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <h3>Nouveau Sprint</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom du sprint *</label>
            <input className="form-input" required value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Sprint 1 - Authentification" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Date début</label>
              <input className="form-input" type="date" value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Date fin</label>
              <input className="form-input" type="date" value={form.endDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SprintCard({ sprint, projectId, onStart, onComplete, onDelete, stories }) {
  const sprintStories = stories.filter(s => s.sprintId === sprint.id);
  const doneTasks = sprintStories.filter(s => s.status === 'DONE').length;

  const daysLeft = sprint.endDate ? Math.ceil((new Date(sprint.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div style={{ background: '#fff', border: '1px solid #dfe1e6', borderRadius: 3, padding: '18px 20px', borderLeft: `4px solid ${sprint.status === 'ACTIVE' ? '#36b37e' : sprint.status === 'COMPLETED' ? '#8993a4' : '#0052cc'}`, boxShadow: '0 1px 2px rgba(9,30,66,.08)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '15px' }}>{sprint.name}</h3>
            <span className={`badge ${STATUS_BADGE[sprint.status]}`}>{STATUS_LABELS[sprint.status]}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#5e6c84', marginTop: '4px', display: 'flex', gap: '12px' }}>
            {sprint.startDate && <span>Début: {sprint.startDate}</span>}
            {sprint.endDate && <span>Fin: {sprint.endDate}</span>}
            {sprint.status === 'ACTIVE' && daysLeft !== null && (
              <span style={{ color: daysLeft < 3 ? '#de350b' : '#ff991f', fontWeight: 600 }}>
                {daysLeft > 0 ? `J-${daysLeft}` : 'Terminé'}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {sprint.status === 'PLANNED' && (
            <button className="btn btn-sm btn-primary" onClick={() => onStart(sprint.id)}>▶ Démarrer</button>
          )}
          {sprint.status === 'ACTIVE' && (
            <button className="btn btn-sm btn-ghost" onClick={() => onComplete(sprint.id)}>✓ Terminer</button>
          )}
          {sprint.status !== 'ACTIVE' && (
            <button className="icon-btn danger" onClick={() => onDelete(sprint.id)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Stories count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#5e6c84' }}>
        <span>📋 {sprintStories.length} story{sprintStories.length !== 1 ? 'ies' : ''}</span>
        {sprintStories.length > 0 && <span style={{ color: '#36b37e', fontWeight: 600 }}>✓ {doneTasks} terminée{doneTasks !== 1 ? 's' : ''}</span>}
      </div>

      {sprintStories.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ height: '6px', background: '#ebecf0', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '3px',
              background: '#0052cc',
              width: `${(doneTasks / sprintStories.length) * 100}%`,
              transition: 'width 0.6s',
            }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
            {sprintStories.map(s => (
              <span key={s.id} style={{
                fontSize: '11px', padding: '2px 8px',
                background: '#ebecf0', border: '1px solid #dfe1e6',
                borderRadius: '3px', color: '#5e6c84', fontWeight: 500,
              }}>{s.title}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SprintsPage() {
  const { currentProject } = useProject();
  const { show } = useToast();
  const [sprintList, setSprintList] = useState([]);
  const [storyList, setStoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    if (!currentProject) return;
    setLoading(true);
    try {
      const [sp, st] = await Promise.all([
        sprintsApi.getByProject(currentProject.id),
        storiesApi.getByProject(currentProject.id),
      ]);
      setSprintList(sp);
      setStoryList(st);
    } catch (e) { show(e.message, 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [currentProject]);

  const handleCreate = async (form) => {
    try {
      await sprintsApi.create(currentProject.id, form);
      show('Sprint créé', 'success');
      setShowModal(false);
      load();
    } catch (e) { show(e.message, 'error'); }
  };

  const handleStart = async (sprintId) => {
    try {
      await sprintsApi.start(currentProject.id, sprintId);
      show('Sprint démarré', 'success');
      load();
    } catch (e) { show(e.message, 'error'); }
  };

  const handleComplete = async (sprintId) => {
    if (!confirm('Terminer ce sprint ?')) return;
    try {
      await sprintsApi.complete(currentProject.id, sprintId);
      show('Sprint terminé', 'success');
      load();
    } catch (e) { show(e.message, 'error'); }
  };

  const handleDelete = async (sprintId) => {
    if (!confirm('Supprimer ce sprint ?')) return;
    try {
      await sprintsApi.delete(currentProject.id, sprintId);
      show('Sprint supprimé', 'success');
      load();
    } catch (e) { show(e.message, 'error'); }
  };

  if (!currentProject) return (
    <div className="empty-state" style={{ height: '60vh' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={40} height={40}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      <h3>Aucun projet sélectionné</h3>
    </div>
  );

  const active = sprintList.filter(s => s.status === 'ACTIVE');
  const planned = sprintList.filter(s => s.status === 'PLANNED');
  const completed = sprintList.filter(s => s.status === 'COMPLETED');

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #dfe1e6' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#172b4d' }}>Sprints</h1>
          <p style={{ color: '#5e6c84', fontSize: '13px', marginTop: '2px' }}>{currentProject.name}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={14} height={14}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouveau Sprint
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #dfe1e6', borderTopColor: '#0052cc', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
        </div>
      ) : sprintList.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={40} height={40}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <h3>Aucun sprint</h3>
          <p>Créez votre premier sprint pour organiser votre travail</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Créer un sprint</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {active.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: '#36b37e', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#36b37e', display: 'inline-block' }} /> Sprints actifs
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {active.map(s => <SprintCard key={s.id} sprint={s} projectId={currentProject.id}
                  onStart={handleStart} onComplete={handleComplete} onDelete={handleDelete} stories={storyList} />)}
              </div>
            </div>
          )}
          {planned.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: '#0052cc', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0052cc', display: 'inline-block' }} /> Sprints planifiés
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {planned.map(s => <SprintCard key={s.id} sprint={s} projectId={currentProject.id}
                  onStart={handleStart} onComplete={handleComplete} onDelete={handleDelete} stories={storyList} />)}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: '#8993a4', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8993a4', display: 'inline-block' }} /> Sprints terminés
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {completed.map(s => <SprintCard key={s.id} sprint={s} projectId={currentProject.id}
                  onStart={handleStart} onComplete={handleComplete} onDelete={handleDelete} stories={storyList} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && <SprintModal onClose={() => setShowModal(false)} onSave={handleCreate} />}
    </div>
  );
}
