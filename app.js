/* =========================================================
   TN MINING
   HTML + CSS + JavaScript
   Demo Mining Application
========================================================= */


/* ================= CONFIG ================= */

/* ================= FIREBASE ================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAxAmAztC802TgPiphufStHH_JIyub-Sso",
  authDomain: "tn-mining.firebaseapp.com",
  projectId: "tn-mining",
  storageBucket: "tn-mining.firebasestorage.app",
  messagingSenderId: "176273347946",
  appId: "1:176273347946:web:c9201ebf4dfa30dea10113",
  measurementId: "G-17W6BH2JPK"
};


const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);

let mining = false;

let miningTimer = null;

let miningSeconds =
  Number(localStorage.getItem("tn_mining_seconds")) || 0;

let balance =
  Number(localStorage.getItem("tn_balance")) || 0;

let miningRate =
  Number(localStorage.getItem("tn_rate")) || 0.00001;

let packageName =
  localStorage.getItem("tn_package") || "Starter";

let username =
  localStorage.getItem("tn_user") || "";

let transactions =
  JSON.parse(localStorage.getItem("tn_transactions") || "[]");


/* ================= ELEMENTS ================= */

const loginPage =
  document.getElementById("loginPage");

const appPage =
  document.getElementById("appPage");


/* ================= LOGIN ================= */

async function login() {

  const usernameInput =
    document.getElementById("username");

  const passwordInput =
    document.getElementById("password");

  const error =
    document.getElementById("loginError");


  const email =
    usernameInput.value.trim();

  const password =
    passwordInput.value.trim();


  if (!email || !password) {

    error.textContent =
      "Please enter email and password.";

    return;
  }


  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );


    username = email;

    localStorage.setItem(
      "tn_user",
      username
    );


    error.textContent = "";

    showApp();


  } catch (e) {


    error.textContent =
      "Login failed: " + e.message;


  }

}


/* ================= SHOW APP ================= */

function showApp() {

  loginPage.classList.add("hidden");

  appPage.classList.remove("hidden");


  document.getElementById(
    "welcomeUser"
  ).textContent =
    "Welcome, " + username;


  document.getElementById(
    "accountName"
  ).textContent =
    username;


  document.getElementById(
    "accountUsername"
  ).textContent =
    username;


  updateAll();

  showScreen("dashboard");

}


/* ================= LOGOUT ================= */

function logout() {

  stopMining();

  localStorage.removeItem("tn_user");

  username = "";

  appPage.classList.add("hidden");

  loginPage.classList.remove("hidden");

  document.getElementById(
    "username"
  ).value = "";

  document.getElementById(
    "password"
  ).value = "";

}


/* ================= SCREEN ================= */

function showScreen(screenName) {

  const screens =
    document.querySelectorAll(".screen");


  screens.forEach(screen => {

    screen.classList.add("hidden");

  });


  const selected =
    document.getElementById(screenName);


  if (selected) {

    selected.classList.remove("hidden");

  }


  const navItems =
    document.querySelectorAll(".nav-item");


  navItems.forEach(item => {

    item.classList.remove("active");


    if (
      item.dataset.screen === screenName
    ) {

      item.classList.add("active");

    }

  });


  if (screenName === "history") {

    renderHistory();

  }


  if (screenName === "withdraw") {

    updateWithdrawBalance();

  }

}


/* ================= MINING ================= */

function toggleMining() {

  if (mining) {

    stopMining();

  } else {

    startMining();

  }

}


/* ================= START MINING ================= */

function startMining() {

  if (mining) return;


  mining = true;


  const buttons = [
    document.getElementById("mineButton"),
    document.getElementById("mineButton2")
  ];


  buttons.forEach(button => {

    if (!button) return;

    button.textContent =
      "Stop Mining";

    button.classList.add("stop");

  });


  const status =
    document.getElementById("miningStatus");


  status.textContent =
    "● Mining active";

  status.classList.remove("stopped");

  status.classList.add("active");


  miningTimer =
    setInterval(() => {

      balance += miningRate;

      miningSeconds++;


      localStorage.setItem(
        "tn_balance",
        balance.toFixed(8)
      );


      localStorage.setItem(
        "tn_mining_seconds",
        miningSeconds
      );


      updateAll();

    }, 1000);

}


