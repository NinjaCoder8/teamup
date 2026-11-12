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
  return data.people.filter(p => p.teamId === team.id).length <= MAX_TEAM;
}

function joinTeam(personId, teamId) {
  const team = data.teams.find(t => t.id === teamId);
  if (!canJoin(team)) {
    alert("This team is full.");
    return;
  }
  const person = data.people.find(p => p.id === personId);
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

function render() {
  // people looking for a team
  const found = searchPeople(document.getElementById("search").value);
  let peopleHtml = "";
  for (const p of found) {
    let chips = "";
    for (const s of p.skills) {
      chips += `<span class="chip">${s}</span>`;
    }
    peopleHtml += `
      <div class="card">
        <h3>${p.name}</h3>
        <div class="chips">${chips}</div>
      </div>`;
  }
  if (found.length === 0) {
    peopleHtml = '<p class="muted">Nobody found.</p>';
  }
  document.getElementById("people").innerHTML = peopleHtml;

  // teams
  const solo = data.people.filter(p => p.teamId === null);
  let teamsHtml = "";
  for (const t of searchTeams(document.getElementById("teamSearch").value)) {
    const members = data.people.filter(p => p.teamId === t.id);
    let names = "";
    for (const m of members) {
      if (names !== "") {
        names += ", ";
      }
      names += m.name;
    }
    if (names === "") {
      names = "No members yet";
    }
    let warning = "";
    if (members.length < 1 || members.length > MAX_TEAM) {
      warning = '<p class="full">Not a valid team yet</p>';
    }
    let options = "";
    for (const p of solo) {
      options += `<option value="${p.id}">${p.name}</option>`;
    }
    teamsHtml += `
      <div class="card">
        <h3>${t.name}</h3>
        <p class="muted">${t.idea}</p>
        <p>${names} <span class="muted">(${members.length}/${MAX_TEAM})</span></p>
        ${warning}
        <div class="row">
          <select id="join-${t.id}">${options}</select>
          <button onclick="joinTeam(Number(document.getElementById('join-${t.id}').value), ${t.id})">Join</button>
        </div>
      </div>`;
  }
  document.getElementById("teams").innerHTML = teamsHtml;

  // countdown
  const ms = DEADLINE - new Date();
  const d = Math.floor(ms / 86400000);
  const h = Math.floor(ms / 3600000) % 24;
  const m = Math.floor(ms / 60000) % 60;
  document.getElementById("countdown").textContent = `Sign-ups close in ${d}d ${h}h ${m}m`;
}

document.getElementById("signup").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const skillsText = document.getElementById("skills").value;
  if (name !== "") {
    if (data.people.length < 500) {
      let skills = [];
      if (skillsText !== "") {
        for (const s of skillsText.split(",")) {
          if (s.trim() !== "") {
            if (!skills.includes(s.trim())) {
              skills.push(s.trim());
            }
          }
        }
      }
      if (skills.length > 0 || confirm("Sign up with no skills?")) {
        data.people.push({ id: Date.now(), name: name, skills: skills, teamId: null });
        save();
        e.target.reset();
        render();
      }
    } else {
      alert("TeamUp is full.");
    }
  } else {
    alert("Please enter your name.");
  }
});

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
