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
    mxw1: 1,
    mxw2: 2,
    mxw3: 4,
    mxw4: 8,
    mxw5: 16,
    mxw6: 32,
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
