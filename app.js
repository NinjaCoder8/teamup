// TeamUp: find teammates for Hack Night.
// The page: data, rendering and events. TeamUp's rules are in teamup.js.

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

function joinTeam(personId, teamId) {
  const team = data.teams.find(entry => entry.id === teamId);
  if (!canJoin(team, data.people)) {
    alert("This team is full.");
    return;
  }
  const person = data.people.find(entry => entry.id === personId);
  person.teamId = teamId;
  save();
  render();
}

function searchPeople(query) {
  const solo = data.people.filter(person => person.teamId === null);
  return solo.filter(person => matches(person.skills.join(" "), query));
}

function searchTeams(query) {
  return data.teams.filter(team => matches(`${team.name} ${team.idea}`, query));
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
  const members = membersOf(team, data.people);
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
  const now = new Date();
  document.getElementById("countdown").textContent = timeLeft(now);
  for (const field of document.querySelectorAll("#signup input, #signup button")) {
    field.disabled = !isOpen(now);
  }
}

function render() {
  renderPeople();
  renderTeams();
  renderCountdown();
}

function signUp(event) {
  event.preventDefault();
  // Checked on submit, not on load: a page opened before the deadline can be submitted after it.
  if (!isOpen(new Date())) {
    alert("Sign-ups are closed.");
    return;
  }
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
