const scene = document.querySelector(".locker-scene");
const introOverlay = document.querySelector("#intro-video");
const introPlayer = document.querySelector("#intro-player");
const introStartButton = document.querySelector("#intro-start-button");
const wrongPasswordOverlay = document.querySelector("#wrong-password-video");
const wrongPasswordPlayer = document.querySelector("#wrong-password-player");
const correctPasswordOverlay = document.querySelector("#correct-password-video");
const correctPasswordPlayer = document.querySelector("#correct-password-player");
const secondPasswordOverlay = document.querySelector("#second-password-video");
const secondPasswordPlayer = document.querySelector("#second-password-player");
const menuScreen = document.querySelector("#dbd-menu");
const playMenuButton = document.querySelector("#play-menu");
const killerMenuButton = document.querySelector("#killer-menu");
const assassinMenuButton = document.querySelector("#assassin-menu");
const killerMenuLabel = killerMenuButton.querySelector("span");
const assassinScreen = document.querySelector("#assassin-screen");
const backToMenuButton = document.querySelector("#back-to-menu");
const assassinCardButtons = document.querySelectorAll(".assassin-card-hotspot");
const sceneImage = document.querySelector(".scene-image");
const lockerButton = document.querySelector("#open-locker");
const backFromRewardButton = document.querySelector("#back-from-reward");
const modal = document.querySelector("#gift-modal");
const closeButton = document.querySelector("#close-modal");
const finalNote = document.querySelector("#final-note");
const steamCodeValue = document.querySelector("#steam-code");
const bonusCodeValue = document.querySelector("#bonus-code");
const copyRewardCodeButtons = document.querySelectorAll(".copy-reward-code");
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

const steamCode = scene.dataset.code;
const bonusCode = scene.dataset.bonusCode;
const giftPassword = "ghost face";
const finalGiftPassword = "tiffany";
let introHidden = false;
let wrongPasswordFocusTarget = null;
let wrongPasswordTimer = null;

killerMenuLabel.textContent = "Recompensa";

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
  introOverlay.classList.add("started");
  playIntroWithAudio().catch(() => {});
}

introPlayer.addEventListener("ended", hideIntro);
introPlayer.addEventListener("error", hideIntro);
introStartButton.addEventListener("click", startIntroAfterGesture, { once: true });

function normalizePassword(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function hideWrongPasswordVideo() {
  clearTimeout(wrongPasswordTimer);
  wrongPasswordPlayer.pause();
  wrongPasswordOverlay.hidden = true;

  if (wrongPasswordFocusTarget) {
    wrongPasswordFocusTarget.focus();
  }
}

function showWrongPasswordVideo(focusTarget) {
  wrongPasswordFocusTarget = focusTarget;
  clearTimeout(wrongPasswordTimer);
  wrongPasswordOverlay.hidden = false;
  wrongPasswordPlayer.currentTime = 0;
  wrongPasswordPlayer.muted = false;
  wrongPasswordPlayer.volume = 1;
  wrongPasswordPlayer.play().catch(() => {
    wrongPasswordTimer = setTimeout(hideWrongPasswordVideo, 3200);
  });
}

function hideCorrectPasswordVideo() {
  correctPasswordPlayer.pause();
  showCongratsStep();
  correctPasswordOverlay.hidden = true;
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
  revealGift();
  secondPasswordOverlay.hidden = true;
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
  assassinMenuButton.hidden = !shouldOpen;

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

function enterAssassinScreen() {
  menuScreen.hidden = true;
  assassinScreen.hidden = false;
  backToMenuButton.focus();
}

function returnToMenu() {
  assassinScreen.hidden = true;
  menuScreen.hidden = false;
  playMenuButton.focus();
}

function returnFromRewardToMenu() {
  modal.hidden = true;
  scene.hidden = true;
  menuScreen.hidden = false;
  sceneImage.src = "assets/dbd-locker-background.png";
  sceneImage.alt = "Cena de Dead by Daylight com armarios vermelhos em um ambiente azul";
  lockerButton.classList.remove("opened");
  playMenuButton.focus();
}

function openGift() {
  modal.hidden = false;
  sceneImage.src = "assets/locker-open.png";
  sceneImage.alt = "Armario vermelho aberto em um ambiente azul";
  giftCard.hidden = false;
  passwordGate.hidden = false;
  congratsStep.hidden = true;
  finalPasswordGate.hidden = true;
  giftContent.hidden = true;
  giftCard.classList.add("locked");
  giftCard.classList.remove("revealed", "rewards-open");
  steamCodeValue.textContent = "?????-?????-?????";
  bonusCodeValue.textContent = "?????-?????-?????";
  copyRewardCodeButtons.forEach((button) => {
    button.textContent = "Copiar codigo";
  });
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
  giftCard.classList.remove("locked");
  continuePasswordButton.focus();
}

function showFinalPasswordGate() {
  giftCard.classList.add("state-switching");
  giftCard.classList.add("locked");
  passwordGate.hidden = true;
  finalPasswordGate.hidden = false;
  congratsStep.hidden = true;
  giftContent.hidden = true;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      giftCard.classList.remove("state-switching");
      finalPasswordInput.focus();
    });
  });
}

function closeGift() {
  modal.hidden = true;
  lockerButton.focus();
}

function revealGift() {
  steamCodeValue.textContent = steamCode;
  bonusCodeValue.textContent = bonusCode;
  passwordGate.hidden = true;
  congratsStep.hidden = true;
  finalPasswordGate.hidden = true;
  giftContent.hidden = false;
  giftCard.classList.remove("locked");
  giftCard.classList.add("revealed", "rewards-open");
  finalNote.textContent = "A fogueira esta acesa. Boa partida.";
  copyRewardCodeButtons[0].focus();
}

playMenuButton.addEventListener("click", toggleKillerChoice);
killerMenuButton.addEventListener("click", enterKillerScene);
assassinMenuButton.addEventListener("click", enterAssassinScreen);
backToMenuButton.addEventListener("click", returnToMenu);
backFromRewardButton.addEventListener("click", returnFromRewardToMenu);
lockerButton.addEventListener("click", openGift);
closeButton.addEventListener("click", closeGift);
continuePasswordButton.addEventListener("click", showFinalPasswordGate);

assassinCardButtons.forEach((button) => {
  button.addEventListener("click", () => {
    assassinCardButtons.forEach((cardButton) => {
      cardButton.classList.remove("selected");
      cardButton.setAttribute("aria-pressed", "false");
    });

    button.classList.add("selected");
    button.setAttribute("aria-pressed", "true");
  });
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
wrongPasswordPlayer.addEventListener("ended", hideWrongPasswordVideo);
wrongPasswordPlayer.addEventListener("error", hideWrongPasswordVideo);
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

copyRewardCodeButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const isBonusReward = button.dataset.reward === "bonus";
    const rewardCode = isBonusReward ? bonusCode : steamCode;
    const rewardLabel = isBonusReward ? "Recompensa 2" : "Recompensa 1";

    try {
      await navigator.clipboard.writeText(rewardCode);
      button.textContent = "Codigo copiado";
      finalNote.textContent = `${rewardLabel} copiada para a area de transferencia.`;
    } catch {
      finalNote.textContent = "Selecione o codigo e copie manualmente.";
    }
  });
});
