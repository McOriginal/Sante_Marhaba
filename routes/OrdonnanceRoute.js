const express = require('express');
const router = express.Router();
const ordonnanceController = require('../controller/OrdonnanceController');

//  Créer une nouvelle Ordonnance
router.post('/createOrdonnance', ordonnanceController.createOrdonnance);

//  Obtenir toutes les Ordonnances
router.get('/getAllOrdonnances', ordonnanceController.getAllOrdonnances);

//  Obtenir une Ordonnances
router.get('/getOneOrdonnance/:id', ordonnanceController.getOneOrdonnance);

//  Obtenir une Ordonnances (avec TRAITEMENT liée)
router.get(
  '/getTraitementOrdonnance/:traitementId',
  ordonnanceController.getTraitementOrdonnance
);

//  Mettre à jour une Ordonnance
router.put('/updateOrdonnance/:id', ordonnanceController.getOneOrdonnance);

//  Supprimer une Ordonnance
router.delete('/deleteOrdonnance/:id', ordonnanceController.deleteOrdonnance);

//  Supprimer toutes les Ordonnance sans Ordonnance
// router.delete(
//   '/deleteAllOrdonnances',
//   ordonnanceController.deleteAllOrdonnance
// );

module.exports = router;
