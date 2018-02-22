const tachyonsDefaults = {
  gray1: "#111",
  gray2: "#333",
  gray3: "#555",
  gray4: "#777",
  gray5: "#999",
  gray6: "#aaa",
  gray7: "#ccc",
  gray8: "#eee",
  gray9: "#f4f4f4",
  white: "#fff",
  "dark-red": "#e7040f",
  red: "#ff4136",
  "light-red": "#ff725c",
  orange: "#ff6300",
  gold: "#ffb700",
  yellow: "#ffd700",
  "light-yellow": "#fbf1a9",
  purple: "#5e2ca5",
  "light-purple": "#a463f2",
  "dark-pink": "#d5008f",
  "hot-pink": "#ff41b4",
  pink: "#ff80cc",
  "light-pink": "#ffa3d7",
  "dark-green": "#137752",
  green: "#19a974",
  "light-green": "#9eebcf",
  navy: "#001b44",
  "dark-blue": "#00449e",
  blue: "#357edd",
  "light-blue": "#96ccff",
  "lightest-blue": "#cdecff",
};

var makeColorsForPrefix = function makeColorsForPrefix(prefix) {
  var colors = Object.keys(tachyonsDefaults).reduce(function(running, key) {
    var value = tachyonsDefaults[key];
    return Object.assign(running, {
      [`${prefix}${key}`]: value,
    });
  }, {});
  return colors;
};

const textColors = makeColorsForPrefix("");
const borderColors = makeColorsForPrefix("b--");
const backgroundColors = makeColorsForPrefix("bg-");

export const defaultColors = Object.assign(
  textColors,
  borderColors,
  backgroundColors
);
