const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let direction = "right";
let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
let record = localStorage.getItem("record") || 0;
let maxApples = localStorage.getItem("maxApples") || 0;

document.getElementById("recordValue").innerText = maxApples;

// Captura eventos de teclado para movimentação da minhoca
document.addEventListener("keydown", (event) => {
    const key = event.key;
    if ((key === "ArrowUp" || key === "w") && direction !== "down") direction = "up";
    else if ((key === "ArrowDown" || key === "s") && direction !== "up") direction = "down";
    else if ((key === "ArrowLeft" || key === "a") && direction !== "right") direction = "left";
    else if ((key === "ArrowRight" || key === "d") && direction !== "left") direction = "right";
});

// Inicia o jogo e exibe os controles
function startGame() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";
    document.querySelector(".control-buttons").style.display = "flex";
    document.querySelector(".direction-buttons").style.display = "flex";
    record = 0; // Reinicia o contador de maçãs ao iniciar uma nova partida
    game = setInterval(drawGame, 100);
}

// Alterna a exibição dos créditos
function showCredits() {
    const credits = document.getElementById("creditsText");
    credits.style.display = credits.style.display === "none" ? "block" : "none";
}

// Alterna a exibição do recorde
function showRecord() {
    const recordText = document.getElementById("recordText");
    recordText.style.display = recordText.style.display === "none" ? "block" : "none";
}

// Atualiza o recorde máximo de maçãs em uma única partida
function updateMaxApples(score) {
    if (score > maxApples) {
        maxApples = score;
        localStorage.setItem("maxApples", maxApples);
        document.getElementById("recordValue").innerText = maxApples;
    }
}

// Função principal do jogo
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha a comida
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Desenha a minhoca
    ctx.fillStyle = "lime";
    snake.forEach((part) => ctx.fillRect(part.x, part.y, box, box));

    // Movimenta a minhoca
    let head = { x: snake[0].x, y: snake[0].y };

    if (direction === "up") head.y -= box;
    if (direction === "down") head.y += box;
    if (direction === "left") head.x -= box;
    if (direction === "right") head.x += box;

    // Verifica colisão com a comida
    if (head.x === food.x && head.y === food.y) {
        food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
        record++;
        updateMaxApples(record); // Atualiza o recorde de maçãs pegadas
    } else {
        snake.pop();
    }

    // Verifica colisão com as bordas ou consigo mesma
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ||
        snake.some((part) => part.x === head.x && part.y === head.y)) {
        clearInterval(game);
        alert("Game Over!");
    }

    snake.unshift(head);
}

// Função para mudar a direção pelo clique nos botões
function changeDirection(newDirection) {
    if (newDirection === "up" && direction !== "down") direction = "up";
    else if (newDirection === "down" && direction !== "up") direction = "down";
    else if (newDirection === "left" && direction !== "right") direction = "left";
    else if (newDirection === "right" && direction !== "left") direction = "right";
}