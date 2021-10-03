import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
// app.use(express.urlencoded());
app.use(cors());

mongoose.connect(
  "mongodb+srv://ranjit_7:jW9GyIvTsq8OOztF@cluster0.y5crp.mongodb.net/TaskDB?retryWrites=true&w=majority",
  { useUnifiedTopology: true, useNewUrlParser: true }
);
mongoose.connection.on("open", () => {
  console.log("mongooDB is connected.");
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

//Routes
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successful", user: user });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User already registered." });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Successfully Registered, Please login now." });
        }
      });
    }
  });
});
app.put("/updateData", (req, res) => {
  const { id, email, password, name } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Id is important." });
  }
  const findData = User.findById(id, (err, suc) => {
    if (!suc) return res.json({ error: "User is not found." });
    const updateData = User.findOneAndUpdate(
      { _id: id },
      {
        email: email || findData.email,
        password: password || findData.password,
        name: name || findData.name,
      },
      (err, sucUpdate) => {
        if (!sucUpdate) return res.json({ error: "Something went wrong." });
        else return res.json({ data: "Update user data success." });
      }
    );
  });
});
// ===========*******Delete route**********============

app.delete("/deleteUser", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Id is important." });
  }
  User.findById(id, (err, suc) => {
    if (!suc) {
      return res.status(400).json({ error: "User is not found." });
    }
    User.findOneAndDelete({ _id: id }, (err, sucDelete) => {
      if (!sucDelete)
        return res.status(404).json({ error: "Something went wrong." });
      else return res.json({ data: "User delete successful." });
    });
  });
});
// =======****get user data****===========
app.get("/:id", (req, res) => {
  const { id } = req.params;
  User.findById(id, (err, suc) => {
    if (!suc) {
      res.status(404).json({ error: "User is not found." });
    }
    res.json({ data: suc });
  });
});

app.listen(process.env.PORT || 9000, () => {
  console.log("BE started at port 9000");
});
