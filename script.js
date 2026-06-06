const scene = document.querySelector(".locker-scene");
const introOverlay = document.querySelector("#intro-video");
const introPlayer = document.querySelector("#intro-player");
const menuScreen = document.querySelector("#dbd-menu");
const playMenuButton = document.querySelector("#play-menu");
const killerMenuButton = document.querySelector("#killer-menu");
const lockerButton = document.querySelector("#open-locker");
const modal = document.querySelector("#gift-modal");
const closeButton = document.querySelector("#close-modal");
const copyButton = document.querySelector("#copy-code");
const codeValue = document.querySelector("#steam-code");
const finalNote = document.querySelector("#final-note");
const passwordGate = document.querySelector("#password-gate");
const passwordInput = document.querySelector("#password-input");
const passwordFeedback = document.querySelector("#password-feedback");
const congratsStep = document.querySelector("#congrats-step");
const continuePasswordButton = document.querySelector("#continue-password");
const finalPasswordGate = document.querySelector("#final-password-gate");
const finalPasswordInput = document.querySelector("#final-password-input");
const finalPasswordFeedback = document.querySelector("#final-password-feedback");
const giftContent = document.querySelector("#gift-content");
const giftCard = document.querySelector(".gift-card");
const ghostVideoStage = document.querySelector("#ghost-video-stage");
const ghostVideo = document.querySelector("#ghost-video");

const steamCode = scene.dataset.code;
const giftPassword = "ghost face";
const finalGiftPassword = "tiffany";
let introHidden = false;

function hideIntro() {
  if (introHidden) {
    return;
  }

  introHidden = true;
  introOverlay.classList.add("hidden");
  introPlayer.pause();
}

function playIntroWithAudio() {
  introPlayer.muted = false;
  introPlayer.volume = 1;
  return introPlayer.play();
}

function startIntroAfterGesture() {
  introOverlay.classList.remove("awaiting-start");
  playIntroWithAudio().catch(() => {});
}

introPlayer.addEventListener("ended", hideIntro);
introPlayer.addEventListener("error", hideIntro);

playIntroWithAudio().catch(() => {
  introOverlay.classList.add("awaiting-start");
  introOverlay.addEventListener("pointerdown", startIntroAfterGesture, { once: true });
});

function normalizePassword(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function showKillerChoice() {
  playMenuButton.setAttribute("aria-expanded", "true");
  menuScreen.classList.add("expanded");
  killerMenuButton.hidden = false;
  killerMenuButton.focus();
}

function enterKillerScene() {
  menuScreen.hidden = true;
  scene.hidden = false;
  lockerButton.focus();
}

function openGift() {
  modal.hidden = false;
  ghostVideoStage.hidden = false;
  giftCard.hidden = true;
  passwordGate.hidden = true;
  congratsStep.hidden = true;
  finalPasswordGate.hidden = true;
  giftContent.hidden = true;
  giftCard.classList.add("locked");
  giftCard.classList.remove("revealed");
  codeValue.textContent = "?????-?????-?????";
  copyButton.disabled = true;
  copyButton.textContent = "Copiar codigo";
  passwordInput.value = "";
  passwordInput.placeholder = "Digite a senha";
  passwordFeedback.textContent = "";
  finalPasswordInput.value = "";
  finalPasswordInput.placeholder = "Digite a segunda senha";
  finalPasswordFeedback.textContent = "";
  lockerButton.classList.add("opened");
  ghostVideo.currentTime = 0;
  ghostVideo.volume = 0.35;
  ghostVideo.muted = false;
  ghostVideo.play().catch(() => {
    ghostVideo.muted = true;
    ghostVideo.play().catch(() => {});
  });
}

function showPasswordGate() {
  ghostVideo.pause();
  ghostVideoStage.hidden = true;
  giftCard.hidden = false;
  passwordGate.hidden = false;
  passwordInput.focus();
}

function showCongratsStep() {
  passwordGate.hidden = true;
  congratsStep.hidden = false;
  continuePasswordButton.focus();
}

function showFinalPasswordGate() {
  congratsStep.hidden = true;
  finalPasswordGate.hidden = false;
  finalPasswordInput.focus();
}

function closeGift() {
  ghostVideo.pause();
  modal.hidden = true;
  lockerButton.focus();
}

function revealGift() {
  codeValue.textContent = steamCode;
  passwordGate.hidden = true;
  congratsStep.hidden = true;
  finalPasswordGate.hidden = true;
  giftContent.hidden = false;
  giftCard.classList.remove("locked");
  giftCard.classList.add("revealed");
  copyButton.disabled = false;
  finalNote.textContent = "A fogueira esta acesa. Boa partida.";
  copyButton.focus();
}

playMenuButton.addEventListener("click", showKillerChoice);
killerMenuButton.addEventListener("click", enterKillerScene);
lockerButton.addEventListener("click", openGift);
closeButton.addEventListener("click", closeGift);
ghostVideo.addEventListener("ended", showPasswordGate);
continuePasswordButton.addEventListener("click", showFinalPasswordGate);

passwordGate.addEventListener("submit", (event) => {
  event.preventDefault();

  if (normalizePassword(passwordInput.value) === giftPassword) {
    showCongratsStep();
    return;
  }

  passwordInput.value = "";
  passwordInput.placeholder = "Senha errada";
  passwordFeedback.textContent = "Senha errada.";
  passwordInput.focus();
});

finalPasswordGate.addEventListener("submit", (event) => {
  event.preventDefault();

  if (normalizePassword(finalPasswordInput.value) === finalGiftPassword) {
    revealGift();
    return;
  }

  finalPasswordInput.value = "";
  finalPasswordInput.placeholder = "Senha errada";
  finalPasswordFeedback.textContent = "Senha errada.";
  finalPasswordInput.focus();
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
