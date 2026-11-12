// The expected answers come from the rules on the page, not from the code:
// "Teams of 2 to 3 people." Run with: npm test
const test = require("node:test");
const assert = require("node:assert");
const { canJoin, matches, parseSkills } = require("./teamup.js");

function teamWith(size) {
  const people = [...Array(size).keys()].map(index => ({ id: index + 1, teamId: 7 }));
  return { team: { id: 7 }, people };
}

test("a team of 0, 1 or 2 has room for one more", () => {
  for (const size of [0, 1, 2]) {
    const { team, people } = teamWith(size);
    assert.strictEqual(canJoin(team, people), true, `a team of ${size}`);
  }
});

test("a full team of 3 has no room", () => {
  const { team, people } = teamWith(3);
  assert.strictEqual(canJoin(team, people), false);
});

test("search ignores capitals and extra spaces", () => {
  assert.ok(matches("Python Django", "python"));
  assert.ok(matches("An AI study buddy for exam revision", "  ai "));
});

test("skills are trimmed, empty ones dropped, repeats removed", () => {
  assert.deepStrictEqual(parseSkills(" React, ,Node,React "), ["React", "Node"]);
});
