import pkg from "./package.json" with {type: "json"};
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import babel from "rollup-plugin-babel";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const plugins = [
    postcss({
        config: {
            path: "./postcss.config.js"
        },
        extensions: [".css", ".scss"],
        minimize: true,
    }),
    resolve(),
    commonjs({
        include: /node-modules/
    }),
    babel({
        exclude: "node_modules/**",
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        presets: [
            ["@babel/preset-env", {targets: {esmodules: true}}],
            ["@babel/preset-react", {runtime: "automatic"}]
        ],
        plugins: [
            ["@babel/plugin-transform-runtime", {regenerator: true, helpers: false, /*corejs: 3*/}],
            "@babel/plugin-transform-async-to-generator",
            "@babel/plugin-transform-react-jsx"
        ],
        runtimeHelpers: true
    }),
    // typescript(),
    // del({targets: ["dist/*"]})
];

export default [
    {
        input: "build/compiled/index_no_css.js",
        output: {
            file: pkg.main.replace("/index", "/index_no_css"),
            format: "cjs",
        },
        plugins: plugins,
        external: Object.keys(pkg.peerDependencies || {})
    },
    {
        input: "build/compiled/index.js",
        output: {
            file: pkg.main,
            format: "cjs",
        },
        plugins: plugins,
        external: Object.keys(pkg.peerDependencies || {})
    },
    {
        input: "build/compiled/index_no_css.js",
        output: {
            file: pkg.module.replace("/index", "/index_no_css"),
            format: "esm",
        },
        plugins: plugins,
        external: Object.keys(pkg.peerDependencies || {})
    },
    {
        input: "build/compiled/index.js",
        output: {
            file: pkg.module,
            format: "esm",
        },
        plugins: plugins,
        external: Object.keys(pkg.peerDependencies || {})
    },
    // {
    //     input: "build/compiled/index.d.ts",
    //     output: [
    //         {
    //             file: "dist/react-ez-checkout.d.ts",
    //             format: "es",
    //             // exports: "default"
    //         },
    //     ],
    //     plugins: [dts()],
    // }
]

