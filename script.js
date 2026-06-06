const scene = document.querySelector(".locker-scene");
const introOverlay = document.querySelector("#intro-video");
const introPlayer = document.querySelector("#intro-player");
const wrongPasswordOverlay = document.querySelector("#wrong-password-video");
const wrongPasswordImage = document.querySelector("#wrong-password-image");
const correctPasswordOverlay = document.querySelector("#correct-password-video");
const correctPasswordPlayer = document.querySelector("#correct-password-player");
const menuScreen = document.querySelector("#dbd-menu");
const playMenuButton = document.querySelector("#play-menu");
const killerMenuButton = document.querySelector("#killer-menu");
const sceneImage = document.querySelector(".scene-image");
const lockerButton = document.querySelector("#open-locker");
const modal = document.querySelector("#gift-modal");
const closeButton = document.querySelector("#close-modal");
const copyButton = document.querySelector("#copy-code");
const codeValue = document.querySelector("#steam-code");
const bonusCodeValue = document.querySelector("#bonus-code");
const finalNote = document.querySelector("#final-note");
const passwordGate = document.querySelector("#password-gate");
const passwordInput = document.querySelector("#password-input");
const passwordFeedback = document.querySelector("#password-feedback");
const congratsStep = document.querySelector("#congrats-step");
const continuePasswordButton = document.querySelector("#continue-password");
const finalPasswordGate = document.querySelector("#final-password-gate");
const finalPasswordInput = document.querySelector("#final-password-input");
const finalPasswordFeedback = document.querySelector("#final-password-feedback");
const rewardReadyStep = document.querySelector("#reward-ready-step");
const receiveRewardButton = document.querySelector("#receive-reward");
const giftContent = document.querySelector("#gift-content");
const giftCard = document.querySelector(".gift-card");

const steamCode = scene.dataset.code;
const bonusCode = scene.dataset.bonusCode;
const giftPassword = "ghost face";
const finalGiftPassword = "tiffany";
let introHidden = false;
let wrongPasswordFocusTarget = null;
let wrongPasswordTimer = null;

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

function hideWrongPasswordVideo() {
  clearTimeout(wrongPasswordTimer);
  wrongPasswordOverlay.hidden = true;

  if (wrongPasswordFocusTarget) {
    wrongPasswordFocusTarget.focus();
  }
}

function showWrongPasswordVideo(focusTarget) {
  wrongPasswordFocusTarget = focusTarget;
  clearTimeout(wrongPasswordTimer);
  wrongPasswordImage.src = "";
  wrongPasswordImage.src = "assets/wesker-wrong-password.gif";
  wrongPasswordOverlay.hidden = false;
  wrongPasswordTimer = setTimeout(hideWrongPasswordVideo, 3200);
}

function hideCorrectPasswordVideo() {
  correctPasswordPlayer.pause();
  correctPasswordOverlay.hidden = true;
  showCongratsStep();
}

function showCorrectPasswordVideo() {
  correctPasswordOverlay.hidden = false;
  correctPasswordPlayer.currentTime = 0;
  correctPasswordPlayer.muted = false;
  correctPasswordPlayer.volume = 0.03;
  correctPasswordPlayer.play().catch(hideCorrectPasswordVideo);
}

function toggleKillerChoice() {
  const shouldOpen = killerMenuButton.hidden;

  playMenuButton.setAttribute("aria-expanded", String(shouldOpen));
  menuScreen.classList.toggle("expanded", shouldOpen);
  killerMenuButton.hidden = !shouldOpen;

  if (shouldOpen) {
    killerMenuButton.focus();
    return;
  }

  playMenuButton.focus();
}

function enterKillerScene() {
  menuScreen.hidden = true;
  scene.hidden = false;
  lockerButton.focus();
}

function openGift() {
  modal.hidden = false;
  sceneImage.src = "assets/locker-open.png";
  sceneImage.alt = "Armario vermelho aberto em um ambiente azul";
  giftCard.hidden = false;
  passwordGate.hidden = false;
  congratsStep.hidden = true;
  finalPasswordGate.hidden = true;
  rewardReadyStep.hidden = true;
  giftContent.hidden = true;
  giftCard.classList.add("locked");
  giftCard.classList.remove("revealed");
  codeValue.textContent = "?????-?????-?????";
  bonusCodeValue.textContent = "?????-?????-?????";
  copyButton.disabled = true;
  copyButton.textContent = "Copiar recompensas";
  passwordInput.value = "";
  passwordInput.placeholder = "Digite a senha";
  passwordFeedback.textContent = "";
  finalPasswordInput.value = "";
  finalPasswordInput.placeholder = "Digite a segunda senha";
  finalPasswordFeedback.textContent = "";
  lockerButton.classList.add("opened");
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

function showRewardReadyStep() {
  finalPasswordGate.hidden = true;
  rewardReadyStep.hidden = false;
  receiveRewardButton.focus();
}

function closeGift() {
  modal.hidden = true;
  lockerButton.focus();
}

function revealGift() {
  codeValue.textContent = steamCode;
  bonusCodeValue.textContent = bonusCode;
  passwordGate.hidden = true;
  congratsStep.hidden = true;
  finalPasswordGate.hidden = true;
  rewardReadyStep.hidden = true;
  giftContent.hidden = false;
  giftCard.classList.remove("locked");
  giftCard.classList.add("revealed");
  copyButton.disabled = false;
  finalNote.textContent = "A fogueira esta acesa. Boa partida.";
  copyButton.focus();
}

playMenuButton.addEventListener("click", toggleKillerChoice);
killerMenuButton.addEventListener("click", enterKillerScene);
lockerButton.addEventListener("click", openGift);
closeButton.addEventListener("click", closeGift);
continuePasswordButton.addEventListener("click", showFinalPasswordGate);
receiveRewardButton.addEventListener("click", revealGift);

passwordGate.addEventListener("submit", (event) => {
  event.preventDefault();

  if (normalizePassword(passwordInput.value) === giftPassword) {
    showCorrectPasswordVideo();
    return;
  }

  passwordInput.value = "";
  passwordInput.placeholder = "Senha errada";
  passwordFeedback.textContent = "Senha errada.";
  showWrongPasswordVideo(passwordInput);
});

finalPasswordGate.addEventListener("submit", (event) => {
  event.preventDefault();

  if (normalizePassword(finalPasswordInput.value) === finalGiftPassword) {
    showRewardReadyStep();
    return;
  }

  finalPasswordInput.value = "";
  finalPasswordInput.placeholder = "Senha errada";
  finalPasswordFeedback.textContent = "Senha errada.";
  showWrongPasswordVideo(finalPasswordInput);
});

correctPasswordPlayer.addEventListener("ended", hideCorrectPasswordVideo);
correctPasswordPlayer.addEventListener("error", hideCorrectPasswordVideo);

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
  const rewardText = `Recompensa 1: ${steamCode}\nRecompensa 2: ${bonusCode}`;

  try {
    await navigator.clipboard.writeText(rewardText);
    copyButton.textContent = "Codigos copiados";
    finalNote.textContent = "As recompensas foram copiadas para a area de transferencia.";
  } catch {
    finalNote.textContent = "Selecione as recompensas e copie manualmente.";
  }
});
