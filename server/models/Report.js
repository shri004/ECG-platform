const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  ecgId:          { type: mongoose.Schema.Types.ObjectId, ref: 'ECG' },
  patientId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  reportUrl:      { type: String },
  interpretation: { type: String },
  riskLevel:      { type: String },
  generatedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);