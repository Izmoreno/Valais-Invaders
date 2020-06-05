var playerName;
var heroChoosedId;
var time;
var isVaudois = false;

var musictheme = new Audio("audio/musictheme.wav");

//Managing different screens before game starts
$(document).ready(function () {

    var chooseHeroElement;
    var geolocationTestElement;
    var homeElement;
    var infosScreenElement;

    $("#playerName").on("keyup", function () {
        if ($(this).val().length != 0) {
            $("#chooseHeroButton").removeAttr("disabled");
        } else {
            $("#chooseHeroButton").prop('disabled', true);
        }
        startMusic();
    });
    $("#chooseHeroButton").click(function () {
        //Save the player name
        playerName = $("#playerName").val();
        //Remove home screen and display choose hero screen
        homeElement = $("#home").detach();
        $("#startMenu").prepend(chooseHeroElement);
        $("#chooseHeroTextTitle").text("Choisis voir ta légende Valaisanne, " + playerName + " !");
        $("#chooseHero").removeAttr("hidden");
    });
    $("#infosButton").click(function () {
        //Remove home screen and display infos screen
        homeElement = $("#home").detach();
        $("#startMenu").prepend(infosScreenElement);
        $("#infosScreen").removeAttr("hidden");
        startMusic();
    });
    $("#infosBackButton").click(function () {
        //Return to start screen
        infosScreenElement = $("#infosScreen").detach();
        homeElement.appendTo("#startMenu");
    });

    $("#backButton").click(function () {
        //Reset of the screen when back is clicked
        const dropSpot = document.getElementById("dropSpot");
        dropSpot.textContent = "";
        $("#dropSpot").append('<p id="dropHint">Ecoute voir, t\'as juste à glisser la bagnole que tu veux ençà</p>');
        $("#startGeolocationButton").prop('disabled', true);

        //Return to start screen
        chooseHeroElement = $("#chooseHero").detach();
        homeElement.appendTo("#startMenu");
    });
    $("#startGeolocationButton").click(function () {
        //Remove choose hero screen and display geolocation test screen
        chooseHeroElement = $("#chooseHero").detach();
        $("#startMenu").prepend(geolocationTestElement);
        $("#geolocationTest").removeAttr("hidden");
        findLocation();
    });
    $("#startGameButton").click(function () {
        //Remove start menu
        $("#startMenu").remove();

        if (heroChoosedId === "") {
            location.reload();
            return;
        }

        //Start game

        //Save player name, hero choosed, score, isVaudois in Session Storage
        if (saveVariables()) {
            //Get ValaisInvaders.html
            window.location.href = "./ValaisInvaders.html";

        } else {
            //Browser doesn't support web storage so return an alert
            alert("Désolé, ton navigateur n'est pas compatible pour ce jeu !")
        }





    });

    //Remove after defining back button
    chooseHeroElement = $("#chooseHero").detach();
    geolocationTestElement = $("#geolocationTest").detach();
    gameZoneElement = $("#gameZone").detach();
    infosScreenElement = $("#infosScreen").detach();
    $("#startMenu").removeAttr("hidden");
    startMusic();

});

function saveVariables() {
    if (typeof (Storage) !== "undefined") { //Check if browser support web Storage
        console.log(isVaudois);
        sessionStorage.score = score;
        sessionStorage.isVaudois = isVaudois;
        sessionStorage.heroChoosedId = heroChoosedId;
        sessionStorage.playerName = playerName;
        return true;
    } else {
        return false;
    }
}

//Drag and Drop
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    const dropSpot = document.getElementById("dropSpot");
    dropSpot.textContent = "";
}


function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var nodeCopy = document.getElementById(data).cloneNode(true);
    nodeCopy.id = data + "1";
    nodeCopy.draggable = false;
    ev.target.appendChild(nodeCopy);
    heroChoosedId = $("#dropSpot").children("img").attr("id");
    //Register hero choosed
    switch (heroChoosedId) {
        case "constantin1":
            heroChoosedId = "constantin";
            break;
        case "freysinger1":
            heroChoosedId = "freysinger";
            break;
        case "rappaz1":
            heroChoosedId = "rappaz";
            break;
        default:
            heroChoosedId = "";
    }

    $("#startGeolocationButton").removeAttr('disabled');
}

function startMusic(){
    musictheme.play();
    musictheme.loop = true;
}

