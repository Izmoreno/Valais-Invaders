var $myCanvas = $('#myCanvas');
var ctx = document.getElementById("myCanvas").getContext("2d");


//pour player
var HEIGHT = 680;
var WIDTH = 1500;
//pour les autres entities
var HEIGHT2 = 580;
var timeWhenGameStarted = Date.now(); //return time in ms

var frameCount = 0;
var cptVie;
var score = 0;
var pause = false;

var Img = {};
Img.player = new Image();
Img.player.src = "img/subaru.png";
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
Img.coeur = new Image();
Img.coeur.src = "img/coeur.png";





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
	else if (event.keyCode === 80) // p for pause
		pause = !pause;
}





update = function () {
	if (pause) {
		ctx.font = '100px Minehead DEMO';
		ctx.fillText("Pause", 700, 400);
		return;
	}

	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	ctx.font = '30px Minehead DEMO';

	frameCount++;


	/*if (frameCount % 50 === 0) //every 1 sec
		randomlyGenerateStraw();*/

	/*if (frameCount % 100 === 0) //every 4 sec
		randomlyGenerateBonus();

	if (frameCount % 75 === 0) //every 3 sec
		randomlyGenerateMalus();

	if (frameCount % 50 === 0) //every 1 sec
		randomlyGenerateEnemy();*/

	for (var key in viesList) {
		viesList[key].update();

	}

	for (var key in strawList) {
		strawList[key].update();

		player.testCollision(strawList[key]);
		if (collide) {
			score += 10;
			player.hp -= 1;
			//delete viesList[player.hp+1];

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
				cptVie = player.hp - 1;
				player.hp -= 1;
				console.log(cptVie);
				delete viesList[cptVie];
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

	ctx.fillText('Score : ' + score, 1300, 30);

	//check highscore
	if (score > higthscore) {
		higthscore = score;
	}
}


startNewGame = function () {
	player.hp = 3;
	timeWhenGameStarted = Date.now();
	frameCount = 0;
	score = 0;
	strawList = {};
	bonusList = {};
	malusList = {};
	bulletList = {};
	viesList = {};
	enemyList = {};
	generateVie();
	higthscore = 100;
	ok = 0;

	randomlyGenerateStraw();

}


player = Player();
startNewGame();

setInterval(update, 40);
