
// PuliGo Gaming Dashboard
// DEMO ONLY — no real cryptocurrency transactions.

const $ = (id) => document.getElementById(id);

const state = {
  tickets: [],
  ticketNumber: 0,
  prizePool: 0,
  prize: 0,
  staked: 0,
  reward: 0,
  lastDraw: null
};

// ---------- Navigation ----------

function showPage(page) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.toggle("active", section.id === page);
  });

  document.querySelectorAll("[data-page]").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-page]").forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.go));
});

// ---------- Account dashboard ----------

function updateAccount() {
  if ($("account-balance") && $("balance")) {
    $("account-balance").textContent = $("balance").textContent;
  }

  if ($("account-tickets")) {
    $("account-tickets").textContent = state.tickets.length;
  }

  if ($("account-staked")) {
    $("account-staked").textContent = state.staked.toFixed(2);
  }

  if ($("staked-amount")) {
    $("staked-amount").textContent = state.staked.toFixed(2);
  }

  if ($("staking-reward")) {
    $("staking-reward").textContent = state.reward.toFixed(2);
  }
}

// ---------- Lottery ----------

function renderTickets() {
  const container = $("my-tickets");
  if (!container) return;

  container.replaceChildren();

  if (state.tickets.length === 0) {
    container.textContent = "No demo tickets yet.";
  } else {
    state.tickets.forEach((ticket) => {
      const item = document.createElement("p");
      item.textContent = `Ticket #${ticket.id} · ${ticket.currency} · Demo`;
      container.appendChild(item);
    });
  }

  $("prize-pool").textContent = state.prizePool.toFixed(2);
  updateAccount();
}

$("buy-ticket")?.addEventListener("click", () => {
  const count = Number($("ticket-count").value);
  const currency = $("lottery-currency").value;

  if (!Number.isInteger(count) || count < 1 || count > 20) {
    $("lottery-status").textContent =
      "Please select between 1 and 20 demo tickets.";
    return;
  }

  for (let i = 0; i < count; i++) {
    state.ticketNumber += 1;
    state.tickets.push({
      id: state.ticketNumber,
      currency
    });
  }

  // Illustrative accounting only; this is not real money.
  state.prizePool += count;
  $("lottery-status").textContent =
    `${count} demo ticket(s) added. No payment was taken.`;

  renderTickets();
});

$("run-draw")?.addEventListener("click", () => {
  if (state.tickets.length === 0) {
    $("draw-status").textContent =
      "Buy demo tickets before running a draw.";
    return;
  }

  const requestedWinners = Number($("winner-count").value);
  const winnerCount = Math.min(requestedWinners, state.tickets.length);
  const available = [...state.tickets];
  const winners = [];

  for (let i = 0; i < winnerCount; i++) {
    const index = Math.floor(Math.random() * available.length);
    winners.push(available.splice(index, 1)[0]);
  }

  // Simulated 60% winner pool and 40% platform share.
  state.prize = state.prizePool * 0.60;
  state.lastDraw = {
    winners,
    prizePerWinner: state.prize / winners.length
  };

  $("draw-status").textContent =
    `Demo draw complete. ${winners.length} winner(s) selected. ` +
    `Illustrative prize per winner: ${state.lastDraw.prizePerWinner.toFixed(2)} demo units.`;

  const history = $("lottery-history");
  const entry = document.createElement("p");
  entry.textContent =
    `Demo draw · ${winners.length} winner(s) · ` +
    `${state.prize.toFixed(2)} illustrative prize pool`;
  history.prepend(entry);

  $("claim-status").textContent =
    "A simulated prize is available to claim if you were selected.";
});

$("claim-prize")?.addEventListener("click", () => {
  if (!state.lastDraw || state.prize <= 0) {
    $("claim-status").textContent =
      "No demo prize is available. Run a demo draw first.";
    return;
  }

  // Demo only: this does not send funds to a wallet.
  $("claim-status").textContent =
    "Demo claim recorded. No cryptocurrency was transferred.";

  state.lastDraw = null;
  state.prize = 0;
});

// ---------- Staking ----------

$("stake-button")?.addEventListener("click", () => {
  const amount = Number($("stake-amount").value);
  const rate = Number($("stake-period").value);

  if (!Number.isFinite(amount) || amount <= 0) {
    $("stake-status").textContent = "Enter a valid demo amount.";
    return;
  }

  state.staked += amount;
  state.reward += amount * rate;

  $("stake-status").textContent =
    `${amount.toFixed(2)} demo PULIGO recorded as staked. ` +
    "Illustrative rewards are not guaranteed or payable.";
  updateAccount();
});

$("unstake-button")?.addEventListener("click", () => {
  if (state.staked <= 0) {
    $("staking-action-status").textContent =
      "There are no demo tokens to unstake.";
    return;
  }

  state.staked = 0;
  $("staking-action-status").textContent =
    "Demo unstaking recorded. No tokens were transferred.";
  updateAccount();
});

$("claim-rewards")?.addEventListener("click", () => {
  if (state.reward <= 0) {
    $("staking-action-status").textContent =
      "No illustrative demo rewards are available.";
    return;
  }

  $("staking-action-status").textContent =
    `Demo reward claim recorded (${state.reward.toFixed(2)} illustrative PULIGO). ` +
    "No tokens were transferred.";

  state.reward = 0;
  updateAccount();
});

// ---------- Demo withdrawals ----------

$("withdraw-button")?.addEventListener("click", () => {
  const amount = Number($("withdraw-amount").value);

  if (!Number.isFinite(amount) || amount <= 0) {
    $("withdraw-status").textContent =
      "Enter a valid positive demo amount.";
    return;
  }

  $("withdraw-status").textContent =
    `Demo withdrawal request for ${amount.toFixed(2)} credits recorded. ` +
    "This is not a real withdrawal; no funds were sent.";
});

// ---------- Wallet status display ----------
// The actual wallet connection is handled by src/main.js.
// This page does not initiate transactions.

window.addEventListener("load", updateAccount);
```
