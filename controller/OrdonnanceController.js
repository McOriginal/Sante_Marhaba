// controllers/OrdonnanceController.js

const Ordonnance = require('../models/OrdonanceModel');
const Medicament = require('../models/MedicamentModel');
const Traitement = require('../models/TraitementModel');

exports.createOrdonnance = async (req, res) => {
  try {
    const { items, ...restOfData } = req.body;

    // const cashierId = req.user?._id || null; // supposé que `req.user` est injecté par auth middleware

    // Vérification des items et existence des produits
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Les articles sont requis.' });
    }

    for (const item of items) {
      const medicament = await Medicament.findById(item.medicamentID);
      if (!medicament) {
        return res
          .status(404)
          .json({ message: `Medicament introuvable: ${item.medicamentID}` });
      }
      if (item.quantity < 1) {
        return res
          .status(400)
          .json({ message: 'Quantité invalide pour un produit.' });
      }
    }

    const newOrdonnance = await Ordonnance.create({
      items,
      ...restOfData,
    });

    res.status(201).json(newOrdonnance);
  } catch (error) {
    console.error("Erreur de validation l'ordonnance :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getAllOrdonnances = async (req, res) => {
  try {
    const ordonnances = await Ordonnance.find()
      .populate({
        path: 'traitement',
        populate: {
          path: 'patient',
        },
      })
      .populate('items.medicaments');
    console.log(ordonnances);
    return res.status(201).json(ordonnances);
  } catch (e) {
    return res.status(404).json(e);
  }
};

exports.getOneOrdonnance = async (req, res) => {
  try {
    const ordonnance = await Ordonnance.findById(req.params.id).populate(
      'items.medicaments'
    );

    // ID de Traitement
    const traitementId = ordonnance.traitement._id;

    // Récupérer les patients à travers le traitement
    const trait = await Traitement.findById(traitementId)
      .populate('patient')
      .populate('doctor');

    return res
      .status(201)
      .json({ ordonnances: ordonnance, traitements: trait });
  } catch (e) {
    return res.status(404).json(e);
  }
};

// Récuperer l'ordonnance par Traitement
exports.getTraitementOrdonnance = async (req, res) => {
  try {
    // ID de Traitement
    const traitementId = req.params.traitementId;

    // Récupérer les patients à travers le traitement
    const trait = await Traitement.findById(traitementId)
      .populate('patient')
      .populate('doctor');

    // Récupérer l'ordonnance dont le traitement correspond à une ID précise
    const ordonnance = await Ordonnance.find({
      traitement: traitementId,
    })
      .populate('traitement')
      .populate('items.medicaments');

    return res.status(201).json({ ordonnances: { ordonnance, trait } });
  } catch (e) {
    return res.status(404).json(e);
  }
};

exports.deleteOrdonnance = async (req, res) => {
  try {
    await Ordonnance.findByIdAndDelete(req.params.id);

    return res
      .status(200)
      .json({ message: `l\'ordonnance supprimé avec succès` });
  } catch (e) {
    console.log(e);
    return res.status(404).json(e);
  }
};
