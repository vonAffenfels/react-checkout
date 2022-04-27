import del from "rollup-plugin-delete";
import pkg from "./package.json";

export default [
    {
        input: "src/index.jsx",
        output: [
            {
                file: pkg.main,
                format: "cjs"
            },
            {
                file: pkg.module,
                format: "esm"
            }
        ],
        plugins: [
            del({targets: ["dist/*"]})
        ],
        external: Object.keys(pkg.peerDependencies || {})
    }
]
