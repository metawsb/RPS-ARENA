// Clear any old timer when the page loads (for iPhone/Safari issues)
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

let opponents = [
  { name: "Justin Bieber", avatar: "images/opponent1.png" },
  { name: "Kanye West", avatar: "images/opponent2.png" },
  { name: "Taylor Swift", avatar: "images/opponent3.png" }
];
let currentOpponent = 0;

function startMatch(amount) {
  wager = amount;
  playerLives = 3;
  opponentLives = 3;
  document.getElementById("wager-selection").style.display = "none";
  document.getElementById("choices").style.display = "flex";
  updateHealthBars();
  resetHandStyles();

  // Always remove any previous timer
  const existingTimer = document.getElementById("timer");
  if (existingTimer) existingTimer.remove();

  // Create a brand-new timer inside dynamic-timer-area
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

  let result;
  if (playerChoice === "none") {
    result = "lose";
  } else {
    result = getResult(playerChoice, opponentChoice);
  }

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
    if (playerChoice === "none") {
      showRoundResult("TIMEOUT! LOSE", "red");
    } else {
      showRoundResult("LOSE", "red");
    }
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
  if (
    (player === "rock" && opponent === "scissors") ||
    (player === "paper" && opponent === "rock") ||
    (player === "scissors" && opponent === "paper")
  ) return "win";
  return "lose";
}

function highlightWinner(winner) {
  resetHandStyles();
  if (winner === "player") {
    document.getElementById("player-hand").classList.add("winner");
    document.getElementById("opponent-hand").classList.add("loser");
  } else {
    document.getElementById("opponent-hand").classList.add("winner");
    document.getElementById("player-hand").classList.add("loser");
  }
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
  let percentChange = 0;

  if (playerLives > 0) {
    wallet += wager;
    totalGain += wager;
    percentChange = ((totalGain / 10000) * 100).toFixed(1);
    message = `<span style='font-size:28px;'>CONGRATULATIONS</span><br>
               <span>YOU'VE WON</span><br>
               <span style='color:limegreen; font-size:36px; font-weight:bold;'>+PHP ${wager}</span>`;
    addTrophy();
  } else {
    wallet -= wager;
    totalGain -= wager;
    percentChange = ((totalGain / 10000) * 100).toFixed(1);
    message = `<span style='font-size:22px;'>BETTER LUCK NEXT TIME</span><br>
               <span style='font-size:22px;'>YOU'VE LOST</span><br>
               <span style='color:red; font-size:36px; font-weight:bold;'>-PHP ${wager}</span>`;
  }

  const gainText = totalGain >= 0
    ? `<span style="color:limegreen;">(+${totalGain} / ${percentChange}%)</span>`
    : `<span style="color:red;">(${totalGain} / ${percentChange}%)</span>`;

  document.querySelector(".wallet-box").innerHTML = `WALLET: PHP ${wallet} ${gainText}`;

  document.getElementById("result-message").innerHTML = message;
  document.getElementById("result-popup").style.display = "block";
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

function addTrophy() {
  let img = document.createElement("img");
  img.src = opponents[currentOpponent].avatar;
  document.getElementById("trophy-case").appendChild(img);
}

function fullReset() {
  wallet = 10000;
  totalGain = 0;
  document.querySelector(".wallet-box").innerHTML = "WALLET: PHP 10000";
  document.getElementById("trophy-case").innerHTML = "";
  document.getElementById("wager-selection").style.display = "block";
  document.getElementById("choices").style.display = "none";

  const existingTimer = document.getElementById("timer");
  if (existingTimer) existingTimer.remove();

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
  if (timerValue <= 3) {
    timer.style.color = "red";
  } else {
    timer.style.color = "white";
  }
}

function autoLose() {
  play("none");
}

updateHealthBars();
