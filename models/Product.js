const mongoose = require("mongoose");
const Joi = require("joi");

const validateProduct = async (product) => {
    const schema = Joi.object({
        title: Joi.string().min(2).max(255).required(),
        desc: Joi.string().min(2).max(255),
        img: Joi.string().uri().optional(),
        categories: Joi.array().optional(),
        size: Joi.string().optional(),
        color: Joi.string().optional(),
        price: Joi.number().min(0).default(0).required(),
        isComposite: Joi.boolean().required(),
        components: Joi.array()
            .items(
                Joi.object({
                    title: Joi.string().min(2).max(255).required(),
                    desc: Joi.string().min(2).max(255),
                    img: Joi.string().uri().optional(),
                    newPrice: Joi.number().min(0).optional(),
                    minRequired: Joi.number().min(0).optional(),
                    maxRequired: Joi.number().min(0).optional(),
                    sources: Joi.array().optional(),
                })
            )
            .allow(null)
            .required(),
    });

    return await schema.validateAsync(product);
};

const ComponentSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: false },
        desc: { type: String, required: true },
        img: { type: String },
        newPrice: { type: Number },
        minRequired: { type: Number, default: 1, min: 0 },
        maxRequired: { type: Number, default: 1, min: 1 },
        sources: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
            },
        ],
    },
    { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        desc: { type: String, required: true },
        img: { type: String, required: true },
        categories: { type: Array },
        size: { type: String },
        color: { type: String },
        price: { type: Number, required: true },
        isComposite: { type: Boolean, default: false },
        components: {
            // type: Array,
            type: [ComponentSchema],
            required: function () {
                return this.isComposite;
            },
            validate: {
                validator: function (value) {
                    if (
                        (this.isComposite && value && value.length > 0) ||
                        (this.isComposite == false && value == null)
                    )
                        return true;
                    else {
                        return false;
                    }
                },
                message: "Wrong combinaison",
            },
        },
    },
    { timestamps: true }
);

module.exports.validate = validateProduct;
module.exports.Product = mongoose.model("products", ProductSchema);
