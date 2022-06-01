import mongoose from "mongoose";

const connect = (uri: string) => {
    return mongoose.connect(uri);
};

export default connect;
