const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
const fileUpload = require("express-fileUpload");
const { MongoClient } = require("mongodb");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.deaij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const studentCollection = client.db("students_site").collection("students");

    // store student data
    app.post("/student", async (req, res) => {
      try {
        const body = req.body;
        // const encodedPic = req.files.image.toString("base64");
        // const bufferImage = Buffer.from(encodedPic, "base64");
        const result = await studentCollection.insertOne(body);
        res.json(result)
      } catch (err) {
        console.log(err.message);
      }
    });

    // get student data
    app.get("/student", async (req, res) => {
      try {
        const result = await studentCollection.find({}).toArray();
        res.json(result);
      } catch (err) {
        console.log(err.message);
      }
    });

    // get student data
    app.get("/student/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const result = await studentCollection.findOne(filter);
        res.json(result);
      } catch (err) {
        console.log(err.message);
      }
    });
    // update student data
    app.put("/student/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const data = req.body;
        const {name, phone, email, address1, address2, Class} = data;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateStudent = {
          $set: {
            name,
            phone,
            email,
            address1,
            address2,
            Class
          },
        };
        const result = await studentCollection.updateOne(
          filter,
          updateStudent,
          options
        );
        res.json(result);
      } catch (err) {
        console.log(err.message);
      }
    });
    // delete student 
    app.delete("/student/:id", async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: ObjectId(id)};
      const result = await studentCollection.deleteOne(filter);
      console.log(result)
      res.json(result)
    })
  } finally {
    // await client.close
  }
}

run().catch(console.dir);

app.get("/", (req, res) => res.send("In the name of Allah"));
app.listen(port, () => console.log(`server running port number is: ${port}`));
