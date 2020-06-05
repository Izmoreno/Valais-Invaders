//Canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//for player
var HEIGHT = 670;
var WIDTH = 1500;
//for other entities
var HEIGHT2 = 580;
var timeWhenGameStarted = Date.now(); //return time in ms

var frameCount = 0;
var cptVie;
var score;
console.log(isNaN(sessionStorage.score));
if (isNaN(sessionStorage.score)) {
    score = 0;
} else {
    score = parseInt(sessionStorage.score);
}



var highScore = 0;
var pause = false;

var speedX = -0.7;
var speedY = 0;

var levelArray;

var bg;
var updateIsDone = true;

var Img = {};
Img.constantin = new Image();
Img.constantin.src = "img/bus-FCSION.png";
Img.freysinger = new Image();
Img.freysinger.src = "img/subaru.png";
Img.rappaz = new Image();
Img.rappaz.src = "img/bus-HIPPIE.png";
Img.barrel = new Image();
Img.barrel.src = "img/barrel.png";
Img.cheese = new Image();
Img.cheese.src = "img/cheese.png";
Img.wine = new Image();
Img.wine.src = "img/wine.png";
Img.apricot = new Image();
Img.apricot.src = "img/apricot.png";
Img.papet = new Image();
Img.papet.src = "img/papet.png";
Img.bg = new Image();
Img.bg.src = "img/back.png";
Img.coeur = new Image();
Img.coeur.src = "img/coeur.png";

var heroChoosedId = sessionStorage.heroChoosedId;
var playerName = sessionStorage.playerName;



function generateLevel() {
    //Read level1.json
    var requestURL = "level1.json";
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    var level;

    request.onload = function () {
        level = request.response;

        //Get the array of the level
        levelArray = level.terrain;
        readJSON();
    }


    var row = 0;


    //Read the column of objects to display each 2 seconds
    readJSON = function () {
        for (var col = 0; col < levelArray.length; col++) {
            var y = col * 100;
            createEntity(levelArray[col][row], 1600, y);
        }
        row++;
        if (row <= levelArray[0].length) {
            setTimeout(function () {
                readJSON();
            }, 1500);
        } else {
            setTimeout(function () {
                //Stop Game because we finished it
                location.href = "../EndGame.html";
                if (score > highScore) {
                    localStorage.highscore = score;
                    sessionStorage.bestScore = true;
                    sessionStorage.score = score;
                }
            }, 8000);
        }

    }

}

function listenKeys() {
    document.onkeydown = function (event) {
        if (event.keyCode === 68) //d
            player.pressingRight = true;
        else if (event.keyCode === 83) //s
            player.pressingDown = true;
        else if (event.keyCode === 65) //a
            player.pressingLeft = true;
        else if (event.keyCode === 87) // w
            player.pressingUp = true;
        /* else if (event.keyCode === 32) // espace
             player.pressingSpace = true;*/
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
        else if (event.keyCode === 80) // p for pause
            pause = !pause;
    }
}




update = function () {
    if(pause){
        return;
    }

    frameCount++;

    if (pause === true) {
        bg.stop();
        ctx.font = '100px Rockwell';
        ctx.fillText("Pause", 650, 300);
        //pause le level aussi
        return;
    }
    if (pause === false) {
        moveBackground();
    }

    if (frameCount != 0 && frameCount % 150 === 0) {
        score += 10;
    }


    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.font = '50px Rockwell';



    for (var key in apricotList) {
        apricotList[key].update();
        collide = player.testCollision(apricotList[key]);
        if (collide) {
            score += 20
            delete apricotList[key];
        }
    }
    for (var key in cheeseList) {
        //+20
        cheeseList[key].update();
        collide = player.testCollision(cheeseList[key]);
        if (collide) {
            score += 20
            delete cheeseList[key];
        }

    }
    for (var key in wineList) {
        //+100
        wineList[key].update();
        collide = player.testCollision(wineList[key]);
        if (collide) {
            score += 100
            delete wineList[key];
        }
    }
    for (var key in papetList) {
        //-50
        papetList[key].update();
        collide = player.testCollision(papetList[key]);
        if (collide) {
            score -= 50
            delete papetList[key];
        }


    }
    for (var key in barrelList) {
        barrelList[key].update();
        collide = player.testCollision(barrelList[key]);
        if (collide) {
            player.hp -= 1;
            delete barrelList[key];
            delete viesList[player.hp + 1];
        }
    }
    for (var key in viesList) {
        viesList[key].update();

    }

    player.update();
    ctx.fillText('Score : ' + score, 1200, 655);
    ctx.fillText('Best score : ' + highScore, 640, 655);

}
//Background
moveBackground = function () {
    $(function () {
        deplace = function () {

            bg = $('#fond').animate({
                left: '-=250'
            }, 1400, 'linear', function () {
                $('#fond').css('top', 0);
                deplace();
            });
        };
        deplace();
    });
}

//Start game
startGame = function () {
    if (sessionStorage.isVaudois === "true") {
        console.log(sessionStorage.isVaudois);
        return generateGameOver();
    }
    player = Player();

    listenKeys();
    moveBackground();
    generateVie();
    setInterval(update, 5);

    //get the highscore from localstorage
    var scoreStr = localStorage.highscore;
    if (scoreStr == null) {
        highScore = 0;
    } else {
        highScore = parseInt(scoreStr);
    }
    setTimeout(function () {
        generateLevel();
    }, 2000);



}

startGame();
