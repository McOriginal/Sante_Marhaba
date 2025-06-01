const mongoose = require('mongoose');
const Patient = require('../models/PatientModel');
const textValidator = require('./regexValidation');

exports.newPatient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailAdresse,
      adresse,
      ethnie,
      profession,
      ...resOfData
    } = req.body;

    // Changer les données en miniscule
    const lowerFirstName = firstName.toLowerCase();
    const lowerLastName = lastName.toLowerCase();
    const lowerAdresse = adresse.toLowerCase();
    const lowerEthnie = ethnie.toLowerCase();
    const lowerProfession = profession.toLowerCase();

    const phoneNumber = Number(req.body.phoneNumber);

    if (
      !textValidator.stringValidator(lowerFirstName) ||
      !textValidator.stringValidator(lowerLastName) ||
      !textValidator.stringValidator(lowerAdresse) ||
      !textValidator.stringValidator(lowerEthnie) ||
      !textValidator.stringValidator()
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Données invalides',
      });
    }

    // Vérification des champs uniques
    const existingPatient = await Patient.findOne({
      phoneNumber,
    }).exec();

    if (existingPatient) {
      return res.status(409).json({
        status: 'error',
        message: 'Ce numéro existe déjà pour un patient',
      });
    }

    if (req.body.phoneNumber.toString().length !== 8) {
      return res.status(409).json({
        status: 'error',
        message: 'Le numéro de téléphone doit contenir exactement 8 chiffres',
      });
    }

    // Création du nouvel patient
    const newPatient = await Patient.create({
      firstName: lowerFirstName,
      lastName: lowerLastName,
      adresse: lowerAdresse,
      ethnie: lowerEthnie,
      profession: lowerProfession,
      ...resOfData,
    });
    return res.status(201).json({
      status: 'success',
      message: 'Patient Ajouté avec succès',
      data: newPatient,
    });
  } catch (error) {
    console.error('Erreur de création:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// ################ ###########################""
// ################ All Patients ###########################""

exports.getAllPatients = async (req, res) => {
  try {
    const allPatients = await Patient.find();

    return res.status(200).json(allPatients);
  } catch (e) {
    res.status(404).json({
      status: 'error',
      // message: "Erreur de l'affichage des patients",
      message: e.message,
    });
  }
};

// ################ One Patient ###########################""

exports.getOnePatient = async (req, res) => {
  try {
    const onePatient = await Patient.findById(req.params.patientId);

    res.status(200).json({
      status: 'succes',
      message: 'Patient affiché avec succès',
      data: {
        onePatient,
      },
    });
  } catch (e) {
    console.log("Erreur de l'affichage de patient: ", e);
    res.status(404).json({
      status: 'error',
      message: 'Erreur de trouver  patient',
    });
  }
};

// ################ Update One Patient ###########################

exports.updatePatient = async (req, res) => {
  try {
    // const { patientId } = req.params.id;
    const {
      firstName,
      lastName,
      emailAdresse,
      adresse,
      ethnie,
      profession,
      phoneNumber,
      ...resOfData
    } = req.body;

    // Changer les données en miniscule
    const lowerFirstName = firstName.toLowerCase();
    const lowerLastName = lastName.toLowerCase();
    const lowerAdresse = adresse.toLowerCase();
    const lowerEthnie = ethnie.toLowerCase();
    const lowerProfession = profession.toLowerCase();

    // Validation des données requises
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        status: 'error',
        message: 'ID patient invalide',
      });
    }

    if (
      !textValidator.stringValidator(lowerFirstName) ||
      !textValidator.stringValidator(lowerLastName) ||
      !textValidator.stringValidator(lowerAdresse) ||
      !textValidator.stringValidator(lowerEthnie) ||
      !textValidator.stringValidator(lowerProfession)
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Données invalides',
      });
    }

    // Conversion des numéros (protection contre les strings)
    const phoneNum = Number(phoneNumber);

    // Vérification des doublons (en excluant patient actuel)
    const existingPatient = await Patient.findOne({
      _id: { $ne: req.params.id }, // Exclure patient actuel
      phoneNumber: phoneNum,
    }).exec();

    if (existingPatient) {
      return res.status(409).json({
        status: 'error',
        message: `Ce numéro de téléphone existe déjà pour un Patien`,
      });
    }

    // Mise à jour de patient
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        firstName: lowerFirstName,
        lastName: lowerLastName,
        adresse: lowerAdresse,
        phoneNumber: phoneNum,
        ...resOfData,
      },
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    ).exec();

    if (!updatedPatient) {
      return res.status(404).json({
        status: 'error',
        message: 'patient non trouvé',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'patient mis à jour avec succès',
      data: updatedPatient,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de patient:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Erreur serveur lors de la mise à jour',
    });
  }
};

// ################ ###########################""
// ################ Update One Patient ###########################

exports.deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'succes',
      message: 'Patient supprimer avec succès',
    });
  } catch (e) {
    console.log('Erreur de  suppression de patient: ', e);
    res.status(404).json({
      status: 'error',
      message: 'Erreur de suppression de patient',
    });
  }
};

// ############### DELETE ALL PatientS ############################
exports.deleteAllPatients = async (req, res) => {
  try {
    await Patient.deleteMany({}); // Supprime tous les documents

    res.status(200).json({
      status: 'success',
      message: 'Tous les patients ont été supprimés avec succès',
    });
  } catch (e) {
    console.error('Erreur lors de la suppression de tous les patients:', e);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression de tous les patients',
      error: e.message,
    });
  }
};
