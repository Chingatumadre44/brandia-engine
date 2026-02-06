const express = require('express');
const cors = require('cors');
const brandRoutes = require('./routes/brand.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Permite servir imágenes desde la carpeta public

// Rutas
app.use('/api/brand', brandRoutes);

// Ruta de salud básica
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'BrandIA Engine API' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Algo salió mal en el servidor',
        message: err.message
    });
});

module.exports = app;
