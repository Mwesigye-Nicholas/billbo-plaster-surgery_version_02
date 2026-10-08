import mongoose from "mongoose";
const {Schema, model} = mongoose;


type PatientVitals = {
    systolicBP?: number | undefined;
    diastolicBP?: number | undefined;
    pulse?: number | undefined;
    temp?: number | undefined;
    spo2?: number | undefined;
    height?: number | undefined;
    weight?: number | undefined;
    date?: Date
   
}


const triageDataSchema = new Schema<PatientVitals>({

     systolicBP: {
        type : Number,
    
    },
     diastolicBP: {
        type : Number,
     
    },

    pulse: {
        type: Number,
      
    },
    temp: {
        type: Number,
    
    },
    spo2: {
        type: Number,
    
    },
    height: {
        type: Number,
       
    },
    weight: {
        type: Number,
        
    },
    date: {
        type: Date,
        default: Date.now
    },

});

 const TriageDataModel = model<PatientVitals>("TriageData", triageDataSchema);
 export default TriageDataModel;