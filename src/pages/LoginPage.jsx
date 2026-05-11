import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try { await login(email, password); navigate('/dashboard'); }
    catch (err) { setError(err.message || 'Email ou mot de passe incorrect.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#fff' }}>

      {/* Left panel - blue */}
      <div style={{ width: '45%', background: '#0052cc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 400, height: 400, top: -100, right: -100, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, bottom: -80, left: -80, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 340 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{ width: 44, height: 44, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#0052cc" strokeWidth="2.5" width={22} height={22}>
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-.3px' }}>MiniScrum</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 16, lineHeight: 1.2 }}>Gérez vos projets agiles</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.7)', lineHeight: 1.6, marginBottom: 40 }}>Planifiez vos sprints, suivez vos tâches et collaborez avec votre équipe.</p>
          {['Board Kanban drag & drop', 'Gestion du backlog', 'Suivi des sprints', 'Tableau de bord en temps réel'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, textAlign: 'left' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" width={11} height={11}><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,.85)' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - white */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#172b4d', marginBottom: 6 }}>Connexion</h2>
          <p style={{ fontSize: 14, color: '#5e6c84', marginBottom: 28 }}>Accédez à votre espace de travail</p>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffebe6', border: '1px solid #ffbdad', color: '#de350b', borderRadius: 3, padding: '10px 12px', fontSize: 13, marginBottom: 16 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#172b4d', marginBottom: 6 }}>Adresse email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="alice@example.com"
                style={{ width: '100%', background: '#fafbfc', border: '2px solid #dfe1e6', borderRadius: 3, padding: '10px 12px', fontSize: 14, color: '#172b4d', outline: 'none', transition: 'border-color .1s' }}
                onFocus={e => e.target.style.borderColor = '#0052cc'}
                onBlur={e => e.target.style.borderColor = '#dfe1e6'} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#172b4d', marginBottom: 6 }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  style={{ width: '100%', background: '#fafbfc', border: '2px solid #dfe1e6', borderRadius: 3, padding: '10px 40px 10px 12px', fontSize: 14, color: '#172b4d', outline: 'none', transition: 'border-color .1s' }}
                  onFocus={e => e.target.style.borderColor = '#0052cc'}
                  onBlur={e => e.target.style.borderColor = '#dfe1e6'} />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8993a4', padding: 4 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={16} height={16}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#0052cc', color: '#fff', border: 'none', borderRadius: 3, padding: '11px 16px', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#0747a6'; }}
              onMouseLeave={e => e.currentTarget.style.background = '#0052cc'}>
              {loading ? <><span className="spinner" /> Connexion...</> : 'Se connecter'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#5e6c84' }}>
            Pas encore de compte ? <Link to="/register" style={{ color: '#0052cc', fontWeight: 600 }}>Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
