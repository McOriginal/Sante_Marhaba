const Paiement = require('../models/PaiementModel');
const Traitement = require('../models/TraitementModel');
// Enregistrer un paiement
exports.createPaiement = async (req, res) => {
  try {
    const selectedTraitement = req.body.traitement;
    // Vérification si un PAIEMENT n'existe pas pour ce TRAITEMENT
    const existingPaiement = await Paiement.findOne({
      traitement: selectedTraitement,
    }).exec();

    if (existingPaiement) {
      return res.status(404).json({ message: 'Ce Traitement est déjà payé' });
    }

    const paiement = await Paiement.create(req.body);
    res.status(201).json(paiement);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Mettre à jour un paiement
exports.updatePaiement = async (req, res) => {
  try {
    const selectedTraitement = req.body.traitement;
    // Vérification si un PAIEMENT n'existe pas pour ce TRAITEMENT
    const existingPaiement = await Paiement.findOne({
      traitement: selectedTraitement,

      _id: { $ne: req.params.id },
    }).exec();
    if (existingPaiement) {
      return res.status(404).json({ message: 'Ce Traitement est déjà payé' });
    }
    const updated = await Paiement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Historique des paiements d’un étudiant
exports.getAllPaiements = async (req, res) => {
  try {
    const paiements = await Paiement.find()
      // Trie par date de création, du plus récent au plus ancien
      .sort({ createdAt: -1 })
      .populate({
        path: 'traitement',
        populate: {
          path: 'patient',
        },
      })
      .populate('ordonnance');
    return res.status(200).json(paiements);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};
// Historique des paiements d’un étudiant
exports.getPaiement = async (req, res) => {
  try {
    const paiements = await Paiement.findById(req.params.id)
      .populate({
        path: 'traitement',
        populate: {
          path: 'patient',
        },
      })
      .populate('ordonnance');
    return res.status(200).json(paiements);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Supprimer un paiement
exports.deletePaiement = async (req, res) => {
  try {
    await Paiement.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ status: 'success', message: 'Paiement supprimé avec succès' });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};
