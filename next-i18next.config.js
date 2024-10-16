const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh-TW"],
  },
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/locales",
  fallbackLng: "en",
  ns: ["translation"],
  defaultNS: "translation",
};
