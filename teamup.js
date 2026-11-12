// TeamUp's rules, with no page in them: the part the tests check.
// index.html loads this before app.js, and the tests load it with require().

const MAX_TEAM = 3;
const MIN_TEAM = 2;
function membersOf(team, people) {
  return people.filter(person => person.teamId === team.id);
}

function canJoin(team, people) {
  return membersOf(team, people).length < MAX_TEAM;
}

// One rule for every search box: ignore capitals and extra spaces.
function matches(text, query) {
  const needle = query.trim().toLowerCase();
  return needle === "" || text.toLowerCase().includes(needle);
}

function parseSkills(text) {
  const skills = text.split(",").map(skill => skill.trim()).filter(skill => skill !== "");
  return [...new Set(skills)];
}
if (typeof module !== "undefined") {
  module.exports = { MAX_TEAM, MIN_TEAM, membersOf, canJoin, matches, parseSkills };
}
