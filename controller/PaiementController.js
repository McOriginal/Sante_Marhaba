const Paiement = require('../models/paimentModel');

// Enregistrer un paiement
exports.createPaiement = async (req, res) => {
  try {
    const paiement = await Paiement.create(req.body);
    res.status(201).json({ status: 'success', data: paiement });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Historique des paiements d’un étudiant
exports.getPaiement = async (req, res) => {
  const paiements = await Paiement.findById(req.params.id)
    .populate('student')
    .populate('academicYear');
  res.status(200).json({ status: 'success', data: paiements });
};

// Historique des paiements d’un étudiant
exports.getPaiementsByStudent = async (req, res) => {
  const paiements = await Paiement.find({ student: req.params.studentId })
    .populate('student')
    .populate('academicYear');
  res.status(200).json({ status: 'success', data: paiements });
};

// Historique des paiements d’un étudiant
exports.getAllPaiements = async (req, res) => {
  const paiements = await Paiement.find()
    .populate('student')
    .populate('academicYear');
  res.status(200).json({ status: 'success', data: paiements });
};

// Mettre à jour un paiement
exports.updatePaiement = async (req, res) => {
  try {
    const updated = await Paiement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: 'success', data: updated });
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
