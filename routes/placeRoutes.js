const express = require('express');
const router = express.Router();
const { seedPlaces, getAllPlaces, getFare } = require('../controllers/placeController');

router.post('/seed', seedPlaces);
router.get('/', getAllPlaces);
router.get('/fare', getFare);

module.exports = router;
