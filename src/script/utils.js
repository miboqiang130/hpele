import * as prettier from "prettier/standalone";

/**
 * 格式化代码
 */
export const formatCode = async (language, value) => {
  let options = {};
  switch (language) {
    case "javascript":
      options = {
        parser: "babel",
        plugins: [await import("prettier/plugins/babel"), await import("prettier/plugins/estree")],
        tabWidth: 4,
      };
      break;
    case "css":
    case "less":
      options = {
        parser: "less",
        plugins: await import("prettier/plugins/postcss"),
        tabWidth: 4,
      };
      break;
  }
  return await prettier.format(value, options);
};
