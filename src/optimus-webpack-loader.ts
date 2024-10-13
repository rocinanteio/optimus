import { jsxTraverse } from './babel/jsx-traverse';

module.exports = async (source: string) => {
  return await jsxTraverse(source);
};
