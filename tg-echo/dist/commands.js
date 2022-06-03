import axios from "axios";
import { Buffer } from "node:buffer";
const echo = (bot, msg) => {
    bot.sendMessage(msg.chat.id, msg.text ?? "");
};
const photoUrl = "https://picsum.photos/200/300";
const sendImage = async (bot, msg) => {
    try {
        const result = await axios.get(photoUrl, { responseType: "arraybuffer" });
        bot.sendPhoto(msg.chat.id, Buffer.from(result.data), {}, { contentType: result.headers["content-type"] });
    }
    catch (err) {
        let errMsg;
        if (err instanceof Error) {
            errMsg = `An error ocurred: ${err.message}`;
        }
        else {
            errMsg = `An unknown error ocurred`;
        }
        bot.sendMessage(msg.chat.id, errMsg);
    }
};
export { echo, sendImage };