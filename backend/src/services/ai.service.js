/**
 * Servicio simulado de IA para generación de branding
 * En etapas posteriores, esto conectará con el API de Gemini o OpenAI
 */

/**
 * Genera una lista de 5 conceptos de branding basados en el prompt
 * @param {string} userPrompt - El texto ingresado por el usuario
 * @returns {Promise<Array>} - Un array con 5 objetos de concepto
 */
const generateBrandingConcepts = async (userPrompt) => {
    // Simulamos un retraso de procesamiento de IA (1.5 segundos)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Datos simulados (Mock)
    return [
        {
            id: "CONCEPT_01",
            name: "Esencia Minimalista",
            description: "Una propuesta basada en la limpieza visual y la simplicidad estructural, ideal para marcas que buscan transparencia y modernidad.",
            personality: ["Sofisticado", "Analítico", "Directo"],
            targetAudience: "Nativos digitales que valoran el minimalismo y la eficiencia.",
            tone: "Corporativo pero accesible"
        },
        {
            id: "CONCEPT_02",
            name: "Eco-Vibrante",
            description: "Enfoque centrado en la sostenibilidad con una paleta de colores orgánica pero energética.",
            personality: ["Empático", "Activista", "Alegre"],
            targetAudience: "Consumidores conscientes del medio ambiente y jóvenes emprendedores.",
            tone: "Inspirador y natural"
        },
        {
            id: "CONCEPT_03",
            name: "Neo-Futurismo",
            description: "Concepto disruptivo que utiliza elementos tecnológicos y contrastes altos para destacar en mercados saturados.",
            personality: ["Audaz", "Innovador", "Frío"],
            targetAudience: "Early adopters de tecnología y sector gaming o cripto.",
            tone: "Vanguardista y técnico"
        },
        {
            id: "CONCEPT_04",
            name: "Legado Atemporal",
            description: "Rescate de valores tradicionales con una ejecución moderna. Tipografías serif y colores sobrios.",
            personality: ["Sabio", "Confiable", "Elegante"],
            targetAudience: "Sector lujo, consultoría senior o marcas con historia.",
            tone: "Autoritario y distinguido"
        },
        {
            id: "CONCEPT_05",
            name: "Cercanía Urbana",
            description: "Diseño dinámico inspirado en la vida de ciudad, con texturas y tipografías 'bold'.",
            personality: ["Social", "Rápido", "Inclusivo"],
            targetAudience: "Comunidad urbana local y marcas de retail masivo.",
            tone: "Coloquial y enérgico"
        }
    ];
};

module.exports = {
    generateBrandingConcepts
};
