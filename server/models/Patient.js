const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  patientId:  { type: String, unique: true },
  name:       { type: String, required: true },
  age:        { type: Number },
  gender:     { type: String, enum: ['Male','Female','Other'] },
  contact:    { type: String },
  symptoms:   { type: String },
  riskLevel:  { type: String, enum: ['low','moderate','high'], default: 'low' },
  ecgHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ECG' }],
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);