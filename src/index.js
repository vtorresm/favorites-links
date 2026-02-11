/**
 * Favorites Links - Servidor Principal
 * @module index.js
 * @description Punto de entrada de la aplicación Express con configuraciones de seguridad
 */

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');

// Configuración
const { server, session: sessionConfig } = require('./keys');

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
app.set('port', server.port);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Security Middlewares
app.use(helmet()); // Headers seguros
app.use(limiter); // Rate limiting

// Development logging
if (server.env === 'development') {
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
}, require('./database'));

app.use(session({
    secret: sessionConfig.secret,
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    saveUninitialized: false,
    cookie: {
        secure: server.env === 'production', // Solo HTTPS en producción
        httpOnly: true, // Previene XSS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Flash messages
const flash = require('connect-flash');
app.use(flash());

// Passport Initialization
const passport = require('passport');
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
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));

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

    if (server.env === 'development') {
        res.status(500).json({
            error: true,
            message: err.message,
            stack: err.stack
        });
    } else {
        res.status(500).render('500', {
            title: 'Error del servidor',
            layout: 'main',
            error: server.env === 'production' ? 'Ocurrió un error interno' : err.message
        });
    }
});

// Starting the server
app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')} in ${server.env} mode`);
});

module.exports = app;
