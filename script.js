const scene = document.querySelector(".locker-scene");
const introOverlay = document.querySelector("#intro-video");
const introPlayer = document.querySelector("#intro-player");
const wrongPasswordOverlay = document.querySelector("#wrong-password-video");
const wrongPasswordImage = document.querySelector("#wrong-password-image");
const correctPasswordOverlay = document.querySelector("#correct-password-video");
const correctPasswordPlayer = document.querySelector("#correct-password-player");
const secondPasswordOverlay = document.querySelector("#second-password-video");
const secondPasswordPlayer = document.querySelector("#second-password-player");
const menuScreen = document.querySelector("#dbd-menu");
const playMenuButton = document.querySelector("#play-menu");
const killerMenuButton = document.querySelector("#killer-menu");
const sceneImage = document.querySelector(".scene-image");
const lockerButton = document.querySelector("#open-locker");
const modal = document.querySelector("#gift-modal");
const closeButton = document.querySelector("#close-modal");
const finalNote = document.querySelector("#final-note");
const rewardButtons = document.querySelectorAll(".reward-choice");
const rewardDetail = document.querySelector("#reward-detail");
const selectedRewardLabel = document.querySelector("#selected-reward-label");
const selectedRewardCode = document.querySelector("#selected-reward-code");
const copySelectedCodeButton = document.querySelector("#copy-selected-code");
const closeRewardDetailButton = document.querySelector("#close-reward-detail");
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
let selectedRewardCodeValue = "";
let selectedRewardButton = null;

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

function hideSecondPasswordVideo() {
  secondPasswordPlayer.pause();
  secondPasswordOverlay.hidden = true;
  showRewardReadyStep();
}

function showSecondPasswordVideo() {
  secondPasswordOverlay.hidden = false;
  secondPasswordPlayer.currentTime = 0;
  secondPasswordPlayer.muted = false;
  secondPasswordPlayer.volume = 0.25;
  secondPasswordPlayer.play().catch(hideSecondPasswordVideo);
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
  rewardDetail.hidden = true;
  giftCard.classList.add("locked");
  giftCard.classList.remove("revealed");
  selectedRewardCode.textContent = "?????-?????-?????";
  selectedRewardLabel.textContent = "Recompensa";
  selectedRewardCodeValue = "";
  selectedRewardButton = null;
  copySelectedCodeButton.textContent = "Copiar codigo";
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
  passwordGate.hidden = true;
  congratsStep.hidden = true;
  finalPasswordGate.hidden = true;
  rewardReadyStep.hidden = true;
  giftContent.hidden = false;
  rewardDetail.hidden = true;
  giftCard.classList.remove("locked");
  giftCard.classList.add("revealed");
  finalNote.textContent = "A fogueira esta acesa. Boa partida.";
  rewardButtons[0].focus();
}

function openRewardDetail(button) {
  const isBonusReward = button.dataset.reward === "bonus";

  selectedRewardButton = button;
  selectedRewardCodeValue = isBonusReward ? bonusCode : steamCode;
  selectedRewardLabel.textContent = isBonusReward ? "Recompensa 2" : "Recompensa 1";
  selectedRewardCode.textContent = selectedRewardCodeValue;
  copySelectedCodeButton.textContent = "Copiar codigo";
  finalNote.textContent = "A fogueira esta acesa. Boa partida.";
  rewardDetail.hidden = false;
  copySelectedCodeButton.focus();
}

function closeRewardDetail() {
  rewardDetail.hidden = true;

  if (selectedRewardButton) {
    selectedRewardButton.focus();
  }
}

playMenuButton.addEventListener("click", toggleKillerChoice);
killerMenuButton.addEventListener("click", enterKillerScene);
lockerButton.addEventListener("click", openGift);
closeButton.addEventListener("click", closeGift);
continuePasswordButton.addEventListener("click", showFinalPasswordGate);
receiveRewardButton.addEventListener("click", revealGift);
closeRewardDetailButton.addEventListener("click", closeRewardDetail);
rewardButtons.forEach((button) => {
  button.addEventListener("click", () => openRewardDetail(button));
});

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
    showSecondPasswordVideo();
    return;
  }

  finalPasswordInput.value = "";
  finalPasswordInput.placeholder = "Senha errada";
  finalPasswordFeedback.textContent = "Senha errada.";
  showWrongPasswordVideo(finalPasswordInput);
});

correctPasswordPlayer.addEventListener("ended", hideCorrectPasswordVideo);
correctPasswordPlayer.addEventListener("error", hideCorrectPasswordVideo);
secondPasswordPlayer.addEventListener("ended", hideSecondPasswordVideo);
secondPasswordPlayer.addEventListener("error", hideSecondPasswordVideo);

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

copySelectedCodeButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(selectedRewardCodeValue);
    copySelectedCodeButton.textContent = "Codigo copiado";
    finalNote.textContent = `${selectedRewardLabel.textContent} copiada para a area de transferencia.`;
  } catch {
    finalNote.textContent = "Selecione o codigo e copie manualmente.";
  }
});
