const imageService = require('../services/image.service');

/**
 * Controlador para la Generación de Imágenes (v11)
 */
const generateImages = async (req, res) => {
    try {
        const { conceptId, logoPrompt, iconSetPrompt } = req.body;

        // Validación básica
        if (!conceptId || !logoPrompt || !iconSetPrompt) {
            return res.status(400).json({
                error: 'Datos incompletos',
                message: 'Debes enviar conceptId, logoPrompt e iconSetPrompt.'
            });
        }

        console.log(`[ImageController] Simulando generación de imágenes para: "${conceptId}"`);

        // Llamada al servicio de imágenes
        const visualAssets = await imageService.generateImages(conceptId, logoPrompt, iconSetPrompt);

        return res.status(200).json({
            success: true,
            visualAssets
        });

    } catch (error) {
        console.error('[ImageController] Error:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
};

module.exports = {
    generateImages
};
