import React from "react";
import _ from "lodash";
import { styles } from "./index";
import cssColors from "css-color-names";

/* Wrap takes a Component or a render function and recursively replaces
   the prop 'classNames' with the respective 'style' definitions.
   Usually, wrapping a whole Class / Component will do the trick,
   but for some render functions (e.g. ListView -> renderHeader)
   this will not work. Hence the such functions need to be wrapped
   individually */
export function wrap(componentOrFunction) {
  if (
    !(
      componentOrFunction.prototype && "render" in componentOrFunction.prototype
    )
  ) {
    const func = componentOrFunction;

    return function wrappedRender(...args) {
      return recursiveStyle(func.apply(this, args));
    };
  }
  const WrappedComponent = componentOrFunction;
  const newClass = class extends WrappedComponent {
    render() {
      return recursiveStyle(super.render());
    }
  };

  /* Fix name */
  newClass.displayName = WrappedComponent.displayName || WrappedComponent.name;

  return newClass;
}

function recursiveStyle(elementsTree) {
  const { props } = elementsTree;
  let newProps;
  let translated = false;

  /* Parse classNames string */
  if (_.isString(props.classNames)) {
    newProps = {};
    translated = true;
    if (_.isArray(props.style)) {
      newProps.style = props.style.slice();
    } else if (_.isObject(props.style)) {
      newProps.style = [props.style];
    } else {
      newProps.style = [];
    }

    const splitted = props.classNames.replace(/-/g, "_").split(" ");
    for (let i = 0; i < splitted.length; i++) {
      const classNames = splitted[i];
      if (classNames.length > 0) {
        const style = styles[classNames];
        if (style) {
          /* Style found */
          newProps.style.push(style);
        } else if (classNames.startsWith("bg_")) {
          newProps.style.push({
            backgroundColor: classNames.slice(3),
          });
        } else if (classNames.startsWith("b__")) {
          newProps.style.push({
            borderColor: classNames.slice(3),
          });
        } else if (classNames.startsWith("tint_")) {
          newProps.style.push({
            tintColor: classNames.slice(3),
          });
        } else if (cssColors[classNames] || /^(rgb|#|hsl)/.test(classNames)) {
          newProps.style.push({
            color: classNames,
          });
        } else {
          throw new Error(`style '${classNames}' not found`);
        }
      }
    }
  }

  let newChildren = props.children;
  if (_.isArray(newChildren)) {
    /* Convert child array */
    newChildren = React.Children.toArray(newChildren);
    for (let i = 0; i < newChildren.length; i++) {
      const c = newChildren[i];
      if (React.isValidElement(c)) {
        const converted = recursiveStyle(c);
        if (converted !== c) {
          translated = true;
          newChildren[i] = converted;
        }
      }
    }
  } else if (React.isValidElement(newChildren)) {
    /* Convert single child */
    const converted = recursiveStyle(newChildren);
    if (converted !== newChildren) {
      translated = true;
      newChildren = converted;
    }
  }

  if (translated) {
    return React.cloneElement(elementsTree, newProps, newChildren);
  }

  return elementsTree;
}
