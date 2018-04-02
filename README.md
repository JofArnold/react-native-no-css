# React Native No CSS

Essentially a fork of [tachyons-css/react-native-style-tachyons](https://github.com/tachyons-css/react-native-style-tachyons) but with the following changes:

- Uses the standard Tachyons names (except for min-max values which are now `mxh1`, `mnw1` etc as Tachyons ones are unclear and are inconsistent and conflict with `mh2` etc for horizontal margins)

- Added a default palette. Tachyons uses things like `moon-gray` which are hard to remember. This project uses `gray1` through to `gray9` where the suffix represents progressively lighter grays (makes incrementing in Vim quicker)

- The `cls` prop is replaced with `classNames` which is more like React web and a little easier to type I find.

Rationale: This is part of my mission to rid the world of direct manipulation of css in projects [no-css](https://github.com/Jofarnold/no-css)

# Use

`npm i react-native-no-css` or `yarn add react-native-no-css` to install.

Then add the following lines into your entry point (normally App.js or index.js)

```
import { StyleSheet } from "react-native";
import NativeTachyons from "react-native-no-css";
NativeTachyons.build({}, StyleSheet);
```

Typical use:

```
<View classNames="flex-column justify-between bg-red">
  <Text classNames="gray1">Some text</Text>
</View>
```

See the objects in the various js files in https://github.com/JofArnold/react-native-no-css/tree/master/src/styles for available styles


---

### TODO

- [x] Put on NPM

- [ ] Make new repo

- [ ] Add remaining flexbox classes
