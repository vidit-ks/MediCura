import mongoose from "mongoose";

const ehrSchema = new mongoose.Schema({
    userid : {type : mongoose.Types.ObjectId, ref : 'User'},
    filename : {type : String},
    downloadURL : {type : String},
    description : {type : String}
})

export default mongoose.model("EHR", ehrSchema);