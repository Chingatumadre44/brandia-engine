require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testImagen() {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'tu_clave_gemini_aqui') {
        console.error('❌ ERROR: API Key no configurada o es el valor por defecto.');
        process.exit(1);
    }

    console.log('--- DIAGNÓSTICO GEMINI IMAGEN 3 ---');
    console.log('Versión SDK:', require('@google/generative-ai/package.json').version);

    const genAI = new GoogleGenerativeAI(key);

    try {
        console.log('1. Probando conexión básica (gemini-1.5-flash)...');
        const textModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const textResult = await textModel.generateContent("Hola, responde 'OK' si recibes esto.");
        console.log('   Respuesta:', textResult.response.text());
        console.log('   ✅ Conexión básica exitosa.');
    } catch (e) {
        console.error('   ❌ Error en conexión básica:', e.message);
    }

    try {
        console.log('2. Listando modelos disponibles...');
        const models = await genAI.listModels();
        const modelNames = models.models.map(m => m.name);
        console.log('   Modelos encontrados:', modelNames.join(', '));

        const hasImagen = modelNames.some(m => m.includes('imagen'));
        console.log('   ¿Imagen detectado?:', hasImagen ? 'SÍ' : 'NO');
    } catch (e) {
        console.error('   ❌ Error listando modelos:', e.message);
    }

    try {
        console.log('3. Probando Imagen 3 (imagen-3.0-generate-001)...');
        const imageModel = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });

        // Prompt minimal
        const prompt = "A simple blue circle on a white background.";
        console.log('   Intentando generar imagen...');

        const result = await imageModel.generateContent(prompt);
        const response = await result.response;

        const candidate = response.candidates[0];
        if (candidate && candidate.content && candidate.content.parts) {
            const part = candidate.content.parts[0];
            if (part.inlineData) {
                console.log('   ✅ Imagen generada exitosamente (Base64 detectado).');
            } else {
                console.warn('   ⚠️ Respuesta recibida pero sin datos de imagen.');
                console.log('   Partes detectadas:', JSON.stringify(candidate.content.parts, null, 2));
            }
        } else {
            console.error('   ❌ Respuesta vacía o malformada.');
            console.log('   Response Raw:', JSON.stringify(response, null, 2));
        }
    } catch (e) {
        console.error('   ❌ Error en Imagen 3:', e.message);
        if (e.message.includes('404')) {
            console.error('   💡 Posible causa: El modelo "imagen-3.0-generate-001" no está disponible para esta API Key o región.');
        } else if (e.message.includes('403')) {
            console.error('   💡 Posible causa: La API Key no tiene permisos para Imagen 3 (requiere suscripción o habilitar el servicio).');
        } else if (e.message.includes('400')) {
            console.error('   💡 Posible causa: Prompt no válido o parámetros incorrectos.');
        }
    }
}

testImagen();
