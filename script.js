// Variables
let wallet = 10000;
let totalGain = 0;
let defeatedOpponents = [];
let currentOpponent = {};
let wagerAmount = 0;
let timerValue = 10;
let timerInterval;

// Utility
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

// Event: Clear any timers when page loads
document.addEventListener("DOMContentLoaded", function() {
    const existingTimer = document.getElementById("timer");
    if (existingTimer) existingTimer.remove();

    // Kill old timer interval
    if (window.timerInterval) {
        clearInterval(window.timerInterval);
        window.timerInterval = null;
    }

    updateWalletDisplay();
});

function startMatch(amount) {
    stopTimer(); // Always stop old timer before starting new match
    if (amount > wallet) {
        document.getElementById("balance-warning").style.display = "block";
        return;
    }
    wagerAmount = amount;
    currentOpponent = generateOpponent();
    document.getElementById("opponent-name").textContent = currentOpponent.name;
    document.getElementById("opponent-avatar").src = currentOpponent.avatar;
    document.getElementById("wager-selection").style.display = "none";
    document.getElementById("choices").style.display = "block";
    resetHearts();
    resetHands();
    resetTimer(); // Start timer only after wager is selected
}

function generateOpponent() {
    const opponents = [
        { name: "Justin Bieber", avatar: "images/opponent1.png" },
        { name: "Elon Musk", avatar: "images/opponent2.png" },
        { name: "Mr. Beast", avatar: "images/opponent3.png" }
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
}

function play(choice) {
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
    stopTimer(); // Stop the timer as soon as a choice is made
    if (player === opponent) {
        highlightTie();
    } else if (
        (player === "rock" && opponent === "scissors") ||
        (player === "paper" && opponent === "rock") ||
        (player === "scissors" && opponent === "paper")
    ) {
        highlightWinner("player-hand", "opponent-hand");
        adjustWallet(wagerAmount);
        defeatedOpponents.push(currentOpponent.name);
    } else {
        highlightWinner("opponent-hand", "player-hand");
        adjustWallet(-wagerAmount);
    }
}

function highlightWinner(winnerId, loserId) {
    document.getElementById(winnerId).classList.add("winner");
    document.getElementById(loserId).classList.add("loser");
    setTimeout(() => showRoundResult(), 2000);
}

function highlightTie() {
    document.getElementById("player-hand").classList.add("tie");
    document.getElementById("opponent-hand").classList.add("tie");
    setTimeout(() => showRoundResult(true), 2000);
}

function showRoundResult(isTie = false) {
    document.getElementById("result-popup").style.display = "block";
    const resultMsg = isTie ? "It's a Tie!" :
        document.getElementById("player-hand").classList.contains("winner") ? "You Win!" : "You Lose!";
    document.getElementById("result-message").textContent = resultMsg;
}

function adjustWallet(amount) {
    wallet += amount;
    totalGain += amount;
    updateWalletDisplay();
    const changeDisplay = document.getElementById("balance-change");
    changeDisplay.style.color = amount >= 0 ? "limegreen" : "red";
    changeDisplay.textContent = `${amount >= 0 ? "+" : ""}PHP ${amount}`;
}

function newMatch() {
    resetHands();
    document.getElementById("choices").style.display = "none";
    document.getElementById("wager-selection").style.display = "block";
    document.getElementById("result-popup").style.display = "none";
    document.getElementById("balance-change").textContent = "";
}

function rematch() {
    resetHands();
    document.getElementById("result-popup").style.display = "none";
    resetTimer();
}

function endMatch() {
    document.getElementById("choices").style.display = "none";
    document.getElementById("wager-selection").style.display = "block";
    document.getElementById("result-popup").style.display = "none";
    document.getElementById("balance-change").textContent = "";
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
}

// Timer Functions
function resetTimer() {
    stopTimer();
    timerValue = 10;
    updateTimerDisplay();

    // Prevent duplicate timers
    if (timerInterval) {
        clearInterval(timerInterval);
    }

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
    adjustWallet(-wagerAmount);
    showRoundResult();
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
