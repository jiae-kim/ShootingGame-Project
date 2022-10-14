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

// true이면 게임 끝, false이면 진행
let gameover = false; 

// 점수판
let score = 0;

// 우주선 좌표
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-66;

// 총알들 저장하는 리스트
let bulletList = [];

// 총알 좌표
function Bullet(){
    this.x = 0; 
    this.y = 0;
    
    // 초기화 시키고 우주선 위치로 시작점 잡아줌
    this.init = function(){
        this.x = spaceshipX + 22;
        this.y = spaceshipY;
        this.alive = true; // true면 사용 전 총알, false면 사용한 총알 
        bulletList.push(this);
    };

    // 총알 발사
    this.update = function(){
        this.y -= 7;
    };

    // 총알이 적군에 닿았다
    this.checkHit = function(){
        for(let i=0; i < enemyList.length; i++){
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 50){
                // 총알과 적군이 없어짐 == 점수 획득
                score ++; // 점수획득
                this.alive = false; // 총알 사용됨
                enemyList.splice(i, 1); // 죽은 적군 제거
            }
        }
    };
}

// 적군이 내려올 때 랜덤한 위치에서 내려옴
function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max - min + 1)) + min;
    return randomNum;
}

// 적군을 저장하는 리스트
let enemyList = [];

// 적군 좌표
function Enemy(){
    this.x = 0;
    this.y = 0;

    this.init = function(){
        this.y = 0;
        this.x = generateRandomValue(0, canvas.width-50);
        enemyList.push(this);
    };

    // 적군이 내려오는 속도 
    this.update = function(){
        this.y += 3;

        if(this.y >= canvas.height - 50){
            gameover = true;
        }
    }
}

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
        // 오른쪽 39, 왼쪽 37, 위 38, 아래 40, 스페이스 32
        //console.log("무슨 키가 눌렸어?", event.keyCode);
        keysDown[event.keyCode] = true;
    });

    document.addEventListener("keyup", function(event){
        delete keysDown[event.keyCode];

        if(event.keyCode ==  32){
            // 스페이스에 키업 이벤트가 발생하면 함수 실행됨
            createBullet();
        }
    });
}

// 총알 생성 함수
function createBullet(){
    let b = new Bullet();
    b.init();
}

// 적군 생성 함수
function createEnemy(){
    // (호출하고싶은 함수, 시간ms)
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init();
    }, 1000);
}


// 우주선의 속도
function update(){
    if(39 in keysDown){ // 우주선이 오른쪽으로 이동 == x좌표의 값이 증가
        spaceshipX += 5;
    }
    if(37 in keysDown){ // 우주선이 왼쪽으로 이동 == x좌표의 값이 감소
        spaceshipX -= 5;
    }

    // 우주선의 좌표값이 무한대로 업데이트가 되는 것이 아닌 경기장 안에서만 있게 
    if(spaceshipX <=0){
        spaceshipX=0;
    }
    if(spaceshipX >= canvas.width-66){
        spaceshipX=canvas.width-66;
    }

    // 총알의 y좌표 update하는 함수
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkHit();
        };
    }
    for(let i=0; i<enemyList.length; i++){
        enemyList[i].update();
    }
}

// 이미지 보여지는 함수
function render(){
    // 배경
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    // 우주선
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    // 점수판
    ctx.fillText(`Score : ${score}`, 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    // 총알
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        };
    }
    // 적군
    for(let i=0; i<enemyList.length; i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }
}

// 배경화면 호출
function main(){
    // gameover 값이 false가 아닐때 게임 끝남
    if(!gameover) {
        update(); // 좌표값을 업데이트하고
        render(); // 그려주고
        requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameoverImage, 25, 100, 350, 350);
    }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();

// 총알 만들기 개념
// 1. 스페이스바를 누르면 총알 발사
// 2. 총알이 발사 == 총알의 y값은 줄어듬(--), 총알의 x값은 스페이스를 누른 순간의 우주선의 x좌표값
// 3. 발사된 총알들은 배열에 저장한다
// 4. 총알들은 x,y좌표값이 있어야 한다
// 5. 총알 배열을 가지고 render 그려준다

// 적군 만들기 개념
// 1. 적군은 x,y좌표값이 있어야 한다
// 2. 적군의 위치는 랜덤하다
// 3. 적군은 밑으로 내려온다 == y좌표 값이 증가한다
// 4. 1초마다 하나씩 적군이 내려온다
// 5. 적군이 바닥에 닿는 순간 게임오버
// 6. 적군과 총알이 만나면 사라지고 점수 1점 획득

// 적군이 죽는 개념
// 1. 총알이 적군에 닿았다
// 2. 총알의 y값이 적군의 y값 보다 작아짐 == 총알.y <= 적군.y
// 3. 총알의 x값이 적군의 너비 안에 들어와야 함 == 총알.x >= 적군.x And 총알.x <= 적군.x + 적군의 너비
