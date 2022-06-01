import mongoose from "mongoose";
const { Schema, model } = mongoose;
const jsonSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    path: {
        type: String,
        required: true,
    },
});
const Json = model("Json", jsonSchema);
export default Json;
