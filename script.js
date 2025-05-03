// Variables
let wallet = 10000;
let totalGain = 0;
let defeatedOpponents = [];
let currentOpponent = {};
let wagerAmount = 0;
let timerValue = 10;
let timerInterval = null;
let playerWins = 0;
let opponentWins = 0;
let roundInProgress = false;
let roundLocked = false;  // Prevents scoring twice per round

function updateWalletDisplay() {
    document.getElementById("nav-wallet").textContent = wallet;
    document.getElementById("nav-wallet-mobile").textContent = wallet;
    const gainElement = document.getElementById("nav-gain");
    if (totalGain >= 0) {
        gainElement.style.color = "limegreen";
        gainElement.textContent = `(+PHP ${totalGain} / ${wallet > 0 ? Math.floor((totalGain / 10000) * 100) : 0}%)`;
    } else {
        gainElement.style.color = "red";
        gainElement.textContent = `(PHP ${totalGain})`;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    stopTimer();
    updateWalletDisplay();
});

function startMatch(amount) {
    if (roundInProgress) return;
    roundInProgress = true;
    roundLocked = false;

    stopTimer();

    if (amount > wallet) {
        document.getElementById("balance-warning").style.display = "block";
        roundInProgress = false;
        return;
    }

    wagerAmount = amount;

    document.querySelectorAll("#wager-selection button").forEach(btn => btn.disabled = true);

    currentOpponent = generateOpponent();
    document.getElementById("opponent-name").textContent = currentOpponent.name;
    document.getElementById("opponent-avatar").src = currentOpponent.avatar;

    document.getElementById("wager-selection").style.display = "none";
    document.getElementById("choices").style.display = "block";

    resetHearts();
    resetHands();
    playerWins = 0;
    opponentWins = 0;
    updateScoreDisplay();
    resetTimer();
}

function generateOpponent() {
    const opponents = [
        { name: "Justin Bieber", avatar: "images/opponent1.png" },
        { name: "Kanye West", avatar: "images/opponent2.png" },
        { name: "Taylor Swift", avatar: "images/opponent3.png" }
    ];
    return opponents[Math.floor(Math.random() * opponents.length)];
}

function resetHearts() {
    document.getElementById("player-hearts").textContent = "❤️❤️❤️";
    document.getElementById("opponent-hearts").textContent = "❤️❤️❤️";
}

function resetHands() {
    document.getElementById("player-hand").textContent = "❔";
    document.getElementById("opponent-hand").textContent = "❔";
    document.getElementById("player-hand").className = "";
    document.getElementById("opponent-hand").className = "";
}

function play(choice) {
    if (!roundInProgress || roundLocked) return;

    stopTimer();

    const choices = ["rock", "paper", "scissors"];
    const opponentChoice = choices[Math.floor(Math.random() * 3)];

    document.getElementById("player-hand").textContent = getSymbol(choice);
    document.getElementById("opponent-hand").textContent = getSymbol(opponentChoice);

    determineWinner(choice, opponentChoice);
}

function getSymbol(choice) {
    if (choice === "rock") return "✊";
    if (choice === "paper") return "✋";
    if (choice === "scissors") return "✌️";
}

function determineWinner(player, opponent) {
    if (roundLocked) return;
    roundLocked = true;

    if (player === opponent) {
        highlightTie();
    } else if (
        (player === "rock" && opponent === "scissors") ||
        (player === "paper" && opponent === "rock") ||
        (player === "scissors" && opponent === "paper")
    ) {
        playerWins++;
        highlightWinner("player-hand", "opponent-hand");
        adjustWallet(wagerAmount);
        if (playerWins >= 3) {
            defeatedOpponents.push(currentOpponent.name);
        }
    } else {
        opponentWins++;
        highlightWinner("opponent-hand", "player-hand");
        adjustWallet(-wagerAmount);
    }
    updateScoreDisplay();
}

function updateScoreDisplay() {
    document.getElementById("player-hearts").textContent = "❤️".repeat(3 - opponentWins);
    document.getElementById("opponent-hearts").textContent = "❤️".repeat(3 - playerWins);
}

function highlightWinner(winnerId, loserId) {
    document.getElementById(winnerId).classList.add("winner");
    document.getElementById(loserId).classList.add("loser");
    setTimeout(() => showRoundResult(false), 2000);
}

