import mongoose from "mongoose";

const PlaceSchema=mongoose.Schema({
    title:  {type:String ,required:true},
    description:  {type:String ,required:true},
    image:  {type:String ,required:true},
    address:  { type: String, required: true },
    location:  {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    creator: { type:mongoose.Types.ObjectId ,required: true ,ref:'User'}    //ref is used here for the connection of user with place

})

export default mongoose.model('Place',PlaceSchema)