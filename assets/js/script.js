let LAT = "";
let LONG = "";
let demo = document.getElementById("demo");

$.get("https://api.ipdata.co?api-key=test", function (response) {
    $("#ip").html("IP: " + response.ip);
    $("#city").html(response.city + ", " + response.region);
}, "jsonp");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);        
    } else {
        demo.innerHTML = "Geolocation is not supported by this browser.";
    }
};

function showPosition(position) {
    LAT = position.coords.latitude;
    LONG = position.coords.longitude;
    demo.innerHTML = "Latitude: " + LAT +
        "<br>Longitude: " + LONG;
};

document.addEventListener('DOMContentLoaded', function() {
    getLocation();
}, false);