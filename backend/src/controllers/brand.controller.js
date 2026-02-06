const aiService = require('../services/ai.service');

/**
 * Controlador para la lógica de branding
 */
const generateStrategy = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                error: 'Falta el prompt del usuario',
                message: 'Debes enviar un campo "prompt" en el cuerpo de la petición'
            });
        }

        console.log(`[BrandController] Procesando prompt: "${prompt}"`);

        // Llamada al servicio de IA (mock por ahora)
        const concepts = await aiService.generateBrandingConcepts(prompt);

        // Devolución de la respuesta exitosa
        return res.status(200).json({
            success: true,
            prompt,
            concepts
        });

    } catch (error) {
        console.error('[BrandController] Error:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
};

module.exports = {
    generateStrategy
};
