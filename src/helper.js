const replacementMap = {
  " ": "-",
  ü: "ue",
  ö: "oe",
  ä: "ae",
  ß: "ss",
};

/**
 * Formats a string:
 * Lowercase, trim and umlauts [ä -> ae, ü -> ue, ß -> ss, ...]
 * @param str Input string
 */
module.exports.formatString = (str) => {
  str = str.toLowerCase().trim();
  for (const key in replacementMap) {
    str = str.replace(key, replacementMap[key]);
  }
  return str;
};
