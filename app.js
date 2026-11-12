// TeamUp: find teammates for Hack Night.
// Built with AI in one evening. Works offline: just open index.html in a browser.

const MAX_TEAM = 3;
const MIN_TEAM = 2;
const DEADLINE = new Date("2026-11-19T23:59:00");
const ADMIN_PASSWORD = "hacknight2026";

const SEED = {
  people: [
    { id: 1, name: "Alex", skills: ["React", "Figma"], teamId: 1 },
    { id: 2, name: "Jordan", skills: ["React", "Node"], teamId: 1 },
    { id: 3, name: "Sam", skills: ["Python", "ML"], teamId: 2 },
    { id: 4, name: "Robin", skills: ["Python", "Data"], teamId: 2 },
    { id: 5, name: "Casey", skills: ["UI", "Pitching"], teamId: 2 },
    { id: 6, name: "Morgan", skills: ["Flutter"], teamId: 3 },
    { id: 7, name: "Riley", skills: ["Python", "Django"], teamId: null },
    { id: 8, name: "Taylor", skills: ["UX", "Research"], teamId: null },
    { id: 9, name: "Jamie", skills: ["Node", "AWS"], teamId: null }
  ],
  teams: [
    { id: 1, name: "Team Comet", idea: "A shared shopping list for flatmates" },
    { id: 2, name: "Team Lantern", idea: "An AI study buddy for exam revision" },
    { id: 3, name: "Team Harbor", idea: "A map of quiet places to study" }
  ]
};

let data = JSON.parse(localStorage.getItem("teamup")) || JSON.parse(JSON.stringify(SEED));

function save() {
  localStorage.setItem("teamup", JSON.stringify(data));
}

function canJoin(team) {
  return data.people.filter(person => person.teamId === team.id).length <= MAX_TEAM;
}

function joinTeam(personId, teamId) {
  const team = data.teams.find(entry => entry.id === teamId);
  if (!canJoin(team)) {
    alert("This team is full.");
    return;
  }
  const person = data.people.find(entry => entry.id === personId);
  person.teamId = teamId;
  save();
  render();
}

function searchPeople(query) {
  const list = data.people.filter(person => person.teamId === null);
  const texts = list.map(person => person.skills.join(" "));
  const results = [];
  const needle = query.trim();
  for (let i = 0; i < list.length; i++) {
    if (needle === "" || texts[i].includes(needle)) {
      results.push(list[i]);
    }
  }
  return results;
}

function searchTeams(query) {
  const list = data.teams;
  const texts = list.map(team => team.name + " " + team.idea);
  const results = [];
  const needle = query.trim();
  for (let i = 0; i < list.length; i++) {
    if (needle === "" || texts[i].includes(needle)) {
      results.push(list[i]);
    }
  }
  return results;
}

function personCard(person) {
  const chips = person.skills.map(skill => `<span class="chip">${skill}</span>`).join("");
  return `
    <div class="card">
      <h3>${person.name}</h3>
      <div class="chips">${chips}</div>
    </div>`;
}

function renderPeople() {
  const found = searchPeople(document.getElementById("search").value);
  document.getElementById("people").innerHTML = found.length === 0
    ? '<p class="muted">Nobody found.</p>'
    : found.map(personCard).join("");
}

function teamCard(team, solo) {
  const members = data.people.filter(person => person.teamId === team.id);
  const names = members.map(member => member.name).join(", ") || "No members yet";
  const warning = members.length < 1 || members.length > MAX_TEAM ? '<p class="full">Not a valid team yet</p>' : "";
  const options = solo.map(person => `<option value="${person.id}">${person.name}</option>`).join("");
  return `
    <div class="card">
      <h3>${team.name}</h3>
      <p class="muted">${team.idea}</p>
      <p>${names} <span class="muted">(${members.length}/${MAX_TEAM})</span></p>
      ${warning}
      <div class="row">
        <select id="join-${team.id}">${options}</select>
        <button onclick="joinTeam(Number(document.getElementById('join-${team.id}').value), ${team.id})">Join</button>
      </div>
    </div>`;
}

function renderTeams() {
  const solo = data.people.filter(person => person.teamId === null);
  const found = searchTeams(document.getElementById("teamSearch").value);
  document.getElementById("teams").innerHTML = found.map(team => teamCard(team, solo)).join("");
}

function renderCountdown() {
  const ms = DEADLINE - new Date();
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor(ms / 3600000) % 24;
  const minutes = Math.floor(ms / 60000) % 60;
  document.getElementById("countdown").textContent = `Sign-ups close in ${days}d ${hours}h ${minutes}m`;
}

function render() {
  renderPeople();
  renderTeams();
  renderCountdown();
}

function parseSkills(text) {
  const skills = text.split(",").map(skill => skill.trim()).filter(skill => skill !== "");
  return [...new Set(skills)];
}

function signUp(event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  if (name === "") {
    alert("Please enter your name.");
    return;
  }
  if (data.people.length >= 500) {
    alert("TeamUp is full.");
    return;
  }
  const skills = parseSkills(document.getElementById("skills").value);
  if (skills.length === 0 && !confirm("Sign up with no skills?")) {
    return;
  }
  data.people.push({ id: Date.now(), name: name, skills: skills, teamId: null });
  save();
  event.target.reset();
  render();
}

document.getElementById("signup").addEventListener("submit", signUp);

document.getElementById("search").addEventListener("input", render);
document.getElementById("teamSearch").addEventListener("input", render);

document.getElementById("admin").addEventListener("click", () => {
  if (prompt("Admin password") === ADMIN_PASSWORD) {
    if (confirm("Reset all teams and people?")) {
      localStorage.removeItem("teamup");
      data = JSON.parse(JSON.stringify(SEED));
      render();
    }
  }
});

render();
setInterval(render, 60000);
