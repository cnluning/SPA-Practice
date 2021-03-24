const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Customer = require("../models/customer");
const Pizza = require("../models/pizza");

// Order routes to demonstrate relationships
router.post("/", (req, res) => {
  const newOrder = new Order.model({});

  const customer = new Customer.model(req.body.customer);
  customer.save();

  const pizzaIds = req.body.pizzas.map((pizza) => {
    const newPizza = new Pizza.model({ ...pizza, order: newOrder._id });
    newPizza.save();
    return newPizza._id;
  });

  newOrder.pizzas = pizzaIds;
  newOrder.customer = customer._id;
  newOrder.notes = req.body.notes;

  newOrder.save((error, data) => {
    return error ? res.sendStatus(500).json(error) : res.json(data);
  });
});

router.get("/:id", (request, response) => {
  // Request parameters (params) are defined in the route, queryParams are provided after the url behind a ? and & in key=value pairs
  const params = request.params;
  const query = request.query;
  if (query.hasOwnProperty("raw") && query.raw === "true") {
    Order.model.findById(params.id, (error, data) => {
      return error ? response.sendStatus(500).json(error) : response.json(data);
    });
  } else {
    Order.model
      .findById(params.id)
      .populate("customer")
      .populate("pizzas")
      .exec((error, data) => {
        return error
          ? response.sendStatus(500).json(error)
          : response.json(data);
      });
  }
});

router.get("/", (request, response) => {
  const query = request.query;
  if (query.hasOwnProperty("raw") && query.raw === "true") {
    Order.model.find({}, (error, data) => {
      return error ? response.sendStatus(500).json(error) : response.json(data);
    });
  } else {
    Order.model
      .find({})
      .populate("customer")
      .populate("pizzas")
      .exec((error, data) => {
        return error
          ? response.sendStatus(500).json(error)
          : response.json(data);
      });
  }
});

router.put("/:id", (request, response) => {
  const data = request.body;
  Order.model.findByIdAndUpdate(
    request.params.id,
    {
      $set: {
        delivery: data.delivery,
        notes: data.notes,
      },
    },
    (error, data) => {
      data.pizzas.forEach((pizza) => {
        Pizza.model.findByIdAndUpdate(
          pizza._id,
          {
            $setOnInsert: {
              crust: pizza.crust,
              cheese: pizza.cheese,
              sauce: pizza.sauce,
              toppings: pizza.toppings,
              order: pizza.order,
            },
          },
          { upsert: true, new: true },
          (error) => {
            return response.sendStatus(500).json(error);
          }
        );
      });

      return error ? response.sendStatus(500).json(error) : res.json(data);
    }
  );
});

router.delete("/:id", (request, response) => {
  Order.model.findByIdAndDelete(request.params.id, {}, (error, data) => {
    if (error) response.sendStatus(500).json(error);

    Pizza.model
      .deleteMany()
      .where("_id")
      .in(data.pizzas)
      .exec((error) => {
        if (error) return response.sendStatus(500).json(error);
      });

    Customer.model.findByIdAndRemove(data.customer, (error) => {
      if (error) return response.sendStatus(500).json(error);
    });

    return response.json(data);
  });
});

module.exports = router;
