# The Vibe Code Maintenance Playbook

Six rules that keep an AI-built project easy to change, and one prompt per rule that makes Claude set it up for you.

From the workshop **Maintainability of AI-Assisted Projects** (IEEE AUB Student Branch x Maaloomatiia, 12 November 2026). TeamUp, in this repository, is the practice project: it breaks all six rules on purpose.

## Why bother

Software that people use has to keep changing, and every change makes it harder to change, unless you work to keep it simple (Meir Lehman's laws of software evolution). AI makes writing code cheap. It doesn't make keeping it cheap:

- People who wrote code with AI scored 50% on a quiz about that same code, against 67% for people who wrote it by hand ([Anthropic, January 2026](https://www.anthropic.com/research/AI-assistance-coding-skills)).
- In 2024, developers pasted more code than they reused, for the first time ([GitClear, 2025](https://www.gitclear.com/ai_assistant_code_quality_2025_research)).
- For every 25% more AI use in a team, delivery stability (how rarely a release breaks something and needs an unplanned fix) dropped by an estimated 7.2% ([DORA report 2024, page 40](https://services.google.com/fh/files/misc/2024_final_dora_report.pdf#page=40)).

"It works" is half the job. You're done when it's right: when someone else can read it, change it and trust it.

## The method: tell, check, enforce

Every rule goes into your project three ways:

1. **Tell it.** Write the rule in `CLAUDE.md`, at the root of your project. Claude reads that file at the start of every chat. Write rules like a thermostat ("under 30 lines"), never like a vibe ("keep it clean"), because a vague rule can't be checked.
2. **Check it.** Turn the rule into a lint rule or a test that fails when the rule is broken.
3. **Enforce it.** A Claude Code hook runs the checks after every edit Claude makes. If a check fails, Claude sees the errors right away, while it's still working, and fixes them.

You don't write any of this by hand. Paste the setup prompt once, then one prompt per rule.

## Step 0: set up once

1. In VS Code, install the **Claude Code** extension (by Anthropic). Open your project **folder**, not a single file. Open the Claude panel (the spark icon, or Cmd/Ctrl+Esc; on macOS Tahoe, Cmd+Esc may open Game Overlay instead: turn that shortcut off in System Settings, Keyboard, Keyboard Shortcuts, Game Controllers).
2. Save where you are first: `git add -A && git commit -m "Before the checks"`.
3. Paste this in the Claude panel:

```text
Set up checks for this project, once. First, if git shows uncommitted changes, stop and ask me to commit.
1. Install ESLint and jscpd as dev dependencies. Keep any ESLint config or test script that already exists; otherwise add an eslint.config.js with no rules yet.
2. Add npm scripts: lint, test (node --test if there's no test runner yet), and check, which runs lint, then test.
3. Add a hook in .claude/settings.json: after every Edit or Write, run npm run check, send its output to stderr, and exit with code 2 if it fails.
4. In CLAUDE.md, add a Checks section: npm run check must pass before you say you're done. If it fails, fix the code, never loosen a rule.
Then run npm run check and tell me how many files each check read.
```

4. To see the hook, open **Customize**, then **Hooks**, in the Claude panel (in the terminal version, type `/hooks`). If it isn't listed, reload the window.

**Not JavaScript?** The method is the same. Swap the tools: for Python, for example, ruff instead of ESLint and pytest instead of `node --test`. jscpd reads most languages. Ask Claude: "What are the equivalent checks for this project's language?"

## Already have a big project?

TeamUp is small. Your project probably breaks these rules in many places, and "fix the code, never the rule" would turn into a refactor nobody can review. So count first, and freeze what's already there. Paste this before each rule:

```text
Before you add a rule, count how many places in this project already break it, and stop. If there are more than a few, record the existing errors as known (for ESLint: npx eslint --suppress-all), so only new or changed code must pass. Then we fix the old ones a few at a time.
```

ESLint keeps the old errors in `eslint-suppressions.json` with a count per file. A new break still fails, and `npx eslint --prune-suppressions` removes the ones you've fixed. It's a list that can only shrink.

**Add rule 05, Tested, first.** On TeamUp we go in order, but on your own project, tests are what prove each clean-up didn't change what the app does.

## The six rules

Add them one at a time. Each prompt ends the same way: **fix the code, never the rule**. The easiest way for an AI to make a check pass is to loosen the check.

### 01 Readable

> "Programs must be written for people to read, and only incidentally for machines to execute." (Harold Abelson and Gerald Jay Sussman)

You read code far more than you write it. And how you use the AI matters: in the same Anthropic trial, people who asked the AI to explain scored 65% or more on the quiz, while people who let it write or debug for them scored under 40%.

- **Tell:** a map of the files and the decisions the code makes, in `CLAUDE.md`. Names say what they hold.
- **Check:** ESLint `id-length` (no one-letter names, except `i`).

```text
Add the rule Readable to this project.
1. In CLAUDE.md, write a map of the files and the decisions this code makes that a newcomer wouldn't guess. Then add the rule: names say what they hold, no one-letter names except i.
2. In eslint.config.js, add id-length: min 2, exceptions ["i"], properties "never".
3. Run npm run check and show me what fails. Then fix the code, never the rule.
```

Read what it writes down: the decisions to keep, and the known problems to fix. They're the things nobody decided on purpose.

### 02 Small

> "If we wish to count lines of code, we should not regard them as 'lines produced' but as 'lines spent'." (Edsger W. Dijkstra)

A function does one thing if you can't pull another function out of it. Aim for a few lines; the check only stops the worst.

- **Tell:** a function stays under 30 lines, a file under 200.
- **Check:** ESLint `max-lines-per-function` and `max-lines`.

```text
Add the rule Small to this project.
1. In CLAUDE.md, under Rules: a function stays under 30 lines, a file under 200.
2. In eslint.config.js, add max-lines-per-function 30 and max-lines 200, skipping blank lines and comments.
3. Run npm run check and show me what fails. Then fix the code, never the rule.
```

### 03 Simple

> "Everyone knows that debugging is twice as hard as writing a program in the first place. So if you're as clever as you can be when you write it, how will you ever debug it?" (Brian Kernighan)

Complexity counts the paths through a function: 1, plus one for every `if`, `for`, `while`, `case`, `&&` and `||`. Every path is one more thing to test. Keep it at 10 or less ([NIST SP 500-235](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication500-235.pdf#page=35): "the original limit of 10 as proposed by McCabe has significant supporting evidence").

- **Tell:** complexity 10 or less, nesting 3 levels at most, 4 inputs at most. Return early instead of nesting.
- **Check:** ESLint `complexity`, `max-depth`, `max-params`.

```text
Add the rule Simple to this project.
1. In CLAUDE.md, under Rules: complexity 10 or less, nesting 3 levels at most, 4 inputs at most. Return early instead of nesting.
2. In eslint.config.js, add complexity 10, max-depth 3 and max-params 4.
3. Run npm run check and show me what fails. Then fix the code, never the rule.
```

### 04 Not repeated

> "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system." (Andy Hunt and Dave Thomas)

Copies drift. Every future change has to be found in every copy, and the one you miss is your next bug.

- **Tell:** each piece of logic has one home. Search before you write. When you fix a bug, look for the same mistake everywhere.
- **Check:** jscpd, a copy-paste detector.

```text
Add the rule Not repeated to this project.
1. In CLAUDE.md, under Rules: each piece of logic has one home. Search before you write. When you fix a bug, look for the same mistake everywhere.
2. Add an npm script dups that runs jscpd on the JavaScript (exit code 1 on any clone), and add it to npm run check.
3. Run npm run check and show me what fails. Then fix the code, never the rule.
```

jscpd only finds copied text. The same rule written two different ways needs the sweep:

```text
Where else in this code does the same mistake appear? List every place before changing anything.
```

### 05 Tested

> "To me, legacy code is simply code without tests." (Michael Feathers)

Tests only find the bugs you thought of ("Program testing can be used to show the presence of bugs, but never to show their absence", Edsger W. Dijkstra). So write the expected answers from the rule, before the code, and test the edges: zero, the limit, one past it.

- **Tell:** every fix starts with a test that fails without it. Expected results come from the rule, not from the code.
- **Check:** your tests (`node --test` needs nothing to install).

Replace the part in angle brackets with a rule your app promises its users:

```text
Add the rule Tested to this project.
1. In CLAUDE.md, under Rules: every fix starts with a test that fails without it. Expected results come from the rule, not from the code.
2. Write tests with node --test from this rule: <for example, "teams of 2 to 3 people">. Test zero, the limit, and one past it. Move the rule's code into a file the tests can load.
3. Run npm run check and show me what fails. Then fix the code, never the test.
```

### 06 Changed safely

> "For each desired change, make the change easy (warning: this may be hard), then make the easy change." (Kent Beck)

Leave the code a little better than you found it. A small change should cost a small effort; when it doesn't, the code is telling you something.

- **Tell:** plan before you change. Each edge case becomes a test. Small steps, each one checked.
- **Check:** each edge case becomes a test that fails before the change. Plan mode is how you get the list: Claude proposes, you approve.

First the rule, in your usual mode:

```text
Add the rule Changed safely to this project. In CLAUDE.md, under Rules: plan before you change. List the edge cases and turn each one into a test. Each test must fail first, because of what the code does, not because a function is missing. Then change in small steps, and run npm run check after each.
```

Then switch to **Plan** in the Claude panel's mode menu (typing "plan mode" in a prompt doesn't switch it), and describe your change in the angle brackets:

```text
Plan this change: <the feature or fix>. List the edge cases first, and the test for each. Don't change any code until I approve the plan.
```

After every change, ask:

```text
What did you decide that I did not tell you to decide?
```

## What the checks do, and don't do

- **When you paste a rule's prompt,** Claude writes the rule, adds the check, shows you what fails, then fixes the code until the check passes. If it stops after showing the errors, say "go ahead".
- **Later, when you build new features,** Claude reads `CLAUDE.md` at the start of every chat, and the hook runs every check after every edit Claude makes. When new code breaks a rule, Claude sees the errors right after that edit and normally fixes them in the same turn.
- **The hook can't stop Claude from finishing.** It only shows Claude the errors. So look at the last check run: it should be green.
- **The hook only runs on Claude's edits.** Code you type yourself isn't checked: run `npm run check` before you commit.
- **The checks catch shape, not meaning.** They catch long functions, deep nesting, copies and failing tests. They can't tell whether the logic is right. That's what your tests from the rule are for, and what reading every diff is for.

## Every day

- **Read every diff** before you accept it, especially the lines that disappear. To review each edit before it lands, switch the Claude panel to **Manual** mode (Auto, the default, edits without asking).
- **Undo Claude's changes:** hover over a message in the Claude panel, then **Rewind code to here**.
- **Commit before you let the AI change anything.** Git is your real undo.
- **Make it explain.** When you don't understand a file, write two sentences about what it does, then ask:

```text
Here is a file from my project and my two-sentence summary of what it does and why. Tell me where my summary is wrong or missing something important. Don't rewrite the code.
```

- **Causes before fixes.** When something breaks:

```text
Here is my code and a bug report: what I expected, what happened instead, the steps, and what I know. List the 3 most likely causes, most likely first, and how I can confirm each one. Don't change any code yet.
```

## Once a month

1. Secrets stay on the server, in a `.env` file, never in front-end code.
2. Check that every package exists before you install it. AI suggests packages that don't.
3. Update one package at a time, run the checks, commit. Then the next.
4. Restore a backup, on purpose, before you need it.
5. Read the permissions you've allowed your AI (every "don't ask again" you clicked is saved in the project).

```text
Act as a senior engineer who will be on call for this project. Check it for: secrets anyone can see in the browser, packages that don't exist or aren't pinned to a version, user input shown on the page without escaping, and data that could be lost. List what you find, worst first. Don't change any code.
```

## The files, at the end

This is what TeamUp looks like after the six prompts (`git checkout step-6`). Copy them if you'd rather start from the result.

`CLAUDE.md`, the checks and the rules:

```markdown
## Checks

- `npm run check` must pass before you say you're done. It runs automatically after every edit you make.
- If it fails, fix the code. Never loosen a rule to make it pass.

## Rules

- **Readable.** Names say what they hold: no one-letter names, except `i` for a loop counter. When the code changes, update the map and the decisions above.
- **Small.** A function stays under 30 lines. A file stays under 200 lines. If it grows past that, split it by what each part does.
- **Simple.** A function has a complexity of 10 or less, nests at most 3 levels deep, and takes at most 4 inputs. Return early instead of nesting.
- **Not repeated.** Each piece of logic has one home. Before you write code, search for code that already does it and reuse it. When you fix a bug, search for the same mistake everywhere else first. `npm run dups` fails on copy-pasted blocks.
- **Tested.** Every fix starts with a test that fails without it. Write the expected results from the rule, not from the code. Test the edges: zero, the limit, one past it.
- **Changed safely.** Plan before you change: list the edge cases and turn each one into a test. Then change in small steps, and run `npm run check` after each. After a change, list what you decided that I didn't ask for.

## How to work

- Before you change code, explain what it does and what it decides. If something isn't written here, ask.
```

`eslint.config.js`:

```js
module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "script" },
    rules: {
      "id-length": ["error", { min: 2, exceptions: ["i"], properties: "never" }],
      "max-lines-per-function": ["error", { max: 30, skipBlankLines: true, skipComments: true }],
      "max-lines": ["error", { max: 200, skipBlankLines: true, skipComments: true }],
      "complexity": ["error", 10],
      "max-depth": ["error", 3],
      "max-params": ["error", 4]
    }
  }
];
```

`package.json`, the scripts (install the tools once with `npm install --save-dev eslint jscpd`):

```json
"scripts": {
  "lint": "eslint .",
  "dups": "jscpd .",
  "test": "node --test --test-reporter=spec",
  "check": "npm run lint && npm run dups && npm test"
}
```

`.jscpd.json`:

```json
{
  "format": ["javascript"],
  "ignore": ["**/node_modules/**"],
  "exitCode": 1,
  "reporters": ["console"]
}
```

`.claude/settings.json`, the hook:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "cd \"$CLAUDE_PROJECT_DIR\" && if [ ! -d node_modules ]; then exit 0; fi && npm run --silent check 1>&2 || exit 2"
          }
        ]
      }
    ]
  }
}
```

After every edit Claude makes, the hook runs `npm run check`. If a check fails, it exits with code 2, so Claude sees the errors right away. It can't stop Claude from finishing, so look at the last run. It skips itself until you've run `npm install`.

## Sources

- Quiz scores with and without AI: [Anthropic, 29 January 2026](https://www.anthropic.com/research/AI-assistance-coding-skills).
- Copy-pasted and moved code, 2021 to 2024: [GitClear, "AI Copilot Code Quality: 2025 Look Back at 12 Months of Data"](https://www.gitclear.com/ai_assistant_code_quality_2025_research).
- Delivery stability and AI adoption: [DORA, Accelerate State of DevOps report 2024, page 40](https://services.google.com/fh/files/misc/2024_final_dora_report.pdf#page=40).
- The complexity limit of 10: [NIST Special Publication 500-235, Structured Testing, 1996](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication500-235.pdf#page=35).

---

You don't have to write every line yourself. You have to be able to explain every decision in it.
