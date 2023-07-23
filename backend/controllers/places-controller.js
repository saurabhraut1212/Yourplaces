import fs from "fs";
import mongoose from "mongoose";
import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";

import getCoordsForAddress from "../util/location.js";
import Place from "../models/place.js";
import User from "../models/user.js";



export const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId)
    } catch (err) {
        const error = new HttpError('Something went wrong ,could not find a place', 500);
        return next(error)

    }

    if (!place) {
        const error = new HttpError('Could not find the place for provided id.', 404)
        return next(error)

    }

    res.json({ place: place.toObject({ getters: true }) })
}

export const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;


    try {
        const userWithPlaces = await User.findById(userId).populate('places');

        if (!userWithPlaces || userWithPlaces.places.length === 0) {
            return next(new HttpError('Could not find places for the provided user id', 404))
        }

        res.json({ places: userWithPlaces.places.map(place => place.toObject({ getters: true })) });
    } catch (err) {
        const error = new HttpError('Fetching places failed, please try again later', 500);
        return next(error);
    }
}


export const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(new HttpError('Invalid inputs passed ,please check your data.', 422))
    }
    const { title, description, address } = req.body;
    console.log(req.body)
    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address)
    } catch (error) {
        return next(error)

    }
    const createdPlace = new Place({

        title,
        description,
        address,
        location: coordinates,
        image: req.file.path,
        creator: req.userData.userId
    })

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError('Creating place failed ,please try again', 500);
        return next(error);

    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id', 404);
        return next(error);
    }


    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Creating place failed ,please try again', 500);
        return next(error)

    }
    res.status(201).json({ place: createdPlace })

}

export const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed ,please check your data.', 422))
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId)
    } catch (err) {
        const error = new HttpError('Something went wrong ,could not update place', 500);
        return next(error);

    }

    if (place.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this place', 401);
        return next(error)
    }
    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError('Something went wrong ,could not update place', 500);
        return next(error)

    }

    res.status(200).json({ place: place.toObject({ getters: true }) })
}

export const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId).populate('creator');

    } catch (err) {
        const error = new HttpError('Something went wrong ,could not delete the place', 500)
        return next(error);

    }

    if (!place) {
        const error = new HttpError('Place could not find for that id', 404);
        return next(error)
    }

    const imagePath = place.image;

    if (place.creator.id !== req.userData.userId) {
        const error = new HttpError('You are not allowed to delete this place', 401);
        return next(error)

    }
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({ session: sess });
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Something went wrong ,could not delete the place', 500)
        return next(error);


    }
    fs.unlink(imagePath, err => {
        console.log(err)
    })

    res.status(200).json({ message: 'Deleted place.' })

}

