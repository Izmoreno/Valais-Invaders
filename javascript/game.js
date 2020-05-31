//Create canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
ctx.font = '30px Arial';
canvas.width = 1500;
canvas.height = 670;
canvas.style = "border:1px solid #000000;";
var div = document.getElementById("gameZone");
div.appendChild(canvas);

//for player
var HEIGHT = 680;
var WIDTH = 1500;
//for other entities
var HEIGHT2 = 580;
var timeWhenGameStarted = Date.now(); //return time in ms

var frameCount = 0;

var score = 0;

var Img = {};
Img.constantin = new Image();
Img.constantin.src = "img/bus-FCSION.png";
Img.freysinger = new Image();
Img.freysinger.src = "img/subaru.png";
Img.rappaz = new Image();
Img.rappaz.src = "img/bus-HIPPIE.png";
Img.enemy = new Image();
Img.enemy = new Image();
Img.enemy.src = "img/enemy.png";
Img.straw = new Image();
Img.straw.src = "img/straw.png";
Img.cheese = new Image();
Img.cheese.src = "img/cheese.png";
Img.wine = new Image();
Img.wine.src = "img/wine.png";
Img.abricot = new Image();
Img.abricot.src = "img/abricot.png";
Img.papet = new Image();
Img.papet.src = "img/papet.png";
Img.bg = new Image();
Img.bg.src = "img/back.png";
Img.bullet = new Image();
Img.bullet.src = "img/bullet.png";


testCollisionRectRect = function (rect1, rect2) {
    return rect1.x <= rect2.x + rect2.width &&
        rect2.x <= rect1.x + rect1.width &&
        rect1.y <= rect2.y + rect2.height &&
        rect2.y <= rect1.y + rect1.height;
}


document.onkeydown = function (event) {
    if (event.keyCode === 68) //d
        player.pressingRight = true;
    else if (event.keyCode === 83) //s
        player.pressingDown = true;
    else if (event.keyCode === 65) //a
        player.pressingLeft = true;
    else if (event.keyCode === 87) // w
        player.pressingUp = true;
    else if (event.keyCode === 32) // espace
        player.pressingSpace = true;
}

document.onkeyup = function (event) {
    if (event.keyCode === 68) //d
        player.pressingRight = false;
    else if (event.keyCode === 83) //s
        player.pressingDown = false;
    else if (event.keyCode === 65) //a
        player.pressingLeft = false;
    else if (event.keyCode === 87) // w
        player.pressingUp = false;
    else if (event.keyCode === 32) // espace
        player.pressingSpace = false;
}





update = function () {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawMap();
    frameCount++;

    if (frameCount % 50 === 0) //every 1 sec
        randomlyGenerateStraw();

    if (frameCount % 100 === 0) //every 4 sec
        randomlyGenerateBonus();

    if (frameCount % 75 === 0) //every 3 sec
        randomlyGenerateMalus();

    if (frameCount % 50 === 0) //every 1 sec
        randomlyGenerateEnemy();


    for (var key in strawList) {
        strawList[key].update();
        var isColliding = player.testCollision(strawList[key]);
        if (isColliding) {
            player.hp -= 1;
        }

    }

    for (var key in bulletList) {
        var b = bulletList[key];
        b.update();

        var toRemove = false;
        b.timer++;
        if (b.timer > 75) {
            toRemove = true;
        }


        if (b.combatType == 'player') { //bullet was shot by player
            for (var key2 in enemyList) {
                if (b.testCollision(enemyList[key2])) {
                    toRemove = true;
                    score += 20;
                    delete enemyList[key2];
                }
            }
        } else if (b.combatType == 'enemy') {
            if (b.testCollision(player)) {
                toRemove = true;
                player.hp -= 1;
            }
        }

        for (var key3 in strawList) {
            if (b.testCollision(strawList[key3])) {
                toRemove = true;
                delete b;
            }
        }


        if (toRemove) {
            delete bulletList[key];
        }
    }

    for (var key in bonusList) {
        bonusList[key].update();
        var isColliding = player.testCollision(bonusList[key]);
        if (isColliding) {
            if (bonusList[key].category == 'abricot')
                score += 10;
            if (bonusList[key].category == 'wine')
                score += 25;
            if (bonusList[key].category == 'cheese')
                score += 50;
            delete bonusList[key];
        }
    }

    for (var key in malusList) {
        malusList[key].update();
        var isColliding = player.testCollision(malusList[key]);
        if (isColliding) {
            if (score - 30 < 0)
                scrore = 0;
            else
                score -= 30;

            delete malusList[key];
        }
    }

    for (var key in enemyList) {
        enemyList[key].update();
        enemyList[key].performAttack(self);
        var isColliding = player.testCollision(enemyList[key]);
        if (isColliding) {
            player.hp -= 1;
        }
    }


    player.update();

    ctx.fillText(player.hp + " Hp", 0, 30);
    ctx.fillText('Score : ' + score, 200, 30);
}


startNewGame = function () {
    player.hp = 10;
    timeWhenGameStarted = Date.now();
    frameCount = 0;
    score = 0;
    strawList = {};
    bonusList = {};
    malusList = {};
    bulletList = {};
    enemyList = {};
    //randomlyGenerateStraw();

}

//Start Game
/*player = Player();
//startNewGame();

//setInterval(update, 40);



drawMap = function () {

    ctx.drawImage(Img.bg, 0, 0);

}*/
