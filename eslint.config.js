// The rules TeamUp's code must follow. They're the same rules CLAUDE.md gives the AI,
// written so a machine can check them: `npm run check` fails when one is broken.
module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "script" },
    rules: {
      // Readable: names say what they hold. No one-letter names, except i for a loop counter.
      "id-length": ["error", { min: 2, exceptions: ["i"], properties: "never" }],
      // Small: a function stays under 30 lines, a file under 200.
      "max-lines-per-function": ["error", { max: 30, skipBlankLines: true, skipComments: true }],
      "max-lines": ["error", { max: 200, skipBlankLines: true, skipComments: true }]
    }
  }
];
