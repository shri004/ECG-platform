import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

const riskStyle = {
  high:     { bg: '#FEF2F2', color: '#DC2626', border: '#FCA5A5' },
  moderate: { bg: '#FFF7ED', color: '#D97706', border: '#FCD34D' },
  low:      { bg: '#F0FDF4', color: '#16A34A', border: '#86EFAC' },
};

const normalRanges = {
  heartRate:   { min: 60,  max: 100, unit: 'bpm',  label: 'Heart Rate' },
  prInterval:  { min: 120, max: 200, unit: 'ms',   label: 'PR Interval' },
  qrsDuration: { min: 70,  max: 120, unit: 'ms',   label: 'QRS Duration' },
  qtInterval:  { min: 350, max: 440, unit: 'ms',   label: 'QT Interval' },
  qtcInterval: { min: 350, max: 450, unit: 'ms',   label: 'QTc Interval' },
  stDeviation: { min: -1,  max: 1,   unit: 'mm',   label: 'ST Deviation' },
};

export default function UploadECG() {
  const navigate  = useNavigate();
  const [step, setStep]         = useState(1); // 1=select patient, 2=upload+measure, 3=results
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState('');
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [form, setForm] = useState({
    heartRate: '', prInterval: '', qrsDuration: '',
    qtInterval: '', qtcInterval: '', stDeviation: '',
  });

  useEffect(() => {
    API.get('/patients').then(r => setPatients(Array.isArray(r.data) ? r.data : []));
  }, []);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const isOutOfRange = (key, val) => {
    if (!val) return false;
    const r = normalRanges[key];
    const n = parseFloat(val);
    return n < r.min || n > r.max;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return alert('Please select a patient first');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('patientId', selected);
      if (file) fd.append('ecgFile', file);
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      const { data } = await API.post('/ecg/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(data);
      setStep(3);
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const selectedPatient = patients.find(p => p._id === selected);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: '32px 36px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 700, color: '#1E293B', letterSpacing: '-0.5px' }}>
            Upload ECG
          </h1>
          <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
            Upload an ECG image and enter measurements for AI-assisted analysis
          </p>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, gap: 0 }}>
          {['Select Patient', 'Upload & Measure', 'Results'].map((s, i) => {
            const num = i + 1;
            const done = step > num;
            const active = step === num;
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: done ? '#0D9488' : active ? '#0EA5E9' : '#E2E8F0',
                    color: done || active ? '#fff' : '#94A3B8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, flexShrink: 0,
                    transition: 'all 0.3s'
                  }}>
                    {done ? '✓' : num}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? '#1E293B' : '#94A3B8' }}>{s}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 2, background: done ? '#0D9488' : '#E2E8F0', margin: '0 12px', transition: 'background 0.3s' }} />}
              </div>
            );
          })}
        </div>

        {/* ── STEP 1: Select Patient ── */}
        {step === 1 && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24 }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 600, color: '#1E293B', marginBottom: 16 }}>
                Which patient is this ECG for?
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {patients.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 32, color: '#94A3B8', fontSize: 13 }}>
                    No patients found. <span style={{ color: '#0EA5E9', cursor: 'pointer' }} onClick={() => navigate('/patients')}>Add a patient first →</span>
                  </div>
                ) : patients.map(p => (
                  <div
                    key={p._id}
                    onClick={() => setSelected(p._id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
                      border: `2px solid ${selected === p._id ? '#0EA5E9' : '#E2E8F0'}`,
                      background: selected === p._id ? '#F0F9FF' : '#fff',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #E0F2FE, #CCFBF1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      {p.gender === 'Female' ? '👩' : '👨'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{p.patientId} · {p.age}y · {p.gender}</div>
                    </div>
                    {selected === p._id && <span style={{ color: '#0EA5E9', fontSize: 18 }}>✓</span>}
                  </div>
                ))}
              </div>

              <button
                onClick={() => selected && setStep(2)}
                disabled={!selected}
                style={{ width: '100%', padding: '13px', background: selected ? 'linear-gradient(135deg, #0EA5E9, #0D9488)' : '#E2E8F0', border: 'none', borderRadius: 10, color: selected ? '#fff' : '#94A3B8', fontSize: 14, fontWeight: 600, cursor: selected ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif" }}
              >
                Continue with {selectedPatient?.name || 'selected patient'} →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Upload + Measurements ── */}
        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

              {/* Left: Upload */}
              <div>
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      {selectedPatient?.gender === 'Female' ? '👩' : '👨'}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{selectedPatient?.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{selectedPatient?.patientId} · {selectedPatient?.age}y</div>
                    </div>
                    <button type="button" onClick={() => setStep(1)} style={{ marginLeft: 'auto', fontSize: 11, color: '#0EA5E9', background: 'none', border: 'none', cursor: 'pointer' }}>Change</button>
                  </div>

                  {/* Drop zone */}
                  <div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('ecgFileInput').click()}
                    style={{
                      border: `2px dashed ${dragging ? '#0EA5E9' : preview ? '#0D9488' : '#CBD5E1'}`,
                      borderRadius: 12, padding: 24, textAlign: 'center', cursor: 'pointer',
                      background: dragging ? '#F0F9FF' : preview ? '#F0FDF4' : '#F8FAFC',
                      transition: 'all 0.2s', minHeight: 180,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    {preview ? (
                      <img src={preview} alt="ECG preview" style={{ maxHeight: 160, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }} />
                    ) : (
                      <>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: '#475569', marginBottom: 4 }}>Drop ECG image here</div>
                        <div style={{ fontSize: 12, color: '#94A3B8' }}>or click to browse · PNG, JPG, PDF</div>
                      </>
                    )}
                  </div>
                  <input id="ecgFileInput" type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
                  {file && <div style={{ marginTop: 8, fontSize: 12, color: '#0D9488', textAlign: 'center' }}>✓ {file.name}</div>}
                </div>
              </div>

              {/* Right: Measurements */}
              <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24 }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 600, color: '#1E293B', marginBottom: 6 }}>ECG Measurements</h3>
                <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 18 }}>Enter values from the ECG report. Red = outside normal range.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {Object.entries(normalRanges).map(([key, r]) => {
                    const outOfRange = isOutOfRange(key, form[key]);
                    return (
                      <div key={key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <label style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{r.label}</label>
                          <span style={{ fontSize: 11, color: '#94A3B8' }}>Normal: {r.min}–{r.max} {r.unit}</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="number"
                            placeholder={`e.g. ${Math.round((r.min + r.max) / 2)}`}
                            value={form[key]}
                            onChange={e => setForm({ ...form, [key]: e.target.value })}
                            style={{
                              width: '100%', padding: '9px 44px 9px 12px',
                              border: `1.5px solid ${outOfRange ? '#FCA5A5' : '#E2E8F0'}`,
                              borderRadius: 8, fontSize: 13, color: '#1E293B',
                              background: outOfRange ? '#FFF5F5' : '#fff',
                              outline: 'none', fontFamily: "'DM Sans', sans-serif"
                            }}
                          />
                          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: outOfRange ? '#EF4444' : '#94A3B8', fontWeight: outOfRange ? 600 : 400 }}>
                            {outOfRange ? '⚠' : r.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', marginTop: 20, padding: '13px', background: loading ? '#E2E8F0' : 'linear-gradient(135deg, #0EA5E9, #0D9488)', border: 'none', borderRadius: 10, color: loading ? '#94A3B8' : '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif' " }}
                >
                  {loading ? '🔄 Analyzing...' : '🧠 Run Analysis →'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ── STEP 3: Results ── */}
        {step === 3 && result && (
          <div style={{ maxWidth: 700 }}>

            {/* Risk banner */}
            <div style={{
              padding: '20px 24px', borderRadius: 14, marginBottom: 20,
              border: `1px solid ${riskStyle[result.riskLevel]?.border}`,
              background: riskStyle[result.riskLevel]?.bg,
              display: 'flex', alignItems: 'center', gap: 16
            }}>
              <div style={{ fontSize: 36 }}>
                {result.riskLevel === 'high' ? '🚨' : result.riskLevel === 'moderate' ? '⚠️' : '✅'}
              </div>
              <div>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: riskStyle[result.riskLevel]?.color, textTransform: 'capitalize' }}>
                  {result.riskLevel} Risk
                </div>
                <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
                  {result.flags.length} abnormalities detected · Patient: {selectedPatient?.name}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 11, color: '#94A3B8', fontStyle: 'italic' }}>
                Decision Support Only
              </div>
            </div>

            {/* Flags */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 600, color: '#1E293B', marginBottom: 14 }}>
                🔍 Detected Findings
              </h3>
              {result.flags.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#F0FDF4', borderRadius: 8, color: '#16A34A', fontSize: 13, fontWeight: 500 }}>
                  ✅ No abnormalities detected — ECG appears within normal parameters
                </div>
              ) : result.flags.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: i < result.flags.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <span style={{ color: '#EF4444', fontSize: 16, flexShrink: 0 }}>⚠</span>
                  <span style={{ fontSize: 13, color: '#1E293B' }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Measurements summary */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 600, color: '#1E293B', marginBottom: 14 }}>
                📐 Interval Measurements
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {Object.entries(normalRanges).map(([key, r]) => {
                  const val = form[key];
                  const out = isOutOfRange(key, val);
                  return (
                    <div key={key} style={{ padding: '12px 14px', borderRadius: 8, background: out ? '#FEF2F2' : '#F8FAFC', border: `1px solid ${out ? '#FCA5A5' : '#E2E8F0'}` }}>
                      <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4 }}>{r.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: out ? '#DC2626' : '#1E293B', fontFamily: "'Sora', sans-serif" }}>
                        {val || '—'}
                      </div>
                      <div style={{ fontSize: 10, color: out ? '#EF4444' : '#94A3B8', marginTop: 2 }}>{r.unit} · {out ? 'Abnormal' : 'Normal'}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ padding: '12px 16px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, fontSize: 12, color: '#92400E', marginBottom: 20 }}>
              ⚠️ <strong>Clinical Decision Support Only</strong> — These findings are AI-assisted and must be reviewed and confirmed by a qualified physician before any clinical action is taken. Not a substitute for professional medical diagnosis.
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => { setStep(1); setResult(null); setFile(null); setPreview(null); setForm({ heartRate: '', prInterval: '', qrsDuration: '', qtInterval: '', qtcInterval: '', stDeviation: '' }); }}
                style={{ flex: 1, padding: '12px', border: '1px solid #E2E8F0', borderRadius: 10, background: '#fff', fontSize: 13, fontWeight: 500, color: '#64748B', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >
                ← New Analysis
              </button>
              <button
                onClick={() => navigate('/patients')}
                style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, #0EA5E9, #0D9488)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >
                View Patients →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}