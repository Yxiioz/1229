let walkImg, fitImg, standImg, char3Img, char4Img, char5Img;
let numFrames = 6;
let fitNumFrames = 12;
let standNumFrames = 2;
let char3NumFrames = 5;
let char4NumFrames = 5;
let char5NumFrames = 7;
let currentFrame = 0;
let fitCurrentFrame = 0;
let standCurrentFrame = 0;
let char3CurrentFrame = 0;
let char4CurrentFrame = 0;
let char5CurrentFrame = 0;
let frameW, frameH, fitFrameW, fitFrameH, standFrameW, standFrameH, char3FrameW, char3FrameH, char4FrameW, char4FrameH, char5FrameW, char5FrameH;
let posX, posY;
let facing = 1;
let isAttacking = false;
let input, button, restartBtn, startGameBtn;
let questionText = "";
let currentAnswer = "";
let btnOptions = [];
let answerResult = "";
let score = 0;
let decorations = [];
let clouds = [];
let houses = [];
let fireworks = [];
let fountainParticles = [];
let gameState = 'LOADING';
let role2CorrectCount = 0;
let role4CorrectCount = 0;
let role5CorrectCount = 0;
let showRole4 = false;
let showRole5 = false;
let remainingAnimals = [];
let loadingProgress = 0;
let displayedEmoji = "";
let emojiTimer = 0;

const animals = [
  { cn: '狗', en: 'Dog', emoji: '🐶' },
  { cn: '貓', en: 'Cat', emoji: '🐱' },
  { cn: '大象', en: 'Elephant', emoji: '🐘' },
  { cn: '獅子', en: 'Lion', emoji: '🦁' },
  { cn: '老虎', en: 'Tiger', emoji: '🐯' },
  { cn: '猴子', en: 'Monkey', emoji: '🐵' },
  { cn: '兔子', en: 'Rabbit', emoji: '🐰' },
  { cn: '熊', en: 'Bear', emoji: '🐻' },
  { cn: '馬', en: 'Horse', emoji: '🐴' },
  { cn: '豬', en: 'Pig', emoji: '🐷' }
];

