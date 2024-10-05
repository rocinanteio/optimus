import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.ts', // Pluginin ana dosyası
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs', // CommonJS formatı
      exports: 'named',
    },
    {
      file: 'dist/index.js',
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
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react'], // Eğer JSX kullanıyorsan
    }),
  ],
};
