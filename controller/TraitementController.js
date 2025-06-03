const Traitement = require('../models/TraitementModel');
const textValidator = require('./regexValidation');

// Enregistrer une Traitement
exports.addTraitement = async (req, res) => {
  try {
    const {
      motif,
      diagnostic,
      result,
      observation,
      totalAmount,
      ...resOfData
    } = req.body;

    const formattedTotalAmount = Number(totalAmount);

    if (
      !textValidator.stringValidator(motif) ||
      !textValidator.stringValidator(diagnostic) ||
      !textValidator.stringValidator(result) ||
      !textValidator.stringValidator(observation)
    ) {
      return res.status(404).json({
        message:
          "Vous avez peut être oublié un champ ou les données saisie n'est sont pas correcte",
      });
    }
    const Traitements = await Traitement.create({
      motif: motif.toLowerCase(),
      diagnostic: diagnostic.toLowerCase(),
      result: motif.toLowerCase(),
      observation: observation.toLowerCase(),
      totalAmount: formattedTotalAmount,
      ...resOfData,
    });
    return res.status(201).json({ Traitements });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Récupérer toutes les Traitements

exports.getAllTraitements = async (req, res) => {
  try {
    const traitements = await Traitement.find()
      // Trie par date de création, du plus récent au plus ancien
      .sort({ createdAt: -1 })
      .populate('patient')
      .populate('doctor');
    return res.status(200).json(traitements);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// ######################################################
// Récupérer une Traitement spécifique
// ######################################################
exports.getTraitementById = async (req, res) => {
  try {
    const traitements = await Traitement.findById(req.params.id)
      .populate('patient')
      .populate('doctor');
    if (!traitements) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Traitement non trouvée' });
    }
    return res.status(200).json(traitements);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Mettre à jour une Traitement
exports.updateTraitement = async (req, res) => {
  try {
    const {
      motif,
      diagnostic,
      result,
      observation,
      totalAmount,
      ...resOfData
    } = req.body;

    const formattedTotalAmount = Number(totalAmount);
    if (
      !textValidator.stringValidator(motif) ||
      !textValidator.stringValidator(diagnostic) ||
      !textValidator.stringValidator(result) ||
      !textValidator.stringValidator(observation)
    ) {
      return res.status(404).jeson({
        message: 'Vous avez mal entrée les données',
      });
    }

    // Mettre à jour la Traitement
    const updated = await Traitement.findByIdAndUpdate(
      req.params.id,
      {
        motif: motif.toLowerCase(),
        diagnostic: diagnostic.toLowerCase(),
        result: result.toLowerCase(),
        observation: observation.toLowerCase(),
        totalAmount: formattedTotalAmount,
        ...resOfData,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json({ updated });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Supprimer une Traitement
exports.deleteTraitement = async (req, res) => {
  try {
    await Traitement.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ status: 'success', message: 'Traitement supprimée avec succès' });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// ############### DELETE ALL Traitement ############################
exports.deleteAllTraitements = async (req, res) => {
  try {
    await Traitement.deleteMany({}); // Supprime tous les documents

    return res.status(200).json({
      status: 'success',
      message: 'Toutes les Traitements ont été supprimés avec succès',
    });
  } catch (e) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression des Traitements',
      error: e.message,
    });
  }
};