/* ================= STOP MINING ================= */

function stopMining() {

  mining = false;


  if (miningTimer) {

    clearInterval(miningTimer);

    miningTimer = null;

  }


  const buttons = [
    document.getElementById("mineButton"),
    document.getElementById("mineButton2")
  ];


  buttons.forEach(button => {

    if (!button) return;

    button.textContent =
      "Start Mining";

    button.classList.remove("stop");

  });


  const status =
    document.getElementById("miningStatus");


  if (status) {

    status.textContent =
      "● Mining stopped";

    status.classList.remove("active");

    status.classList.add("stopped");

  }

}


/* ================= BALANCE ================= */

function updateBalance() {

  const balanceText =
    balance.toFixed(8) + " TN";


  const balanceElement =
    document.getElementById("balance");


  if (balanceElement) {

    balanceElement.textContent =
      balanceText;

  }

}


/* ================= TIME ================= */

function updateMiningTime() {

  const hours =
    Math.floor(
      miningSeconds / 3600
    );


  const minutes =
    Math.floor(
      (miningSeconds % 3600) / 60
    );


  const seconds =
    miningSeconds % 60;


  const time =

    String(hours).padStart(2, "0")
    + ":" +
    String(minutes).padStart(2, "0")
    + ":" +
    String(seconds).padStart(2, "0");


  const element =
    document.getElementById("miningTime");


  if (element) {

    element.textContent =
      time;

  }

}


/* ================= RATE ================= */

function updateRate() {

  const rateText =
    miningRate.toFixed(8)
    + " TN/s";


  const elements = [

    document.getElementById("rate"),

    document.getElementById("miningRateLarge"),

    document.getElementById("accountRate")

  ];


  elements.forEach(element => {

    if (element) {

      element.textContent =
        rateText;

    }

  });

}


/* ================= PACKAGE ================= */

function updatePackage() {

  const elements = [

    document.getElementById("dashboardPackage"),

    document.getElementById("currentPackage")

  ];


  elements.forEach(element => {

    if (element) {

      element.textContent =
        packageName;

    }

  });

}


/* ================= SELECT PACKAGE ================= */

function selectPackage(
  name,
  rate
) {

  packageName = name;

  miningRate = rate;


  localStorage.setItem(
    "tn_package",
    packageName
  );


  localStorage.setItem(
    "tn_rate",
    miningRate
  );


  updateAll();


  alert(
    name +
    " package activated."
  );


  showScreen("mining");

}


/* ================= DEPOSIT ================= */

function demoDeposit() {

  const amount =
    1;


  balance += amount;


  localStorage.setItem(
    "tn_balance",
    balance.toFixed(8)
  );


  addTransaction(
    "Deposit",
    amount
  );


  updateAll();


  alert(
    "Demo balance added: "
    + amount.toFixed(8)
    + " TN"
  );

}


/* ================= COPY ADDRESS ================= */

function copyAddress() {

  const address =
    "TN-DEMO-ADDRESS-001";


  navigator.clipboard
    .writeText(address)
    .then(() => {

      alert(
        "Demo address copied."
      );

    })
    .catch(() => {

      alert(address);

    });

}


/* ================= WITHDRAW ================= */

