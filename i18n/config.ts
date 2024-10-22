const supportedLangs = ["en", "zh-tw"];
const defaultLang: Locale = "en";

export { supportedLangs, defaultLang };
export type Locale = (typeof supportedLangs)[number];
