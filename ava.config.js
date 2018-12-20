export default {
    babel: {
        testOptions: {
            plugins: [
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-syntax-dynamic-import",
            ],
            presets: [
                ["@babel/env", {
                    modules: "commonjs",
                    targets: {
                        node: "current",
                    },
                }],        
                ["@babel/preset-typescript", {}],
            ]
        },
        extensions: ["ts", "js"]
    },
    // compileEnhancements: false,
    // extensions: ["ts", "js"],
    files: ["./test/tests/*.spec.ts"]
};
