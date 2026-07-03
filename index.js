const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

const OBJECT_TYPE = "2-232012711";

// Homepage
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`,
      {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        },
        params: {
          properties: "name,author,genre",
        },
      }
    );

    res.render("homepage", {
      title: "Books",
      books: response.data.results,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.send("Error fetching books");
  }
});

// Form Page
app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

// Create Book
app.post("/update-cobj", async (req, res) => {
  try {
    const { name, author, genre } = req.body;

    await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`,
      {
        properties: {
          name,
          author,
          genre,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.redirect("/");
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.send("Error creating book");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});