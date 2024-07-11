let x = 0;
let y = 0;
let bn = 0;
let en = 0;
let explo = 0;
let score = 0;
let keysPressed = {};
let canShoot = true;
let canShootTime = 120;
let hp = 3;
let gameOverFlag = false;
let level = 1000;
let intervalId;
let soundObj = {
  shoot: "./sounds/shoot.mp3",
  explo: "./sounds/explo.mp3",
  levelUp: "./sounds/levelUp.mp3",
};

gameLoop();
// setEnemy();
intervalId = setInterval(setEnemy, level);

$(window)
  .on("keydown", function (e) {
    keysPressed[e.which] = true;
  })
  .on("keyup", function (e) {
    delete keysPressed[e.which];
  });

function gameLoop() {
  if (score % 10 === 0 && score > 0 && level >= 300) {
    $(".level").addClass("active");
  }
  if (keysPressed[37]) {
    x -= 10;
    if (x <= -570) x = -570;
    $(".plane").css("left", x);
  }
  if (keysPressed[39]) {
    x += 10;
    if (x >= 570) x = 570;
    $(".plane").css("left", x);
  }
  if (keysPressed[38]) {
    if (y <= 408) {
      y += 7.5;
    }
    $(".plane").css("bottom", y);
  }
  if (keysPressed[40]) {
    if (y >= 10) {
      y -= 7.5;
    }
    $(".plane").css("bottom", y);
  }
  if (keysPressed[32]) {
    if (canShoot) {
      canShoot = false;
      bn++;
      let bt = `<div class="bullet bullet${bn}">
        <img src="./images/bullet1.png" alt="" />
      </div>`;
      $(".game").append(bt);
      $(".game .bullet" + bn).css("left", x);
      $(".game .bullet" + bn).css("bottom", y);
      playSound("shoot");
      $(".game .bullet" + bn)
        .css("left", x)
        .animate(
          {
            bottom: "480px",
          },
          {
            duration: 1000,
            easing: "linear",
            step: function () {
              const $bullet = $(this);
              $(".planeE").each((index, elm) => {
                const $enemy = $(elm);
                if (isOverLap($bullet, $enemy)) {
                  let exx = $enemy.css("left");
                  let exy = $enemy.css("top");
                  $enemy.addClass(`${hp}`);
                  $bullet.remove();
                  hp--;
                  if (elm.classList.contains(0)) {
                    playSound("explo");
                    $enemy.remove();
                    score++;
                    explo++;

                    $(".game").append(
                      ` <div class="explo explo${explo}"></div>`
                    );

                    $(`.game .explo${explo}`).css("left", exx);
                    $(`.game .explo${explo}`).css("top", exy);
                    $(`.game .explo${explo}`).on("animationend", (e) => {
                      $(e.currentTarget).remove();
                    });
                    $(".score span").text(score);
                    hp = 3;
                  }
                }
              });
            },
            complete: function () {
              $(this).remove();
            },
          }
        );

      setTimeout(() => {
        canShoot = true;
      }, canShootTime);
    }
  }
  $(".planeE").each((index, elm) => {
    if (!gameOverFlag) {
      // 只在 gameOverFlag 为 false 时检测
      const $enemy = $(elm);
      if (isOverLap($(".plane"), $enemy)) {
        gameOverFlag = true; // 设置标志位
        gameover();
      }
    }
  });

  if (!gameOverFlag) {
    // 只有在未游戏结束时才继续循环
    requestAnimationFrame(gameLoop);
  }
}

$(".planeE").each((index, elm) => {
  if (!gameOverFlag) {
    const $enemy = $(elm);
    if (isOverLap($(".plane"), $enemy)) {
      gameOverFlag = true;
      gameover();
    }
  }
});

function setEnemy() {
  en++;
  let post = (Math.floor(Math.random() * 7) - 3) * 180;
  let template = `<div class="planeE enemy${en}">
                            <img src="./images/plane2.png" alt="" />
                        </div>`;
  $(".game").append(template);
  $(".game .enemy" + en).css("left", post + "px");
  $(".game .enemy" + en).animate(
    {
      top: 480,
    },
    4000,
    "linear",
    function () {
      $(this).remove();
    }
  );
}

function isOverLap($div1, $div2) {
  let x1 = $div1.offset().left;
  let y1 = $div1.offset().top;
  let w1 = $div1.outerWidth();
  let h1 = $div1.outerHeight();

  let x2 = $div2.offset().left;
  let y2 = $div2.offset().top;
  let w2 = $div2.outerWidth();
  let h2 = $div2.outerHeight();

  if (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2) {
    return true;
  } else {
    return false;
  }
}

$(".level").on("animationstart", (e) => {
  playSound("levelUp");
  console.log("play");
});

$(".level").on("animationend", (e) => {
  $(".level").removeClass("active");
  level -= 20;
  updateInterval();
});

function updateInterval() {
  if (intervalId) {
    clearInterval(intervalId); // 清除之前的 interval
  }
  intervalId = setInterval(setEnemy, level);
}

function gameover() {
  alert("Game Over!");
  location.reload();
}

function playSound(key) {
  let sound = new Audio(soundObj[key]);
  sound.addEventListener("ended", (e) => {
    e.target = null;
  });
  sound.play();
}
