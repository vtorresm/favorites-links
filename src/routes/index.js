/**
 * Rutas Principales
 * @module routes/index
 * @description Rutas de la página de inicio
 */

import { Router } from 'express';

const router = Router();

/**
 * GET /
 * Página principal
 */
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Inicio',
        layout: 'main'
    });
});

export default router;
