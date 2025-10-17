const menu = document.getElementById("menu-screen");
const game = document.getElementById("game-container");
const bird = document.getElementById("bird");
const scoreDisplay = document.getElementById("score");

const flapSound = document.getElementById("flapSound");
const scoreSound = document.getElementById("scoreSound");
const crashSound = document.getElementById("crashSound");

let selectedBird = "";
let birdY = 300;
let velocity = 0;
let gravity = 0.4;
let jump = -7;
let pipes = [];
let score = 0;
let gameOver = false;

/* Bird Selection */
document.querySelectorAll("#bird-selection img").forEach(img => {
  img.addEventListener("click", () => {
    document.querySelectorAll("#bird-selection img").forEach(i => i.style.border = "none");
    img.style.border = "3px solid yellow";
    selectedBird = img.src;
  });
});

/* Start Game */
document.getElementById("start-btn").addEventListener("click", () => {
  if (!selectedBird) {
    alert("Please select a bird 🐤");
    return;
  }
  menu.classList.add("hidden");
  game.classList.remove("hidden");
  bird.style.backgroundImage = `url('${selectedBird}')`;
  startGame();
});

function startGame() {
  document.addEventListener("keydown", flap);
  document.addEventListener("click", flap);
  setInterval(createPipe, 1800);
  updateGame();
}

function flap() {
  if (gameOver) return;
  velocity = jump;
  flapSound.currentTime = 0;
  flapSound.play();
}

function createPipe() {
  const gap = 160;
  const topHeight = Math.floor(Math.random() * 220) + 60;
  const bottomHeight = 600 - topHeight - gap;

  const topPipe = document.createElement("div");
  topPipe.classList.add("pipe");
  topPipe.style.height = topHeight + "px";
  topPipe.style.top = "0";
  topPipe.style.left = "400px";

  const bottomPipe = document.createElement("div");
  bottomPipe.classList.add("pipe");
  bottomPipe.style.height = bottomHeight + "px";
  bottomPipe.style.bottom = "0";
  bottomPipe.style.left = "400px";

  game.appendChild(topPipe);
  game.appendChild(bottomPipe);

  pipes.push({ top: topPipe, bottom: bottomPipe });
}

function updateGame() {
  if (gameOver) return;

  velocity += gravity;
  birdY += velocity;
  bird.style.top = birdY + "px";

  const birdRect = bird.getBoundingClientRect();

  pipes.forEach((pipePair, index) => {
    const topPipe = pipePair.top;
    const bottomPipe = pipePair.bottom;
    const left = parseInt(topPipe.style.left);

    topPipe.style.left = left - 3 + "px";
    bottomPipe.style.left = left - 3 + "px";

    const topRect = topPipe.getBoundingClientRect();
    const bottomRect = bottomPipe.getBoundingClientRect();

    if (
      birdRect.right > topRect.left &&
      birdRect.left < topRect.right &&
      (birdRect.top < topRect.bottom || birdRect.bottom > bottomRect.top)
    ) {
      crashSound.play();
      endGame();
    }

    if (left + 80 < 0) {
      topPipe.remove();
      bottomPipe.remove();
      pipes.splice(index, 1);
      score++;
      scoreSound.play();
      scoreDisplay.textContent = score;
    }
  });

  if (birdY > 550 || birdY < 0) {
    crashSound.play();
    endGame();
  }

  requestAnimationFrame(updateGame);
}

function endGame() {
  gameOver = true;
  bird.style.animation = "none";
  alert("💀 Game Over! Your Score: " + score);
  window.location.reload();
}
