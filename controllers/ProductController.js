const Order = require('../models/Order');
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

exports.addProduct = async (req, res, next) => {
    try {
        const { name, description, price, discount_rate, stock_quantity, image, category, rating, reviews } = req.body;
        const newProduct = await Product.addProduct({ name, description, price, discount_rate, stock_quantity, image, category, rating, reviews });
        req.flash('success_msg', 'Product Added Successfully');
        res.redirect('/products');
    } catch (error) {
        next(error);
    }
};


exports.updateProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const { name, description, price, discount_rate, stock_quantity, image, category, rating, reviews } = req.body;

        await Product.updateProduct({ productId, name, description, price, discount_rate, stock_quantity, image, category, rating, reviews });

        res.status(200).json({ message: 'Product Updated Successfully' });
    } catch (error) {
        next(error);
    }
};



exports.getProductById = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await Product.getProductDetails(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        next(error); 
    }
};



exports.deleteProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        await Product.deleteProduct(productId);
        req.flash('success_msg', 'Product Deleted Successfully');
        res.redirect('/products');
    } catch (error) {
        next(error);
    }
};



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