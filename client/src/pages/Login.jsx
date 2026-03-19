import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

// ── tiny inline styles as JS objects (no extra CSS file needed) ──
const S = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    fontFamily: "'DM Sans', sans-serif",
  },

  // ── LEFT PANEL ──
  left: {
    background: 'linear-gradient(145deg, #0c1a3a 0%, #0EA5E9 60%, #0D9488 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px 48px',
    position: 'relative',
    overflow: 'hidden',
  },

  // ECG line SVG overlay
  ecgOverlay: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    opacity: 0.15,
  },

  leftBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 48,
    alignSelf: 'flex-start',
  },

  brandDot: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'rgba(255,255,255,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
  },

  brandText: {
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: "'Sora', sans-serif",
    letterSpacing: '0.3px',
  },

  heroTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 'clamp(28px, 3vw, 40px)',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.2,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },

  heroSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.7,
    marginBottom: 48,
    alignSelf: 'flex-start',
    maxWidth: 360,
    fontWeight: 300,
  },

  pillsWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    alignSelf: 'flex-start',
    zIndex: 1,
  },

  pill: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: 10,
    padding: '12px 18px',
    backdropFilter: 'blur(8px)',
  },

  pillIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
  },

  pillText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: 500,
  },

  pillSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 1,
  },

  // ── RIGHT PANEL ──
  right: {
    background: '#F8FAFC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 48px',
  },

  formWrap: {
    width: '100%',
    maxWidth: 400,
    animation: 'fadeUp 0.5s ease forwards',
  },

  eyebrow: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#0EA5E9',
    marginBottom: 12,
  },

  formTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 28,
    fontWeight: 700,
    color: '#1E293B',
    marginBottom: 8,
    letterSpacing: '-0.5px',
  },

  formSub: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 36,
    fontWeight: 300,
  },

  fieldGroup: {
    marginBottom: 20,
  },

  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: '#374151',
    marginBottom: 8,
  },

  inputWrap: {
    position: 'relative',
  },

  inputIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94A3B8',
    fontSize: 16,
    pointerEvents: 'none',
  },

  input: {
    width: '100%',
    padding: '13px 14px 13px 42px',
    border: '1.5px solid #E2E8F0',
    borderRadius: 10,
    fontSize: 14,
    color: '#1E293B',
    background: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },

  forgotLink: {
    display: 'block',
    textAlign: 'right',
    fontSize: 12,
    color: '#0EA5E9',
    marginTop: 8,
    textDecoration: 'none',
  },

  btn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #0EA5E9, #0D9488)',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    marginTop: 28,
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.15s',
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '0.2px',
  },

  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    color: '#DC2626',
    marginBottom: 20,
  },

  demoBox: {
    marginTop: 32,
    padding: '16px',
    background: '#F0F9FF',
    border: '1px solid #BAE6FD',
    borderRadius: 10,
  },

  demoTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: '#0284C7',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  demoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    color: '#0369A1',
    padding: '5px 0',
    borderBottom: '1px dashed #BAE6FD',
  },

  roleTag: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.5px',
  },

  footer: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 11,
    color: '#94A3B8',
  },
};

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [showPass, setShowPass] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/auth/login', { email, password });
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (e, em, pw) => {
    e.preventDefault();
    setEmail(em);
    setPassword(pw);
  };

  return (
    <div style={S.page}>

      {/* ── LEFT PANEL ── */}
      <div style={S.left}>

        {/* Brand */}
        <div style={S.leftBrand}>
          <div style={S.brandDot}>🫀</div>
          <span style={S.brandText}>CardioAI Platform</span>
        </div>

        {/* Hero text */}
        <h1 style={S.heroTitle}>
          ECG Analysis,<br />
          Reimagined for<br />
          Modern Clinics.
        </h1>
        <p style={S.heroSub}>
          AI-assisted interpretation, structured reports, and patient
          management — built to support clinicians where specialists aren't available.
        </p>

        {/* Feature pills */}
        <div style={S.pillsWrap}>
          {[
            { icon: '🧠', title: 'AI-Powered Interpretation', sub: 'Three-tier analysis engine' },
            { icon: '📄', title: 'Instant PDF Reports',       sub: 'Structured clinical format' },
            { icon: '🔐', title: 'Role-Based Access',         sub: 'Doctor · Technician · Admin' },
          ].map((p) => (
            <div key={p.title} style={S.pill}>
              <div style={S.pillIcon}>{p.icon}</div>
              <div>
                <div style={S.pillText}>{p.title}</div>
                <div style={S.pillSub}>{p.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ECG line decoration */}
        <svg style={S.ecgOverlay} viewBox="0 0 900 80" preserveAspectRatio="none" fill="none">
          <polyline
            points="0,50 80,50 100,50 115,15 125,65 135,8 145,55 160,50 300,50 320,50 335,18 345,60 355,10 365,52 380,50 550,50 570,50 585,20 595,58 605,12 615,50 630,50 800,50 820,50 835,22 845,56 855,14 865,50 900,50"
            stroke="white" strokeWidth="2"
          />
        </svg>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={S.right}>
        <div style={S.formWrap}>

          <div style={S.eyebrow}>Secure Access</div>
          <h2 style={S.formTitle}>Welcome back</h2>
          <p style={S.formSub}>Sign in to your clinical dashboard</p>

          {error && <div style={S.errorBox}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={S.fieldGroup}>
              <label style={S.label}>Email address</label>
              <div style={S.inputWrap}>
                <span style={S.inputIcon}>✉</span>
                <input
                  style={S.input}
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={e => { e.target.style.borderColor = '#0EA5E9'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.1)'; }}
                  onBlur={e  => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div style={S.fieldGroup}>
              <label style={S.label}>Password</label>
              <div style={S.inputWrap}>
                <span style={S.inputIcon}>🔒</span>
                <input
                  style={{ ...S.input, paddingRight: 44 }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={e => { e.target.style.borderColor = '#0EA5E9'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.1)'; }}
                  onBlur={e  => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 14 }}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
              <a href="#" style={S.forgotLink}>Forgot password?</a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{ ...S.btn, opacity: loading ? 0.75 : 1 }}
              disabled={loading}
              onMouseEnter={e => { e.target.style.opacity = '0.88'; e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.target.style.opacity = '1';    e.target.style.transform = 'translateY(0)'; }}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={S.demoBox}>
            <div style={S.demoTitle}>Demo Credentials</div>
            {[
              { role: 'Doctor',      em: 'doctor@demo.com',     pw: 'demo123', bg: '#DBEAFE', color: '#1D4ED8' },
              { role: 'Technician',  em: 'tech@demo.com',       pw: 'demo123', bg: '#DCFCE7', color: '#15803D' },
              { role: 'Admin',       em: 'admin@demo.com',      pw: 'demo123', bg: '#FEF3C7', color: '#B45309' },
            ].map(d => (
              <div key={d.role} style={S.demoRow}>
                <span style={{ ...S.roleTag, background: d.bg, color: d.color }}>{d.role}</span>
                <span style={{ color: '#475569', fontFamily: 'monospace' }}>{d.em}</span>
                <button
                  onClick={(e) => fillDemo(e, d.em, d.pw)}
                  style={{ background: 'none', border: 'none', color: '#0EA5E9', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
                >
                  Use →
                </button>
              </div>
            ))}
          </div>

          <div style={S.footer}>
            Decision Support Only · Not a Diagnostic Device<br />
            © 2026 CardioAI Platform
          </div>
        </div>
      </div>

    </div>
  );
}