function preload() {
  walkImg = loadImage('1/walk/walk1.png');
  fitImg = loadImage('1/fit/fit1.png');
  standImg = loadImage('2/stand/1.png');
  char3Img = loadImage('3/5.png');
  char4Img = loadImage('4/跳.png');
  char5Img = loadImage('5/關公.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameW = walkImg.width / numFrames;
  frameH = walkImg.height;
  fitFrameW = fitImg.width / fitNumFrames;
  fitFrameH = fitImg.height;
  standFrameW = standImg.width / standNumFrames;
  standFrameH = standImg.height;
  char3FrameW = char3Img.width / char3NumFrames;
  char3FrameH = char3Img.height;
  char4FrameW = char4Img.width / char4NumFrames;
  char4FrameH = char4Img.height;
  char5FrameW = char5Img.width / char5NumFrames;
  char5FrameH = char5Img.height;
  posX = width / 2;
  posY = height / 2;

  input = createInput();
  input.position(width / 2 - 100, height - 50);
  input.size(150);
  input.style('font-size', '16px');
  input.style('padding', '5px');
  input.style('border-radius', '5px');
  input.style('border', 'none');
  input.changed(checkAnswer);

  button = createButton('送出');
  button.position(input.x + input.width + 25, height - 50);
  button.mousePressed(checkAnswer);
  button.style('font-size', '16px');
  button.style('padding', '5px 10px');
  button.style('border-radius', '5px');
  button.style('background-color', '#4CAF50');
  button.style('color', 'white');
  button.style('border', 'none');
  button.style('cursor', 'pointer');
  
  // 建立三個選項按鈕
  for (let i = 0; i < 3; i++) {
    let btn = createButton('');
    btn.position(width / 2 - 160 + i * 110, height - 50);
    btn.size(100, 35);
    btn.style('font-size', '16px');
    btn.style('cursor', 'pointer');
    btn.style('background-color', '#4CAF50');
    btn.style('color', 'white');
    btn.style('border', 'none');
    btn.style('border-radius', '5px');
    btn.mousePressed(() => checkOption(i));
    btn.hide();
    btnOptions.push(btn);
  }

  remainingAnimals = [...animals]; // 初始化題目佇列
  generateQuestion();
  input.hide();
  button.hide();

  // 建立重新開始按鈕
  restartBtn = createButton('重新開始');
  restartBtn.position(width / 2 - 60, height / 2 + 100);
  restartBtn.size(120, 50);
  restartBtn.style('font-size', '20px');
  restartBtn.style('cursor', 'pointer');
  restartBtn.style('background-color', '#FF4500');
  restartBtn.style('color', 'white');
  restartBtn.style('border', 'none');
  restartBtn.style('border-radius', '10px');
  restartBtn.mousePressed(resetGame);
  restartBtn.hide();

  // 建立開始遊戲按鈕
  startGameBtn = createButton('開始遊戲');
  startGameBtn.position(width / 2 - 60, height / 2 + 50);
  startGameBtn.size(120, 50);
  startGameBtn.style('font-size', '20px');
  startGameBtn.style('cursor', 'pointer');
  startGameBtn.style('background-color', '#2196F3');
  startGameBtn.style('color', 'white');
  startGameBtn.style('border', 'none');
  startGameBtn.style('border-radius', '10px');
  startGameBtn.mousePressed(startGame);
  startGameBtn.hide();

  for (let i = 0; i < 50; i++) {
    decorations.push({
      x: random(width),
      y: random(height / 2, height),
      size: random(5, 15),
      color: random(['#FFC0CB', '#FFFF00', '#FFFFFF', '#228B22'])
    });
  }

  for (let i = 0; i < 10; i++) {
    clouds.push({
      x: random(width),
      y: random(50, height / 2 - 50),
      size: random(60, 100),
      speed: random(0.5, 1.5)
    });
  }

  // 生成豪宅/皇宮風格的房子
  houses = [];
  let attempts = 0;
  while (houses.length < 3 && attempts < 100) {
    attempts++;
    let hW = random(300, 500);
    let hH = random(250, 400);
    let hX = random(0, width - hW); // 確保不超出右邊界
    
    // 檢查重疊
    let overlap = false;
    for (let h of houses) {
      if (hX < h.x + h.w + 50 && hX + hW + 50 > h.x) { // 保持 50px 間距
        overlap = true;
        break;
      }
    }
    
    if (overlap) continue;

    let houseObj = {
      x: hX,
      y: height / 2,
      w: hW,
      h: hH,
      mainColor: random(['#F8F8FF', '#FFF5EE', '#F0FFF0', '#FFFACD']), // 象牙白、淺黃等淺色系
      roofColor: random(['#B22222', '#4169E1', '#DAA520', '#800080']), // 紅、藍、金、紫屋頂
      pillarCount: floor(random(4, 8)), // 柱子數量
      windows: []
    };

    // 生成窗戶位置
    let winCols = floor(hW / 60);
    let winRows = floor(hH / 90);
    for (let r = 0; r < winRows; r++) {
      for (let c = 0; c < winCols; c++) {
        if (random() > 0.3) { // 隨機保留窗戶
          houseObj.windows.push({
            rx: (c + 0.5) * (hW / winCols) - 15, // 相對 X
            ry: -(r + 0.5) * (hH / winRows) - 20, // 相對 Y
            w: 30,
            h: 50
          });
        }
      }
    }
    houses.push(houseObj);
  }
}

function draw() {
  if (gameState === 'LOADING') {
    background('#87CEEB');
    fill(255);
    stroke(0);
    strokeWeight(4);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("載入中...", width / 2, height / 2 - 50);
    
    // 繪製進度條
    stroke(255);
    strokeWeight(2);
    noFill();
    rect(width / 2 - 150, height / 2, 300, 30, 15);
    
    noStroke();
    fill('#FFD700');
    let w = map(loadingProgress, 0, 100, 0, 296);
    rect(width / 2 - 148, height / 2 + 2, w, 26, 13);
    
    loadingProgress += 1.5; // 載入速度
    if (loadingProgress >= 100) {
      gameState = 'START';
      startGameBtn.show();
    }
    return;
  }

  if (gameState === 'START') {
    background('#87CEEB');
    fill(255);
    stroke(0);
    strokeWeight(4);
    textSize(60);
    textAlign(CENTER, CENTER);
    text("遊戲開始", width / 2, height / 2 - 50);
    return;
  }

  // 通關成功畫面 (獨立畫面)
  if (gameState === 'CLEARED') {
    background(0); // 純黑夜空
    
    // 煙火邏輯
    for (let i = fireworks.length - 1; i >= 0; i--) {
      let f = fireworks[i];
      fill(f.color);
      noStroke();
      ellipse(f.x, f.y, f.size, f.size);
      f.x += f.vx;
      f.y += f.vy;
      f.size *= 0.98;
      if (f.size < 1) fireworks.splice(i, 1);
    }
    if (frameCount % 10 === 0) {
      fireworks.push({
        x: random(width),
        y: random(height / 2),
        vx: random(-2, 2),
        vy: random(-2, 2),
        size: random(5, 15),
        color: random(['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF'])
      });
    }

    // UI 顯示
    restartBtn.show();
    input.hide(); button.hide(); for (let btn of btnOptions) btn.hide();

    fill(255);
    stroke(0);
    strokeWeight(4);
    textSize(80);
    textAlign(CENTER, CENTER);
    text("通關成功", width / 2, height / 2);
    return; // 停止繪製原本的遊戲世界
  }

  if (showRole5) {
    background('#191970'); // 晚上
  } else if (showRole4) {
    background('#FFA500'); // 下午
  } else {
    background('#87CEEB'); // 早上
  }
  noStroke();
  fill(255, 200);
  for (let c of clouds) {
    ellipse(c.x, c.y, c.size, c.size * 0.8);
    ellipse(c.x - c.size * 0.4, c.y + c.size * 0.1, c.size * 0.7, c.size * 0.5);
    ellipse(c.x + c.size * 0.4, c.y + c.size * 0.1, c.size * 0.7, c.size * 0.5);
    c.x += c.speed;
    if (c.x > width + 100) c.x = -100;
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    let f = fireworks[i];
    fill(f.color);
    ellipse(f.x, f.y, f.size, f.size);
    f.x += f.vx;
    f.y += f.vy;
    f.size *= 0.98;
    if (f.size < 1) {
      fireworks.splice(i, 1);
    }
  }

  noStroke();
  fill('#669900');
  rect(0, height / 2, width, height / 2);

  // 繪製房子 (豪宅/皇宮風格)
  for (let h of houses) {
    // 地基
    fill(100);
    rect(h.x - 10, h.y, h.w + 20, 10);

    // 主體
    fill(h.mainColor);
    rect(h.x, h.y - h.h, h.w, h.h); 
    
    // 繪製窗戶 (帶發光效果)
    for (let win of h.windows) {
      if (showRole5) {
        // 晚上：窗戶發光
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = 'yellow';
        fill(255, 255, 0, 220);
      } else {
        // 白天：普通窗戶
        drawingContext.shadowBlur = 0;
        fill(50, 70, 90);
      }
      rect(h.x + win.rx, h.y + win.ry, win.w, win.h, 10); // 圓角窗戶
    }
    drawingContext.shadowBlur = 0; // 重置光暈效果

    // 柱子 (Pillars)
    fill(240); // 灰白色柱子
    let pillarW = h.w / (h.pillarCount * 2 + 1);
    for(let i=0; i<h.pillarCount; i++) {
        let px = h.x + pillarW + i * 2 * pillarW;
        rect(px, h.y - h.h, pillarW, h.h);
    }

    // 屋頂 (大三角 + 圓頂)
    fill(h.roofColor); 
    triangle(h.x - 30, h.y - h.h, h.x + h.w + 30, h.y - h.h, h.x + h.w / 2, h.y - h.h - 120);
    // 圓頂裝飾
    arc(h.x + h.w / 2, h.y - h.h - 60, 120, 120, PI, 0);

    // 大門 (拱門風格)
    fill('#4A3C31'); 
    let doorW = 80;
    let doorH = 120;
    rect(h.x + h.w / 2 - doorW/2, h.y - doorH, doorW, doorH);
    arc(h.x + h.w / 2, h.y - doorH, doorW, doorW, PI, 0);
    
    // 金色邊框裝飾
    stroke('#FFD700');
    strokeWeight(3);
    noFill();
    rect(h.x, h.y - h.h, h.w, h.h); // 建築外框
    noStroke();
  }

  // 繪製超大氣派噴水池
  let fx = width / 2;
  let fy = height / 2 + 60;

  push();
  // 基座水池
  noStroke();
  fill(230); // 大理石底座
  ellipse(fx, fy + 40, 600, 100);
  fill('#40E0D0'); // 池水
  ellipse(fx, fy + 40, 560, 85);

  // 下層結構
  fill(240);
  rect(fx - 70, fy - 40, 140, 80);
  fill('#FFD700'); // 金色裝飾
  rect(fx - 75, fy + 30, 150, 10);
  
  fill(240);
  ellipse(fx, fy - 40, 300, 50); // 下層水盤
  fill('#40E0D0');
  ellipse(fx, fy - 40, 280, 40);

  // 中層結構
  fill(240);
  rect(fx - 50, fy - 110, 100, 70);
  ellipse(fx, fy - 110, 200, 40); // 中層水盤
  fill('#40E0D0');
  ellipse(fx, fy - 110, 180, 30);

  // 頂層結構
  fill(240);
  rect(fx - 30, fy - 170, 60, 60);
  ellipse(fx, fy - 170, 100, 25);
  
  // 頂端金色裝飾
  fill('#FFD700');
  ellipse(fx, fy - 190, 40, 60);

  // 噴水粒子效果
  for(let k=0; k<5; k++){
    fountainParticles.push({ x: fx, y: fy - 200, vx: random(-4, 4), vy: random(-7, -4), size: random(5, 10), color: color(173, 216, 230, 150) });
  }

  for (let i = fountainParticles.length - 1; i >= 0; i--) {
    let p = fountainParticles[i];
    fill(p.color);
    ellipse(p.x, p.y, p.size, p.size);
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2; // 重力
    if (p.y > fy + 40) fountainParticles.splice(i, 1);
  }
  pop();

  for (let d of decorations) {
    fill(d.color);
    ellipse(d.x, d.y, d.size, d.size);
  }

  let char3Sx = char3CurrentFrame * char3FrameW;
  push();
  translate(width / 2 - 500, height / 2);
  scale(4);
  image(char3Img, -char3FrameW / 2, -char3FrameH / 2, char3FrameW, char3FrameH, char3Sx, 0, char3FrameW, char3FrameH);
  pop();

  if (frameCount % 10 === 0) {
    char3CurrentFrame = (char3CurrentFrame + 1) % char3NumFrames;
  }

  if (showRole5) {
    let char5Sx = char5CurrentFrame * char5FrameW;
    push();
    translate(width - 200, height / 2);
    scale(1.5);
    image(char5Img, -char5FrameW / 2, -char5FrameH / 2, char5FrameW, char5FrameH, char5Sx, 0, char5FrameW, char5FrameH);
    pop();

    if (frameCount % 10 === 0) {
      char5CurrentFrame = (char5CurrentFrame + 1) % char5NumFrames;
    }
  } else if (showRole4) {
    let char4Sx = char4CurrentFrame * char4FrameW;
    push();
    translate(width - 200, height / 2);
    scale(1.5);
    image(char4Img, -char4FrameW / 2, -char4FrameH / 2, char4FrameW, char4FrameH, char4Sx, 0, char4FrameW, char4FrameH);
    pop();

    if (frameCount % 10 === 0) {
      char4CurrentFrame = (char4CurrentFrame + 1) % char4NumFrames;
    }
  } else {
    let standSx = standCurrentFrame * standFrameW;
    push();
    translate(width - 200, height / 2);
    scale(1.5);
    image(standImg, -standFrameW / 2, -standFrameH / 2, standFrameW, standFrameH, standSx, 0, standFrameW, standFrameH);
    pop();

    if (frameCount % 10 === 0) {
      standCurrentFrame = (standCurrentFrame + 1) % standNumFrames;
    }
  }

  if (keyIsDown(32) && !isAttacking) {
    isAttacking = true;
    fitCurrentFrame = 0;
  }

  if (isAttacking) {
    posX += 5 * facing;
    let sx = fitCurrentFrame * fitFrameW;
    push();
    translate(posX, posY);
    scale(facing * 3, 3);
    image(fitImg, -fitFrameW / 2, -fitFrameH / 2, fitFrameW, fitFrameH, sx, 0, fitFrameW, fitFrameH);
    pop();

    if (frameCount % 5 === 0) {
      fitCurrentFrame++;
      if (fitCurrentFrame >= fitNumFrames) {
        isAttacking = false;
      }
    }
  } else {
    let isMoving = false;
    if (keyIsDown(RIGHT_ARROW)) {
      posX += 3;
      facing = 1;
      isMoving = true;
    } else if (keyIsDown(LEFT_ARROW)) {
      posX -= 3;
      facing = -1;
      isMoving = true;
    }

    let sx = currentFrame * frameW;
    push();
    translate(posX, posY);
    scale(facing * 3, 3);
    image(walkImg, -frameW / 2, -frameH / 2, frameW, frameH, sx, 0, frameW, frameH);
    pop();

    if (isMoving && frameCount % 5 === 0) {
      currentFrame = (currentFrame + 1) % numFrames;
    } else if (!isMoving) {
      currentFrame = 0;
    }
  }

  let char3X = width / 2 - 500;
  let char3Y = height / 2;
  let standX = width - 200;
  let standY = height / 2;
  
  // 根據距離控制 UI 顯示
  if (gameState === 'PLAY') {
    if (dist(posX, posY, standX, standY) < 250) {
      // 接近出題角色：顯示選項按鈕，隱藏輸入框
      input.hide();
      button.hide();
      for (let btn of btnOptions) btn.show();
      
      // 繪製更明顯的問題背景與文字
      push();
      rectMode(CENTER);
      fill(0, 0, 0, 180); // 半透明黑色背景
      rect(width / 2, height / 2 - 150, 500, 80, 10); // 改為畫面正中央
      fill(255, 255, 0); // 黃色文字
      textSize(32); // 加大字體
      textAlign(CENTER, CENTER);
      text(questionText, width / 2, height / 2 - 150);
      pop();
    } else if (dist(posX, posY, char3X, char3Y) < 250) {
      // 接近大學角色：顯示輸入框，隱藏選項按鈕
      input.show();
      button.show();
      for (let btn of btnOptions) btn.hide();
      text("請問你是甚麼大學?", char3X, char3Y - 120);
    } else {
      // 都不在範圍內：全部隱藏
      input.hide();
      button.hide();
      for (let btn of btnOptions) btn.hide();
    }
  }

  fill(255);
  textSize(24);
  textAlign(CENTER);

  // 顯示回答結果
  text(answerResult, width / 2, 50);
  
  textAlign(LEFT);
  text("分數: " + score, 50, 50);

  push();
  textSize(30);
  fill('#FFD700');
  stroke(0);
  strokeWeight(4);
  textAlign(RIGHT, TOP);
  text("學號: 730946", width - 20, 20);
  pop();

  // 顯示答對的動物樣子 (Emoji)
  if (emojiTimer > 0) {
    push();
    textSize(150);
    textAlign(CENTER, CENTER);
    text(displayedEmoji, width / 2, height / 2 - 280);
    pop();
    emojiTimer--;
  }
}

function generateQuestion() {
  // 如果題目用完了，重新填滿
  if (remainingAnimals.length === 0) {
    remainingAnimals = [...animals];
  }

  // 從剩餘題目中隨機選一個
  let index = floor(random(remainingAnimals.length));
  let correctAnimal = remainingAnimals[index];
  remainingAnimals.splice(index, 1); // 移除已選題目

  currentAnswer = correctAnimal.en;
  questionText = correctAnimal.cn + " 的英文是?";
  
  // 產生選項
  let options = [currentAnswer];
  while (options.length < 3) {
    let other = random(animals).en;
    if (!options.includes(other)) {
      options.push(other);
    }
  }
  
  // 打亂選項順序
  options = shuffle(options);
  
  // 更新按鈕文字
  for (let i = 0; i < 3; i++) {
    btnOptions[i].html(options[i]);
    // 將選項文字存入按鈕物件中以便檢查
    btnOptions[i].value = options[i];
  }
}

function checkOption(index) {
  let selected = btnOptions[index].value;
  if (selected === currentAnswer) {
    answerResult = "答對了！";
    score++;
    
    // 設定要顯示的動物 Emoji 與時間
    let animalData = animals.find(a => a.en === currentAnswer);
    if (animalData) displayedEmoji = animalData.emoji;
    emojiTimer = 60; // 顯示約 1 秒 (60 frames)

    if (!showRole4) {
      role2CorrectCount++;
      if (role2CorrectCount >= 2) {
        showRole4 = true;
      }
    } else if (!showRole5) {
      role4CorrectCount++;
      if (role4CorrectCount >= 2) {
        showRole5 = true;
      }
    } else {
      role5CorrectCount++;
      if (role5CorrectCount >= 2) {
        gameState = 'CLEARED';
      }
    }
    for (let i = 0; i < 100; i++) {
      fireworks.push({
        x: random(width),
        y: random(height / 2),
        vx: random(-2, 2),
        vy: random(-2, 2),
        size: random(5, 15),
        color: random(['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF'])
      });
    }
    generateQuestion();
  } else {
    answerResult = "答錯了，再試試看！";
  }
}

function checkAnswer() {
  let ans = input.value();
  let char3X = width / 2 - 500;
  let char3Y = height / 2;

  if (dist(posX, posY, char3X, char3Y) < 250) {
    answerResult = "你好，" + ans + " 的同學！";
  }
  input.value('');
}

function startGame() {
  gameState = 'PLAY';
  startGameBtn.hide();
}

function resetGame() {
  score = 0;
  role2CorrectCount = 0;
  role4CorrectCount = 0;
  role5CorrectCount = 0;
  showRole4 = false;
  showRole5 = false;
  gameState = 'START'; // 回到開始畫面
  startGameBtn.show(); // 顯示開始按鈕
  remainingAnimals = [...animals];
  generateQuestion();
  restartBtn.hide();
  fireworks = [];
  posX = width / 2;
  posY = height / 2;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  input.position(width / 2 - 100, height - 50);
  button.position(width / 2 - 100 + input.width + 25, height - 50);
  
  for (let i = 0; i < 3; i++) {
    btnOptions[i].position(width / 2 - 160 + i * 110, height - 50);
  }
  restartBtn.position(width / 2 - 60, height / 2 + 100);
  startGameBtn.position(width / 2 - 60, height / 2 + 50);
  
  posX = width / 2;
  posY = height / 2;
}

function mousePressed() {
  // 移除原本點擊畫面任意處開始遊戲的邏輯
  // 改由 startGameBtn 控制
}
