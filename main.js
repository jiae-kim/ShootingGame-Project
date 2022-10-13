// canvas 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas)

// 이미지
let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameoverImage;

// 우주선 좌표
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-66;

// 이미지 가져오는 함수
function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src="images/background.png";

    spaceshipImage = new Image();
    spaceshipImage.src="images/spaceship.png";

    bulletImage = new Image();
    bulletImage.src="images/bullet.png";

    enemyImage = new Image();
    enemyImage.src="images/enemy.png";

    gameoverImage = new Image();
    gameoverImage.src="images/gameover.png";
}

let keysDown = {};
// 방향키 누르면 실행되는 함수
function setupKeyboardListener(){
    document.addEventListener("keydown", function(event){
        // event에는 어떤 키가 눌렸는지에 대한 정보를 가지고 있음
        //console.log("무슨 키가 눌렸어?", event.key);
        keysDown[event.key] = true;
        //console.log("키다운객체에 들어간 값은?", keysDown);
    });

    document.addEventListener("keyup", function(event){
        delete keysDown[event.key];
        //console.log("버튼 클릭 후", keysDown);
    });
}

// 우주선의 속도
function update(){
    if('ArrowRight' in keysDown){
        // 우주선이 오른쪽으로 이동 == x좌표의 값이 증가
        spaceshipX += 5;
    }
    if('ArrowLeft' in keysDown){
        // 우주선이 왼쪽으로 이동 == x좌표의 값이 감소
        spaceshipX -= 5;
    }

    // 우주선의 좌표값이 무한대로 업데이트가 되는 것이 아닌 경기장 안에서만 있게 
    if(spaceshipX <=0){
        spaceshipX=0;
    }
    if(spaceshipX >= canvas.width-66){
        spaceshipX=canvas.width-66;
    }
}

// spacebar 누를 때 총알이 발사됨 
// y좌표가 줄어든다 (--)
// 총알이 여러개 발사될 경우 배열에 총알 담아둠

// 이미지 보여지는 함수
function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
}

// 배경화면 호출
function main(){
    update(); // 좌표값을 업데이트하고
    render(); // 그려주고
    requestAnimationFrame(main);
}

loadImage();
setupKeyboardListener();
main();
