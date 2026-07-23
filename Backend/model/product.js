import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title:{
        type : String,
        required : true
    },
    description : {
        type : String,
       
    },
    price :{
        type: Number,
        required : true

    },
    category : {
        type : String

    },
    images: [
        {
            type: String
        }
    ],
    stock : {
        type : Number,
        default : 0
    }
}, { timestamps : true });

productSchema.index({
    title: "text",
    description: "text",
    category: "text"
});

export default mongoose.model("Product", productSchema);