import { getCdn } from './service';
import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

export const optimusPlugin = () => {
  const iconSet = new Set();
  return {
    name: 'optimus-bundle',
    transform(code: string, id: string) {
      if (!id.endsWith('.jsx') && !id.endsWith('.tsx')) {
        return null;
      }

      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });

      if (
        id ===
        '/Users/ibrahim.dagdelen/Projects/Github/icon-usage-benchmark/svg-converter-demo/src/App.tsx'
      ) {
        console.log('ast');
      }
      // @ts-ignore
      traverse.default(ast, {
        JSXElement(path) {
          console.log('asdfasd');
          const openingElement = path.node.openingElement;

          if (t.isJSXIdentifier(openingElement.name, { name: 'ty-icon' })) {
            console.log('sadfads');
          }
        },
        CallExpression(path: NodePath<t.CallExpression>, opts: t.Node) {
          const callee = path.node.callee;

          callee.naöme = 'jsx';

          if (t.isJSXElement(callee)) {
            // Eğer JSX öğesi ise, children eklemek için
            const jsxElement = callee;

            // Yeni children'ı oluştur
            const newChild = t.jsxElement('<svg></svg>'); // veya istediğin bir JSX öğesi

            // Eğer children yoksa bir dizi oluştur
            if (!jsxElement.openingElement.attributes) {
              jsxElement.children = [];
            }

            // Yeni child'ı children dizisine ekle
            jsxElement.children.push(newChild);

            console.log('Yeni child eklendi:', newChild);
          }
        },
      });

      return {
        code: code,
      };
    },
    async buildEnd() {
      const icons = Array.from(iconSet) as string[];

      for (const icon of icons) {
        await getCdn(icon);
      }

      console.log('\nOptimus Icons:', Array.from(iconSet));
    },
  };
};
