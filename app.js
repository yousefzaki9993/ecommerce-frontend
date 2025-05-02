require('dotenv').config();
const express = require('express');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRouter');
const app = express();

// register view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`Recieved a ${req.method} request to ${req.url}`);
    next();
})

// Routes
app.use('/products', productRoutes);
app.use('/user', userRoutes);
//app.use('/orders', orderRoutes);

app.get('/', async (req, res) => {
    res.render('index');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});