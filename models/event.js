const mongoose = require("mongoose");

const eventShema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
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
