const RATE = 0.00001;

let mining = false;
let miningTimer = null;
let seconds = 0;

let balance = Number(localStorage.getItem("tn_balance")) || 0;
let savedUser = localStorage.getItem("tn_user");

const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const error = document.getElementById("loginError");

  if (!username || !password) {
    error.textContent = "Please enter username and password.";
    return;
  }

  /*
    Demo login.
    Any username/password will work.
  */

  localStorage.setItem("tn_user", username);

  savedUser = username;

  showApp();
}

function showApp() {
  loginPage.classList.add("hidden");
  appPage.classList.remove("hidden");

  document.getElementById("welcomeUser").textContent =
    "Welcome, " + savedUser;

  document.getElementById("accountName").textContent =
    savedUser;

  updateBalance();
}

function logout() {
  stopMining();

  localStorage.removeItem("tn_user");

  appPage.classList.add("hidden");
  loginPage.classList.remove("hidden");

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

function toggleMining() {
  if (mining) {
    stopMining();
  } else {
    startMining();
  }
}

function startMining() {
  mining = true;

  const button = document.getElementById("mineButton");
  const status = document.getElementById("miningStatus");

  button.textContent = "STOP MINING";
  button.classList.add("stop");

  status.textContent = "● Mining active";
  status.style.color = "#20c46b";

  miningTimer = setInterval(() => {

    balance += RATE;
    seconds++;

    localStorage.setItem(
      "tn_balance",
      balance.toFixed(8)
    );

    updateBalance();
    updateTime();

  }, 1000);
}

function stopMining() {
  mining = false;

  if (miningTimer) {
    clearInterval(miningTimer);
    miningTimer = null;
  }

  const button = document.getElementById("mineButton");
  const status = document.getElementById("miningStatus");

  if (button) {
    button.textContent = "START MINING";
    button.classList.remove("stop");
  }

  if (status) {
    status.textContent = "● Mining stopped";
    status.style.color = "#777";
  }
}

function updateBalance() {
  document.getElementById("balance").textContent =
    balance.toFixed(8) + " TN";
}

function updateTime() {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  document.getElementById("miningTime").textContent =
    String(hours).padStart(2, "0") + ":" +
    String(minutes).padStart(2, "0") + ":" +
    String(secs).padStart(2, "0");
}

/* Auto login */

if (savedUser) {
  showApp();
} else {
  loginPage.classList.remove("hidden");
  appPage.classList.add("hidden");
}
