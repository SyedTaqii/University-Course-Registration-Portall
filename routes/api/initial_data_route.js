const express = require('express');
const router = express.Router();
const SeedController = require('../../controllers/initial_data_controller');

// Seed initial data
router.post('/', SeedController.populateInitialData);

module.exports = router;