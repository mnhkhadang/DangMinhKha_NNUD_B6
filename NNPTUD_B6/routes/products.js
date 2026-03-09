// routes/products.js
var express = require('express');
var router = express.Router();
let productController = require('../controllers/products'); // ← import controller
let { checkLogin, checkRole } = require('../utils/authHandler');

router.get('/', async function (req, res, next) {
    try {
        let products = await productController.getAllProducts();
        res.send(products);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        let product = await productController.getProductById(req.params.id);
        if (!product) return res.status(404).send({ message: "id not found" });
        res.send(product);
    } catch (error) {
        res.status(404).send({ message: "id not found" });
    }
});

router.post('/', checkLogin, checkRole("mod", "ADMIN"), async function (req, res, next) {
    try {
        let { title, price, description, images } = req.body;
        let product = await productController.createProduct(title, price, description, images);
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.put('/:id', checkLogin, checkRole("mod", "ADMIN"), async function (req, res, next) {
    try {
        let product = await productController.updateProduct(req.params.id, req.body);
        if (!product) return res.status(404).send({ message: "id not found" });
        res.send(product);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.delete('/:id', checkLogin, checkRole("ADMIN"), async function (req, res, next) {
    try {
        let product = await productController.deleteProduct(req.params.id);
        if (!product) return res.status(404).send({ message: "id not found" });
        res.send(product);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router; 