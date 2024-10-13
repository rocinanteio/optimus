import type { Plugin } from 'vite';
import { jsxTraverse } from './babel/jsx-traverse';

export const optimusVitePlugin = (): Plugin => {
  return {
    name: 'optimus-bundle',
    enforce: 'pre',
    async transform(code: string, id: string) {
      if (!id.endsWith('.jsx') && !id.endsWith('.tsx')) {
        return null;
      }

      return {
        code: await jsxTraverse(code),
      };
    },
  };
};
