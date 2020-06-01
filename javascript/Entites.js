var player;

var strawList = {};
var bonusList = {};
var bulletList = {};
var malusList = {};
var enemyList = {};
var viesList = {};
var ok = 0;
var collide = false;
var alive = true;


Player = function () {
	//Generate the hero choosed
	var self;
	switch (heroChoosedId) {
		case "constantin":
			self = Actor('player', 'id', 100, 350, 30, 5, 200, 134, Img.constantin, 10, 1);
			break;
		case "freysinger":
			self = Actor('player', 'id', 100, 350, 30, 5, 200, 134, Img.freysinger, 10, 1);
			break;
		case "rappaz":
			self = Actor('player', 'id', 100, 350, 30, 5, 200, 134, Img.rappaz, 10, 1);
			break;
		default:
			self = Actor('player', 'id', 100, 350, 30, 5, 200, 134, Img.freysinger, 10, 1);
	}

	self.updatePosition = function () {
		if (self.pressingRight) {
			if (self.x < 1400)
				self.x += 10;
		}
		if (self.pressingLeft) {
			if (self.x > 100)
				self.x = self.x - 10;
		}
		if (self.pressingDown) {
			if (self.y < 675)
				self.y += 10;
		}
		if (self.pressingUp) {
			if (self.y > 70)
				self.y = self.y - 10;
		}
		if (self.pressingSpace)
			generateBullet(self);
	}


	var super_update = self.update;
	self.update = function () {
		super_update();
		if (self.hp <= 0 && ok === 0) {
			ok = 1;
			var timeSurvived = Date.now() - timeWhenGameStarted;
			console.log("You lost! You survived for " + timeSurvived + " ms.");
			//startNewGame();
			document.getElementById("gameZone").style.display = "none";
			document.getElementById("gameover").style.display = "block";
			addScore();
			//draw hightscore
		}
	}


	self.pressingDown = false;
	self.pressingLeft = false;
	self.pressingRight = false;
	self.pressingSpace = false;
	self.pressingUp = false;

	return self;
}


//player, enemy, bullet, bonus, malus, straw
Entity = function (type, id, x, y, spdX, spdY, width, height, img) {
	var self = {
		type: type,
		x: x,
		y: y,
		width: width,
		height: height,
		img: img,
		spdX: spdX,
		spdY: spdY,
	};


	self.update = function () {
		self.updatePosition();
		self.draw();
	}


	self.draw = function () {
		ctx.save();

		var x = self.x - self.width / 2;
		var y = self.y - self.height / 2;
		ctx.drawImage(self.img, x, y);
		ctx.restore();

	}


	self.getDistance = function (entity2) { //return distance (number)
		var vx = self.x - entity2.x;
		var vy = self.y - entity2.y;
		return Math.sqrt(vx * vx + vy * vy);
	}


	self.testCollision = function (entity2) {
		if (!(entity2.x > (self.x + self.width) ||
				entity2.x < (self.x - entity2.width) ||
				entity2.y > (self.y + self.height) ||
				entity2.y < (self.y - entity2.height))) {
			collide = true;
		} else
			collide = false;

	}

	self.updatePosition = function () {
		self.x += self.spdX;
		self.y += self.spdY;
	}

	return self;

}

//player, enemy
Actor = function (type, id, x, y, spdX, spdY, width, height, img, hp, atkSpd) {
	var self = Entity(type, id, x, y, spdX, spdY, width, height, img);

	self.hp = hp;
	self.attackCounter = 0;
	self.angle = 0;

	self.atkSpd = atkSpd;

	var super_update = self.update;
	self.update = function () {
		super_update();
		self.attackCounter += self.atkSpd;
	}

	self.performAttack = function () {
		if (self.attackCounter > 50) { //every 1 sec
			self.attackCounter = 0;
			generateBullet(self);
		}
	}


	return self;
}

Vies = function (id, x, y, spdX, spdY, width, height) {
	var self = Entity('vie', id, x, y, spdX, spdY, width, height, Img.coeur);
	viesList[id] = self;

}

