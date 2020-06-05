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
var score = parseInt(sessionStorage.score);
var highScore = 0;
var pause = false;

var speedX = -1;
var speedY = 0;

var levelArray;

var bg;

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





testCollisionRectRect = function (rect1, rect2) {
    return rect1.x <= rect2.x + rect2.width &&
        rect2.x <= rect1.x + rect1.width &&
        rect1.y <= rect2.y + rect2.height &&
        rect2.y <= rect1.y + rect1.height;
}

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
            var y = col * 100 + 50;
            createEntity(levelArray[col][row], 1600, y);
        }
        row++;
        if (row <= levelArray[0].length) {
            setTimeout(function () {
                readJSON();
            }, 1000);
        } else {
            setTimeout(function () {
                //Stop Game because we finished it
                location.href = "./EndGame.html";
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

    }
}




update = function () {



    if (frameCount != 0 && frameCount % 150 === 0) {
        score += 10;
    }


    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.font = '50px Rockwell';

    frameCount++;

    for (var key in apricotList) {
        apricotList[key].update();
    }
    for (var key in cheeseList) {
        cheeseList[key].update();

    }
    for (var key in wineList) {
        wineList[key].update();

    }
    for (var key in papetList) {
        papetList[key].update();

    }
    for (var key in barrelList) {
        barrelList[key].update();
        /*player.testCollision(barrelList[key]);
        if (collide) {
            player.hp -= 1;
            delete barrelList[key];
            delete viesList[player.hp + 1];
        }*/
    }
    for (var key in viesList) {
        viesList[key].update();

    }
    /*
    	for (var key in strawList) {
    		strawList[key].update();

    		player.testCollision(strawList[key]);
    		if (collide) {
    			score += 10;
    			player.hp -= 1;
    			delete viesList[player.hp + 1];
    			delete strawList[key];

    		}


    	}
    */

    /*
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
        }*/

    /*   for (var key in malusList) {
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
*/
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
