import _ from "lodash";

export const widths = _.mapValues(
  {
    w1: 1,
    w2: 2,
    w3: 4,
    w4: 8,
    w5: 16,
    w6: 32,
  },
  val => ({ width: val })
);

export const maxWidths = _.mapValues(
  {
    mw1: 1,
    mw2: 2,
    mw3: 4,
    mw4: 8,
    mw5: 16,
    mw6: 32,
  },
  val => ({ maxWidth: val })
);

export const minWidths = _.mapValues(
  {
    mnw1: 1,
    mnw2: 2,
    mnw3: 4,
    mnw4: 8,
    mnw5: 16,
    mnw6: 32,
  },
  val => ({ minWidth: val })
);
