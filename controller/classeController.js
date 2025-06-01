const Validator = require('./regexValidation');
const Classe = require('./../models/classeModel');

exports.createClasse = async (req, res) => {
  try {
    const filiere = req.body.filiere;
    // Vérification que les données entrée est bien valide
    if (!Validator.StringValidator(filiere)) {
      return res.status(400).json({
        status: 'error',
        message: `Le nom: ${req.body.filiere} n'est pas correcte`,
      });
    }
    // #######################################
    //  Création d'une Classe
    // #######################################
    const classe = await Classe.create(req.body);
    res.status(201).json({ status: 'success', data: classe });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// ###########################################
//  Afficher toute les Années Scolaire
// ###########################################

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Classe.find().populate('academicYear');
    res.status(200).json({ status: 'success', data: classes });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// ###########################################
//  Afficher une  Classe
// ###########################################
exports.getOneClasse = async (req, res) => {
  try {
    const classe = await Classe.findById(req.params.classeId).populate(
      'academicYear'
    );
    res.status(200).json({ status: 'success', data: classe });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// ##############################################""
// Mettre à jour une classe
// ##############################################""
exports.updateClasse = async (req, res) => {
  try {
    const updated = await Classe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// ###############################################################
// Supprimer une Classe
// ###############################################################
exports.deleteClasse = async (req, res) => {
  try {
    await Classe.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ status: 'success', message: 'Classe supprimée avec succès' });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// ##############################################################
// Supprimer toute la Clase
// ##############################################################
exports.deleteAllClasse = async (req, res) => {
  try {
    await Classe.deleteMany({}); // Supprime tous les documents

    res.status(200).json({
      status: 'success',
      message: 'Toute les Classe ont été supprimés avec succès',
    });
  } catch (e) {
    console.error('Erreur lors de la suppression de toutes les Classe:', e);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression de toute les Classe',
      error: e.message,
    });
  }
};

// #####################################################################
// Supprimer la Classe avec Filtre
// #####################################################################
exports.deleteClassesByFilter = async (req, res) => {
  try {
    const result = await Classe.deleteMany(req.body);
    res.status(200).json({
      status: 'success',
      message: `${result.deletedCount} classes supprimées.`,
    });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};
