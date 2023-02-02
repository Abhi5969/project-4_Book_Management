require("dotenv").config();
const express=require("express")
const app=express()
const route=require("./routes/route")
const mongoose= require('mongoose')
const multer  = require('multer')
mongoose.set("strictQuery", true);

app.use(express.json());
app.use(multer().any())
app.use("/", route);

mongoose.connect("mongodb+srv://Abhi_functionup:dBalIHuDvBLH2uZK@abhi1.m5k3ewv.mongodb.net/group7database")
    .then(() => console.log("Mongodb is connected."))
    .catch((err) => console.log(err));

app.listen(3000, function () { 
    console.log("Express app is running on port " + 3000);
});