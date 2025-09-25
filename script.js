// get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track attendance
let count = 0;
const maxCount = 50; // Maximum number of attendees

// Load counts from localStorage if available
if (localStorage.getItem("attendeeCount")) {
  count = parseInt(localStorage.getItem("attendeeCount"));
  const attendeeCount = document.getElementById("attendeeCount");
  attendeeCount.textContent = count;
}

const teamIds = ["water", "zero", "power"];
teamIds.forEach(function (team) {
  const saved = localStorage.getItem(team + "Count");
  if (saved !== null) {
    document.getElementById(team + "Count").textContent = saved;
  }
});

// Load attendee list from localStorage if available
const attendeeListElement = document.getElementById("attendeeList");
let attendees = [];
if (localStorage.getItem("attendees")) {
  attendees = JSON.parse(localStorage.getItem("attendees"));
  attendees.forEach(function (att) {
    addAttendeeToList(att.name, att.teamName);
  });
}

// Helper to add attendee to the list in the DOM
function addAttendeeToList(name, teamName) {
  const li = document.createElement("li");
  li.textContent = name;
  const badge = document.createElement("span");
  badge.className = "team-badge";
  badge.textContent = teamName;
  li.appendChild(badge);
  attendeeListElement.appendChild(li);
}

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text; // Get the text of the selected option

  console.log(name, teamName);

  // Increment count and update attendee count display
  count++;
  const attendeeCount = document.getElementById("attendeeCount");
  attendeeCount.textContent = count;
  localStorage.setItem("attendeeCount", count);
  console.log("Total check-ins: ", count);

  // Update progress bar visually
  const percentage = Math.round((count / maxCount) * 100) + "%";
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage;
  console.log("Progress:", percentage);

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  const newTeamCount = parseInt(teamCounter.textContent) + 1;
  teamCounter.textContent = newTeamCount;
  localStorage.setItem(team + "Count", newTeamCount);

  // Add attendee to the list and save
  addAttendeeToList(name, teamName);
  attendees.push({ name: name, teamName: teamName });
  localStorage.setItem("attendees", JSON.stringify(attendees));

  // show welcome message
  const message = `👋 Welcome, ${name} from ${teamName}!`;
  const greeting = document.getElementById("greeting");
  greeting.textContent = message;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  // Check if attendance goal is reached
  if (count === maxCount) {
    // Find the team with the highest count
    const waterCount = parseInt(
      document.getElementById("waterCount").textContent
    );
    const zeroCount = parseInt(
      document.getElementById("zeroCount").textContent
    );
    const powerCount = parseInt(
      document.getElementById("powerCount").textContent
    );
    let maxTeam = "water";
    let maxValue = waterCount;
    if (zeroCount > maxValue) {
      maxTeam = "zero";
      maxValue = zeroCount;
    }
    if (powerCount > maxValue) {
      maxTeam = "power";
      maxValue = powerCount;
    }

    // Highlight the winning team card
    const teamCards = document.querySelectorAll(".team-card");
    teamCards.forEach(function (card) {
      card.style.outline = "none";
      card.style.boxShadow = "none";
    });
    const winnerCard = document.querySelector(`.team-card.${maxTeam}`);
    if (winnerCard) {
      winnerCard.style.outline = "4px solid gold";
      winnerCard.style.boxShadow = "0 0 18px 4px gold";
    }

    // Show celebration message
    greeting.textContent = `🎉 Attendance goal reached! Congratulations to the winning team: ${
      winnerCard.querySelector(".team-name").textContent
    }`;
    greeting.classList.add("success-message");
    greeting.style.display = "block";
  }

  form.reset(); // Reset the form fields
});
