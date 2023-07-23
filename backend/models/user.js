import mongoose from "mongoose";

//import uniqueValidator from "mongoose-unique-validator"
const UserSchema=mongoose.Schema({
    name:{type:String ,required:true},
    email:{type:String ,required:true},
    password:{type:String ,required:true,minlength:6},
    image:{type:String ,required:true},
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }]
})

//UserSchema.plugin(uniqueValidator)

export default mongoose.model('User',UserSchema)