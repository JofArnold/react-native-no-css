import { test } from "tape";
import { build, wrap, styles, sizes } from "../src/";
import _ from "lodash";
import React from "react";
import ShallowRenderer from "react-test-renderer/shallow";
import Benchmark from "benchmark";

function buildRNT(options) {
  for (const prop in styles) {
    if ({}.hasOwnProperty.call(styles, prop)) {
      delete styles[prop];
    }
  }
  const fakeStyleSheet = { create: sheet => sheet };
  build(options, fakeStyleSheet);
}

test("styles", t => {
  buildRNT({
    fonts: {
      iowan: "Iowan Old Style",
    },
    colors: {
      palette: {
        green: "#00FF00",
        light_green: "#00FF00",
      },
    },
  });

  t.ok(_.isObject(styles), "styles is an object");
  t.ok(_.has(styles, "w1"), "example: has w1");
  t.ok(_.has(styles, "w5"), "example: has w5");
  t.ok(_.has(styles, "pb7"), "example: has pb7");
  t.ok(_.has(styles, "f1"), "example: has f1");
  t.ok(_.has(styles, "absolute_fill"), "example: has absolute-fill");
  t.deepEqual(styles.pa3, { padding: 16 }, "pa3 is 16");
  t.deepEqual(styles.br3, { borderRadius: 8 }, "br3 is 8");
  t.deepEqual(styles.bl, { borderLeftWidth: 1 }, "bl works");
  t.deepEqual(
    styles.br__top,
    { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
    "br--top works"
  );
  t.deepEqual(styles.o_025, { opacity: 0.025 }, "o-025 is opacity 0.025");
  t.deepEqual(styles.min_w3, { minWidth: 64 });
  t.deepEqual(styles.max_w3, { maxWidth: 64 });
  t.deepEqual(styles.min_h4, { minHeight: 128 });
  t.deepEqual(styles.max_h4, { maxHeight: 128 });
  t.deepEqual(styles.lh_copy, { lineHeight: 24 });
  t.deepEqual(styles.tracked_tight, { letterSpacing: -0.8 });
  t.deepEqual(styles.left_1, { left: 16 });
  t.deepEqual(styles.top_2, { top: 32 });
  t.deepEqual(styles.absolute, { position: "absolute" });
  t.deepEqual(styles.bottom_0, { bottom: 0 });
  t.deepEqual(styles.ff_iowan, { fontFamily: "Iowan Old Style" });

  /* Underscore version are generated */
  t.ok(
    _.has(styles, "flx_i"),
    "underscore version is generated in addition to hyphenated names"
  );

  /* Sizes */
  t.equal(sizes.pa3, 16, "pa3 is 16");
  t.equal(sizes.max_w2, 32, "max_w2 is 32");

  t.end();
});

test("fonts", t => {
  buildRNT({
    fonts: {
      iowan: "Iowan Old Style",
    },
  });
  t.deepEqual(styles.ff_iowan, { fontFamily: "Iowan Old Style" });
  t.end();
});

test("colors", t => {
  buildRNT({
    colors: {
      palette: {
        green: "#00FF00",
        light_green: "#CCFFCC",
      },
    },
  });

  /* Colors */
  t.deepEqual(styles.green, { color: "#00FF00" });
  t.deepEqual(styles.b__green, { borderColor: "#00FF00" });
  t.deepEqual(styles.bg_green, { backgroundColor: "#00FF00" });
  t.deepEqual(styles.bg_light_green, { backgroundColor: "#CCFFCC" });

  t.deepEqual(styles.tint_green, { tintColor: "#00FF00" });
  t.deepEqual(styles.tint_light_green, { tintColor: "#CCFFCC" });

  t.ok(_.has(styles, "b__green"), "multiple underscores work");

  t.end();
});

test("wrapping", t => {
  function createComponent(classNamesStr, style) {
    const comp = class extends React.Component {
      render() {
        return (
          <div key="1" other="2" classNames={classNamesStr} style={style}>
            <div key="child1" classNames="w2">
              <div classNames="w4" />
            </div>
            <div key="child2" classNames="w1">
              Test
            </div>
            <div key="child3" classNames="w2">
              <div />
            </div>
            <div
              key="child4"
              classNames="bg-#abcdef b--rgba(200,144,233,1.0) burlywood"
            >
              <div />
            </div>
          </div>
        );
      }
    };

    comp.displayName = "Orig";

    return comp;
  }

  function renderComponent(classNamesStr, style) {
    const renderer = new ShallowRenderer();
    const Comp = wrap(createComponent(classNamesStr, style));
    renderer.render(<Comp />);
    return renderer.getRenderOutput();
  }

  const Orig = createComponent("w5");
  const Wrapped = wrap(Orig);
  t.equal(Wrapped.displayName, Orig.displayName, "displayName is preserved");

  let result = renderComponent("w5");
  t.deepEqual(result.key, "1", "key is preserved");
  t.deepEqual(result.props.other, "2", "other properties are preserved");
  t.deepEqual(result.props.children[0].props.classNames, "w2", "child is preserved");
  t.deepEqual(
    result.props.children[0].props.style,
    [{ width: 32 }],
    "child classNames is converted"
  );
  t.deepEqual(result.props.children.length, 4, "children are converted");
  t.deepEqual(
    result.props.children[0].props.children.props.style,
    [{ width: 128 }],
    "nested single children are converted"
  );
  t.deepEqual(
    result.props.children[1].props.children,
    "Test",
    "Non-ReactElement children are preserved"
  );
  t.ok(
    React.isValidElement(result.props.children[2].props.children),
    "unaltered single children are preserved"
  );

  t.deepEqual(
    result.props.children[3].props.style,
    [
      { backgroundColor: "#abcdef" },
      { borderColor: "rgba(200,144,233,1.0)" },
      { color: "burlywood" },
    ],
    "ad-hoc colors are supported"
  );

  t.deepEqual(result.props.style, [{ width: 256 }], "style array is created");

  result = renderComponent("w5", { width: 5 });
  t.deepEqual(
    result.props.style,
    [{ width: 5 }, { width: 256 }],
    "existing style object is converted to array and appended"
  );

  result = renderComponent("w5", [{ width: 5 }]);
  t.deepEqual(
    result.props.style,
    [{ width: 5 }, { width: 256 }],
    "existing style array is appended"
  );

  result = renderComponent("");
  t.deepEqual(
    result.props.style,
    [],
    "if style is undefined, an array will be created"
  );

  result = renderComponent("flx-i");
  t.deepEqual(result.props.style, [{ flex: 1 }], "hyphens work");

  t.throws(() => renderComponent("w8"), /style 'w8' not found/);

  t.end();
});

test("wrapping benchmark", t => {
  const Orig = wrap(() => (
    <div key="1" classNames="w3">
      <div key="child1" classNames="w2">
        <div classNames="w4" />
      </div>
      <div key="child4" classNames="bg-#abcdef b--rgba(200,144,233,1.0) burlywood">
        <div />
      </div>
    </div>
  ));

  /* Benchmarking */
  const inst = <Orig />;
  new Benchmark.Suite().add("wrap", () => inst.render()).on("cycle", event => {
    t.comment(`performance: ${event.target}`);
  });
  // .run()

  t.end();
});

test("wrapping render class", t => {
  const Orig = wrap(
    class Orig extends React.Component {
      render() {
        return <div classNames="b">hello</div>;
      }
    }
  );

  const renderer = new ShallowRenderer();
  renderer.render(<Orig />);
  const result = renderer.getRenderOutput();
  t.deepEqual(result.type, "div");
  t.deepEqual(result.props.style, [{ fontWeight: "bold" }]);
  t.end();
});

test("wrapping render functions", t => {
  const Orig = wrap(props => <div classNames={props.xx}>Some Text</div>);

  const renderer = new ShallowRenderer();
  renderer.render(<Orig xx="b" />);
  const result = renderer.getRenderOutput();
  t.deepEqual(result.type, "div");
  t.deepEqual(result.props.style, [{ fontWeight: "bold" }]);
  t.end();
});
