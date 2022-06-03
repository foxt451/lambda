import TelegramBot from "node-telegram-bot-api";
const token = process.env.BOT_TOKEN;
if (!token) throw new Error("Please provide a BOT_TOKEN in config");
const chat_id = process.env.CHAT_ID;
if (!chat_id) throw new Error("Please provide a CHAT_ID token in config");
const bot = new TelegramBot(token);

const sendMessage = async (text: string) => {
  await bot.sendMessage(chat_id, text);
  console.log("\x1b[32mMessage sent successfully!");
};

const sendImage = async (path: string) => {
  try {
    await bot.sendPhoto(chat_id, path);
    console.log("\x1b[32mImage sent successfully!");
  } catch (err) {
    process.stdout.write("\x1b[31m");
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log("An error ocurred");
    }
  }
};

export { sendMessage, sendImage };