function highlightTie() {
    document.getElementById("player-hand").classList.add("tie");
    document.getElementById("opponent-hand").classList.add("tie");
    setTimeout(() => showRoundResult(true), 2000);
}

function showRoundResult(isTie) {
    document.getElementById("result-popup").style.display = "block";
    let resultMsg = "";

    if (isTie) {
        resultMsg = "It's a Tie!";
    } else if (playerWins >= 3) {
        resultMsg = "You Win the Match!";
    } else if (opponentWins >= 3) {
        resultMsg = "You Lose the Match!";
    } else {
        resultMsg = document.getElementById("player-hand").classList.contains("winner")
            ? "You Win the Round!"
            : "You Lose the Round!";
    }

    document.getElementById("result-message").textContent = resultMsg;
    roundInProgress = false;
}

function adjustWallet(amount) {
    if (roundLocked) {
        wallet += amount;
        totalGain += amount;
        updateWalletDisplay();
        const changeDisplay = document.getElementById("balance-change");
        changeDisplay.style.color = amount >= 0 ? "limegreen" : "red";
        changeDisplay.textContent = `${amount >= 0 ? "+" : ""}PHP ${amount}`;
    }
}

function newMatch() {
    stopTimer();
    resetHands();
    document.getElementById("choices").style.display = "none";
    document.getElementById("wager-selection").style.display = "block";
    document.getElementById("result-popup").style.display = "none";
    document.getElementById("balance-change").textContent = "";
    playerWins = 0;
    opponentWins = 0;
    roundInProgress = false;
    roundLocked = false;

    document.querySelectorAll("#wager-selection button").forEach(btn => btn.disabled = false);
}

function rematch() {
    if (playerWins >= 3 || opponentWins >= 3) return newMatch();

    resetHands();
    document.getElementById("result-popup").style.display = "none";
    roundInProgress = true;
    roundLocked = false;
    resetTimer();
}

function endMatch() {
    stopTimer();
    document.getElementById("choices").style.display = "none";
    document.getElementById("wager-selection").style.display = "block";
    document.getElementById("result-popup").style.display = "none";
    document.getElementById("balance-change").textContent = "";
    playerWins = 0;
    opponentWins = 0;
    roundInProgress = false;
    roundLocked = false;

    document.querySelectorAll("#wager-selection button").forEach(btn => btn.disabled = false);
}

function closeBalanceWarning() {
    document.getElementById("balance-warning").style.display = "none";
}

function fullReset() {
    stopTimer();
    wallet = 10000;
    totalGain = 0;
    defeatedOpponents = [];
    updateWalletDisplay();
    resetHands();
    document.getElementById("choices").style.display = "none";
    document.getElementById("wager-selection").style.display = "block";
    document.getElementById("balance-change").textContent = "";
    playerWins = 0;
    opponentWins = 0;
    roundInProgress = false;
    roundLocked = false;

    document.querySelectorAll("#wager-selection button").forEach(btn => btn.disabled = false);
}

// Timer Functions
function resetTimer() {
    stopTimer();
    timerValue = 10;
    updateTimerDisplay();

    if (!roundInProgress || wagerAmount === 0) return;

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
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    let timer = document.getElementById("timer");
    if (!timer) {
        timer = document.createElement("div");
        timer.id = "timer";
        document.getElementById("dynamic-timer-area").appendChild(timer);
    }
    timer.textContent = `Time Left: ${timerValue}s`;
}

function autoLose() {
    if (!roundInProgress || roundLocked) return;

    roundLocked = true;
    opponentWins++;
    adjustWallet(-wagerAmount);
    updateScoreDisplay();
    showRoundResult(false);
}

// Trophy Modal
function openTrophiesModal() {
    const trophyList = document.getElementById("trophies-list");
    trophyList.innerHTML = "";
    defeatedOpponents.forEach(name => {
        const trophy = document.createElement("div");
        trophy.textContent = name;
        trophy.className = "trophies";
        trophyList.appendChild(trophy);
    });
    document.getElementById("trophies-modal").style.display = "block";
}

function closeTrophiesModal() {
    document.getElementById("trophies-modal").style.display = "none";
}
