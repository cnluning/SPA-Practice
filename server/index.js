const { request } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const pizzas = require("./routers/pizzas");
const users = require("./routers/users");
const orders = require("./routers/orders");

const app = express();

// Middleware
const logging = (request, response, next) => {
  console.log(`${request.method} ${request.url} ${Date.now()}`);
  next();
};

app.use(express.json());
app.use(logging);
app.use("/pizzas", pizzas);
app.use("/users", users);
app.use("/orders", orders);

// Database stuff
mongoose.connect("mongodb://localhost/pizza");
const db = mongoose.connection;

let db_status = "MongoDB connection not successful.";

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => (db_status = "Successfully opened connection to Mongo!"));

const burritoSchema = new mongoose.Schema({
  size: String,
  meat: String,
  beans: Boolean,
  heat: String,
});

const Burrito = mongoose.model("Burrito", burritoSchema);

app.post("/burritos", (request, response) => {
  const newBurrito = new Burrito(request.body);
  newBurrito.save((err, burrito) => {
    return err ? response.sendStatus(500).json(err) : response.json(burrito);
  });
});

app.get("/burritos", (request, response) => {
  Burrito.find({}, (error, data) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(data);
  });
});

app.get("/burritos/:id", (request, response) => {
  Burrito.findById(request.params.id, (error, data) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(data);
  });
});

app.delete("/burritos/:id", (request, response) => {
  Burrito.findByIdAndRemove(request.params.id, {}, (error, data) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(data);
  });
});

app.put("/burritos/:id", (request, response) => {
  const body = request.body;
  Burrito.findByIdAndUpdate(
    request.params.id,
    {
      $set: {
        size: body.size,
        meat: body.meat,
        beans: body.beans,
        heat: body.heat,
      },
    },
    (error, data) => {
      if (error) return response.sendStatus(500).json(error);
      return response.json(request.body);
    }
  );
});

app.route("/").get((request, response) => {
  response.send("HELLO WORLD");
});

app.get("/status", (request, response) => {
  response.send(JSON.stringify({ message: "Service running ok" }));
});

app
  .route("/posts")
  .get((request, response) => {
    // express adds a "params" Object to requests
    const id = request.params.id;
    let data = "The ID equals " + id;
    // handle GET request for post with an id of "id"
    if (request.query) {
      if (request.query.type) {
        if (request.query.type === "json") {
          data = { id: request.params.id, q: request.query };
        }
      }
    }
    response.status(418).json(data);
  })
  .post((request, response) => {
    response.json(request);
  });

const PORT = process.env.PORT || 4040;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
