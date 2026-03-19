const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');

// GET all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create patient
router.post('/', auth, async (req, res) => {
  try {
    const { name, age, gender, contact, symptoms } = req.body;
    const count = await Patient.countDocuments();
    const patientId = `PAT${String(count + 1).padStart(4, '0')}`;
    const patient = await Patient.create({
      patientId, name, age, gender,
      contact, symptoms, createdBy: req.user._id
    });
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE patient
router.delete('/:id', auth, async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;