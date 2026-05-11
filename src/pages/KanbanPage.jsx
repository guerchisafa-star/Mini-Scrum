import { useEffect, useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { tasks as tasksApi, sprints as sprintsApi, stories as storiesApi, members as membersApi } from '../api/client';
import { useToast } from '../components/Toast';
import { Link } from 'react-router-dom';

const COLUMNS = [
  { key: 'TODO',        label: 'To Do',       color: '#5e6c84', bg: '#f4f5f7' },
  { key: 'IN_PROGRESS', label: 'In Progress',  color: '#0052cc', bg: '#deebff' },
  { key: 'DONE',        label: 'Done',         color: '#36b37e', bg: '#e3fcef' },
];

function TaskCard({ task, onEdit, onDelete, isDragging, onDragStart, onDragEnd }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{ background: '#fff', border: '1px solid #dfe1e6', borderRadius: 3, padding: '10px 12px', cursor: 'grab', userSelect: 'none', opacity: isDragging ? .4 : 1, boxShadow: '0 1px 2px rgba(9,30,66,.1)', transition: 'box-shadow .1s' }}
      onMouseEnter={e => { if (!isDragging) e.currentTarget.style.boxShadow = '0 4px 8px rgba(9,30,66,.15)'; }}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 2px rgba(9,30,66,.1)'}
    >
      {task.userStoryTitle && (
        <div style={{ fontSize: 10, color: '#0052cc', fontWeight: 700, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{task.userStoryTitle}</div>
      )}
      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, lineHeight: 1.4 }}>{task.title}</div>
      {task.description && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{task.description}</div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {task.assignedToName ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#0052cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>
              {task.assignedToName.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 11, color: '#5e6c84' }}>{task.assignedToName.split(' ')[0]}</span>
          </div>
        ) : <span style={{ fontSize: 11, color: '#8993a4' }}>Non assigné</span>}
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="icon-btn" style={{ width: 24, height: 24 }} onClick={e => { e.stopPropagation(); onEdit(task); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={12} height={12}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button className="icon-btn danger" style={{ width: 24, height: 24 }} onClick={e => { e.stopPropagation(); onDelete(task); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={12} height={12}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskModal({ task, stories, members, onClose, onSave }) {
  const [form, setForm] = useState({ title: task?.title || '', description: task?.description || '', assignedToId: task?.assignedToId || '' });
  const [storyId, setStoryId] = useState(task?.userStoryId || (stories.length > 0 ? String(stories[0].id) : ''));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task && !storyId) {
      alert('Veuillez sélectionner une User Story ou en créer une dans le Backlog.');
      return;
    }
    setLoading(true);
    try { await onSave(form, storyId); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <h3>{task ? 'Modifier la tâche' : 'Nouvelle tâche'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Titre *</label>
            <input className="form-input" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ex: Créer le formulaire" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Détails..." />
          </div>
          {!task && (
            <div className="form-group">
              <label className="form-label">User Story *</label>
              {stories.length === 0 ? (
                <div style={{ fontSize: 12, color: '#de350b', padding: '8px 12px', background: '#ffebe6', borderRadius: 3 }}>
                  Aucune user story disponible. Créez-en une dans le <strong>Backlog</strong> d'abord.
                </div>
              ) : (
                <select className="form-select" value={storyId} onChange={e => setStoryId(e.target.value)}>
                  <option value="">— Sélectionner une story —</option>
                  {stories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              )}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Assigner à</label>
            <select className="form-select" value={form.assignedToId} onChange={e => setForm(f => ({ ...f, assignedToId: e.target.value }))}>
              <option value="">Non assigné</option>
              {members.map(m => <option key={m.userId} value={m.userId}>{m.fullName}</option>)}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={loading || (!task && stories.length === 0)}>
              {loading ? <span className="spinner" /> : (task ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function KanbanPage() {
  const { currentProject } = useProject();
  const { user, canManage } = useAuth();
  const { show } = useToast();
  const [taskList, setTaskList] = useState([]);
  const [storyList, setStoryList] = useState([]);       // toutes les stories
  const [sprintStories, setSprintStories] = useState([]); // stories du sprint actif seulement
  const [memberList, setMemberList] = useState([]);
  const [activeSprint, setActiveSprint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const load = async () => {
    if (!currentProject) return;
    setLoading(true);
    try {
      const [sprints, allStories, mems] = await Promise.all([
        sprintsApi.getByProject(currentProject.id),
        storiesApi.getByProject(currentProject.id),
        membersApi.getByProject(currentProject.id),
      ]);
      const active = sprints.find(s => s.status === 'ACTIVE') || null;
      setActiveSprint(active);
      setStoryList(allStories);
      setMemberList(mems);
      if (active) {
        // Stories assignées au sprint actif
        const activeStories = allStories.filter(s => s.sprintId === active.id);
        setSprintStories(activeStories);
        const t = await tasksApi.getBySprint(active.id);
        setTaskList(t);
      } else {
        setSprintStories(allStories);
        const all = await Promise.all(allStories.map(s => tasksApi.getByStory(s.id).catch(() => [])));
        setTaskList(all.flat());
      }
    } catch (e) { show(e.message, 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [currentProject]);

  const handleSave = async (form, storyId) => {
    try {
      const payload = { title: form.title, description: form.description, assignedToId: form.assignedToId ? Number(form.assignedToId) : null };
      if (modal.task) {
        await tasksApi.update(modal.task.id, payload);
        show('Tâche modifiée', 'success');
      } else {
        await tasksApi.create(Number(storyId), payload);
        show('Tâche créée', 'success');
      }
      setModal(null); load();
    } catch (e) { show(e.message || 'Erreur lors de la création', 'error'); }
  };

  const handleDelete = async (task) => {
    if (!confirm(`Supprimer "${task.title}" ?`)) return;
    try { await tasksApi.delete(task.id); show('Tâche supprimée', 'success'); load(); }
    catch (e) { show(e.message, 'error'); }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksApi.updateStatus(taskId, newStatus);
      setTaskList(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (e) { show(e.message, 'error'); }
  };

  const handleDragEnd = () => {
    if (dragging && dragOver && dragging.status !== dragOver) handleStatusChange(dragging.id, dragOver);
    setDragging(null); setDragOver(null);
  };

  if (!currentProject) return (
    <div className="empty-state" style={{ height: '60vh' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg>
      <h3>Aucun projet sélectionné</h3>
    </div>
  );

  if (!activeSprint && !loading) return (
    <div className="empty-state" style={{ height: '60vh' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={48} height={48}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <h3>Aucun sprint actif</h3>
      <p>Démarrez un sprint depuis la page Sprints pour voir le board Kanban.</p>
      <Link to="/sprints" className="btn btn-primary">Aller aux Sprints →</Link>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="page-title">Board Kanban</div>
          <div className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={13} height={13}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {activeSprint?.name ?? '...'}
          </div>
        </div>
        {canManage && (
          <button className="btn btn-primary" onClick={() => setModal({ type: 'create' })}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={14} height={14}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nouvelle tâche
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, alignItems: 'start' }}>
          {COLUMNS.map(col => {
            const colTasks = taskList.filter(t => {
              if (t.status !== col.key) return false;
              // DEVELOPER voit seulement ses tâches assignées
              if (!canManage) return Number(t.assignedToId) === Number(user?.userId);
              return true;
            });
            const isOver = dragOver === col.key;
            return (
              <div key={col.key}
                onDragOver={e => { e.preventDefault(); setDragOver(col.key); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={handleDragEnd}
                style={{ background: isOver ? '#e9f2ff' : '#f4f5f7', border: `2px solid ${isOver ? '#0052cc' : 'transparent'}`, borderRadius: 3, minHeight: 400, transition: 'all .1s' }}
              >
                {/* Col header */}
                <div style={{ padding: '12px 12px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: col.color, flexShrink: 0 }} />
                  <span style={{ fontWeight: 700, fontSize: 12, color: '#172b4d', textTransform: 'uppercase', letterSpacing: '.5px' }}>{col.label}</span>
                  <span style={{ background: '#dfe1e6', borderRadius: 3, padding: '1px 7px', fontSize: 11, color: '#5e6c84', fontWeight: 700, marginLeft: 'auto' }}>{colTasks.length}</span>
                </div>
                {/* Tasks */}
                <div style={{ padding: '0 8px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {colTasks.length === 0 ? (
                    <div style={{ height: 72, border: `2px dashed #dfe1e6`, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8993a4', fontSize: 12 }}>
                      {isOver ? 'Déposer ici' : 'Glissez une tâche ici'}
                    </div>
                  ) : colTasks.map(task => (
                    <TaskCard key={task.id} task={task}
                      onEdit={t => setModal({ type: 'edit', task: t })}
                      onDelete={handleDelete}
                      isDragging={dragging?.id === task.id}
                      onDragStart={() => setDragging(task)}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <TaskModal task={modal.task} stories={sprintStories} members={memberList}
          onClose={() => setModal(null)} onSave={handleSave} />
      )}
    </div>
  );
}
