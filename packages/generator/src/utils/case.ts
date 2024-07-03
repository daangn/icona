/**
 * @description Convert a kebab-case or snake_case string to camelCase.
 */
export const toCamelCase = (str: string) => {
  return str.replace(/[_-](\w)/g, (_, char) => char.toUpperCase());
};

/**
 * @description Convert a kebab-case or snake_case string to PascalCase.
 */
export const toPascalCase = (str: string) => {
  return str
    .replace(/[_-](\w)/g, (_, char) => char.toUpperCase())
    .replace(/^\w/, (char) => char.toUpperCase());
};
