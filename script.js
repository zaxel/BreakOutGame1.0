//setting up canvas
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let x = canvas.width/2;
let y = canvas.height-30;

//pixels bounce move per frame
let dx = 2;
let dy = -2;

//bounce setting
let bounceColor = "#0095DD";
let ballRadius = 10;

//paddle setting
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth) / 2;
let paddleSpeed = 7;

//if button pressed 
let rightPressed = false;
let leftPressed = false;

//bricks settings
let brickRowCount = 4;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 35;
let brickOffsetLeft = 35;
let brickColour = "#0095DD";

//scores
let score = 0;
let scoreFactor = 10;

//player lives
let lives = 3;

//creating empty arrays of bricks 
let bricks = [];
for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1};
    }
}

//filling arrays with bricks starting coordinats and drawing bricks
function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1){
                let brickX = (c*(brickWidth+brickPadding))+ brickOffsetLeft;
                let brickY = (r*(brickHeight+brickPadding))+ brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickColour;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//checking if buttons pressed
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

//checking if mouse moved
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        if(relativeX <= paddleWidth/2){
            paddleX = 0;
        }else if(relativeX > (canvas.width - paddleWidth/2)){
            paddleX = canvas.width - paddleWidth;
        }else{
            paddleX = relativeX - paddleWidth/2;
        }
    }
}

//calculatind ball calliding with the bricks
function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status == 1){
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    //checking if score equal to ammount of bricks
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS! \n Your score is: " + score*scoreFactor);
                        document.location.reload();
                    }
                    randomColour();
                }
            }
        }
    }
}

//score drawing
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score*scoreFactor, 8, 20);
}
//lives draing
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

//drawing ball
function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = bounceColor;
    ctx.fill();
    ctx.closePath();
}
function randomColour(){
    bounceColor = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
}

//drawing the game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawScore();
    drawLives();
    drawPaddle();
    collisionDetection();
    x += dx;
    y += dy;

    //checking if ball touching the left and right wall
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx+1.5;
        randomColour();
    }
    
    //checking if ball touching the top wall
    if(y + dy < ballRadius) {
        dy = -dy;
        randomColour();
        //checking if ball touching the bottom wall
    } else if(y + dy > canvas.height-ballRadius) {
        //if ball touching the paddle then bouncing the ball to opposite direction
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            randomColour();
        }
        //otherwise game over
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    //moving paddle to the right 
    if(rightPressed) {
        paddleX += paddleSpeed;
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }

    //moving paddle to the left
    else if(leftPressed) {
        paddleX -= paddleSpeed;
        if (paddleX < 0){
            paddleX = 0;
        }
    }
    requestAnimationFrame(draw);
}

//drawing the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
draw();




