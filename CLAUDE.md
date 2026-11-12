# TeamUp

A hackathon team finder: people sign up solo, search by skill, and join teams of 2 to 3.
Plain HTML, CSS and JavaScript. No build and no server: open `index.html` in a browser.

## Map

- `index.html`: the page and its styles.
- `teamup.js`: TeamUp's rules (team size, search, skills, the deadline), with no page in them.
- `teamup.test.js`: the tests for those rules.
- `app.js`: the page: the data, rendering, search, sign-up, joining a team, the admin reset.
- `eslint.config.js`: the rules below, written as checks.
- `.claude/settings.json`: runs `npm run check` after every edit Claude makes.
- `.jscpd.json`: the settings for `npm run dups`, the copy-paste check.
## Decisions this code makes (keep them unless I say otherwise)

- Data lives in each visitor's browser (`localStorage`, key `teamup`). Two visitors never see each other's sign-ups.
- A team of 1 counts as valid: `MIN_TEAM` is defined but never used. Ask the organisers before changing it.

## Known problems (fix them when you touch that code)

- The deadline is read in each visitor's own time zone, the countdown goes negative after it, and sign-ups never close.
- The admin password is in `app.js`, readable by anyone who opens the page.
- What visitors type is shown as HTML: a name typed as `<b>Alex</b>` shows in bold, and code hidden in a name can run.

## Checks

- `npm run check` must pass before you say you're done. It runs automatically after every edit you make.
- If it fails, fix the code. Never loosen a rule to make it pass.

## Rules

- **Readable.** Names say what they hold: no one-letter names, except `i` for a loop counter. When the code changes, update the map, the decisions and the known problems above.
- **Small.** A function stays under 30 lines. A file stays under 200 lines. If it grows past that, split it by what each part does.
- **Simple.** A function has a complexity of 10 or less, nests at most 3 levels deep, and takes at most 4 inputs. Return early instead of nesting.
- **Not repeated.** Each piece of logic has one home. Before you write code, search for code that already does it and reuse it. When you fix a bug, search for the same mistake everywhere else first. `npm run dups` fails on copy-pasted blocks.
- **Tested.** Every fix starts with a test that fails without it. Write the expected results from the rule, not from the code. Test the edges: zero, the limit, one past it.
## How to work

- Before you change code, explain what it does and what it decides. If something isn't written here, ask.
