const { Product, validate } = require("../models/Product");

const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const router = require("express").Router();

//CREATE
router.post("/", async (req, res) => {
    try {
        const result = await validate(req.body);

        console.log(result);

        if (result.error) return res.status(400).json(result.error);

        const newProduct = new Product(result);

        if (newProduct.isComposite == true) {
            await newProduct.components.forEach((component) => {
                if (component.sources.length < 1 || !component.sources) {
                    return res
                        .status(500)
                        .json("ssource has to contains OID of product");
                } else {
                    component.sources.forEach((source) => {
                        Product.findOne(
                            {
                                _id: source,
                            },
                            (error, result) => {
                                if (error) return res.status(500).json(err);
                                // throw new Error(
                                //     `Product with _id ${source} must exist`
                                // );
                            }
                        );
                    });
                }
            });
            const savedProduct = await newProduct.save();
            return res.status(200).json(savedProduct);
        } else {
            const savedProduct = await newProduct.save();
            return res.status(200).json(savedProduct);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:id", async (req, res) => {
    try {
        const result = await validate(req.body);

        console.log(result);

        if (result.error) return res.status(400).json(result.error);

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: result,
            },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            `components.sources`
        );
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find().populate(`components.sources`);
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
