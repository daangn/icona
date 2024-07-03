// index.vue 파일 내용을 생성하는 함수
interface GenerateIndexFileTemplateProps {
  componentNames: string[];
  ext: string | null;
}

export const ignores = `/* eslint-disable */ // @ts-nocheck @ts-ignore`;

export const generateIndexFileTemplate = (
  props: GenerateIndexFileTemplateProps,
) => {
  const { componentNames, ext } = props;
  const imports = componentNames
    .map((name) => {
      const importName = ext ? `${name}.${ext}` : name;
      return `export { default as ${name} } from "./${importName}";`;
    })
    .join("\n");
  return `${ignores}\n${imports}\n`;
};
