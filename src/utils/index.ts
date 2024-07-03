import { Share } from "react-native";

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

export {
  CreditDebitCardNumber,
  createArrayUseNumber,
  determineCardType,
  getUrlExtension,
  onShare,
  timeElapsedString,
};
