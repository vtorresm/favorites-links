/**
 * Rutas de Autenticación
 * @module routes/authentication
 * @description Manejo de registro, login y logout con Passport.js
 */

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import pool from '../database.js';
import config from '../keys.js';

const router = Router();

/**
 * Validaciones para registro de usuario
 */
const registerValidationRules = [
    body('username')
        .trim()
        .notEmpty().withMessage('El nombre de usuario es requerido')
        .isAlphanumeric().withMessage('Solo letras y números')
        .isLength({ min: 3, max: 20 }).withMessage('Debe tener entre 3 y 20 caracteres'),
    body('password')
        .trim()
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('confirm_password')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        })
];

/**
 * Validaciones para login
 */
const loginValidationRules = [
    body('username')
        .trim()
        .notEmpty().withMessage('El nombre de usuario es requerido'),
    body('password')
        .trim()
        .notEmpty().withMessage('La contraseña es requerida')
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

// Passport Configuration

/**
 * Serialización de usuario (guardar ID en sesión)
 */
passport.serializeUser((user, done) => {
    done(null, user.id);
});

/**
 * Deserialización de usuario (obtener usuario de la sesión)
 */
passport.deserializeUser(async (id, done) => {
    try {
        const users = await pool.query('SELECT id, username FROM users WHERE id = ?', [id]);
        done(null, users[0]);
    } catch (err) {
        done(err, null);
    }
});

/**
 * Estrategia Local de Passport para autenticación
 */
passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },
    async (username, password, done) => {
        try {
            // Buscar usuario
            const users = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

            if (users.length === 0) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }

            const user = users[0];

            // Verificar contraseña
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// Routes

/**
 * GET /auth/register
 * Muestra el formulario de registro
 */
router.get('/register', (req, res) => {
    res.render('auth/register', {
        title: 'Registrarse',
        layout: 'main'
    });
});

/**
 * POST /auth/register
 * Crea un nuevo usuario
 */
router.post('/register', registerValidationRules, validate, async (req, res) => {
    try {
        const { username, password } = req.body;

        // Verificar si usuario ya existe
        const existingUser = await pool.query('SELECT id FROM users WHERE username = ?', [username]);

        if (existingUser.length > 0) {
            req.flash('error_msg', 'El nombre de usuario ya está en uso');
            return res.redirect('/auth/register');
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear usuario
        await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        req.flash('success_msg', 'Usuario registrado correctamente. Por favor inicia sesión.');
        res.redirect('/auth/login');
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        req.flash('error_msg', 'Error al registrar el usuario');
        res.redirect('/auth/register');
    }
});

/**
 * GET /auth/login
 * Muestra el formulario de login
 */
router.get('/login', (req, res) => {
    res.render('auth/login', {
        title: 'Iniciar Sesión',
        layout: 'main'
    });
});

/**
 * POST /auth/login
 * Autentica al usuario
 */
router.post('/login', loginValidationRules, validate, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/links',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});

/**
 * GET /auth/logout
 * Cierra la sesión del usuario
 */
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success_msg', 'Sesión cerrada correctamente');
        res.redirect('/auth/login');
    });
});

export default router;
