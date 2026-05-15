import mongoose from "mongoose";


const DiseaseSchema = new mongoose.Schema({

    diseasename : {type : String, required : true, unique : true},
    basic_remedy : {type : String},
    self_curable : {type : String, enum : ["Yes","No"]},
    doctortype : {type : String},
    other_symptoms : {type : String}

});

export default mongoose.model("Disease", DiseaseSchema);