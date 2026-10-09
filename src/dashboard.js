
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

if ($("prize-pool")) {
$("prize-pool").textContent = state.prizePool.toFixed(2);
}

updateAccount();
}

$("buy-ticket")?.addEventListener("click", () => {
const count = Number($("ticket-count")?.value);
const currency = $("lottery-currency")?.value || "PULIGO";

if (!Number.isInteger(count) || count < 1 || count > 20) {
if ($("lottery-status")) {
$("lottery-status").textContent =
"Please select between 1 and 20 demo tickets.";
}
return;
}

for (let i = 0; i < count; i++) {
state.ticketNumber += 1;
state.tickets.push({
id: state.ticketNumber,
currency
});
}

// Illustrative accounting only; no payment is taken.
state.prizePool += count;

if ($("lottery-status")) {
$("lottery-status").textContent =
`${count} demo ticket(s) added. No payment was taken.`;
}

renderTickets();
});

$("run-draw")?.addEventListener("click", () => {
if (state.tickets.length === 0) {
if ($("draw-status")) {
$("draw-status").textContent =
"Buy demo tickets before running a draw.";
}
return;
}

const requestedWinners = Number($("winner-count")?.value || 1);

if (!Number.isInteger(requestedWinners) || requestedWinners < 1) {
if ($("draw-status")) {
$("draw-status").textContent = "Choose at least one winner.";
}
return;
}

const winnerCount = Math.min(requestedWinners, state.tickets.length);
const available = [...state.tickets];
const winners = [];

for (let i = 0; i < winnerCount; i++) {
const index = Math.floor(Math.random() * available.length);
winners.push(available.splice(index, 1)[0]);
}

// Demonstration only; Math.random() is not secure lottery randomness.
state.prize = state.prizePool * 0.60;
state.lastDraw = {
winners,
prizePerWinner: state.prize / winners.length
};

if ($("draw-status")) {
$("draw-status").textContent =
`Demo draw complete. ${winners.length} winner(s) selected. ` +
`Illustrative prize per winner: ${state.lastDraw.prizePerWinner.toFixed(2)} demo units.`;
}

if ($("lottery-history")) {
const entry = document.createElement("p");
entry.textContent =
`Demo draw · ${winners.length} winner(s) · ` +
`${state.prize.toFixed(2)} illustrative prize pool`;

```
$("lottery-history").prepend(entry);
```

}

if ($("claim-status")) {
$("claim-status").textContent =
`Winning demo ticket(s): ${winners.map((ticket) => "#" + ticket.id).join(", ")}. ` +
"No real prize is payable.";
}
});

$("claim-prize")?.addEventListener("click", () => {
if (!state.lastDraw || state.prize <= 0) {
if ($("claim-status")) {
$("claim-status").textContent =
"No demo prize is available. Run a demo draw first.";
}
return;
}

if ($("claim-status")) {
$("claim-status").textContent =
"Demo claim recorded. No cryptocurrency was transferred.";
}

state.lastDraw = null;
state.prize = 0;
});

// ---------- Staking ----------

$("stake-button")?.addEventListener("click", () => {
const amount = Number($("stake-amount")?.value);
const rate = Number($("stake-period")?.value);

if (!Number.isFinite(amount) || amount <= 0) {
if ($("stake-status")) {
$("stake-status").textContent = "Enter a valid demo amount.";
}
return;
}

if (!Number.isFinite(rate) || rate < 0) {
if ($("stake-status")) {
$("stake-status").textContent = "Choose a valid demo staking period.";
}
return;
}

state.staked += amount;
state.reward += amount * rate;

if ($("stake-status")) {
$("stake-status").textContent =
`${amount.toFixed(2)} demo PULIGO recorded as staked. ` +
"Illustrative rewards are not guaranteed or payable.";
}

updateAccount();
});

$("unstake-button")?.addEventListener("click", () => {
if (state.staked <= 0) {
if ($("staking-action-status")) {
$("staking-action-status").textContent =
"There are no demo tokens to unstake.";
}
return;
}

state.staked = 0;

if ($("staking-action-status")) {
$("staking-action-status").textContent =
"Demo unstaking recorded. No tokens were transferred.";
}

updateAccount();
});

$("claim-rewards")?.addEventListener("click", () => {
if (state.reward <= 0) {
if ($("staking-action-status")) {
$("staking-action-status").textContent =
"No illustrative demo rewards are available.";
}
return;
}

if ($("staking-action-status")) {
$("staking-action-status").textContent =
`Demo reward claim recorded (${state.reward.toFixed(2)} illustrative PULIGO). ` +
"No tokens were transferred.";
}

state.reward = 0;
updateAccount();
});

// ---------- Demo withdrawals ----------

$("withdraw-button")?.addEventListener("click", () => {
const amount = Number($("withdraw-amount")?.value);

if (!Number.isFinite(amount) || amount <= 0) {
if ($("withdraw-status")) {
$("withdraw-status").textContent =
"Enter a valid positive demo amount.";
}
return;
}

if ($("withdraw-status")) {
$("withdraw-status").textContent =
`Demo withdrawal request for ${amount.toFixed(2)} credits recorded. ` +
"This is not a real withdrawal; no funds were sent.";
}
});

// ---------- Wallet status display ----------
// Actual wallet connection is handled by src/main.js.
// This file does not initiate blockchain transactions.

window.addEventListener("load", updateAccount);
