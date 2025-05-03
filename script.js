document.addEventListener("DOMContentLoaded", function() {
  const existingTimer = document.getElementById("timer");
  if (existingTimer) existingTimer.remove();
});

let wallet = 10000;
let wager = 0;
let playerLives = 3;
let opponentLives = 3;
let timerInterval;
let timerValue = 10;
let totalGain = 0;
let defeatedOpponents = []; // NEW: Track defeated opponents

let opponents = [
  { name: "Justin Bieber", avatar: "images/opponent1.png" },
  { name: "Kanye West", avatar: "images/opponent2.png" },
  { name: "Taylor Swift", avatar: "images/opponent3.png" }
];
let currentOpponent = 0;

function startMatch(amount) {
  if (amount > wallet) {
    showBalanceWarning();
    return;
  }

  wager = amount;
  playerLives = 3;
  opponentLives = 3;
  document.getElementById("wager-selection").style.display = "none";
  document.getElementById("choices").style.display = "flex";
  updateHealthBars();
  resetHandStyles();

  const existingTimer = document.getElementById("timer");
  if (existingTimer) existingTimer.remove();

  let timerDiv = document.createElement("div");
  timerDiv.id = "timer";
  timerDiv.className = "timer";
  document.getElementById("dynamic-timer-area").appendChild(timerDiv);

  resetTimer();
}

function updateHealthBars() {
  document.getElementById("player-hearts").textContent = "❤️".repeat(playerLives);
  document.getElementById("opponent-hearts").textContent = "❤️".repeat(opponentLives);
}

function play(playerChoice) {
  stopTimer();

  const choices = ["rock", "paper", "scissors"];
  const opponentChoice = choices[Math.floor(Math.random() * 3)];
  const emojis = { rock: "✊", paper: "✋", scissors: "✌️" };

  resetHandStyles();

  if (playerChoice !== "none") {
    document.getElementById("player-hand").textContent = emojis[playerChoice];
  } else {
    document.getElementById("player-hand").textContent = "❔";
  }
  document.getElementById("opponent-hand").textContent = emojis[opponentChoice];

  let result = playerChoice === "none" ? "lose" : getResult(playerChoice, opponentChoice);

  if (result === "win") {
    highlightWinner("player");
    animateHeartLoss("opponent");
    setTimeout(() => {
      opponentLives--;
      updateHealthBars();
      checkEndMatch();
    }, 400);
    showRoundResult("WIN", "limegreen");
  } else if (result === "lose") {
    highlightWinner("opponent");
    animateHeartLoss("player");
    setTimeout(() => {
      playerLives--;
      updateHealthBars();
      checkEndMatch();
    }, 400);
    showRoundResult(playerChoice === "none" ? "TIMEOUT! LOSE" : "LOSE", "red");
  } else {
    highlightTie();
    showRoundResult("TIE", "yellow");
    resetTimer();
  }
}

function animateHeartLoss(who) {
  let el = document.getElementById(who + "-lost");
  el.textContent = "-1❤️";
  el.style.opacity = 1;
  el.style.animation = "fadeHeart 0.4s forwards";
  setTimeout(() => {
    el.textContent = "";
    el.style.opacity = 0;
    el.style.animation = "";
  }, 400);
}

function getResult(player, opponent) {
  if (player === opponent) return "tie";
  return (player === "rock" && opponent === "scissors") ||
         (player === "paper" && opponent === "rock") ||
         (player === "scissors" && opponent === "paper") ? "win" : "lose";
}

function highlightWinner(winner) {
  resetHandStyles();
  document.getElementById(`${winner}-hand`).classList.add("winner");
  document.getElementById(winner === "player" ? "opponent-hand" : "player-hand").classList.add("loser");
}

function highlightTie() {
  resetHandStyles();
  document.getElementById("player-hand").classList.add("tie");
  document.getElementById("opponent-hand").classList.add("tie");
}

function resetHandStyles() {
  document.getElementById("player-hand").className = "";
  document.getElementById("opponent-hand").className = "";
}

function showRoundResult(text, color) {
  const balanceChange = document.getElementById("balance-change");
  balanceChange.textContent = text;
  balanceChange.style.color = color;
}

function checkEndMatch() {
  if (playerLives <= 0 || opponentLives <= 0) {
    stopTimer();
    setTimeout(showResult, 400);
  } else {
    resetTimer();
  }
}

