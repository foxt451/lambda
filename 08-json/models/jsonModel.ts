import mongoose from "mongoose";
const { Schema, model } = mongoose;

interface IJson {
  name: string;
  path: string;
}

const jsonSchema = new Schema<IJson>({
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
export { IJson };
export default Json;
