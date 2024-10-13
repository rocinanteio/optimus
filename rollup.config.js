import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';

export default [
  {
    input: 'src/optimus-vite-plugin.ts',
    output: [
      {
        file: 'dist/optimus-vite-plugin.cjs',
        format: 'cjs',
        exports: 'named',
      },
      {
        file: 'dist/optimus-vite-plugin.js',
        format: 'esm',
      },
    ],
    plugins: [
      json(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
    ],
  },
  {
    input: 'src/optimus-webpack-loader.ts',
    output: [
      {
        file: 'dist/optimus-webpack-loader.cjs',
        format: 'cjs',
        exports: 'named',
      },
      {
        file: 'dist/optimus-webpack-loader.js',
        format: 'esm',
      },
    ],
    plugins: [
      json(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
    ],
  },
];