function showResult() {
  let message = "";

  if (playerLives > 0 && opponentLives <= 0) {
    wallet += wager;
    totalGain += wager;
    message = `<span style='font-size:28px;'>CONGRATULATIONS</span><br>
               <span>YOU'VE WON</span><br>
               <span style='color:limegreen; font-size:36px; font-weight:bold;'>+PHP ${wager}</span>`;
    addTrophy(opponents[currentOpponent]); // NEW: Add trophy if new opponent defeated
  } else if (playerLives <= 0) {
    wallet -= wager;
    wallet = Math.max(wallet, 0);
    totalGain -= wager;
    message = `<span style='font-size:22px;'>BETTER LUCK NEXT TIME</span><br>
               <span style='color:red; font-size:36px; font-weight:bold;'>-PHP ${wager}</span>`;
  } else {
    resetTimer();
    return;
  }

  const navWallet = document.getElementById("nav-wallet");
  const navGain = document.getElementById("nav-gain");
  if (navWallet) navWallet.textContent = wallet;

  let percentChange = ((totalGain / 10000) * 100).toFixed(1);
  let gainText = totalGain >= 0 
    ? `+PHP ${totalGain} / ${percentChange}%`
    : `-PHP ${Math.abs(totalGain)} / ${percentChange}%`;

  if (navGain) {
    navGain.textContent = `(${gainText})`;
    navGain.style.color = totalGain >= 0 ? "limegreen" : "red";
  }

  document.getElementById("result-message").innerHTML = message;
  document.getElementById("result-popup").style.display = "block";
}

function addTrophy(opponent) {
  // Only add if not already defeated
  if (!defeatedOpponents.some(o => o.name === opponent.name)) {
    defeatedOpponents.push(opponent);

    const trophiesList = document.getElementById("trophies-list");
    let trophy = document.createElement("div");
    trophy.style.textAlign = "center";

    let img = document.createElement("img");
    img.src = opponent.avatar;
    img.style.width = "80px";
    img.style.height = "80px";
    img.style.borderRadius = "10px";

    let label = document.createElement("div");
    label.textContent = opponent.name;
    label.style.marginTop = "5px";

    trophy.appendChild(img);
    trophy.appendChild(label);
    trophiesList.appendChild(trophy);
  }
}

function newMatch() {
  rotateOpponent();
  resetGame();
}

function rematch() {
  resetGame(true);
}

function endMatch() {
  document.getElementById("result-popup").style.display = "none";
  document.getElementById("choices").style.display = "none";
  document.getElementById("wager-selection").style.display = "block";
  resetGame(true);
}

function resetGame(keepOpponent = false) {
  playerLives = 3;
  opponentLives = 3;
  resetHandStyles();
  document.getElementById("player-hand").textContent = "❔";
  document.getElementById("opponent-hand").textContent = "❔";
  document.getElementById("balance-change").textContent = "";
  updateHealthBars();
  document.getElementById("result-popup").style.display = "none";

  const existingTimer = document.getElementById("timer");
  if (existingTimer) existingTimer.remove();

  if (!keepOpponent) {
    document.getElementById("choices").style.display = "flex";
  }
}

function rotateOpponent() {
  currentOpponent = (currentOpponent + 1) % opponents.length;
  document.getElementById("opponent-name").textContent = opponents[currentOpponent].name;
  document.getElementById("opponent-avatar").src = opponents[currentOpponent].avatar;
}

function fullReset() {
  wallet = 10000;
  totalGain = 0;
  defeatedOpponents = [];

  const navWallet = document.getElementById("nav-wallet");
  const navGain = document.getElementById("nav-gain");
  if (navWallet) navWallet.textContent = wallet;
  if (navGain) {
    navGain.textContent = "(+PHP 0 / 0%)";
    navGain.style.color = "limegreen";
  }

  document.getElementById("wager-selection").style.display = "block";
  document.getElementById("choices").style.display = "none";

  const existingTimer = document.getElementById("timer");
  if (existingTimer) existingTimer.remove();

  document.getElementById("trophies-list").innerHTML = ""; // Clear trophies

  resetGame(true);
}

function resetTimer() {
  stopTimer();
  timerValue = 10;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timerValue--;
    updateTimerDisplay();
    if (timerValue <= 0) {
      stopTimer();
      autoLose();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimerDisplay() {
  const timer = document.getElementById("timer");
  if (!timer) return;

  timer.textContent = `${timerValue} seconds left`;
  timer.style.fontWeight = "bold";
  timer.style.color = timerValue <= 3 ? "red" : "white";
}

function autoLose() {
  play("none");
}

function showBalanceWarning() {
  document.getElementById("balance-warning").style.display = "block";
}

function closeBalanceWarning() {
  document.getElementById("balance-warning").style.display = "none";
}

// Modal controls
function openTrophiesModal() {
  document.getElementById("trophies-modal").style.display = "block";
}

function closeTrophiesModal() {
  document.getElementById("trophies-modal").style.display = "none";
}

updateHealthBars();
