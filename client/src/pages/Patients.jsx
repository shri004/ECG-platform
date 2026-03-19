import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

const S = {
  layout: { display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'DM Sans', sans-serif" },
  main: { marginLeft: 240, flex: 1, padding: '32px 36px' },

  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  title: { fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: '#1E293B', letterSpacing: '-0.5px' },
  titleSub: { fontSize: 13, color: '#94A3B8', marginTop: 3 },

  addBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '11px 20px',
    background: 'linear-gradient(135deg, #0EA5E9, #0D9488)',
    border: 'none', borderRadius: 10, color: '#fff',
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: '0 4px 14px rgba(14,165,233,0.3)',
    transition: 'opacity 0.2s, transform 0.15s',
  },

  searchBar: {
    display: 'flex', gap: 10, marginBottom: 20,
    background: '#fff', border: '1px solid #E2E8F0',
    borderRadius: 10, padding: '10px 16px',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1, border: 'none', outline: 'none',
    fontSize: 14, color: '#1E293B', background: 'transparent',
    fontFamily: "'DM Sans', sans-serif",
  },

  tableWrap: {
    background: '#fff', border: '1px solid #E2E8F0',
    borderRadius: 14, overflow: 'hidden',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '13px 18px', textAlign: 'left',
    fontSize: 11, fontWeight: 600, color: '#94A3B8',
    letterSpacing: '0.8px', textTransform: 'uppercase',
    background: '#F8FAFC', borderBottom: '1px solid #E2E8F0',
  },
  td: {
    padding: '14px 18px', fontSize: 13, color: '#1E293B',
    borderBottom: '1px solid #F1F5F9',
  },
  tr: { transition: 'background 0.15s', cursor: 'pointer' },

  avatar: {
    width: 34, height: 34, borderRadius: '50%',
    background: 'linear-gradient(135deg, #E0F2FE, #CCFBF1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, marginRight: 10, flexShrink: 0,
  },

  riskBadge: { fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 },

  actionBtn: {
    padding: '5px 12px', border: '1px solid #E2E8F0',
    borderRadius: 6, background: 'none', fontSize: 11,
    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600, marginRight: 6, transition: 'all 0.15s',
  },

  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#94A3B8' },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 15, fontWeight: 500, marginBottom: 6 },
  emptySubText: { fontSize: 13 },

  // Modal
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(15,23,42,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 200, backdropFilter: 'blur(4px)',
  },
  modal: {
    background: '#fff', borderRadius: 16,
    padding: '32px', width: '100%', maxWidth: 480,
    animation: 'fadeUp 0.3s ease forwards',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  },
  modalTitle: { fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: '#1E293B', marginBottom: 6 },
  modalSub: { fontSize: 13, color: '#94A3B8', marginBottom: 24 },

  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 },
  formFull: { marginBottom: 14 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, letterSpacing: '0.3px' },
  input: {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #E2E8F0', borderRadius: 8,
    fontSize: 13, color: '#1E293B', outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.2s',
    background: '#F8FAFC',
  },
  select: {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #E2E8F0', borderRadius: 8,
    fontSize: 13, color: '#1E293B', outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    background: '#F8FAFC', cursor: 'pointer',
  },

  modalBtns: { display: 'flex', gap: 10, marginTop: 24 },
  cancelBtn: {
    flex: 1, padding: '12px', border: '1px solid #E2E8F0',
    borderRadius: 8, background: 'none', fontSize: 14,
    color: '#64748B', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
  },
  saveBtn: {
    flex: 2, padding: '12px',
    background: 'linear-gradient(135deg, #0EA5E9, #0D9488)',
    border: 'none', borderRadius: 8, color: '#fff',
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },

  toast: {
    position: 'fixed', bottom: 24, right: 24,
    background: '#1E293B', color: '#fff',
    padding: '12px 20px', borderRadius: 10,
    fontSize: 13, fontWeight: 500,
    zIndex: 999, animation: 'fadeUp 0.3s ease',
    display: 'flex', alignItems: 'center', gap: 8,
  },
};

const riskColors = {
  low:      { background: '#F0FDF4', color: '#16A34A' },
  moderate: { background: '#FFF7ED', color: '#D97706' },
  high:     { background: '#FEF2F2', color: '#DC2626' },
};

const emptyForm = { name: '', age: '', gender: 'Male', contact: '', symptoms: '' };

