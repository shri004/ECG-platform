const mongoose = require('mongoose');

const ECGSchema = new mongoose.Schema({
  patientId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  fileUrl:         { type: String },
  fileType:        { type: String },
  measurements: {
    heartRate:     Number,
    prInterval:    Number,
    qrsDuration:   Number,
    qtInterval:    Number,
    qtcInterval:   Number,
    stDeviation:   Number,
  },
  ruleFlags:        [String],
  riskLevel:        { type: String, enum: ['low','moderate','high'], default: 'low' },
  aiInterpretation: { type: String },
  doctorNotes:      { type: String },
  status:           { type: String, enum: ['pending','analyzed','reviewed','final'], default: 'pending' },
  uploadedBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('ECG', ECGSchema);