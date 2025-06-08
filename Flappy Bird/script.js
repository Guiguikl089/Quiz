const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const creditsButton = document.getElementById("creditsButton");
const creditsText = document.getElementById("creditsText");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 2000;
canvas.height = 950;

const birdImg = new Image();
birdImg.src = "./img/bird.png.png";

const cloudImg = new Image();
cloudImg.src = "./img/pngwing.com.png"; // Imagem das nuvens

const bird = {
    x: 50,
    y: 200,
    width: 90,
    height: 90,
    velocity: 0,
    gravity: 0.5,

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
    },

    draw() {
        ctx.drawImage(birdImg, this.x, this.y, this.width, this.height);
    }
};

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        bird.velocity = -8; // Pulo do pássaro
    }
});

const pipes = [];
const clouds = [
    { x: 800, y: 50, width: 150, height: 80 },
    { x: 400, y: 20, width: 120, height: 70 },
    { x: 1000, y: 80, width: 170, height: 90 }
];

let score = 0;
let gameOver = false;

function createPipe() {
    const pipeHeight = Math.floor(Math.random() * 300) + 150;
    pipes.push({
        x: canvas.width,
        y: 0,
        width: 70,
        height: pipeHeight,
        passed: false
    });

    pipes.push({
        x: canvas.width,
        y: pipeHeight + 180,
        width: 70,
        height: canvas.height - (pipeHeight + 100),
        passed: false
    });
}

setInterval(createPipe, 2000);

function drawClouds() {
    clouds.forEach(cloud => {
        ctx.drawImage(cloudImg, cloud.x, cloud.y, cloud.width, cloud.height);
        cloud.x -= 1.5; // Movimento suave das nuvens

        if (cloud.x + cloud.width < 0) {
            cloud.x = canvas.width + Math.random() * 300; // Reposiciona a nuvem na lateral direita
        }
    });
}

function checkCollision(pipe) {
    let margemErro = 5; // Adicionando uma margem de erro pequena

    if (
        bird.x + margemErro < pipe.x + pipe.width &&
        bird.x + bird.width - margemErro > pipe.x &&
        bird.y + margemErro < pipe.y + pipe.height &&
        bird.y + bird.height - margemErro > pipe.y
    ) {
        gameOver = true;
    }

    // Verifica se o pássaro tocou o chão
    if (bird.y + bird.height >= canvas.height) {
        gameOver = true;
    }
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 80, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawClouds(); // Desenha as nuvens no topo
    bird.update();
    bird.draw();

    pipes.forEach((pipe) => {
        pipe.x -= 3;
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);

        checkCollision(pipe);

        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
            score++;
        }
    });

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Pontuação: " + score, 10, 20);

    requestAnimationFrame(gameLoop);
}

// Lógica da Tela Inicial e Créditos
startButton.addEventListener("click", () => {
    startScreen.style.display = "none"; // Esconde a tela inicial
    canvas.style.display = "block"; // Exibe o jogo
    gameLoop(); // Começa o jogo
});

creditsButton.addEventListener("click", () => {
    creditsText.style.display = "block"; // Exibe o nome abaixo do botão de créditos
});