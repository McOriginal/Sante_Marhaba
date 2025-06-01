const mongoose = require('mongoose');

const medicamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    }, // Ex: Nom de médicament
    stock: {
      type: Number,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    // La clé de rélation
    fournisseur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fournisseur',
      required: true,
    },
  },
  { timestamps: true }
);

const Medicament = mongoose.model('Medicament', medicamentSchema);

module.exports = Medicament;
