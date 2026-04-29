const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

/*Middleware*/
app.use(express.json());
app.use(cors());

/*MongoDB Connection*/
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

const Contact = require("./module/ContactSchema.js");

/* Fixed Admin Login*/
const ADMIN_USERNAME = "StarKidz";
const ADMIN_PASSWORD = "12345";

/*JWT Middleware*/
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);;
    req.admin = decoded;

    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

/*Admin Login*/
app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      username !== ADMIN_USERNAME ||
      password !== ADMIN_PASSWORD
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Username or Password",
      });
    }

    const token = jwt.sign(
      { username: ADMIN_USERNAME },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login Success",
      token,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/contact", async (req, res) => {
  try {
    const {
      parentName,
      childrenName,
      email,
      phoneNumber,
      program,
      centerCity,
      message,
    } = req.body;

    const newContact = await Contact.create({
      parentName,
      childrenName,
      email,
      phoneNumber,
      program,
      centerCity,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Form Submitted Successfully",
      data: newContact,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/admin/contact", verifyToken, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: contacts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.delete("/admin/contact/:id", verifyToken, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
})