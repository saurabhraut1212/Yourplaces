import express from "express"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import fs from 'fs';
import path from "path";

import placesRoutes from "./routes/places-routes.js"
import usersRoutes from "./routes/users-routes.js"
import HttpError from "./models/http-error.js";


const app = express()
app.use(bodyParser.json())

app.use(express.json({ limit: "30mb", extended: true }))
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use(cors());


app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept ,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    next();
})

app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes)

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route');
    throw error;
})

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err)
        })
    }
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500).json({ message: error.message || 'An unknown error occurred' })
})

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.pcyfzle.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => { app.listen(5000) })
    .then(() => console.log('Server started on port 5000'))
    .catch((err) => { console.log(err) })
