let wallet = 10000;
let wager = 0;
let playerLives = 3;
let opponentLives = 3;

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
  document.getElementById("player-hand").textContent = "❔";
  document.getElementById("opponent-hand").textContent = "❔";
  document.getElementById("balance-change").textContent = "";
}

function updateHealthBars() {
  document.getElementById("player-hearts").textContent = "❤️".repeat(playerLives);
  document.getElementById("opponent-hearts").textContent = "❤️".repeat(opponentLives);
}

function play(playerChoice) {
  if (playerLives === 0 || opponentLives === 0) return;

  const choices = ["rock", "paper", "scissors"];
  const opponentChoice = choices[Math.floor(Math.random() * 3)];
  const emojis = { rock: "✊", paper: "✋", scissors: "✌️" };

  resetHandStyles();

  document.getElementById("player-hand").textContent = emojis[playerChoice];
  document.getElementById("opponent-hand").textContent = emojis[opponentChoice];

  const result = getResult(playerChoice, opponentChoice);

  if (result === "win") {
    highlightHands("player");
    animateHeartLoss("opponent");
    setTimeout(() => {
      opponentLives--;
      updateHealthBars();
      checkEndMatch();
    }, 800);
    showRoundResult("WIN", "limegreen");
  } else if (result === "lose") {
    highlightHands("opponent");
    animateHeartLoss("player");
    setTimeout(() => {
      playerLives--;
      updateHealthBars();
      checkEndMatch();
    }, 800);
    showRoundResult("LOSE", "red");
  } else {
    resetHandStyles();
    document.getElementById("player-hand").classList.add("tie");
    document.getElementById("opponent-hand").classList.add("tie");
    showRoundResult("TIE", "yellow");
  }
}

function animateHeartLoss(who) {
  let el = document.getElementById(who + "-lost");
  el.textContent = "-1❤️";
  el.style.opacity = 1;
  el.style.animation = "fadeHeart 0.8s forwards";
  setTimeout(() => {
    el.textContent = "";
    el.style.opacity = 0;
    el.style.animation = "";
  }, 800);
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

function resetHandStyles() {
  document.getElementById("player-hand").className = "";
  document.getElementById("opponent-hand").className = "";
}

function highlightHands(winner) {
  resetHandStyles();
  if (winner === "player") {
    document.getElementById("player-hand").classList.add("winner");
    document.getElementById("opponent-hand").classList.add("loser");
  } else {
    document.getElementById("player-hand").classList.add("loser");
    document.getElementById("opponent-hand").classList.add("winner");
  }
}

function showRoundResult(text, color) {
  const balanceChange = document.getElementById("balance-change");
  balanceChange.textContent = text;
  balanceChange.style.color = color;
}

function checkEndMatch() {
  if (playerLives === 0 || opponentLives === 0) {
    setTimeout(showResult, 300);
  }
}

function showResult() {
  let message = "";
  if (playerLives > 0) {
    wallet += wager;
    message = `<span style='color:limegreen;'>Congratulations!</span><br>
               <span style='font-size:28px; color:limegreen;'>YOU WIN</span><br>
               <span style='font-size:36px; color:limegreen;'>+PHP ${wager}</span>`;
    addTrophy();
  } else {
    wallet -= wager;
    message = `<span style='color:red;'>Better Luck Next Time</span><br>
               <span style='font-size:28px; color:red;'>YOU LOSE</span><br>
               <span style='font-size:36px; color:red;'>-PHP ${wager}</span>`;
  }
  document.getElementById("wallet").textContent = "PHP " + wallet;
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
  document.getElementById("wallet").textContent = "PHP " + wallet;
  document.getElementById("trophy-case").innerHTML = "";
  document.getElementById("wager-selection").style.display = "block";
  document.getElementById("choices").style.display = "none";
  resetGame(true);
}

updateHealthBars();
