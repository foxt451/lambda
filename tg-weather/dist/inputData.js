const intervals = new Map([
    ["/interval 3", 3],
    ["/interval 6", 6],
]);
const intervalMessages = new Map([
    ["/interval 3", "3-годинний інтервал"],
    ["/interval 6", "6-годинний інтервал"],
]);
const cities = new Map([
    ["Київ", { lat: 50.45466, lon: 30.5238 }],
]);
const getIntervalKeyboard = (city) => Array.from(intervalMessages.entries(), ([command, message]) => [
    {
        text: message,
        callback_data: `${command} ${city}`,
    },
]);
const citiesKeyboard = Array.from(cities.keys(), (city) => [
    {
        text: city,
        callback_data: `/city ${city}`,
    },
]);
export { intervals, cities, getIntervalKeyboard, citiesKeyboard };
