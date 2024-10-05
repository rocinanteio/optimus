import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import type { Plugin } from 'vite';
import generate from '@babel/generator';
import { IconManager } from './icon-manager';

const iconSet = new Set<string>();
const IconManagerInstance = new IconManager();

export const optimusPlugin = (): Plugin => {
  const getIconName = function (
    attribute: t.JSXAttribute | t.JSXSpreadAttribute,
  ) {
    if (t.isJSXAttribute(attribute)) {
      if (t.isStringLiteral(attribute.value)) {
        return attribute.value.value;
      }

      if (
        t.isJSXExpressionContainer(attribute.value) &&
        t.isStringLiteral(attribute.value.expression)
      ) {
        return attribute.value.expression.value;
      }
    }
  };

  const getIconIdentifier = function (element: t.JSXOpeningElement) {
    return element.attributes.find(
      (attr) =>
        t.isJSXAttribute(attr) &&
        t.isJSXIdentifier(attr.name, { name: 'ty-icon' }) &&
        (t.isStringLiteral(attr.value) ||
          t.isJSXExpressionContainer(attr.value)),
    );
  };

  return {
    name: 'optimus-bundle',
    enforce: 'pre',
    async transform(code: string, id: string) {
      if (!id.endsWith('.jsx') && !id.endsWith('.tsx')) {
        return null;
      }

      const ast = parse(code, {
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

      const output = generate.default(ast, {});
      return {
        code: output.code,
      };
    },
  };
};
