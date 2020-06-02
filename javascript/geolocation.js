var message = document.getElementById("resultMessage");

function findLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);

    } else {
        $("#geolocLoader").remove();
        message.innerHTML = "Regarde-voir aller suici ! Faudrait peut-être choisir un navigateur plus récent ! ";
    }

}

function showPosition(position) {

    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    //console.log(lat);
    //console.log(lon);

    var mymap = L.map('mapid').setView([lat, lon], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGlhZ29jYXN0YW5oZWlybyIsImEiOiJja2F2YnRuYmEwNzNmMnFwbmExemppN3ZsIn0.YlJL7xY-mu_asdjNqoo53g', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);
    var marker = L.marker([lat, lon]).addTo(mymap);
    marker.bindPopup("<b>" + playerName + "</b><br>C'est ici que t'as les vaches ?!").openPopup();


    //Get region to define if it is in Valais
    var geocodeService = L.esri.Geocoding.geocodeService();

    geocodeService.reverse().latlng([lat, lon]).run(function (error, result) {
        if (error) {
            $("#geolocLoader").remove();
            message.innerHTML("Regarde-voir aller suici ! Faudrait peut-être choisir un navigateur plus récent ! ");
            return;
        }
        //result is in json
        //var address = result.address.Match_addr;
        var region = result.address.Region;
        //console.log(result);
        //console.log(region);
        //console.log(address);

        isInValaisTest(region);
    })
}

function isInValaisTest(region) {
    $("#geolocLoader").remove();
    switch (region) {
        case "Valais":
            //+100 points
            message.innerHTML = "Ah, un bon Valaisan ! Tu mérites 100 points en plus rien que pour ça !";
            score = 100;
            break;
        case "Vaud":
            //Game over
            message.innerHTML = "Vaudois ! Si tu crois que t'es autorisé à défendre les couleurs valaisannes... ";
            score = -1000;
            break;
        case "Genève":
            //-100 points
            message.innerHTML = "Tcheuuu ! Le Frouze ici ! Tu pars avec -100 points";
            score = -100;
            break;
        default:
            message.innerHTML = "Les étrangers démarrent avec un malus de 50 points en Valais !";
            //-50 points
            score = -50;
            break;
    }
}

function showError(error) {
    $("#geolocLoader").remove();
    switch (error.code) {
        case error.PERMISSION_DENIED:
            message.innerHTML = "Mais ça te joue ? T'as peur qu'on te pique tes vaches ? J'espère que t'as pris le Fendant quand même..."
            break;
        default :
            message.innerHTML = "On sait pas où t'as les vaches mais on peut quand même en boire une !"
            break;
    }
}
