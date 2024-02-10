const config = {
  extends: ["stylelint-config-standard", "stylelint-config-recess-order"],
  rules: {
    "selector-class-pattern": null,
  },
  ignoreFiles: ["node_modules/**", "dist/**"],
};

export default config;
