const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let car = { x: 130, y: 400, w: 40, h: 80 };
let obstacle = { x: Math.random()*260, y: -100, w: 40, h: 80 };
let speed = 4;
let score = 0;
let gameOver = false;

// Touch control
canvas.addEventListener("touchstart", e => {
  let touchX = e.touches[0].clientX;
  let rect = canvas.getBoundingClientRect();
  let x = touchX - rect.left;

  if (x < canvas.width / 2) car.x -= 30;
  else car.x += 30;

  if (car.x < 0) car.x = 0;
  if (car.x > canvas.width - car.w)
    car.x = canvas.width - car.w;
});

// Keyboard (PC optional)
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") car.x -= 30;
  if (e.key === "ArrowRight") car.x += 30;
});

function drawCar() {
  ctx.fillStyle = "lime";
  ctx.fillRect(car.x, car.y, car.w, car.h);
}

function drawObstacle() {
  ctx.fillStyle = "red";
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
}

function collide(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  obstacle.y += speed;

  if (obstacle.y > canvas.height) {
    obstacle.y = -100;
    obstacle.x = Math.random() * (canvas.width - obstacle.w);
    score++;
    speed += 0.2;
    document.getElementById("score").innerText = "Score: " + score;
  }

  if (collide(car, obstacle)) {
    gameOver = true;
    document.getElementById("msg").innerText = "💥 Game Over!";
    return;
  }

  drawCar();
  drawObstacle();
  requestAnimationFrame(update);
}

update();
