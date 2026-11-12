# TeamUp

A hackathon team finder: sign up solo, search for people by skill, and join a team.

TeamUp was vibe-coded in one evening. It works. It also breaks six classic maintenance rules, on purpose. It's the practice project for the workshop **Maintainability of AI-Assisted Projects** (IEEE AUB Student Branch x Maaloomatiia, 12 November 2026).

The `main` branch is TeamUp as shipped: the bugs and the broken rules are all there. Each chapter's fixed version is saved as a tag (see below).

**Using these rules on your own project?** Start with [PLAYBOOK.md](PLAYBOOK.md): the setup prompt, one prompt per rule, and the files to copy.

## Get it

```bash
git clone https://github.com/NinjaCoder8/teamup
cd teamup
```

No git? Click **Code**, then **Download ZIP**, and unzip it.

## Run it

Open `index.html` in your browser. Nothing to install.

## Check it

The checks need Node.js 20.19 or later (22 or 24 is fine). Run `npm install` once, then:

```bash
npm run check
```

(`package.json` pins `minimatch` 11.0.1 under `overrides`: ESLint 10 still asks for an older version with a known advisory, and this keeps `npm install` at 0 vulnerabilities.)

At the start, `npm run check` passes because no rules are switched on yet. The workshop adds one rule per chapter: a line in `CLAUDE.md`, a check that fails when the rule is broken, and a Claude Code hook (`.claude/settings.json`) that runs the checks after every edit Claude makes. Each rule fails on TeamUp as shipped, then Claude fixes the code.

| Rule | The check | What fails on TeamUp as shipped |
|---|---|---|
| 01 Readable | ESLint `id-length` | One-letter names: `p`, `t`, `s`, `m`, `e` |
| 02 Small | ESLint `max-lines-per-function`, `max-lines` | `render` is 59 lines long |
| 03 Simple | ESLint `complexity`, `max-depth`, `max-params` | The sign-up code nests 6 levels deep |
| 04 Not repeated | jscpd (`npm run dups`) | The two searches are one copy-pasted block, with the same bug in both |
| 05 Tested | `node --test` | A full team of 3 still accepts a fourth member |
| 06 Changed safely | Tests for the plan's edge cases | Sign-ups never close, and the deadline depends on your time zone |

## See each chapter's result

Each chapter's result is saved as a tag:

```bash
git checkout step-3   # step-0 is TeamUp as shipped, step-6 is the end
```

## Work on it with AI

Open the `teamup` folder (not just a file) in VS Code, then open the Claude Code panel. Every prompt from the workshop is in [PLAYBOOK.md](PLAYBOOK.md).
