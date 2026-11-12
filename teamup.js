// TeamUp's rules, with no page in them: the part the tests check.
// index.html loads this before app.js, and the tests load it with require().

const MAX_TEAM = 3;
const MIN_TEAM = 2;
// Sign-ups close at 23:59 Beirut time (UTC+2 in November), the same minute for everyone.
const DEADLINE = new Date("2026-11-19T23:59:00+02:00");
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

function isOpen(now) {
  return now < DEADLINE;
}

function timeLeft(now) {
  if (!isOpen(now)) {
    return "Sign-ups are closed";
  }
  const ms = DEADLINE - now;
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor(ms / 3600000) % 24;
  const minutes = Math.floor(ms / 60000) % 60;
  return `Sign-ups close in ${days}d ${hours}h ${minutes}m`;
}
if (typeof module !== "undefined") {
  module.exports = { MAX_TEAM, MIN_TEAM, DEADLINE, membersOf, canJoin, matches, parseSkills, isOpen, timeLeft };
}
