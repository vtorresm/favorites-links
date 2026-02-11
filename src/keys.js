/**
 * Configuración del proyecto
 * @module keys
 */

// Cargar variables de entorno
require('dotenv').config();

/**
 * Configuración de base de datos y servidor
 * Lee valores de process.env con valores por defecto para desarrollo
 */
module.exports = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'db_links'
    },
    server: {
        port: parseInt(process.env.PORT, 10) || 4000,
        env: process.env.NODE_ENV || 'development'
    },
    session: {
        secret: process.env.SESSION_SECRET || 'development_secret_change_in_production'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'jwt_secret_change_in_production'
    }
};
