import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';

export default {
  input: 'src/optimus-plugin.ts', // Pluginin ana dosyası
  output: [
    {
      file: 'dist/optimus-plugin.cjs.js',
      format: 'cjs', // CommonJS formatı
      exports: 'named',
    },
    {
      file: 'dist/optimus-plugin.js',
      format: 'esm', // ES Module formatı
    },
  ],
  plugins: [
    json(),
    commonjs(), // CommonJS modüllerini dönüştürmek için
    typescript({
      tsconfig: './tsconfig.json', // TypeScript yapılandırma dosyasının yolu
    }),
    babel({
      exclude: 'node_modules/**', // Babel'in hangi dosyaları dönüştüreceğini belirt
      presets: ['@babel/preset-env', '@babel/preset-react'], // Eğer JSX kullanıyorsan
    }),
  ],
};
