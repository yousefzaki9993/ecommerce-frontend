require('dotenv').config();
const session = require('express-session');
const express = require('express');
const flash = require('connect-flash');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();

// register view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    resave: false,
    secret: 'secret',
    saveUninitialized: true,
    cookie: { secure: false },
}));
app.use(flash());
app.use((req, res, next) => {
    console.log(`Recieved a ${req.method} request to ${req.url}`);
    next();
})
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

// Routes
app.use('/products', productRoutes);
app.use('/user', userRoutes);
//app.use('/orders', orderRoutes);

app.get('/', async (req, res, next) => {
    try {
        res.render('index');
    } catch (error) {
        next(error);
    }
});

app.use((req, res, next) => {
    const error = new Error('Page Not Found');
    error.status = 404;
    next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});