function withdraw() {

  const address =
    document.getElementById(
      "withdrawAddress"
    ).value.trim();


  const amount =
    Number(
      document.getElementById(
        "withdrawAmount"
      ).value
    );


  const message =
    document.getElementById(
      "withdrawMessage"
    );


  if (!address) {

    message.textContent =
      "Please enter wallet address.";

    return;

  }


  if (!amount || amount <= 0) {

    message.textContent =
      "Please enter a valid amount.";

    return;

  }


  if (amount > balance) {

    message.textContent =
      "Insufficient demo balance.";

    return;

  }


  balance -= amount;


  localStorage.setItem(
    "tn_balance",
    balance.toFixed(8)
  );


  addTransaction(
    "Withdraw",
    amount
  );


  message.textContent =
    "Demo withdrawal request created.";


  document.getElementById(
    "withdrawAddress"
  ).value = "";


  document.getElementById(
    "withdrawAmount"
  ).value = "";


  updateAll();

}


/* ================= WITHDRAW BALANCE ================= */

function updateWithdrawBalance() {

  const element =
    document.getElementById(
      "withdrawBalance"
    );


  if (element) {

    element.textContent =
      balance.toFixed(8)
      + " TN";

  }

}


/* ================= REFERRAL ================= */

function getReferralCode() {

  if (!username) {

    return "TN-REF";

  }


  return (
    "TN-" +
    username
      .replace(/\s/g, "")
      .substring(0, 6)
      .toUpperCase()
  );

}


/* ================= COPY REFERRAL ================= */

function copyReferral() {

  const code =
    getReferralCode();


  const element =
    document.getElementById(
      "refCode"
    );


  if (element) {

    element.textContent =
      code;

  }


  navigator.clipboard
    .writeText(code)
    .then(() => {

      document.getElementById(
        "copyMessage"
      ).textContent =
        "Referral code copied.";

    })
    .catch(() => {

      document.getElementById(
        "copyMessage"
      ).textContent =
        code;

    });

}


/* ================= TRANSACTIONS ================= */

function addTransaction(
  type,
  amount
) {

  const transaction = {

    type: type,

    amount: Number(amount),

    time:
      new Date().toLocaleString()

  };


  transactions.unshift(
    transaction
  );


  if (transactions.length > 50) {

    transactions =
      transactions.slice(0, 50);

  }


  localStorage.setItem(
    "tn_transactions",
    JSON.stringify(transactions)
  );


  renderHistory();

}


/* ================= HISTORY ================= */

function renderHistory() {

  const list =
    document.getElementById(
      "historyList"
    );


  if (!list) return;


  if (!transactions.length) {

    list.innerHTML = `
      <div class="empty-history">
        No transactions yet.
      </div>
    `;

    return;

  }


  list.innerHTML =
    transactions
      .map(transaction => {

        const isDeposit =
          transaction.type === "Deposit";


        const icon = isDeposit

          ? `
            <svg viewBox="0 0 24 24">
              <path d="M12 3v12"/>
              <path d="m7 10 5 5 5-5"/>
              <path d="M5 20h14"/>
            </svg>
          `

          : `
            <svg viewBox="0 0 24 24">
              <path d="M12 21V9"/>
              <path d="m7 14 5-5 5 5"/>
              <path d="M5 4h14"/>
            </svg>
          `;


        const sign =
          isDeposit ? "+" : "-";


        return `

          <div class="history-item">

            <div class="history-icon">
              ${icon}
            </div>

            <div class="history-info">

              <strong>
                ${transaction.type}
              </strong>

              <small>
                ${transaction.time}
              </small>

            </div>

            <div class="history-amount">

              ${sign}
              ${transaction.amount.toFixed(8)}
              TN

            </div>

          </div>

        `;

      })
      .join("");

}


/* ================= UPDATE ALL ================= */

function updateAll() {

  updateBalance();

  updateMiningTime();

  updateRate();

  updatePackage();

  updateWithdrawBalance();


  const refCode =
    document.getElementById(
      "refCode"
    );


  if (refCode) {

    refCode.textContent =
      getReferralCode();

  }


  renderHistory();

}


/* ================= AUTO LOGIN ================= */

if (username) {

  showApp();

} else {

  loginPage.classList.remove(
    "hidden"
  );

  appPage.classList.add(
    "hidden"
  );

}
