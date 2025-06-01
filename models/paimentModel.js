const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema({
  montant: {
    type: Number,
    required: true,
    trim: true,
  },
  dateOfPaiement: { type: Date, default: Date.now },

  methode: {
    type: String,
    enum: ['cash', 'orange', 'moove'],
    default: 'cash',
    required: true,
  },
  statut: {
    type: String,
    enum: ['Payé', 'Partiel', 'Non payé'],
    default: 'Payé',
    required: true,
  },

  // Clé de rélation Patient
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },

  // Clé de rélation Année Scolaire
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Paiement = mongoose.model('Paiement', paiementSchema);
module.exports = Paiement;
