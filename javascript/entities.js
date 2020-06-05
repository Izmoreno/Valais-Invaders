var player;

var apricotList = {};
var cheeseList = {};
var barrelList = {};
var wineList = {};
var papetList = {};
var viesList = {};
var collid = false;



Player = function () {
    //Generate the hero choosed
    var self;
    switch (heroChoosedId) {
        case "constantin":
            self = Entity('player', 'id', 300, 200, 2, 2, 270, 90, Img.constantin);
            delay=100;
            break;
        case "freysinger":
            self = Entity('player', 'id', 300, 200, 2, 2, 225, 75, Img.freysinger);
            delay=70;
            break;
        case "rappaz":
            self = Entity('player', 'id', 300, 200, 2, 2, 160, 80, Img.rappaz);
            delay=36;
            break;
        default:
            self = Entity('player', 'id', 300, 200, 2, 2, 225, 75, Img.freysinger);
            delay=70;
    }

    self.hp = 3;

    self.updatePosition = function () {
        if (self.pressingRight) {
            if (self.x < 1400)
                self.x += self.spdX;
        }
        if (self.pressingLeft) {
            if (self.x > 100)
                self.x = self.x - self.spdX;
        }
        if (self.pressingDown) {
            if (self.y < 600)
                self.y += self.spdY;
        }
        if (self.pressingUp) {
            if (self.y > 70)
                self.y = self.y - self.spdY;
        }
    }

    var super_update = self.update;
    self.update = function () {
        super_update();
        //check lives
        if (self.hp <= 0) {

            var timeSurvived = Date.now() - timeWhenGameStarted;
            console.log("You lost! You survived for " + timeSurvived + " ms.");
            if(score > highScore){
                localStorage.highscore = score;
                sessionStorage.bestScore = true;
            }
            generateGameOver();
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
        id: id,
        width: width,
        height: height,
        img: img,
        spdX: spdX,
        spdY: spdY,
    };

    self.update = function () {
        self.updatePosition();

        //remove object if it is out of the canevas
        if (self.x === -100) {
            switch (self.type) {
                case "barrel":
                    delete barrelList[self.id];
                    break;
                case "apricot":
                    delete apricotList[self.id];
                    break;
                case "wine":
                    delete wineList[self.id];
                    break;
                case "cheese":
                    delete cheeseList[self.id];
                    break;
                case "papet":
                    delete papetList[self.id];
                    break;
                default:
                    break;
            }
        } else {
            self.draw();
        }

    }


    self.draw = function () {
        ctx.save();

        var x = self.x - self.width / 2;
        var y = self.y - self.height / 2;
        ctx.drawImage(self.img, x, y);
        ctx.restore();
    }


    self.testCollision = function (entity) { //return if colliding (true/false)
        if (self.x-delay<(entity.x+entity.width)&&
            (self.x-delay+self.width)>entity.x&&
            self.y < (entity.y+entity.height)&&
            (self.y+self.height)> entity.y){
            collide = true;
            return collide;
        } else
            collide = false;
       return collide;
   }


    self.updatePosition = function () {
        self.x += self.spdX;
        self.y += self.spdY;
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
    var y = 645;
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

Apricot = function (id, xDestination, yDestination) {
    var self = Entity("apricot", id, xDestination, yDestination, speedX, 0, 100, 100, Img.apricot);
    apricotList[id] = self;
}
Barrel = function (id, xDestination, yDestination) {
    var self = Entity("barrel", id, xDestination, yDestination, speedX, 0, 100, 100, Img.barrel);
    barrelList[id] = self;
}
Cheese = function (id, xDestination, yDestination) {
    var self = Entity("cheese", id, xDestination, yDestination, speedX, 0, 100, 100, Img.cheese);
    cheeseList[id] = self;
}
Wine = function (id, xDestination, yDestination) {
    var self = Entity("wine", id, xDestination, yDestination, speedX, 0, 100, 100, Img.wine);
    wineList[id] = self;
}
Papet = function (id, xDestination, yDestination) {
    var self = Entity("papet", id, xDestination, yDestination, speedX, 0, 100, 100, Img.papet);
    papetList[id] = self;
}
var barrelIdCount = 0;
var apricotIdCount = 0;
var cheeseIdCount = 0;
var wineIdCount = 0;
var papetIdCount = 0;


createEntity = function (idObject, xDestination, yDestination) {
    switch (idObject) {
        case 1:
            break;
        case 2:
            //Créer objet apricot avec image apricot.png
            Apricot(apricotIdCount, xDestination, yDestination)
            apricotIdCount++;
            break;
        case 3:
            //Créer objet cheese avec image cheese.png
            Cheese(cheeseIdCount, xDestination, yDestination)
            cheeseIdCount++;
            break;
        case 4:
            //Créer objet wine avec wine.png
            Wine(wineIdCount, xDestination, yDestination)
            wineIdCount++;
            break;
        case 5:
            //Créer objet papet avec papet.png
            Papet(papetIdCount, xDestination, yDestination)
            papetIdCount++;
            break;
        case 6:
            //Créer objet barrel avec barrel.png
            Barrel(barrelIdCount, xDestination, yDestination);
            barrelIdCount++;
            break;
    }


}

generateGameOver = function () {
    //Storage compatibility should already checked
    //Save the type of ending and the score
    sessionStorage.isGameOver = true;
    sessionStorage.score = score;

    //Get ValaisInvaders.html
    window.location.href = "./EndGame.html";
}
