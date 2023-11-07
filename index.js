const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.POST || 3737;
const userdb = process.env.USER_DB;
const passdb = process.env.PASS_DB;
const secretToken = process.env.TOKEN;

// Middle were
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

const uri = `mongodb+srv://${userdb}:${passdb}@cluster0.yhpfxjc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection = client.db("toursDB").collection("services");
    const bookCollection = client.db("toursDB").collection("bookings");
    // Jwt
    app.post("/api/v1/jwt", (req, res) => {
      const email = req.body;
      const token = jwt.sign(email, secretToken, { expiresIn: "1h" });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .send({ message: "Success" });
    });
    app.post("/api/v1/logout", (req, res) => {
      res.clearCookie("token", { maxAge: 0 }).send({ success: true });
    });

    // Find One For Update
    app.get("/api/v1/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });
    //  Update service
    app.patch("/api/v1/update-service/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateData = {
        $set: {
          address: data.address,
          pdes: data.pdes,
          sname: data.sname,
          price: data.price,
          sphoto: data.sphoto,
          des: data.des,
          area: data.area,
        },
      };
      const result = await serviceCollection.updateOne(
        filter,
        updateData,
        options
      );
      res.send(result);
    });
    // Delete service from my service
    app.get("/api/v1/my-services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    });
    app.get("/api/v1/my-services", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/api/v1/services", async (req, res) => {
      const filter = serviceCollection.find();
      const result = await filter.toArray();
      res.send(result);
    });
    app.post("/api/v1/services", async (req, res) => {
      const adddata = req.body;
      const result = await serviceCollection.insertOne(adddata);
      res.send(result);
    });
    // Set Data To Bookings
    app.post("/api/v1/bookings", async (req, res) => {
      const bookData = req.body;
      const result = await bookCollection.insertOne(bookData);
      res.send(result);
    });

    // Get Query Data For My Booked
    app.get("/api/v1/my-bookings", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { uemail: email };
      const cursor = bookCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // Get Query Data For Others Booked
    app.get("/api/v1/others-bookings", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { semail: email };
      const cursor = bookCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Career Server is Running...");
});

app.listen(port, () => {
  console.log(`Server Is Running On http://${port}`);
});
