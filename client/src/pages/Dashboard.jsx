import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

const S = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: '#F8FAFC',
    fontFamily: "'DM Sans', sans-serif",
  },

  main: {
    marginLeft: 240,
    flex: 1,
    padding: '32px 36px',
    overflowX: 'hidden',
  },

  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },

  greeting: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 24,
    fontWeight: 700,
    color: '#1E293B',
    letterSpacing: '-0.5px',
  },

  greetingSub: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: 300,
  },

  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 22px',
    background: 'linear-gradient(135deg, #0EA5E9, #0D9488)',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.15s',
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: '0 4px 14px rgba(14,165,233,0.35)',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 18,
    marginBottom: 28,
  },

  statCard: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 14,
    padding: '20px 22px',
    cursor: 'default',
    transition: 'transform 0.2s, box-shadow 0.2s',
    animation: 'fadeUp 0.4s ease forwards',
    opacity: 0,
  },

  statTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },

  statIconWrap: {
    width: 40, height: 40,
    borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18,
  },

  statChange: {
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 20,
  },

  statValue: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 28,
    fontWeight: 700,
    color: '#1E293B',
    letterSpacing: '-1px',
    lineHeight: 1,
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: 400,
  },

  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 18,
    marginBottom: 18,
  },

  card: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 14,
    overflow: 'hidden',
    animation: 'fadeUp 0.5s ease forwards',
    opacity: 0,
  },

  cardHeader: {
    padding: '18px 22px 14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #F1F5F9',
  },

  cardTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    color: '#1E293B',
  },

  cardBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 20,
    background: '#FEF3C7',
    color: '#D97706',
  },

  cardBody: {
    padding: '16px 22px',
  },

  alertItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 0',
    borderBottom: '1px solid #F8FAFC',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },

  alertDot: {
    width: 8, height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },

  alertName: {
    fontSize: 13,
    fontWeight: 500,
    color: '#1E293B',
    flex: 1,
  },

  alertSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },

  alertBadge: {
    fontSize: 10,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 20,
  },

  patientRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 0',
    borderBottom: '1px solid #F8FAFC',
    cursor: 'pointer',
  },

  patientAvatar: {
    width: 34, height: 34,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #E0F2FE, #CCFBF1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14,
    flexShrink: 0,
  },

  viewAllBtn: {
    padding: '7px 14px',
    border: '1px solid #E2E8F0',
    borderRadius: 7,
    background: 'none',
    fontSize: 12,
    color: '#64748B',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
  },

  // mini bar chart
  chartWrap: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 6,
    height: 80,
    padding: '8px 0',
  },

  bar: {
    flex: 1,
    borderRadius: '4px 4px 0 0',
    background: 'linear-gradient(180deg, #0EA5E9, #0D9488)',
    opacity: 0.85,
    transition: 'opacity 0.2s',
    cursor: 'pointer',
    minWidth: 0,
  },

  chartLabel: {
    display: 'flex',
    gap: 6,
    marginTop: 6,
  },

  chartDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    color: '#CBD5E1',
    minWidth: 0,
  },

  emptyState: {
    textAlign: 'center',
    padding: '32px 20px',
    color: '#94A3B8',
    fontSize: 13,
  },

  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
    marginBottom: 18,
  },

  quickBtn: {
    padding: '16px',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 12,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  },

  quickIcon: {
    fontSize: 22,
    marginBottom: 8,
  },

  quickLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#1E293B',
    display: 'block',
  },

  quickSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    display: 'block',
  },

  disclaimer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 18px',
    background: '#FFFBEB',
    border: '1px solid #FDE68A',
    borderRadius: 10,
    fontSize: 12,
    color: '#92400E',
    marginBottom: 18,
  },
};

// Sample data (replace with real API calls)
const sampleStats = [
  { label: "Today's Uploads",  value: 12, icon: '📤', bg: '#EFF6FF', change: '+3', up: true  },
  { label: 'Abnormal ECGs',    value: 4,  icon: '⚠️', bg: '#FFF7ED', change: '-1', up: false },
  { label: 'Total Patients',   value: 87, icon: '👥', bg: '#F0FDF4', change: '+5', up: true  },
  { label: 'Reports Generated',value: 64, icon: '📄', bg: '#FAF5FF', change: '+8', up: true  },
];

const sampleAlerts = [
  { name: 'Ravi Sharma',   finding: 'ST Elevation detected',    risk: 'high',     time: '10 min ago' },
  { name: 'Priya Mehta',   finding: 'Prolonged QTc interval',   risk: 'moderate', time: '35 min ago' },
  { name: 'Arjun Nair',    finding: 'Ventricular Tachycardia',  risk: 'high',     time: '1h ago'     },
  { name: 'Sunita Patil',  finding: 'Bundle Branch Block',      risk: 'moderate', time: '2h ago'     },
];

const samplePatients = [
  { name: 'Ravi Sharma',  age: 54, gender: 'M', lastECG: 'Today',      risk: 'high'     },
  { name: 'Priya Mehta',  age: 41, gender: 'F', lastECG: 'Today',      risk: 'moderate' },
  { name: 'Arjun Nair',   age: 67, gender: 'M', lastECG: '2 days ago', risk: 'high'     },
  { name: 'Sunita Patil', age: 38, gender: 'F', lastECG: '3 days ago', risk: 'low'      },
  { name: 'Vikram Joshi', age: 60, gender: 'M', lastECG: '1 week ago', risk: 'moderate' },
];

