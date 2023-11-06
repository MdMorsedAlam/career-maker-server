const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.POST || 3737;
const userdb = process.env.USER_DB;
const passdb = process.env.PASS_DB;

// Middle were
app.use(express.json());
app.use(cors());

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

    const serviceCollection = client
      .db("toursDB").collection("services");

    app.post("/api/v1/services", async (req, res) => {
      const adddata = req.body;
      const result = await serviceCollection.insertOne(adddata);
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
