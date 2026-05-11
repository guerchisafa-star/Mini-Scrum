import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth as authApi } from '../api/client';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', role: 'DEVELOPER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return; }
    setLoading(true); setError('');
    try {
      await authApi.register({ fullName: form.fullName, email: form.email, password: form.password, role: form.role });
      navigate('/login');
    } catch (err) { setError(err.message || 'Erreur lors de la création du compte.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#f4f5f7' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ background: '#fff', border: '1px solid #dfe1e6', borderRadius: 3, padding: '36px', boxShadow: '0 4px 8px rgba(9,30,66,.15)' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0052cc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" width={18} height={18}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#172b4d', lineHeight: 1 }}>MiniScrum</div>
              <div style={{ fontSize: 10, color: '#8993a4', fontWeight: 500, marginTop: 2, textTransform: 'uppercase', letterSpacing: .5 }}>Workspace</div>
            </div>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#172b4d', marginBottom: 4 }}>Créer un compte</h2>
          <p style={{ fontSize: 14, color: '#5e6c84', marginBottom: 24 }}>Rejoignez votre équipe Scrum</p>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffebe6', border: '1px solid #ffbdad', color: '#de350b', borderRadius: 3, padding: '10px 12px', fontSize: 13, marginBottom: 16 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            {[
              { label: 'Nom complet', key: 'fullName', type: 'text', placeholder: 'Alice Martin' },
              { label: 'Adresse email', key: 'email', type: 'email', placeholder: 'alice@example.com' },
              { label: 'Mot de passe', key: 'password', type: 'password', placeholder: '••••••••' },
              { label: 'Confirmer le mot de passe', key: 'confirmPassword', type: 'password', placeholder: '••••••••' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#172b4d', marginBottom: 6 }}>{f.label}</label>
                <input type={f.type} required value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                  style={{ width: '100%', background: '#fafbfc', border: '2px solid #dfe1e6', borderRadius: 3, padding: '9px 12px', fontSize: 14, color: '#172b4d', outline: 'none', transition: 'border-color .1s' }}
                  onFocus={e => e.target.style.borderColor = '#0052cc'} onBlur={e => e.target.style.borderColor = '#dfe1e6'} />
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#172b4d', marginBottom: 8 }}>Rôle</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ value: 'DEVELOPER', label: 'Développeur' }, { value: 'PRODUCT_OWNER', label: 'Product Owner' }].map(r => (
                  <label key={r.value} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: form.role === r.value ? '#e9f2ff' : '#fff', border: `2px solid ${form.role === r.value ? '#0052cc' : '#dfe1e6'}`, borderRadius: 3, padding: '9px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: form.role === r.value ? '#0052cc' : '#5e6c84', transition: 'all .1s' }}>
                    <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={{ display: 'none' }} />
                    {r.label}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#0052cc', color: '#fff', border: 'none', borderRadius: 3, padding: '11px 16px', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#0747a6'; }}
              onMouseLeave={e => e.currentTarget.style.background = '#0052cc'}>
              {loading ? <><span className="spinner" /> Création...</> : 'Créer mon compte'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#5e6c84' }}>
            Déjà un compte ? <Link to="/login" style={{ color: '#0052cc', fontWeight: 600 }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
