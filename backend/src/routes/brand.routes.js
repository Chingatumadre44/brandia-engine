const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');
const artController = require('../controllers/art.controller');
const promptController = require('../controllers/prompt.controller');
const imageController = require('../controllers/image.controller');

const debugController = require('../controllers/debug.controller');

/**
 * @route   GET /api/brand/health
 * @desc    Check service availability
 */
router.get('/health', (req, res) => res.json({ status: 'ok', engine: 'v8.5-hybrid' }));

/**
 * @route   POST /api/brand/strategy
 * @desc    Procesa un prompt y devuelve 5 conceptos de branding sugeridos
 */
router.post('/strategy', brandController.generateStrategy);

/**
 * @route   GET /api/brand/images/debug
 * @desc    Test de integración en vivo para Gemini Imagen
 */
router.get('/images/debug', debugController.debugIntegration);

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
