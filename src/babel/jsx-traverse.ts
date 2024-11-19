import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { getIconIdentifier, getIconName, getStyleIdentifier } from '../utils';
import { IconManager } from '../icon-manager';
import generate from '@babel/generator';

const iconSet = new Set<string>();
const IconManagerInstance = new IconManager();

export const jsxTraverse = async (sourceCode: string) => {
  const ast = parse(sourceCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });
  let styleElement: t.JSXAttribute |t.JSXSpreadAttribute = undefined

  // Find Available Icons
  // @ts-ignore
  traverse.default(ast, {
    JSXElement(path: NodePath<t.JSXElement>) {
      const openingElement = path.node.openingElement;

      if (t.isJSXIdentifier(openingElement.name, { name: 'i' })) {
        const element = getIconIdentifier(openingElement);
        styleElement = getStyleIdentifier(openingElement);

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
          // let icon = `
          //  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          //       <circle cx="12" cy="12" r="10"/>
          //       <line x1="12" y1="8" x2="12" y2="12"/>
          //       <line x1="12" y1="16" x2="12.01" y2="16"/>
          //   </svg>
          //   `

          let icon = IconManagerInstance.getIcon(iconName);

          if (styleElement) {
            const svgAst = parse(icon, {
              sourceType: "module",
              plugins: ["jsx"],
            });

            // @ts-ignore
            traverse.default(svgAst, {
              JSXOpeningElement(path:NodePath<t.JSXOpeningElement>) {
                const openingElement = path.node;

                if (t.isJSXIdentifier(openingElement.name, { name: 'svg' })) {
                  // @ts-ignore
                  openingElement.attributes.push(styleElement);
                }
              },
            });

            // @ts-ignore
            console.log("generate.default(svgAst, {}).code",generate.default(svgAst).code);

            // @ts-ignore
            icon = generate.default(svgAst, {}).code
          }

          if (!icon) return;

          const newChild = t.jsxText(icon);

          if (!path.node.children) {
            path.node.children = [];
          }

          if (path.node.openingElement.selfClosing) {
            path.node.openingElement.selfClosing = false
            path.node.closingElement = {
              ...path.node.openingElement,
              type: "JSXClosingElement",
            }
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
