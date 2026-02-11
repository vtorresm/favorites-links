/**
 * Favorites Links - Servidor Principal
 * @module index.js
 * @description Punto de entrada de la aplicación Express con configuraciones de seguridad
 */

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import { fileURLToPath } from 'url';

// Configuración
import config from './keys.js';

// Directory setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initializations
const app = express();

/**
 * Configuración de Rate Limiting
 * Previene ataques de fuerza bruta limitando solicitudes por IP
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 solicitudes por ventana
    message: {
        error: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo después de 15 minutos'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Settings
app.set('port', config.server.port);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: import('./lib/handlebars.js')
}));
app.set('view engine', '.hbs');

// Security Middlewares
app.use(helmet()); // Headers seguros
app.use(limiter); // Rate limiting

// Development logging
if (config.server.env === 'development') {
    app.use(morgan('dev'));
}

// Body parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Session configuration
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_links'
}, (await import('./database.js')).default);

app.use(session({
    secret: config.session.secret,
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    cookie: {
        secure: config.server.env === 'production', // Solo HTTPS en producción
        httpOnly: true, // Previene XSS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Flash messages
import flash from 'connect-flash';
app.use(flash());

// Passport Initialization
import passport from 'passport';
app.use(passport.initialize());
app.use(passport.session());

// Global Variables para vistas
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Routes
app.use((await import('./routes/index.js')).default);
app.use((await import('./routes/authentication.js')).default);
app.use('/links', (await import('./routes/links.js')).default);

// 404 Handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Página no encontrada',
        layout: 'main'
    });
});

// Error Handler Global
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);

    if (config.server.env === 'development') {
        res.status(500).json({
            error: true,
            message: err.message,
            stack: err.stack
        });
    } else {
        res.status(500).render('500', {
            title: 'Error del servidor',
            layout: 'main',
            error: config.server.env === 'production' ? 'Ocurrió un error interno' : err.message
        });
    }
});

// Starting the server
app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')} in ${config.server.env} mode`);
});

export default app;
