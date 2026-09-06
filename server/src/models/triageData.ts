import mongoose from "mongoose";

const {Schema, model} = mongoose;

type PatientVitals = {
    systolicBP?: number;
    diastolicBP?: number;
    pulse?: number;
    temp?: number;
    spo2?: number;
    height?: number;
    weight?: number;
    date?: Date;
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
        default: Date.now,
    },

});

 const TriageData = model<PatientVitals>("TriageData", triageDataSchema);
 export default TriageData;