generateVie = function () {
	//Math.random() returns a number between 0 and 1
	var x0 = 30;
	var x1 = 90;
	var x2 = 150;
	var y = 725;
	var height = 44;
	var width = 50;
	var id0 = 1;
	var id1 = 2;
	var id2 = 3;
	var spdX = 0;
	var spdY = 0;

	Vies(id0, x0, y, spdX, spdY, width, height);
	Vies(id1, x1, y, spdX, spdY, width, height);
	Vies(id2, x2, y, spdX, spdY, width, height);
}






Enemy = function (id, x, y, spdX, spdY, width, height) {
	var self = Actor('enemy', id, x, y, spdX, spdY, width, height, Img.enemy, 2, 1);
	enemyList[id] = self;

}

randomlyGenerateEnemy = function () {
	//Math.random() returns a number between 0 and 1
	var x = 1500;
	var y = Math.random() * HEIGHT2;
	var height = 73;
	var width = 60;
	var id = Math.random();
	var spdX = -12;
	var spdY = 0;
	Enemy(id, x, y, spdX, spdY, width, height);

}

Straw = function (id, x, y, spdX, spdY, width, height) {
	var self = Entity('straw', id, x, y, spdX, spdY, width, height, Img.straw);

	strawList[id] = self;
}

randomlyGenerateStraw = function () {
	//Math.random() returns a number between 0 and 1
	var height = 50;
	var width = 50;
	var x = 1500;
	var y = Math.random() * HEIGHT2;
	var y2 = Math.random() * HEIGHT2;
	while (y2 < (y + height)) {
		var y2 = Math.random() * HEIGHT2;
	}

	var id = Math.random();
	var id2 = Math.random();
	var spdX = -8;
	var spdY = 0;


	Straw(id, x, y, spdX, spdY, width, height);
	Straw(id2, x, y2, spdX, spdY, width, height);
}


Bonus = function (id, x, y, spdX, spdY, width, height, img, category) {
	var self = Entity('bonus', id, x, y, spdX, spdY, width, height, img);

	self.category = category;

	bonusList[id] = self;
}

randomlyGenerateBonus = function () {
	//Math.random() returns a number between 0 and 1
	var x = 1500;
	var y = Math.random() * HEIGHT2;
	var height = 10;
	var width = 10;
	var id = Math.random();
	var spdX = -8;
	var spdY = 0;

	if (Math.random() < 0.6) {
		var category = 'abricot';
		var img = Img.abricot;
	} else if (Math.random() < 0.9) {
		var category = 'wine';
		var img = Img.wine;
	} else {
		var category = 'fromage';
		var img = Img.cheese;
	}

	Bonus(id, x, y, spdX, spdY, width, height, img, category);
}

Malus = function (id, x, y, spdX, spdY, width, height) {
	var self = Entity('malus', id, x, y, spdX, spdY, width, height, Img.papet);
	malusList[id] = self;
}

randomlyGenerateMalus = function () {
	//Math.random() returns a number between 0 and 1
	var x = 1500;
	var y = Math.random() * HEIGHT2;
	var height = 50;
	var width = 50;
	var id = Math.random();
	var spdX = -8;
	var spdY = 0;


	Malus(id, x, y, spdX, spdY, width, height);
}


Bullet = function (id, x, y, spdX, spdY, width, height, combatType) {
	var self = Entity('bullet', id, x, y, spdX, spdY, width, height, Img.bullet);

	self.timer = 0;
	self.combatType = combatType;

	bulletList[id] = self;
}

generateBullet = function (actor) {
	//Math.random() returns a number between 0 and 1
	var x = actor.x;
	var y = actor.y;
	var height = 24;
	var width = 24;
	var id = Math.random();
	var angle = actor.angle;

	var spdX = Math.cos(angle / 180 * Math.PI) * 5;
	var spdY = Math.sin(angle / 180 * Math.PI) * 5;
	Bullet(id, x, y, spdX, spdY, width, height, actor.type);
}
