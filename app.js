require('dotenv').config();
const session = require('express-session');
const express = require('express');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/AdminRoutes');
const promoRoutes = require('./routes/promoRoutes')
const app = express();

// register view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
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

app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.path}`);
  next();
});

// Routes
app.use('/products', productRoutes);
app.use('/user', userRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);
app.use('/admin', adminRoutes);
app.use('/promo', promoRoutes);


app.get('/', async (req, res, next) => {
    try {
        console.log('hello');
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
