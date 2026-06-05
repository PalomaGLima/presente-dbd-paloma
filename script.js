const scene = document.querySelector(".locker-scene");
const lockerButton = document.querySelector("#open-locker");
const modal = document.querySelector("#gift-modal");
const closeButton = document.querySelector("#close-modal");
const copyButton = document.querySelector("#copy-code");
const codeValue = document.querySelector("#steam-code");
const finalNote = document.querySelector("#final-note");
const passwordGate = document.querySelector("#password-gate");
const passwordInput = document.querySelector("#password-input");
const passwordFeedback = document.querySelector("#password-feedback");
const giftContent = document.querySelector("#gift-content");
const giftCard = document.querySelector(".gift-card");

const steamCode = scene.dataset.code;
const giftPassword = "ghost face";

function normalizePassword(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function openGift() {
  modal.hidden = false;
  passwordGate.hidden = false;
  giftContent.hidden = true;
  giftCard.classList.add("locked");
  giftCard.classList.remove("revealed");
  codeValue.textContent = "?????-?????-?????";
  copyButton.disabled = true;
  copyButton.textContent = "Copiar codigo";
  passwordInput.value = "";
  passwordInput.placeholder = "Digite a senha";
  passwordFeedback.textContent = "";
  lockerButton.classList.add("opened");
  passwordInput.focus();
}

function closeGift() {
  modal.hidden = true;
  lockerButton.focus();
}

function revealGift() {
  codeValue.textContent = steamCode;
  passwordGate.hidden = true;
  giftContent.hidden = false;
  giftCard.classList.remove("locked");
  giftCard.classList.add("revealed");
  copyButton.disabled = false;
  finalNote.textContent = "A fogueira esta acesa. Boa partida.";
  copyButton.focus();
}

lockerButton.addEventListener("click", openGift);
closeButton.addEventListener("click", closeGift);

passwordGate.addEventListener("submit", (event) => {
  event.preventDefault();

  if (normalizePassword(passwordInput.value) === giftPassword) {
    revealGift();
    return;
  }

  passwordInput.value = "";
  passwordInput.placeholder = "Senha errada";
  passwordFeedback.textContent = "Senha errada.";
  passwordInput.focus();
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeGift();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeGift();
  }
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(steamCode);
    copyButton.textContent = "Codigo copiado";
    finalNote.textContent = "O codigo foi copiado para a area de transferencia.";
  } catch {
    finalNote.textContent = "Selecione o codigo e copie manualmente.";
  }
});
