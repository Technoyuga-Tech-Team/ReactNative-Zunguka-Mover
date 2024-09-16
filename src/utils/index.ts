import moment from "moment";
import { Share } from "react-native";
import * as Yup from "yup";

const getUrlExtension = (url: string) => {
  return url?.split(/[#?]/)[0]?.split(".")?.pop()?.trim();
};

const createArrayUseNumber = (length: number) => {
  return Array(length).fill(0);
};

const CreditDebitCardNumber = (value: string) => {
  var v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  var matches = v.match(/\d{4,16}/g);
  var match = (matches && matches[0]) || "";
  var parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(" ");
  } else {
    return value;
  }
};

const cardTypeRegexes: any = {
  visa: /^4/,
  "master-card": /^5[1-5]/,
  "american-express": /^3[47]/,
  discover: /^6(?:011|5)/,
};

const determineCardType = (cardNumber: string) => {
  for (const cardType in cardTypeRegexes) {
    if (cardNumber.match(cardTypeRegexes[cardType])) {
      return cardType;
    }
  }
  return "default"; // If the card type is not recognized, show a default image
};

const onShare = async (val: string) => {
  const options = {
    title: "App link",
    message: val,
  };
  try {
    await Share.share(options);
  } catch (error) {
    // showMessage(error.message);
  }
};

const timeElapsedString = (datetime: string | number | Date, full = false) => {
  const now = new Date();
  const ago = new Date(datetime);

  const diffMs = now - ago;
  const diff = {
    y: Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000)),
    m: Math.floor(diffMs / (30.44 * 24 * 60 * 60 * 1000)),
    w: Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)),
    d: Math.floor(diffMs / (24 * 60 * 60 * 1000)),
    h: Math.floor(diffMs / (60 * 60 * 1000)),
    i: Math.floor(diffMs / (60 * 1000)),
    s: Math.floor(diffMs / 1000),
  };

  const string = {
    y: "year",
    m: "month",
    w: "week",
    d: "day",
    h: "hour",
    i: "minute",
    s: "second",
  };

  for (const [k, v] of Object.entries(string)) {
    if (diff[k]) {
      string[k] = diff[k] + " " + v + (diff[k] > 1 ? "s" : "");
    } else {
      delete string[k];
    }
  }

  const result = full
    ? Object.values(string).join(", ")
    : Object.values(string)[0];

  return result ? result + " ago" : "just now";
};

const keepSingleSpace = (value: string) => {
  const newValue = value.trim().replace(/\s{2,}/g, " ");
  return newValue;
};

function formatPhoneNumber(number: string) {
  // Split the number at the first space
  const parts = number.split(" ");

  // Check if there's a space
  if (parts.length < 2) {
    console.warn("No space found in phone number:", number);
    return number; // Return the original number if no space is found
  }

  // Extract the first part (assuming it's not the country code)
  const firstPart = parts[0];

  const lastparts = number.split(" ").reverse(); // Reverse to get the last space first
  // Check if there's a space
  if (lastparts.length < 2) {
    console.warn("No space found in phone number:", number);
    return number; // Return the original number if no space is found
  }

  const lastPhoneNumber = lastparts[0];
  const lastDigit = lastPhoneNumber.length <= 4 ? lastPhoneNumber.length : 4;
  const lastFourDigits = lastPhoneNumber.slice(-`${lastDigit}`);

  // Mask all digits except the lastDigit in the remaining part
  const remainingDigits = parts
    .slice(1)
    .join("")
    .slice(0, -`${lastDigit}`)
    .replace(/./g, "*");

  // Combine the formatted parts
  const formattedNumber = `(${firstPart
    .slice(1)
    .replace(/./g, "*")}) ${remainingDigits} -${lastFourDigits}`;

  return formattedNumber;
}

const getRandomFileName = () => {
  var timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  var random = ("" + Math.random()).substring(2, 8);
  var random_number = timestamp + random;
  return random_number;
};

const hasEmail = (text: string) => {
  const emailMatch = text.match(/(\S+@\S+\.\S+)/);
  if (emailMatch) {
    return Yup.string().email(emailMatch[0]);
  } else {
    return false;
  }
};

const hasPhone = (text: string) => {
  const rgx = /\d{10}/;
  const phoneMatch = text.match(rgx);
  console.log("phoneMatch", phoneMatch);
  if (phoneMatch) {
    return Yup.string().test("phone", "", (value) => {
      console.log("value", value);
      return rgx.test(value);
    });
  } else {
    return false;
  }
};

const calculateDistanceWithTime = (
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
) => {
  // Convert latitude and longitude to radians
  const lat1Rad = (origin.latitude * Math.PI) / 180;
  const lon1Rad = (origin.longitude * Math.PI) / 180;
  const lat2Rad = (destination.latitude * Math.PI) / 180;
  const lon2Rad = (destination.longitude * Math.PI) / 180;

  // Calculate Haversine formula
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // Earth's radius in meters
  const earthRadius = 6371000;

  // Calculate distance in meters
  const distanceMeters = c * earthRadius;
  // Convert to desired time unit (e.g., hours, minutes) based on speed (assume a constant speed)
  const speed = 50; // Example: 50 km/h
  const timeInSeconds = distanceMeters / (speed * 1000); // Convert km/h to m/s
  const milliseconds = timeInSeconds * 1000;
  const minutes = moment.duration(milliseconds, "milliseconds").asMinutes();

  return minutes; // Or convert to hours, etc., as needed
};

export {
  CreditDebitCardNumber,
  createArrayUseNumber,
  determineCardType,
  getUrlExtension,
  onShare,
  timeElapsedString,
  keepSingleSpace,
  formatPhoneNumber,
  getRandomFileName,
  hasEmail,
  hasPhone,
  calculateDistanceWithTime,
};
