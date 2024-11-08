import express from "express";
import mongoose from "mongoose";
import UserModel from "./user";

mongoose.connect('mongodb+srv://Learning:Mjnh13071997..@cluster0.t1ncv.mongodb.net/')
const app = express()
app.listen(8080, () => {
    console.log("Server is running!");
  });
  