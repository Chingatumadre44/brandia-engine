/**
 * Servicio simulado de Dirección de Arte
 * En la versión 9 del BrandIA Engine, este servicio traduce un concepto estratégico
 * en una serie de reglas visuales estandarizadas.
 */

/**
 * Genera una dirección de arte basada en un concepto de marca
 * @param {Object} concept - El objeto del concepto estratégico (id, name, personality, etc.)
 * @returns {Promise<Object>} - El JSON con las reglas visuales
 */
const generateVisualRules = async (concept) => {
    // Simulamos procesamiento de IA
    await new Promise(resolve => setTimeout(resolve, 1200));

    const { id, personality = [] } = concept;

    // Lógica de "Director de Arte" para derivar estilos según la personalidad
    const isMinimalist = personality.includes('Sofisticado') || personality.includes('Directo');
    const isEco = personality.includes('Empático') || personality.includes('Inspirador');
    const isFuturistic = personality.includes('Audaz') || personality.includes('Neo-Futurismo');

    return {
        conceptId: id,
        styleKeywords: isMinimalist
            ? ["Clean", "Premium", "Structured", "Negative Space"]
            : isEco ? ["Organic", "Soft", "Textured", "Hand-drawn"]
                : ["Sharp", "Glow", "Dynamic", "Synthetic"],

        logoDescription: `Un logotipo que refleja el concepto "${concept.name}" mediante el uso de formas ${isMinimalist ? 'geométricas puras' : isEco ? 'fluidas y naturales' : 'angulares y dinámicas'}.`,

        colorSystem: {
            primary: isMinimalist ? "#000000" : isEco ? "#2D5A27" : "#6200EE",
            secondary: isMinimalist ? "#FFFFFF" : isEco ? "#F5F5DC" : "#03DAC6",
            accent: isMinimalist ? "#D4AF37" : isEco ? "#8B4513" : "#CF6679",
            supporting: isMinimalist
                ? ["#F0F0F0", "#A0A0A0"]
                : isEco ? ["#E9EDC9", "#CCD5AE"]
                    : ["#121212", "#1F1B24"]
        },

        typography: {
            primaryFont: isMinimalist ? "Inter Tight" : isEco ? "Outfit" : "JetBrains Mono",
            secondaryFont: "Roboto"
        },

        iconography: {
            style: isMinimalist ? "Minimalist Line" : isEco ? "Organic Fill" : "Cyberpunk Outline",
            stroke: isMinimalist ? "Thin" : "Regular",
            cornerRadius: isMinimalist ? "0px" : isEco ? "12px" : "2px",
            grid: "8px layout"
        },

        imageryMood: isMinimalist
            ? "Studio photography, high contrast, clean backgrounds"
            : isEco ? "Natural light, macro textures, forest/earthy environments"
                : "Cyan/Magenta lighting, neon streaks, motion blur"
    };
};

module.exports = {
    generateVisualRules
};
