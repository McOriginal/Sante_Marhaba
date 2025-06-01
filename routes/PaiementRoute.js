const express = require('express');
const router = express.Router();
const paiementController = require('../controller/PaiementController');

// Créer
router.post('/createPaiement', paiementController.createPaiement);

// Trouvez un paiements
router.get('/getPaiement/:id', paiementController.getPaiement);

// Trouvez tous les paiements
router.get('/getAllPaiements', paiementController.getAllPaiements);

// Trouvez les paiements d'une etudiant
router.get(
  '/getStudentPaiement/:studentId',
  paiementController.getPaiementsByStudent
);

// Mettre à jour
router.put('/updatePaiement/:id', paiementController.updatePaiement);

// Supprimer
router.delete('/deletePaiement/:id', paiementController.deletePaiement);

module.exports = router;
