const Paiement = require('../models/PaiementModel');

// Enregistrer un paiement
exports.createPaiement = async (req, res) => {
  try {
    const paiement = await Paiement.create(req.body);
    res.status(201).json(paiement);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Mettre à jour un paiement
exports.updatePaiement = async (req, res) => {
  try {
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

// Historique des paiements d’un étudiant
exports.getPaiementsByStudent = async (req, res) => {
  const paiements = await Paiement.find({ student: req.params.studentId })
    .populate('traitement')
    .populate('ordonnance');
  res.status(200).json({ status: 'success', data: paiements });
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
