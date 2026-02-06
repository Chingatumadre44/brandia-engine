const artService = require('../services/art.service');

/**
 * Controlador para la Dirección de Arte (v9)
 */
const generateArtDirection = async (req, res) => {
    try {
        const concept = req.body;

        // Validación básica del contrato del concepto
        if (!concept || !concept.id || !concept.name) {
            return res.status(400).json({
                error: 'Concepto inválido',
                message: 'Debes enviar el objeto completo del concepto de branding generado en la etapa anterior.'
            });
        }

        console.log(`[ArtDirectionController] Generando dirección de arte para: "${concept.name}"`);

        // Llamada al servicio de Dirección de Arte
        const artDirection = await artService.generateVisualRules(concept);

        return res.status(200).json({
            success: true,
            artDirection
        });

    } catch (error) {
        console.error('[ArtDirectionController] Error:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
};

module.exports = {
    generateArtDirection
};
