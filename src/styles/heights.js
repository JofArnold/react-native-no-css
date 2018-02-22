import _ from "lodash";

export const heights = _.mapValues(
  {
    h1: 1,
    h2: 2,
    h3: 4,
    h4: 8,
    h5: 16,
    h6: 32,
  },
  val => ({ height: val })
);

export const maxHeights = _.mapValues(
  {
    mh1: 1,
    mh2: 2,
    mh3: 4,
    mh4: 8,
    mh5: 16,
    mh6: 32,
  },
  val => ({ maxHeight: val })
);

export const minHeights = _.mapValues(
  {
    mnh1: 1,
    mnh2: 2,
    mnh3: 4,
    mnh4: 8,
    mnh5: 16,
    mnh6: 32,
  },
  val => ({ minHeight: val })
);
