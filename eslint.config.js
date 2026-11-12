// The rules TeamUp's code must follow. They're the same rules CLAUDE.md gives the AI,
// written so a machine can check them: `npm run check` fails when one is broken.
module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "script" },
    rules: {
      // Readable: names say what they hold. No one-letter names, except i for a loop counter.
      "id-length": ["error", { min: 2, exceptions: ["i"], properties: "never" }]
    }
  }
];
