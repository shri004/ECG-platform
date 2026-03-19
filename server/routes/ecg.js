const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const ECG     = require('../models/ECG');
const Patient = require('../models/Patient');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// POST upload ECG
router.post('/upload', upload.single('ecgFile'), async (req, res) => {
  try {
    const { patientId, heartRate, prInterval, qrsDuration, qtInterval, qtcInterval, stDeviation } = req.body;

    // Rule-based analysis engine
    const flags = [];
    const hr  = parseFloat(heartRate)  || 0;
    const pr  = parseFloat(prInterval) || 0;
    const qrs = parseFloat(qrsDuration)|| 0;
    const qt  = parseFloat(qtInterval) || 0;
    const qtc = parseFloat(qtcInterval)|| 0;
    const st  = parseFloat(stDeviation)|| 0;

    if (hr  > 100) flags.push('Tachycardia (HR > 100 bpm)');
    if (hr  < 60)  flags.push('Bradycardia (HR < 60 bpm)');
    if (pr  > 200) flags.push('First Degree AV Block (PR > 200ms)');
    if (qrs > 120) flags.push('Bundle Branch Block (QRS > 120ms)');
    if (qtc > 450) flags.push('Prolonged QTc (> 450ms) — Risk of Torsades');
    if (st  > 1)   flags.push('ST Elevation (> 1mm) — Possible STEMI');
    if (st  < -1)  flags.push('ST Depression (< -1mm) — Possible Ischemia');

    const riskLevel = flags.some(f =>
      f.includes('STEMI') || f.includes('Torsades')
    ) ? 'high' : flags.length > 0 ? 'moderate' : 'low';

    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const ecg = await ECG.create({
      patientId,
      fileUrl,
      measurements: { heartRate: hr, prInterval: pr, qrsDuration: qrs, qtInterval: qt, qtcInterval: qtc, stDeviation: st },
      ruleFlags: flags,
      riskLevel,
      status: 'analyzed'
    });

    // Update patient risk level
    await Patient.findByIdAndUpdate(patientId, { riskLevel });

    res.status(201).json({ ecg, flags, riskLevel });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET ECGs for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const ecgs = await ECG.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
    res.json(ecgs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET single ECG
router.get('/:id', async (req, res) => {
  try {
    const ecg = await ECG.findById(req.params.id).populate('patientId');
    res.json(ecg);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;