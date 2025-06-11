const express = require('express');
const router = express.Router();
const medicamentController = require('../controller/MedicamentController');

// Créer un Medicament
router.post('/addMedicament', medicamentController.createMedicament);

// Afficher une toutes les Medicament
router.get('/getAllMedicaments', medicamentController.getAllMedicament);

// Afficher une seule Medicament
router.get('/getOneMedicament/:id', medicamentController.getOneMedicament);

// Mettre à jour une Medicament
router.put('/updateMedicament/:id', medicamentController.updateMedicament);

// Mettre à jour une Medicament avec le Stock
router.post(
  '/decrementMultipleStocks',
  medicamentController.decrementMultipleStocks
);

// Annuler à jour une Medicament avec le Stock
router.post(
  '/cancelDecrementMultipleStocks/:ordonnanceId',
  medicamentController.cancelOrdonnance
);

// supprimer une Matière
router.delete(
  '/deleteMedicament/:id',
  medicamentController.deleteMedicamentById
);

// Supprimer toutes les Medicament
router.delete('/deleteAllMedicament', medicamentController.deleteAllMedicament);

module.exports = router;