export default function Patients() {
  const navigate = useNavigate();
  const [patients, setPatients]   = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState('');

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await API.get('/patients');
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast('❌ Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.age) return showToast('⚠️ Name and age are required');
    setSaving(true);
    try {
      const { data } = await API.post('/patients', form);
      setPatients(prev => [data, ...prev]);
      setShowModal(false);
      setForm(emptyForm);
      showToast('✅ Patient added successfully');
    } catch (err) {
      showToast('❌ Failed to add patient');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this patient?')) return;
    try {
      await API.delete(`/patients/${id}`);
      setPatients(prev => prev.filter(p => p._id !== id));
      showToast('🗑️ Patient deleted');
    } catch {
      showToast('❌ Failed to delete');
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.patientId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={S.layout}>
      <Sidebar />
      <main style={S.main}>

        {/* Top bar */}
        <div style={S.topBar}>
          <div>
            <h1 style={S.title}>Patient Management</h1>
            <p style={S.titleSub}>{patients.length} total patients registered</p>
          </div>
          <button
            style={S.addBtn}
            onClick={() => setShowModal(true)}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            + Add Patient
          </button>
        </div>

        {/* Search */}
        <div style={S.searchBar}>
          <span style={{ color: '#94A3B8' }}>🔍</span>
          <input
            style={S.searchInput}
            placeholder="Search by name or patient ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 16 }}>✕</button>
          )}
        </div>

        {/* Table */}
        <div style={S.tableWrap}>
          {loading ? (
            <div style={S.emptyState}>
              <div style={S.emptyIcon}>⏳</div>
              <div style={S.emptyText}>Loading patients...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={S.emptyState}>
              <div style={S.emptyIcon}>👥</div>
              <div style={S.emptyText}>{search ? 'No patients found' : 'No patients yet'}</div>
              <div style={S.emptySubText}>{!search && 'Click "Add Patient" to register your first patient'}</div>
            </div>
          ) : (
            <table style={S.table}>
              <thead>
                <tr>
                  {['Patient','ID','Age / Gender','Contact','Risk Level','Last ECG','Actions'].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr
                    key={p._id}
                    style={S.tr}
                    onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={S.td}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={S.avatar}>👤</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                          {p.symptoms && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{p.symptoms.slice(0, 30)}{p.symptoms.length > 30 ? '...' : ''}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={S.td}>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, background: '#F1F5F9', padding: '3px 8px', borderRadius: 5 }}>
                        {p.patientId}
                      </span>
                    </td>
                    <td style={S.td}>{p.age}y · {p.gender}</td>
                    <td style={S.td}>{p.contact || '—'}</td>
                    <td style={S.td}>
                      <span style={{ ...S.riskBadge, ...riskColors[p.riskLevel || 'low'] }}>
                        {p.riskLevel || 'low'}
                      </span>
                    </td>
                    <td style={{ ...S.td, color: '#94A3B8' }}>
                      {p.ecgHistory?.length > 0 ? `${p.ecgHistory.length} ECG(s)` : 'No ECGs yet'}
                    </td>
                    <td style={S.td}>
                      <button
                        style={{ ...S.actionBtn, color: '#0EA5E9', borderColor: '#BAE6FD' }}
                        onClick={() => navigate('/upload')}
                        onMouseEnter={e => { e.currentTarget.style.background = '#E0F2FE'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                      >
                        + ECG
                      </button>
                      <button
                        style={{ ...S.actionBtn, color: '#DC2626', borderColor: '#FCA5A5' }}
                        onClick={(e) => handleDelete(p._id, e)}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>

      {/* Add Patient Modal */}
      {showModal && (
        <div style={S.overlay} onClick={() => setShowModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <h2 style={S.modalTitle}>Add New Patient</h2>
            <p style={S.modalSub}>Enter patient details to register them in the system</p>

            <div style={S.formGrid}>
              <div>
                <label style={S.label}>FULL NAME *</label>
                <input
                  style={S.input}
                  placeholder="Patient name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  onFocus={e => e.target.style.borderColor = '#0EA5E9'}
                  onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>
              <div>
                <label style={S.label}>AGE *</label>
                <input
                  style={S.input}
                  type="number" placeholder="Age"
                  value={form.age}
                  onChange={e => setForm({ ...form, age: e.target.value })}
                  onFocus={e => e.target.style.borderColor = '#0EA5E9'}
                  onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>
              <div>
                <label style={S.label}>GENDER</label>
                <select style={S.select} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label style={S.label}>CONTACT</label>
                <input
                  style={S.input}
                  placeholder="Phone number"
                  value={form.contact}
                  onChange={e => setForm({ ...form, contact: e.target.value })}
                  onFocus={e => e.target.style.borderColor = '#0EA5E9'}
                  onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>
            </div>

            <div style={S.formFull}>
              <label style={S.label}>PRESENTING SYMPTOMS</label>
              <input
                style={{ ...S.input, width: '100%' }}
                placeholder="e.g. chest pain, shortness of breath, palpitations"
                value={form.symptoms}
                onChange={e => setForm({ ...form, symptoms: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#0EA5E9'}
                onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
              />
            </div>

            <div style={S.modalBtns}>
              <button style={S.cancelBtn} onClick={() => { setShowModal(false); setForm(emptyForm); }}>
                Cancel
              </button>
              <button style={S.saveBtn} onClick={handleAdd} disabled={saving}>
                {saving ? 'Saving...' : '✓ Register Patient'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
  
}
