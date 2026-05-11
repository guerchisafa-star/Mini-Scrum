import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { dashboard as dashboardApi } from '../api/client';

const STAT_CARDS = [
  { key: 'totalProjects',   label: 'Projets',        color: '#0052cc', bg: '#e9f2ff',  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={20} height={20}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
  { key: 'activeSprints',   label: 'Sprints actifs', color: '#0065ff', bg: '#deebff',  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={20} height={20}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  { key: 'totalTasks',      label: 'Total tâches',   color: '#253858', bg: '#ebecf0',  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={20} height={20}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { key: 'totalTodo',       label: 'À faire',        color: '#5e6c84', bg: '#f4f5f7',  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={20} height={20}><circle cx="12" cy="12" r="10"/></svg> },
  { key: 'totalInProgress', label: 'En cours',       color: '#ff991f', bg: '#fffae6',  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={20} height={20}><path d="M12 2v10l4 4"/><circle cx="12" cy="12" r="10"/></svg> },
  { key: 'totalDone',       label: 'Terminées',      color: '#36b37e', bg: '#e3fcef',  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={20} height={20}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
];

const DEV_CARDS = [
  { key: 'todo',       label: 'À faire',  color: '#5e6c84', bg: '#f4f5f7',  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={20} height={20}><circle cx="12" cy="12" r="10"/></svg> },
  { key: 'inProgress', label: 'En cours', color: '#ff991f', bg: '#fffae6',  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={20} height={20}><path d="M12 2v10l4 4"/><circle cx="12" cy="12" r="10"/></svg> },
  { key: 'done',       label: 'Terminées',color: '#36b37e', bg: '#e3fcef',  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={20} height={20}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
];

function StatCard({ label, value, color, bg, icon }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #dfe1e6', borderRadius: 3, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 2px rgba(9,30,66,.1)', transition: 'box-shadow .15s, transform .15s', cursor: 'default' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 8px rgba(9,30,66,.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(9,30,66,.1)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 3, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.8rem', fontWeight: 700, color, lineHeight: 1, letterSpacing: '-1px' }}>{value}</div>
        <div style={{ fontSize: 12, color: '#5e6c84', marginTop: 3, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

const STATUS_BADGE = {
  TODO: { label: 'À faire', color: '#5e6c84', bg: '#f4f5f7' },
  IN_PROGRESS: { label: 'En cours', color: '#ff991f', bg: '#fffae6' },
  DONE: { label: 'Terminé', color: '#36b37e', bg: '#e3fcef' },
};

function TaskRow({ task }) {
  const s = STATUS_BADGE[task.status] || { label: task.status, color: '#888', bg: '#f0f0f0' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 3, background: '#fff', border: '1px solid #dfe1e6', marginBottom: 6, transition: 'border-color .1s, box-shadow .1s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#0052cc'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,82,204,.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#dfe1e6'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#172b4d' }}>{task.title}</div>
        {task.userStoryTitle && <div style={{ fontSize: 11, color: '#5e6c84', marginTop: 2 }}>📋 {task.userStoryTitle}</div>}
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 3, background: s.bg, color: s.color, whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '.3px' }}>{s.label}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { user, canManage } = useAuth();
  const { currentProject } = useProject();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    dashboardApi.get(user.userId, user.role).then(setData).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  const initials = (user?.fullName ?? '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const roleLabel = user?.role === 'ADMIN' ? 'Admin' : user?.role === 'PRODUCT_OWNER' ? 'Product Owner' : user?.role === 'SCRUM_MASTER' ? 'Scrum Master' : 'Développeur';

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #dfe1e6', borderTopColor: '#0052cc', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
    </div>
  );

  const totalForProgress = canManage ? (data?.totalTasks ?? 0) : ((data?.todo ?? 0) + (data?.inProgress ?? 0) + (data?.done ?? 0));
  const doneForProgress  = canManage ? (data?.totalDone ?? 0) : (data?.done ?? 0);
  const progressPct = totalForProgress > 0 ? Math.round((doneForProgress / totalForProgress) * 100) : 0;

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #dfe1e6' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#172b4d', letterSpacing: '-.3px' }}>
            Bonjour, <span style={{ color: '#0052cc' }}>{user?.fullName?.split(' ')[0]}</span> 👋
          </h1>
          <p style={{ color: '#5e6c84', marginTop: 4, fontSize: 13 }}>
            {currentProject ? `Projet actif : ${currentProject.name}` : 'Aucun projet sélectionné'}
            <span style={{ margin: '0 8px', color: '#dfe1e6' }}>·</span>
            <span style={{ color: '#0052cc', fontWeight: 600 }}>{roleLabel}</span>
          </p>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0052cc', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700 }}>{initials}</div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${canManage ? 6 : 3}, 1fr)`, gap: 12, marginBottom: 24 }}>
        {(canManage ? STAT_CARDS : DEV_CARDS).map(c => (
          <StatCard key={c.key} label={c.label} value={data?.[c.key] ?? 0} color={c.color} bg={c.bg} icon={c.icon} />
        ))}
      </div>

      {/* Progress bar */}
      {totalForProgress > 0 && (
        <div style={{ background: '#fff', border: '1px solid #dfe1e6', borderRadius: 3, padding: '18px 22px', marginBottom: 20, boxShadow: '0 1px 2px rgba(9,30,66,.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#172b4d' }}>Progression {canManage ? 'globale' : 'personnelle'}</div>
              <div style={{ fontSize: 12, color: '#5e6c84', marginTop: 2 }}>{doneForProgress} tâche{doneForProgress > 1 ? 's' : ''} terminée{doneForProgress > 1 ? 's' : ''} sur {totalForProgress}</div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: progressPct === 100 ? '#36b37e' : '#0052cc', letterSpacing: '-1px' }}>{progressPct}%</div>
          </div>
          <div style={{ height: 8, background: '#ebecf0', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 4, background: progressPct === 100 ? '#36b37e' : '#0052cc', width: `${progressPct}%`, transition: 'width .6s ease' }} />
          </div>
        </div>
      )}

      {/* My tasks (developer) */}
      {!canManage && (
        <div style={{ background: '#fff', border: '1px solid #dfe1e6', borderRadius: 3, padding: '18px 22px', boxShadow: '0 1px 2px rgba(9,30,66,.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#172b4d' }}>Mes tâches</div>
            <span style={{ fontSize: 12, color: '#5e6c84', background: '#ebecf0', borderRadius: 3, padding: '2px 8px', fontWeight: 600 }}>{data?.myTasks?.length ?? 0}</span>
          </div>
          {data?.myTasks?.length > 0
            ? data.myTasks.map(t => <TaskRow key={t.id} task={t} />)
            : <div style={{ textAlign: 'center', padding: '28px 0', color: '#5e6c84', fontSize: 13 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
                Aucune tâche assignée pour le moment
              </div>
          }
        </div>
      )}
    </div>
  );
}
