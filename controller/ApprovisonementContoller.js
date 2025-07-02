const Approvisonement = require('../models/ApprovisonementModel');
const Medicament = require('../models/MedicamentModel');

// Create a new approvisonement
exports.createApprovisonement = async (req, res) => {
  try {
    const { medicament, quantity, price, ...restOfData } = req.body;
    // On change les valeurs quantity et price en nombres
    formatQuantity = Number(quantity);
    formatPrice = Number(price);

    // Medicament ID
    // const medicamentID = await Medicament.findById(req.params.medicament_id);
    if (!medicament) {
      return res.status(404).json({ message: 'Médicament non trouvée' });
    }

    // On ajoute la quantité sur le stock disponible de médicament
    await Medicament.findByIdAndUpdate(
      medicament,
      { $inc: { stock: formatQuantity } },
      { new: true }
    );

    // On crée l'approvisionnement
    const approvisonement = await Approvisonement.create({
      ...restOfData,
      quantity: formatQuantity,
      price: formatPrice,
      medicament,
    });

    return res.status(201).json(approvisonement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all approvisonements
exports.getAllApprovisonements = async (req, res) => {
  try {
    const approvisonements = await Approvisonement.find()
      // Trie par date de création, du plus récent au plus ancien
      .sort({ createdAt: -1 })
      .populate('medicament')
      .populate('fournisseur');
    return res.status(200).json(approvisonements);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single approvisonement by ID
exports.getApprovisonementById = async (req, res) => {
  try {
    const approvisonement = await Approvisonement.findById(req.params.id)
      .populate('medicament')
      .populate('fournisseur');
    if (!approvisonement) {
      return res.status(404).json({ message: 'Approvisonement not found' });
    }

    return res.status(200).json(approvisonement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an approvisonement by ID
exports.deleteApprovisonement = async (req, res) => {
  try {
    const approvisonement = await Approvisonement.findByIdAndDelete(
      req.params.id
    );

    if (!approvisonement) {
      return res.status(404).json({ message: 'Approvisonement not found' });
    }

    // On décrémente le stock du médicament associé
    await Medicament.findByIdAndUpdate(
      approvisonement.medicament,
      { $inc: { stock: -approvisonement.quantity } },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: 'Approvisonement deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
