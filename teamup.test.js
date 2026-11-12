// The expected answers come from the rules on the page, not from the code:
// "Teams of 2 to 3 people." Run with: npm test
const test = require("node:test");
const assert = require("node:assert");
const { canJoin, matches, parseSkills, isOpen, timeLeft } = require("./teamup.js");

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

// Edge cases from the plan. The deadline: 23:59 Beirut time on 19 November is 21:59 UTC.
test("sign-ups are open one minute before the deadline", () => {
  assert.strictEqual(isOpen(new Date("2026-11-19T21:58:00Z")), true);
});

test("sign-ups are closed at the exact minute, and after it", () => {
  assert.strictEqual(isOpen(new Date("2026-11-19T21:59:00Z")), false);
  assert.strictEqual(isOpen(new Date("2026-11-20T08:00:00Z")), false);
});

test("the countdown never goes negative", () => {
  assert.strictEqual(timeLeft(new Date("2026-11-25T00:00:00Z")), "Sign-ups are closed");
});
