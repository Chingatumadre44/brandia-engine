const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');
const artController = require('../controllers/art.controller');
const promptController = require('../controllers/prompt.controller');
const imageController = require('../controllers/image.controller');

/**
 * @route   POST /api/brand/strategy
 * @desc    Procesa un prompt y devuelve 5 conceptos de branding sugeridos
 */
router.post('/strategy', brandController.generateStrategy);

/**
 * @route   POST /api/brand/art-direction
 * @desc    Genera reglas visuales basadas en un concepto estratégico (v9)
 */
router.post('/art-direction', artController.generateArtDirection);

/**
 * @route   POST /api/brand/visual-prompts
 * @desc    Genera prompts de imagen basados en la dirección de arte (v10)
 */
router.post('/visual-prompts', promptController.generatePrompts);

/**
 * @route   POST /api/brand/images
 * @desc    Crea activos visuales simulados basados en prompts (v11)
 */
router.post('/images', imageController.generateImages);

module.exports = router;
