const readableRepr = (data) => {
    let lastDate = "";
    return data.list
        .map((entry) => {
        const date = new Date(entry.dt * 1000);
        const dateStr = date.toLocaleDateString("uk-UA", {
            weekday: "long",
            day: "2-digit",
            month: "long",
        });
        const timeStr = date.toLocaleTimeString("uk-UA", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        let resultStr = "";
        if (dateStr !== lastDate) {
            lastDate = dateStr;
            resultStr += `${dateStr}:\n`;
        }
        const getTempStr = (temp) => {
            return `${temp <= 0 ? "" : "+"}${Math.round(temp)} °C`;
        };
        const conditions = entry.weather
            .map((weather) => weather.description)
            .join(", ");
        resultStr += `  ${timeStr}, ${getTempStr(entry.main.temp)}, відчувається як ${getTempStr(entry.main.feels_like)}, ${conditions}`;
        return resultStr;
    })
        .join("\n");
};
export { readableRepr };
