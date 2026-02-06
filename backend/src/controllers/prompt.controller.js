const promptService = require('../services/prompt.service');

/**
 * Controlador para la Generación de Prompts Visuales (v10)
 */
const generatePrompts = async (req, res) => {
    try {
        const artDirection = req.body;

        // Validación básica del contrato de dirección de arte
        if (!artDirection || !artDirection.conceptId || !artDirection.colorSystem) {
            return res.status(400).json({
                error: 'Dirección de arte inválida',
                message: 'Debes enviar el objeto completo de dirección de arte generado en la etapa anterior.'
            });
        }

        console.log(`[PromptController] Generando prompts visuales para el concepto: "${artDirection.conceptId}"`);

        // Llamada al servicio de prompts
        const visualPrompts = await promptService.generateVisualPrompts(artDirection);

        return res.status(200).json({
            success: true,
            visualPrompts
        });

    } catch (error) {
        console.error('[PromptController] Error:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
};

module.exports = {
    generatePrompts
};
