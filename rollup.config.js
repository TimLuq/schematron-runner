import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

import pkg from './package.json';

import { resolve as resolvePath } from "path";

// function terser() { return { name: "terser" }; }

function idResolver(options = {}) {
    return {
        name: 'xpath-resolver',
        resolveId(importee) {
            if (importee === "xpath") {
                return resolvePath(process.cwd(), "node_modules", "xpath", "xpath.js");
            }
            if (importee === "regenerator-runtime/runtime") {
                return resolvePath(process.cwd(), "node_modules", "regenerator-runtime", "runtime.js");
            }
            return (options.resolveId && options.resolveId[importee]) || null;
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
		external: ['fs', 'node-fetch', 'xmldom', 'crypto', './dom-parser'],
		output: {
            name: pkg.name,
            sourcemap: true,
			file: pkg.browser,
            format: 'umd',
            exports: 'named',
        },
        plugins: [
			idResolver(),
            sourcemaps(),
            commonjs(),
            babel(babelConf("> 5%, not dead")),
            terser(),
		]
    },

	// bundle [parse5 parser](https://www.npmjs.com/package/parse5), which is under MIT license
	{
		input: 'esm/dom-parser.js',
		external: ["parse5/lib/parser/index.js"],
		output: [
            {
                banner: "// minimized xmldom parser: https://www.npmjs.com/package/xmldom",
                name: "dom-parser",
                sourcemap: true,
                file: "build/dom-parser.js",
                format: 'umd',
                exports: 'named',
            },
            {
                banner: "// minimized xmldom parser: https://www.npmjs.com/package/xmldom",
                name: "dom-parser",
                sourcemap: true,
                file: "build/dom-parser.mjs",
                format: 'es',
                exports: 'named',
            },
        ],
        plugins: [
			resolve(),
            sourcemaps(),
            commonjs(),
            babel(babelConf("> 5%, not dead")),
            terser(),
		]
	},

	{
		input: 'esm/schematron-runner.js',
		external: ['fs', 'node-fetch', 'xpath', 'xmldom', 'crypto', './dom-parser.js'],
		output: [
			{ file: pkg.cjs, sourcemap: true, format: 'cjs', exports: 'named' },
		],
        plugins: [
            idResolver({ resolveId: {
                "./dom-parser": "./dom-parser.js",
            }}),
			resolve(),
            sourcemaps(),
            babel(babelConf({ node: "8" })),
            terser(),
		]
    },

	{
		input: 'esm/schematron-runner.js',
		external: ['fs', 'node-fetch', 'xpath', 'xmldom', 'crypto', './dom-parser.mjs'],
		output: [
			{ file: pkg.module, sourcemap: true, format: 'es', exports: 'named' },
		],
        plugins: [
            idResolver({ resolveId: {
                "./dom-parser": "./dom-parser.mjs",
            }}),
			resolve(),
            sourcemaps(),
            babel(babelConf({ chrome: "64" })),
            terser(),
		]
    },

	{
		input: 'esm/schematron-runner.js',
		external: ['fs', 'node-fetch', 'xpath', 'xmldom', './dom-parser'],
		output: { file: pkg.cjsDebug, sourcemap: true, format: 'cjs', exports: 'named' },
        plugins: [
            sourcemaps(),
		]
    },
    
	{
		input: 'esm/bin.js',
		external: ['fs', 'node-fetch', 'xpath', 'xmldom', 'crypto', './dom-parser'],
		output: [
			{ file: pkg.bin, sourcemap: true, format: 'cjs', exports: 'named', banner: "#!/usr/bin/env node\ntry { require('source-map-support').install(); } catch (_) {}" },
		],
        plugins: [
            resolve(),
            sourcemaps(),
            // babel(babelConf({ node: "8" })),
            // terser(),
		]
	}
];