const chartData = [
  { day: 'Mon', val: 65 }, { day: 'Tue', val: 45 }, { day: 'Wed', val: 80 },
  { day: 'Thu', val: 55 }, { day: 'Fri', val: 90 }, { day: 'Sat', val: 30 }, { day: 'Sun', val: 70 },
];

const riskColor = {
  high:     { bg: '#FEF2F2', color: '#DC2626' },
  moderate: { bg: '#FFF7ED', color: '#D97706' },
  low:      { bg: '#F0FDF4', color: '#16A34A' },
};

const riskDot = { high: '#EF4444', moderate: '#F59E0B', low: '#10B981' };

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const hour = time.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const maxBar = Math.max(...chartData.map(d => d.val));

  return (
    <div style={S.layout}>
      <Sidebar />

      <main style={S.main}>

        {/* Top bar */}
        <div style={S.topBar}>
          <div>
            <h1 style={S.greeting}>{greeting}, Dr. {user?.name?.split(' ')[0] || 'User'} 👋</h1>
            <p style={S.greetingSub}>
              {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              &nbsp;·&nbsp;{time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button
            style={S.uploadBtn}
            onClick={() => navigate('/upload')}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            📤 Upload ECG
          </button>
        </div>

        {/* Disclaimer */}
        <div style={S.disclaimer}>
          ⚠️ <span><strong>Clinical Decision Support Only</strong> — All AI-generated findings must be reviewed and confirmed by a qualified physician before any clinical action is taken.</span>
        </div>

        {/* Stat cards */}
        <div style={S.statsGrid}>
          {sampleStats.map((s, i) => (
            <div
              key={s.label}
              style={{ ...S.statCard, animationDelay: `${i * 0.08}s` }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={S.statTop}>
                <div style={{ ...S.statIconWrap, background: s.bg }}>{s.icon}</div>
                <span style={{ ...S.statChange, background: s.up ? '#F0FDF4' : '#FEF2F2', color: s.up ? '#16A34A' : '#DC2626' }}>
                  {s.change} today
                </span>
              </div>
              <div style={S.statValue}>{s.value}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={S.quickActions}>
          {[
            { icon: '🔍', label: 'Analyze ECG',    sub: 'Upload & run AI analysis', path: '/upload'   },
            { icon: '👤', label: 'Add Patient',     sub: 'Register new patient',     path: '/patients' },
            { icon: '📋', label: 'View Reports',    sub: 'All finalized reports',    path: '/reports'  },
          ].map(q => (
            <button
              key={q.label}
              style={S.quickBtn}
              onClick={() => navigate(q.path)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0EA5E9'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(14,165,233,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={S.quickIcon}>{q.icon}</div>
              <span style={S.quickLabel}>{q.label}</span>
              <span style={S.quickSub}>{q.sub}</span>
            </button>
          ))}
        </div>

        {/* Two column */}
        <div style={S.twoCol}>

          {/* Abnormal alerts */}
          <div style={{ ...S.card, animationDelay: '0.2s' }}>
            <div style={S.cardHeader}>
              <span style={S.cardTitle}>⚠️ Abnormal ECG Alerts</span>
              <span style={S.cardBadge}>{sampleAlerts.length} unreviewed</span>
            </div>
            <div style={S.cardBody}>
              {sampleAlerts.map((a, i) => (
                <div
                  key={i}
                  style={S.alertItem}
                  onClick={() => navigate('/analysis/demo')}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ ...S.alertDot, background: riskDot[a.risk] }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={S.alertName}>{a.name}</div>
                    <div style={S.alertSub}>{a.finding} · {a.time}</div>
                  </div>
                  <span style={{ ...S.alertBadge, ...riskColor[a.risk] }}>
                    {a.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ECG trend */}
          <div style={{ ...S.card, animationDelay: '0.28s' }}>
            <div style={S.cardHeader}>
              <span style={S.cardTitle}>📈 ECG Uploads — This Week</span>
              <button style={S.viewAllBtn}>Details</button>
            </div>
            <div style={S.cardBody}>
              <div style={S.chartWrap}>
                {chartData.map((d) => (
                  <div
                    key={d.day}
                    style={{ ...S.bar, height: `${(d.val / maxBar) * 100}%` }}
                    onMouseEnter={e => e.target.style.opacity = '1'}
                    onMouseLeave={e => e.target.style.opacity = '0.85'}
                    title={`${d.day}: ${d.val} uploads`}
                  />
                ))}
              </div>
              <div style={S.chartLabel}>
                {chartData.map(d => (
                  <div key={d.day} style={S.chartDay}>{d.day}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent patients */}
        <div style={{ ...S.card, animationDelay: '0.35s' }}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>👥 Recent Patients</span>
            <button style={S.viewAllBtn} onClick={() => navigate('/patients')}>View all →</button>
          </div>
          <div style={S.cardBody}>
            {samplePatients.map((p, i) => (
              <div
                key={i}
                style={S.patientRow}
                onClick={() => navigate('/patients')}
                onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={S.patientAvatar}>👤</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                    {p.age}y · {p.gender === 'M' ? 'Male' : 'Female'} · Last ECG: {p.lastECG}
                  </div>
                </div>
                <span style={{ ...S.alertBadge, ...riskColor[p.risk] }}>{p.risk}</span>
                <button
                  style={{ marginLeft: 8, padding: '5px 12px', border: '1px solid #E2E8F0', borderRadius: 6, background: 'none', fontSize: 11, color: '#0EA5E9', cursor: 'pointer', fontWeight: 600 }}
                  onClick={e => { e.stopPropagation(); navigate('/upload'); }}
                >
                  + ECG
                </button>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}