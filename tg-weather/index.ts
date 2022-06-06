import "./config.js";
import { bot } from "./tg.js";
import { sendForecast } from "./commands.js";
import { KeyboardButton } from "node-telegram-bot-api";
import WebSocket from "ws";

// this flow goes from the most specific commands
// to the most generic commands
bot.on("text", (msg) => {
  console.log(msg);
  const text = msg.text ?? "";
  if (intervals.has(text)) {
    // we don't keep state, so we don't remember previously selected city
    // therefore we have to rely on the default city
    // but this can easily be expanded
    sendForecast(bot, msg, cities.get(defaultCityEntry)!, intervals.get(text)!);
  } else if (cities.has(text)) {
    bot.sendMessage(msg.chat.id, "Обери інтервал", {
      reply_markup: {
        keyboard: intervalKeyboard,
        one_time_keyboard: true,
      },
    });
  } else {
    bot.sendMessage(msg.chat.id, "Обери команду", {
      reply_markup: {
        keyboard: citiesKeyboard,
        one_time_keyboard: true,
      },
    });
  }
});

// we use command names as they are in keyboards
// because telegram will return button's exact text
// and it will be easier to search for value with it if keys are of the same format. the same for keyboard generation
const intervals = new Map([
  ["3-годинний", 3],
  ["6-годинний", 6],
]);

const defaultCityEntry = "Прогноз в Києві";
const cities = new Map<string, { lat: number; lon: number }>([
  ["Прогноз в Києві", { lat: 50.45466, lon: 30.5238 }],
]);

const intervalKeyboard: KeyboardButton[][] = Array.from(
  intervals.keys(),
  (interval) => [
    {
      text: interval,
    },
  ]
);
const citiesKeyboard: KeyboardButton[][] = Array.from(cities.keys(), (city) => [
  {
    text: city,
  },
]);

const tgUrl = "ws://vesta.web.telegram.org:80/apis";
try {
const websocket = new WebSocket(tgUrl);
websocket.addEventListener("error", e => {
  console.log(e.message);
  
})
websocket.addEventListener("open", (e) => {
  console.log("connected to ws");
});
} catch (e) {
  console.log(e);
  
}

