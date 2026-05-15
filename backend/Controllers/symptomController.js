import Disease from "../models/DiseaseSchema.js"


export const postDisease = async (req,res,next) =>{
        const disease = new Disease(req.body)
    try {
        const saveDisease = await disease.save()

        res.status(200).json({succcess:true, message:"DiseaseAdded to DB", data: saveDisease})
    }catch(e){
        res.status(400).json({succcess:true, message:`failed ${e}`})
    }
}

export const getAlldisease = async(req,res,next) =>{
    try{
        const diseases = await Disease.find()
        res.status(200).json({succcess : true, message : "Fetched succesfully",data : diseases})
    }catch{
        res.status(200).json({succcess : true, message : "failed to fetch"})
    }
}

export const getDiease = async(req,res,next) =>{
    try{
        const disease = await Disease.findOne({diseasename : req.body.dname})
        res.status(200).json({succcess : true,message : "Fetched succesfully ", data : disease})
    }catch(e){
        res.status(400).json({succcess : true,message : "failed to fetch", error : e})
    }
}