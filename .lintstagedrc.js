export default {
  "*.{ts,tsx, json, css, md}": [
    "biome check --files-ignore-unknown=true",
    "biome check --write --no-errors-on-unmatched",
  ],
  "*": ["biome check --no-errors-on-unmatched --files-ignore-unknown=true"],
};
