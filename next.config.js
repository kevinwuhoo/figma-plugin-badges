const isDocs = process.env.BUILD_DOCS === "true";

module.exports = {
  assetPrefix: isDocs ? "/figma-plugin-badges/" : "",
};
