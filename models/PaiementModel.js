const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema(
  {
    totalAmount: {
      type: Number,
      required: true,
      trim: true,
    },
    totalPaye: {
      type: Number,
      required: true,
      trim: true,
    },

    motifPaiement: {
      type: String,
      enum: ['ordonnance', 'traitement', 'consultation', 'tous'],
      required: true,
    },
    paiementDate: {
      type: Date,
      required: true,
    },
    methode: {
      type: String,
      enum: ['cash', 'orange money', 'moove money'],
      default: 'cash',
      required: true,
    },
    statut: {
      type: String,
      enum: ['payé', 'partiel', 'non payé'],
      default: 'Payé',
      required: true,
    },
    // Clé de rélation Traitement
    traitement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Traitement',
    },
    // Clé de rélation Patient
    ordonnance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ordonnance',
    },
  },
  { timestamps: true }
);

const Paiement = mongoose.model('Paiement', paiementSchema);
module.exports = Paiement;
