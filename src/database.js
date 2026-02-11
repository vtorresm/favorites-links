/**
 * Conexión a Base de Datos MySQL
 * @module database
 * @description Manejo de pool de conexiones con promisify y manejo de errores
 */

import mysql from 'mysql';
import { promisify } from 'util';
import config from './keys.js';

/**
 * Crear pool de conexiones
 */
const pool = mysql.createPool(config.database);

/**
 * Manejo de errores de conexión
 */
pool.getConnection((err, connection) => {
    if (err) {
        let errorMessage = 'Error de conexión a la base de datos';

        switch (err.code) {
            case 'PROTOCOL_CONNECTION_LOST':
                errorMessage = 'La conexión con la base de datos se cerró';
                break;
            case 'ER_CON_COUNT_ERROR':
                errorMessage = 'Demasiadas conexiones abiertas';
                break;
            case 'ECONNREFUSED':
                errorMessage = 'Conexión rechazada. Verifica las credenciales';
                break;
            case 'ENOTFOUND':
                errorMessage = 'Host no encontrado. Verifica la configuración';
                break;
            default:
                errorMessage = err.message;
        }

        console.error('❌ Database Error:', errorMessage);
        console.error('Code:', err.code);
    }

    if (connection) {
        connection.release();
        console.log('✅ Database connected successfully');
    }
});

// Promisify pool query methods for async/await usage
pool.query = promisify(pool.query);

/**
 * Execute a query with parameters (prevents SQL injection)
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
export const execute = async (sql, params) => {
    return await pool.query(sql, params);
};

export default pool;
