/**
 * Handlebars Helpers
 * @module lib/handlebars
 * @description Funciones helper para las plantillas Handlebars
 */

import { format } from 'timeago.js';

/**
 * Helper para formatear timestamps a tiempo relativo
 * @param {Date|string} timestamp - Fecha a formatear
 * @returns {string} Tiempo relativo formateado
 */
export const timeago = (timestamp) => {
    return format(timestamp);
};

export default {
    timeago
};
