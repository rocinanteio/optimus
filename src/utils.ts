import * as t from '@babel/types';

export const getIconIdentifier = function (element: t.JSXOpeningElement) {
  return element.attributes.find(
    (attr) =>
      t.isJSXAttribute(attr) &&
      t.isJSXIdentifier(attr.name, { name: 'ty-icon' }) &&
      (t.isStringLiteral(attr.value) || t.isJSXExpressionContainer(attr.value)),
  );
};

export const getStyleIdentifier = function (element: t.JSXOpeningElement) {
  return element.attributes.find(
    (attr) =>
      t.isJSXAttribute(attr) &&
      t.isJSXIdentifier(attr.name, { name: 'style' })
  );
};

export const getIconName = function (
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
