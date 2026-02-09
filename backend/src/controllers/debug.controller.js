const imageService = require('../services/image.service');

const debugIntegration = async (req, res) => {
    console.log('[DebugController] Iniciando test de integración...');

    const results = {
        timestamp: new Date().toISOString(),
        apiKeyConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'tu_clave_gemini_aqui',
        testImagen: null,
        error: null
    };

    try {
        // Test rápido con prompt simple
        const testRes = await imageService.generateImages(
            'TEST_DIAG',
            'A small blue square favicon.',
            'Minimalist icon of a star.'
        );
        results.testImagen = 'SUCCESS';
        results.data = testRes;
        res.json({ status: 'ok', diagnostics: results });
    } catch (error) {
        results.testImagen = 'FAILED';
        results.error = error.message;
        res.status(500).json({ status: 'error', diagnostics: results });
    }
};

module.exports = {
    debugIntegration
};
