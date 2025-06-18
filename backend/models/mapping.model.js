const mongoose = require('mongoose');

const mappingSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Patient',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Doctor',
    },
    notes: {
      type: String,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a doctor can only be assigned once to a patient
mappingSchema.index({ patient: 1, doctor: 1 }, { unique: true });

const Mapping = mongoose.model('Mapping', mappingSchema);

module.exports = Mapping;
