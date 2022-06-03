import "./config.js";
import { bot } from "./tg.js";
import { echo, sendImage } from "./commands.js";
bot.on("text", (msg) => {
    if (/photo/i.test(msg.text ?? "")) {
        sendImage(bot, msg);
    }
    else {
        echo(bot, msg);
    }
});
