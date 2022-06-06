import TelegramBot, { Message } from "node-telegram-bot-api";
import axios from "axios";
import { readableRepr } from "./utils.js";

const weatherToken = process.env.OPEN_WEATHER_KEY;
if (!weatherToken)
  throw new Error("Please provide an OPEN_WEATHER_KEY in config");
const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${weatherToken}`;

const sendForecast = async (
  bot: TelegramBot,
  msg: Message,
  { lat, lon }: { lat: number; lon: number },
  interval: number
) => {
  try {
    const response = await axios.get(
      weatherUrl + `&lat=${lat}&lon=${lon}&lang=ua&units=metric`
    );
    console.log(JSON.stringify(response.data));
    response.data.list = response.data.list.filter(
      (el: any, index: number) => index % Math.ceil(interval / 3) === 0
    );
    bot.sendMessage(msg.chat.id, readableRepr(response.data));
  } catch (err) {
    console.log(err);

    bot.sendMessage(msg.chat.id, "An error ocurred");
  }
};

export { sendForecast };
