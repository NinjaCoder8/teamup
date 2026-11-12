// The rules TeamUp's code must follow. They're the same rules CLAUDE.md gives the AI,
// written so a machine can check them: `npm run check` fails when one is broken.
module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "script" },
    rules: {
      // No rules yet: the workshop adds one per chapter.
    }
  }
];
