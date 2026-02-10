const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const engineSound = document.getElementById("engine");
const crashSound = document.getElementById("crash");

let car;
let obstacles;
let speed;
let score;
let gameOver;
let laneOffset = 0;

/* 🚗 Init game */
function init() {
  car = { x: 130, y: 380, w: 40, h: 80 };
  obstacles = [
    { x: 40, y: -200, w: 40, h: 80 },
    { x: 120, y: -500, w: 40, h: 80 },
    { x: 200, y: -800, w: 40, h: 80 }
  ];
  speed = 4;
  score = 0;
  gameOver = false;
  document.getElementById("msg").innerText = "";
  document.getElementById("score").innerText = "Score: 0";

  engineSound.currentTime = 0;
  engineSound.play();

  update();
}

/* 🛣️ Road + lane animation */
function drawRoad() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;

  for (let y = laneOffset; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, y);
    ctx.lineTo(canvas.width / 2, y + 20);
    ctx.stroke();
  }

  laneOffset += speed;
  if (laneOffset > 40) laneOffset = 0;
}

/* 🚗 Draw car */
function drawCar() {
  ctx.fillStyle = "lime";
  ctx.fillRect(car.x, car.y, car.w, car.h);
}

/* 🚧 Draw obstacles */
function drawObstacles() {
  ctx.fillStyle = "red";
  obstacles.forEach(o => {
    ctx.fillRect(o.x, o.y, o.w, o.h);
  });
}

/* 💥 Collision */
function hit(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

/* 🔁 Game loop */
function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRoad();

  obstacles.forEach(o => {
    o.y += speed;

    if (o.y > canvas.height) {
      o.y = -200 - Math.random() * 300;
      o.x = Math.random() * (canvas.width - o.w);
      score++;
      speed += 0.15;
      document.getElementById("score").innerText =
        "Score: " + score;
    }

    if (hit(car, o)) {
      gameOver = true;
      engineSound.pause();
      crashSound.play();
      document.getElementById("msg").innerText = "💥 Game Over!";
      return;
    }
  });

  drawCar();
  drawObstacles();
  requestAnimationFrame(update);
}

/* 📱 Touch control */
canvas.addEventListener("touchstart", e => {
  e.preventDefault();
  let rect = canvas.getBoundingClientRect();
  let x = e.touches[0].clientX - rect.left;

  if (x < canvas.width / 2) car.x -= 40;
  else car.x += 40;

  if (car.x < 0) car.x = 0;
  if (car.x > canvas.width - car.w)
    car.x = canvas.width - car.w;
}, { passive: false });

/* 🔄 Restart */
function restart() {
  engineSound.pause();
  init();
}

/* 🔒 Double-tap zoom block */
let lastTouch = 0;
document.addEventListener("touchend", e => {
  let now = new Date().getTime();
  if (now - lastTouch <= 300) e.preventDefault();
  lastTouch = now;
}, { passive: false });

init();
