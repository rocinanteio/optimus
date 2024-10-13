import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { getIconIdentifier, getIconName } from '../utils';
import { IconManager } from '../icon-manager';
import generate from '@babel/generator';

const iconSet = new Set<string>();
const IconManagerInstance = new IconManager();

export const jsxTraverse = async (sourceCode: string) => {
  const ast = parse(sourceCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  // Find Available Icons
  // @ts-ignore
  traverse.default(ast, {
    JSXElement(path: NodePath<t.JSXElement>) {
      const openingElement = path.node.openingElement;
      if (t.isJSXIdentifier(openingElement.name, { name: 'i' })) {
        const element = getIconIdentifier(openingElement);
        if (!element) return;
        const name = getIconName(element);
        if (name) {
          iconSet.add(name);
        }
      }
    },
  });

  // Fetch Icons
  const list = Array.from(iconSet.values());
  await IconManagerInstance.addIcons(list);

  // @ts-ignore
  traverse.default(ast, {
    JSXElement(path: NodePath<t.JSXElement>) {
      const openingElement = path.node.openingElement;
      if (t.isJSXIdentifier(openingElement.name, { name: 'i' })) {
        const element = getIconIdentifier(openingElement);
        if (!element) return;

        let iconName = getIconName(element);
        if (iconName) {
          const icon = IconManagerInstance.getIcon(iconName);
          if (!icon) return;

          const newChild = t.jsxText(icon);

          if (!path.node.children) {
            path.node.children = [];
          }

          path.node.children.push(newChild);
        }
      }
    },
  });

  // @ts-ignore
  const output = generate.default(ast, {});
  return output.code;
};
