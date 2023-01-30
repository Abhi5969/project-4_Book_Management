const express=require("express")
const app=express()
const route=require("./routes/route")
const mongoose= require('mongoose')

mongoose.set("strictQuery", true);

app.use(express.json());
app.use("/", route);

mongoose.connect("mongodb+srv://piyushtale:piyushrajutale@cluster0.t7w7ipr.mongodb.net/group7Database")
    .then(() => console.log("Mongodb is connected."))
    .catch((err) => console.log(err));

app.listen(3000, function () {
    console.log("Express app is running on port " + 3000);
});