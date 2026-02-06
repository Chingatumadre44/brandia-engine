require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 BrandIA Engine v8 Backend Corriendo`);
    console.log(`📍 Puerto: ${PORT}`);
    console.log(`🔗 Endpoint: http://localhost:${PORT}/api/brand/strategy`);

    // Validación de API Key en el arranque
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'tu_clave_gemini_aqui') {
        console.warn(`\n⚠️  [ADVERTENCIA]: GEMINI_API_KEY no detectada o es el valor por defecto.`);
        console.warn(`   Configure su clave real en el archivo .env para habilitar la IA.\n`);
    } else {
        console.log(`✅ GEMINI_API_KEY detectada correctamente.`);
    }

    console.log(`=========================================`);
});
