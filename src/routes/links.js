/**
 * Rutas de Links
 * @module routes/links
 * @description Manejo de operaciones CRUD para favoritos/links
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const pool = require('../database');

/**
 * Validaciones para crear/editar un link
 */
const linkValidationRules = [
    body('title')
        .trim()
        .notEmpty().withMessage('El título es requerido')
        .isLength({ min: 3, max: 100 }).withMessage('El título debe tener entre 3 y 100 caracteres'),
    body('url')
        .trim()
        .notEmpty().withMessage('La URL es requerida')
        .isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('Debe ser una URL válida (http/https)'),
    body('description')
        .trim()
        .optional()
        .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres')
];

/**
 * Middleware para manejar errores de validación
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error_msg', errors.array().map(e => e.msg).join(', '));
        return res.redirect('back');
    }
    next();
};

/**
 * GET /links/add
 * Muestra el formulario para agregar un nuevo link
 */
router.get('/add', (req, res) => {
    res.render('links/add', {
        title: 'Agregar Link',
        layout: 'main'
    });
});

/**
 * POST /links/add
 * Crea un nuevo link en la base de datos
 */
router.post('/add', linkValidationRules, validate, async (req, res) => {
    try {
        const { title, url, description } = req.body;
        const newLink = {
            title: title.trim(),
            url: url.trim(),
            description: description ? description.trim() : ''
        };

        await pool.query('INSERT INTO links SET ?', [newLink]);
        req.flash('success_msg', 'Link agregado correctamente');
        res.redirect('/links');
    } catch (err) {
        console.error('Error al guardar link:', err);
        req.flash('error_msg', 'Error al guardar el link');
        res.redirect('/links/add');
    }
});

/**
 * GET /links
 * Lista todos los links almacenados
 */
router.get('/', async (req, res) => {
    try {
        const links = await pool.query('SELECT * FROM links ORDER BY created_at DESC');
        res.render('links/list', {
            title: 'Mis Links',
            layout: 'main',
            links
        });
    } catch (err) {
        console.error('Error al obtener links:', err);
        req.flash('error_msg', 'Error al cargar los links');
        res.render('links/list', {
            title: 'Mis Links',
            layout: 'main',
            links: []
        });
    }
});

/**
 * GET /links/delete/:id
 * Elimina un link por su ID
 */
router.get('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM links WHERE id = ?', [id]);
        req.flash('success_msg', 'Link eliminado correctamente');
        res.redirect('/links');
    } catch (err) {
        console.error('Error al eliminar link:', err);
        req.flash('error_msg', 'Error al eliminar el link');
        res.redirect('/links');
    }
});

/**
 * GET /links/edit/:id
 * Muestra el formulario para editar un link
 */
router.get('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);

        if (links.length === 0) {
            req.flash('error_msg', 'Link no encontrado');
            return res.redirect('/links');
        }

        res.render('links/edit', {
            title: 'Editar Link',
            layout: 'main',
            link: links[0]
        });
    } catch (err) {
        console.error('Error al obtener link para editar:', err);
        req.flash('error_msg', 'Error al cargar el link');
        res.redirect('/links');
    }
});

/**
 * POST /links/edit/:id
 * Actualiza un link existente
 */
router.post('/edit/:id', linkValidationRules, validate, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, url, description } = req.body;

        const updatedLink = {
            title: title.trim(),
            url: url.trim(),
            description: description ? description.trim() : ''
        };

        await pool.query('UPDATE links SET ? WHERE id = ?', [updatedLink, id]);
        req.flash('success_msg', 'Link actualizado correctamente');
        res.redirect('/links');
    } catch (err) {
        console.error('Error al actualizar link:', err);
        req.flash('error_msg', 'Error al actualizar el link');
        res.redirect(`/links/edit/${req.params.id}`);
    }
});

module.exports = router;
