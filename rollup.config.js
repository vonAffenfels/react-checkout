import pkg from "./package.json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import babel from "rollup-plugin-babel";
import typescript from "@rollup/plugin-typescript";

export default [
    // {
    //     input: "src/index.tsx",
    //     output: [
    //         // {
    //         //     file: pkg.main,
    //         //     format: "cjs",
    //         //     exports: "default"
    //         // },
    //         {
    //             file: pkg.module,
    //             format: "esm",
    //             exports: "default"
    //         }
    //     ],
    //     plugins: [
    //         postcss({
    //             config: {
    //                 path: "./postcss.config.js"
    //             },
    //             extensions: [".css", ".scss"],
    //             minimize: true,
    //             inject: {
    //                 insertAt: "top"
    //             }
    //         }),
    //         resolve(),
    //         commonjs({
    //             include: /node-modules/
    //         }),
    //         babel({
    //             exclude: "node_modules/**",
    //             extensions: [".js", ".jsx"],
    //             presets: [
    //                 ["@babel/preset-env", {targets: {esmodules: true}}],
    //                 ["@babel/preset-react", {runtime: "automatic"}]
    //             ],
    //             plugins: [
    //                 ["@babel/plugin-transform-runtime", {regenerator: true, helpers: false, /*corejs: 3*/}],
    //                 "@babel/plugin-transform-async-to-generator",
    //                 "@babel/plugin-transform-react-jsx"
    //             ],
    //             runtimeHelpers: true
    //         }),
    //         typescript(),
    //         // del({targets: ["dist/*"]})
    //     ],
    //     external: Object.keys(pkg.peerDependencies || {})
    // },
    {
        input: "src/index_no_css.tsx",
        output: [
            // {
            //     file: pkg.main.replace("/index", "/index_no_css"),
            //     format: "cjs",
            //     exports: "default"
            // },
            {
                file: pkg.module.replace("/index", "/index_no_css"),
                format: "esm",
                exports: "default"
            }
        ],
        plugins: [
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
                extensions: [".js", ".jsx"],
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
            typescript(),
            // del({targets: ["dist/*"]})
        ],
        external: Object.keys(pkg.peerDependencies || {})
    },
    {
        input: "build/compiled/index.d.ts",
        output: [
            {
                file: "dist/react-ez-checkout.d.ts",
                format: "es",
                exports: "default"
            },
        ],
    }
]

