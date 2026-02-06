/**
 * Servicio de Ingeniería de Prompts (Prompt Engineering)
 * En la versión 10 del BrandIA Engine, este servicio transforma la dirección de arte
 * en instrucciones textuales detalladas para generadores de imágenes (DALL-E, Midjourney, etc.)
 */

/**
 * Genera prompts de imagen basados en la dirección de arte
 * @param {Object} artDirection - El objeto de dirección de arte generado en v9
 * @returns {Promise<Object>} - El JSON con los prompts visuales
 */
const generateVisualPrompts = async (artDirection) => {
    // Simulamos procesamiento de ingeniería de prompts
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { conceptId, styleKeywords = [], logoDescription, colorSystem, typography, iconography, imageryMood } = artDirection;

    const keywords = styleKeywords.join(', ');
    const colors = `${colorSystem.primary}, ${colorSystem.secondary} and ${colorSystem.accent}`;
    const fontStyle = typography.primaryFont;

    // Prompt para Logo Principal
    const logoPrompt = `High-end professional logo design for a brand, following the concept: ${logoDescription}. ` +
        `Visual style: ${keywords}. Technical specs: Flat vector, minimalist execution, balanced proportions. ` +
        `Color palette: ${colors}. Typography inspiration: ${fontStyle}. ` +
        `Pure white background, high-resolution, sharp edges, no shadows, no realistic textures.`;

    // Prompt para Set de Iconos
    const iconSetPrompt = `A cohesive set of 6 professional functional icons for a digital brand interface. ` +
        `Style: ${iconography.style}, with ${iconography.stroke} stroke and ${iconography.cornerRadius} corner radius. ` +
        `Grid system: ${iconography.grid}. Visual consistency: ${keywords}. ` +
        `Colors used: ${colorSystem.primary} and ${colorSystem.secondary}. ` +
        `Arranged in a grid, isolated on a white background, consistent viewing angle, 2D vector style.`;

    // Prompt para Lámina de Estilo / Style Guide
    const styleGuidePrompt = `Professional brand style guide presentation board. ` +
        `Including: Primary logo, color swatches of ${colors}, typography samples of ${fontStyle}, and texture/mood inspiration. ` +
        `Overall mood: ${imageryMood}. Layout: Clean, editorial design, organized sections. ` +
        `High quality graphic design portfolio style, soft studio lighting, showcasing the brand visual identity system.`;

    return {
        conceptId,
        logoPrompt,
        iconSetPrompt,
        styleGuidePrompt
    };
};

module.exports = {
    generateVisualPrompts
};
