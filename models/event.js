const mongoose = require("mongoose");

const eventShema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },

        msg: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            enum: ["NEW", "PROMO", "SALE"],
            default: "PROMO",
        },

        reduction: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 100,
        },
        //les types sont String Number Object Boolean

        startDate: {
            type: Date,
            default: Date.now(),
        },

        endDate: {
            type: Date,
            default: Date.now(),
        },

        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const event = new mongoose.model("event", eventShema);

module.exports = event;
