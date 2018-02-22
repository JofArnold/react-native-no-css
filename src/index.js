import _ from "lodash";
import Color from "color";
import * as reactWrapper from "./reactWrapper";
import { heights, minHeights, maxHeights } from "./styles/heights";
import { widths, minWidths, maxWidths } from "./styles/widths";
import * as borders from "./styles/borders";
import flexbox from "./styles/flexbox";
import spacing from "./styles/spacing";
import typeScale from "./styles/typeScale";
import text from "./styles/text";
import images from "./styles/images";
import fontWeights from "./styles/fontWeights";
import opacity from "./styles/opacity";
import * as absolute from "./styles/absolute";
import lineHeight from "./styles/lineHeight";
import tracked from "./styles/tracked";

const NativeTachyons = {
  wrap: reactWrapper.wrap,

  /* Placeholder */
  styles: {},

  /* Placeholder */
  sizes: {},

  build: function build(options = {}, StyleSheet) {
    _.defaultsDeep(options, {
      rem: 16,
      colors: {
        palette: {},
      },
      fonts: {},
    });

    /* Assign all the styles */
    const styleSheet = {};
    _.assign(styleSheet, borders.styles);
    _.assign(styleSheet, flexbox);
    _.assign(styleSheet, fontWeights);
    _.assign(styleSheet, images);
    _.assign(styleSheet, text);
    _.assign(styleSheet, opacity);

    /* Calculate rem scales */
    const sizes = {};
    const REM_SCALED = [
      heights,
      minHeights,
      maxHeights,
      widths,
      minWidths,
      maxWidths,
      spacing,
      typeScale,
      borders.radii,
      lineHeight,
      tracked,
    ];

    REM_SCALED.forEach(subSheet => {
      _.forOwn(subSheet, (styleObj, tachyonsKey) => {
        _.forOwn(styleObj, (val, name) => {
          styleSheet[tachyonsKey] = {
            [name]: val * options.rem,
          };
          sizes[tachyonsKey] = val * options.rem;
        });
      });
    });

    /* Absolute */
    _.assign(styleSheet, absolute.scaleStyles(options.rem));

    /* Colors */
    _.forOwn(options.colors.palette, (val, name) => {
      styleSheet[`bg-${name}`] = { backgroundColor: val };
      styleSheet[`${name}`] = { color: val };
      styleSheet[`b--${name}`] = { borderColor: val };
      styleSheet[`tint-${name}`] = { tintColor: val };

      /* Alpha variants */
      for (let i = 10; i < 100; i += 10) {
        const rgbString = new Color(val)
          .alpha(i / 100)
          .rgb()
          .string();

        styleSheet[`bg-${name}-${i}`] = { backgroundColor: rgbString };
        styleSheet[`${name}-${i}`] = { color: rgbString };
        styleSheet[`b--${name}-${i}`] = { borderColor: rgbString };
      }
    });

    /* Font-families */
    _.forOwn(options.fonts, (val, key) => {
      styleSheet[`ff-${key}`] = { fontFamily: val };
    });

    _.assign(NativeTachyons.sizes, hyphensToUnderscores(sizes));
    _.assign(
      NativeTachyons.styles,
      StyleSheet.create(hyphensToUnderscores(styleSheet))
    );
  },
};

function hyphensToUnderscores(sourceObj) {
  const translated = {};

  /* Create hypened versions */
  _.forOwn(sourceObj, (val, key) => {
    translated[key.replace(/-/g, "_")] = val;
  });

  return translated;
}

export default NativeTachyons;
export const { sizes, styles, wrap, build } = NativeTachyons;
