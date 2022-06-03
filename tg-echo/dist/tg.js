import TelegramBot from "node-telegram-bot-api";
const token = process.env.BOT_TOKEN;
if (!token)
    throw new Error("Please provide a BOT_TOKEN in config");
const bot = new TelegramBot(token, { polling: true });
export { bot };
