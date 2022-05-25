import moment from "moment-timezone";

const evaluateResources = (req, res) => {
  if (
    req.body.count === undefined ||
    req.body.language === undefined ||
    req.body.mimetype === undefined
  ) {
    return res
      .status(400)
      .json({ msg: "Please provide language, count and mimetype" });
  }
  const price = evaluatePrice(req.body);
  const time = evaluateTime(req.body);
  const deadline_date = evaluateDeadline(moment(), time);
  console.log(deadline_date);

  return res.status(200).json({ price, time, deadline_date: deadline_date.format(), deadline: deadline_date.unix() });
};

const minTime = 1;
const additionalTime = 0.5;
const evaluateTime = ({ language, mimetype, count }) => {
  const { charsPerHour } = tryGetLangData(language);
  const formatMultiplier = getFormatMultiplier(mimetype);
  return (
    Math.max(minTime, additionalTime + count / charsPerHour) * formatMultiplier
  );
};

const tryGetLangData = (language) => {
  const langData = languageData[language];
  if (langData === undefined) {
    throw new Error("Unsupported language");
  }
  return langData;
};

const languageData = {
  en: { pricePerChar: 0.12, minPrice: 120, charsPerHour: 333 },
  ukr: { pricePerChar: 0.05, minPrice: 50, charsPerHour: 1333 },
  rus: { pricePerChar: 0.05, minPrice: 50, charsPerHour: 1333 },
};

const timezone = "Europe/Kiev";
const startHour = 10;
const endHour = 19;
const evaluateDeadline = (currentTime, requiredTime) => {
  currentTime = currentTime.tz(timezone);
  // move start time from a weekend
  if ([6, 7].includes(currentTime.isoWeekday())) {
    currentTime.add(1, "w").isoWeekday(1).hours(startHour).startOf("h");
  }
  let evaluated = moment(currentTime);
  // bring the date to the nearest working time
  if (evaluated.hours() >= endHour) {
    evaluated.add(1, "d").hours(startHour).startOf("h");
  }
  if (evaluated.hours() < startHour) {
    evaluated.hours(startHour).startOf("h");
  }
  const hourInterval = endHour - startHour;
  const fullDays = Math.floor(requiredTime / hourInterval);
  evaluated.add(fullDays, "days");
  // remaining time is less than 1 day
  let remainingTime = requiredTime % hourInterval;
  // it might overflow on the next day, but not on the day after it
  const dayFinish = moment(evaluated).hours(endHour).startOf("h");
  if (moment(evaluated).add(remainingTime, "h") > dayFinish) {
    remainingTime -= dayFinish.diff(evaluated, "h", true);
    evaluated.add(1, "d").hour(startHour).startOf("h");
  }
  evaluated.add(remainingTime, "h");
  extractWeekends(currentTime, evaluated);
  console.log(evaluated);
  return evaluated;
};

// counts weekends that happened to be in the interval and adds them
// won't handle weekends at the start, but will at the end of the interval
// mutates endtime
const extractWeekends = (startTime, endTime) => {
  // these are actual days of work required to complete
  let dayDiff = endTime.diff(startTime, "d");
  // now, for every 5 days of work add 2 days of rest
  endTime.add(Math.floor(dayDiff / 5) * 2, "d");
  // there also is a case when we start from, say friday, and finish on monday. then dayDiff
  // is only 3, but we will also add 2 days
  dayDiff = dayDiff % 5;
  if (moment(startTime).isoWeekday(6) <= moment(startTime).add(dayDiff, "d")) {
    endTime.add(2, "d");
  }

  // move endTime from a weekend
  if ([6, 7].includes(endTime.isoWeekday())) {
    endTime.add(2, "d");
  }
};

const evaluatePrice = ({ language, mimetype, count }) => {
  const { pricePerChar, minPrice } = tryGetLangData(language);
  const formatMultiplier = getFormatMultiplier(mimetype);
  return Math.max(minPrice, pricePerChar * count) * formatMultiplier;
};

const getFormatMultiplier = (format) => {
  switch (format) {
    case "doc":
    case "docx":
    case "rtf":
      return 1;
    default:
      return 1.2;
  }
};

export { evaluateResources, evaluatePrice, evaluateTime, evaluateDeadline };
