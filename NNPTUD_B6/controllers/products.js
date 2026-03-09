// controllers/products.js
let productModel = require("../schemas/products");
let { ConvertTitleToSlug } = require('../utils/titleHandler');

module.exports = {
    getAllProducts: async function () {
        return await productModel.find({ isDeleted: false });
    },

    getProductById: async function (id) {
        return await productModel.findOne({ _id: id, isDeleted: false });
    },

    createProduct: async function (title, price, description, images) {
        let newItem = new productModel({
            title,
            slug: ConvertTitleToSlug(title),
            price,
            description,
            images
        });
        await newItem.save();
        return newItem;
    },

    updateProduct: async function (id, updateData) {
        if (updateData.title) {
            updateData.slug = ConvertTitleToSlug(updateData.title);
        }
        return await productModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: updateData },
            { new: true }
        );
    },

    deleteProduct: async function (id) {
        return await productModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: { isDeleted: true } },
            { new: true }
        );
    }
};
