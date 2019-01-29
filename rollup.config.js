import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
// import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';

import pkg from './package.json';

import { resolve as resolvePath } from "path";

function terser() { return { name: "terser" }; }

function xpathResolver() {
    return {
        name: 'xpath-resolver',
        resolveId(importee) {
            if (importee === "xpath") {
                return resolvePath(process.cwd(), "node_modules", "xpath", "xpath.js");
            }
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
		external: ['fs', 'node-fetch', 'xmldom'],
		output: {
			name: pkg.name,
			file: pkg.browser,
            format: 'umd',
            exports: 'named',
        },
        plugins: [
			xpathResolver(),
            sourcemaps(),
            babel(babelConf("> 0.25%, not dead")),
            terser(),
		]
	},

	{
		input: 'esm/schematron-runner.js',
		external: ['fs', 'node-fetch', 'xpath', 'xmldom'],
		output: [
			{ file: pkg.main, format: 'cjs', exports: 'named' },
			{ file: pkg.module, format: 'es', exports: 'named' },
		],
        plugins: [
			resolve(),
            sourcemaps(),
            babel(babelConf({ chrome: "62", node: "8" })),
            terser(),
		]
    },
    
	{
		input: 'esm/bin.js',
		external: ['fs', 'node-fetch', 'xpath', 'xmldom'],
		output: [
			{ file: pkg.bin, format: 'cjs', exports: 'named', banner: "#!/usr/bin/env node" },
		],
        plugins: [
            resolve(),
            sourcemaps(),
            babel(babelConf({ node: "8" })),
            terser(),
		]
	}
];
