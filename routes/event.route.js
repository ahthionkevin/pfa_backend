const router = require("express").Router();

const event = require("../models/event");

const events = [
    {
        id: 1,
        name: "Black Friday",
        startDate: "2021-11-25",
        endDate: "2021-11-25",
    },
    {
        id: 2,
        name: "Noel",
        startDate: "2021-12-05",
        endDate: "2022-01-01",
    },
    {
        id: 3,
        name: "Aid-El-Fitr",
        startDate: "2022-04-23",
        endDate: "2022-05-05",
    },
    {
        id: 4,
        name: "Aid-El-Kbir",
        startDate: "2022-06-15",
        endDate: "2022-07-12",
    },
    {
        id: 5,
        name: "Achoura",
        startDate: "2022-07-20",
        endDate: "2022-08-10",
    },
];

//All events with products

router.get("/", async function (req, res) {
    const events = await event.find().populate("products");
    return res.status(200).json(events);
    // return res.send(await event.find({ id: req.params.id })); //type
});

//creer un event

router.post("/", async function (req, res) {
    console.log(req.body);
    const newEvent = {
        id: events.length + 1,
        name: req.body.name,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        products: req.body.products,
        reduction: req.body.reduction,
        type: req.body.type,
        msg: req.body.msg,
    };
    //product.push(newProduit);

    const theEvent = await event.create(newEvent);

    return res.send(theEvent);
});

//trouver l'evenement souhaite

router.get("/wantedEvent", async function (req, res) {
    return res.send(
        await event
            .find({
                startDate: {
                    $lte: Date.now(),
                },
                endDate: {
                    $gte: Date.now(),
                },
            })
            .populate("products")
    );
});

router.get("/:id", async function (req, res) {
    return res.send(
        await event
            .findOne({
                _id: req.params.id,
            })
            .populate("products")
    );
});

//modifier event

router.put("/:id", async function (req, res) {
    /* var temp = {
    name: req.sanitize('name').escape().trim()
   
} */
    // const updatedEvent = new event({
    //     // id: req.params.id,
    //     name: req.body.name,
    //     startDate: req.body.startDate,
    //     endDate: req.body.endDate,
    //     products: req.body.products,
    // });
    // await event
    //     .updateOne({ _id: req.params.id }, updatedEvent)
    //     .then(() => {
    //         res.status(201).json({
    //             message: "Event updated successfully!",
    //         });
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         res.status(400).json({
    //             error: error,
    //         });
    //     });

    await event.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            startDate: new Date(req.body.startDate).toLocaleDateString(),
            endDate: new Date(req.body.endDate).toLocaleDateString(),
            products: req.body.products,
            reduction: req.body.reduction,
            type: req.body.type,
            msg: req.body.msg,
        },
        { new: true },
        (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    error: err,
                });
            }

            return res.status(200).json(doc);
        }
    );
});

router.delete("/:id", async function (req, res) {
    event
        .deleteOne({ id: req.params.id })
        .then(() => {
            res.status(200).json({
                message: "Event Deleted!",
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
});

module.exports = router;
