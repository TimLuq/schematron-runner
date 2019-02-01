import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

import pkg from './package.json';

import { resolve as resolvePath } from "path";

// function terser() { return { name: "terser" }; }

function xpathResolver() {
    return {
        name: 'xpath-resolver',
        resolveId(importee) {
            if (importee === "xpath") {
                return resolvePath(process.cwd(), "node_modules", "xpath", "xpath.js");
            }
            if (importee === "regenerator-runtime/runtime") {
                return resolvePath(process.cwd(), "node_modules", "regenerator-runtime", "runtime.js");
            }
            /*
            if (!importee.endsWith(".js")) {
                console.log("Resolve: %s", importee);
            }
            */
            return null;
        }
    };
}

function babelConf(targets) {
    return {
        plugins: [ "@babel/plugin-syntax-dynamic-import" ],
        presets: [['@babel/env', { targets }]],
    };
}

export default [
	// browser-friendly UMD build
	{
		input: 'esm/browser.js',
		external: ['fs', 'node-fetch', 'xmldom', 'crypto'],
		output: {
            name: pkg.name,
            sourcemap: true,
			file: pkg.browser,
            format: 'umd',
            exports: 'named',
        },
        plugins: [
			xpathResolver(),
            sourcemaps(),
            commonjs(),
            babel(babelConf("> 5%, not dead")),
            terser(),
		]
	},

	{
		input: 'esm/schematron-runner.js',
		external: ['fs', 'node-fetch', 'xpath', 'xmldom', 'crypto'],
		output: [
			{ file: pkg.cjs, sourcemap: true, format: 'cjs', exports: 'named' },
			{ file: pkg.module, sourcemap: true, format: 'es', exports: 'named' },
		],
        plugins: [
			resolve(),
            sourcemaps(),
            babel(babelConf({ chrome: "64", node: "8" })),
            terser(),
		]
    },

	{
		input: 'esm/schematron-runner.js',
		external: ['fs', 'node-fetch', 'xpath', 'xmldom'],
		output: { file: pkg.cjsDebug, sourcemap: true, format: 'cjs', exports: 'named' },
        plugins: [
            sourcemaps(),
		]
    },
    
	{
		input: 'esm/bin.js',
		external: ['fs', 'node-fetch', 'xpath', 'xmldom', 'crypto'],
		output: [
			{ file: pkg.bin, sourcemap: true, format: 'cjs', exports: 'named', banner: "#!/usr/bin/env node" },
		],
        plugins: [
            resolve(),
            sourcemaps(),
            babel(babelConf({ node: "8" })),
            terser(),
		]
	}
];
