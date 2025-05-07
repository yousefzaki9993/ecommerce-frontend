const Product = require('../models/Product');

// For API usage
exports.apiGetProducts = async (req, res) => {
    const products = await Product.getAllProducts();
    res.json(products);
};

exports.apiGetRelatedProducts = async (req, res) => {
    const products = await Product.getRelatedProducts(req.params.id);
    res.json(products);
}

exports.apiGetRelatedReviews = async (req, res) => {
    const reviews = await Product.getRelatedReviews(req.params.id);
    res.json(reviews);
}

// For rendering view
exports.renderProducts = (req, res, next) => {
    try {
        res.render('products');
    } catch (error) {
        next(error);
    }
};

exports.renderProductsDetails = async (req, res, next) => {
    try {
        const product = await Product.getProductDetails(req.params.id);
        res.render('product-detail', { product: product });
    } catch (error) {
        next(error);
    }
}

//For Logic
exports.addReview = async (req, res, next) => {
    try {
        const { productId, userId, rating, title, review } = req.body;
        await Product.addReview({ productId, userId, rating, title, review });
        req.flash('success_msg', 'Added Review Successfully');
        res.redirect('/products/' + productId);
        return;
    } catch (error) {
        next(error);
    }
}