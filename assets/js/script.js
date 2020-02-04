let key = "SY7qj7qCDs1AFqjNz5S9XQrrz1n5jltR";
let cityArr = JSON.parse(localStorage.getItem("cityInput")) || [];
const fourColumn = $("#four-column");
const currentRow = $("#current-row");
const search = $("#search-btn");

// Render data from localStorage
function putOnPage(array) {

    $("#city-store").empty();
    array = JSON.parse(localStorage.getItem("cityInput")) || [];
    for (let i = 0; i < array.length; i++) {
        let newColumn = $("<div class='column'>")
        let newSegment = $("<div class='ui segment city-select'>").attr("data-city", array[i]);
        let newPtag = $("<p>").text(array[i]).attr("style", "color:#a333c8").attr("class", "searched");
        let br = $("<br>");
        newSegment.append(newPtag);
        newColumn.append(newSegment, br);
        $("#city-store").prepend(newColumn);
    };
};

// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition, showError);
//     } else {
//         console.log("Geolocation is not supported by this browser.");
//     }
// }

// function showError(error) {
//     switch(error.code) {
//         case error.PERMISSION_DENIED:
//             console.log("User denied the request for Geolocation.");
//             break;
//         case error.POSITION_UNAVAILABLE:
//             console.log("Location information is unavailable.")
//             break;
//         case error.TIMEOUT:
//             console.log("The request to get user location timed out.");
//             break;
//         case error.UNKNOWN_ERROR:
//             console.log("An unknown error occurred.");
//             break;
//     }
// }

// function showPosition(position) {

//     let latlon = position.coords.latitude + "," + position.coords.longitude;
//     console.log(latlon);
//     getCurrentData(latlon);
// };

// AJAX CALL FOR CURRENT LOCATION
function getCurrentData(city) {

    $.ajax({
        type: "GET",
        // url: "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + key + "&sort=date,name,asc&city=Redmond&classificationName=music&size=8",
        url: "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + key + "&sort=date,name,asc&city=" + city + "&classificationName=music&size=18",
        async: true,
        dataType: "json",
        success: function (json) {
            console.log(json._embedded.events);
            let eventsList = json._embedded.events;
            eventsList.forEach(function (elem) {
                // console.log(elem);

                let outerDiv = $("<div>").attr("class", "ui segment target-event").attr("id", elem.id);
                let image = $("<img class='ui medium left floated image'>").attr("src", elem.images[2].url);
                let title = $("<h4>").text(elem.name).attr("style", "color:#4183c4");
                let genre = $("<p>").text("Genre: " + elem.classifications[0].genre.name);
                let date = $("<p>").text(elem.dates.start.localDate);
                let venue = $("<p>").text(elem._embedded.venues[0].name);
                let address = $("<p>").text(elem._embedded.venues[0].address.line1 + ", " + elem._embedded.venues[0].city.name);
                let button = $("<button class='fluid ui purple button' type='submit'>").text("More Info");
                outerDiv.append(image, title, genre, date, venue, address, button);
                currentRow.append(outerDiv);
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
};

// AJAX CALL FOR SEARCHED LOCATION
function getUserData(cityName) {

    $("#four-column").empty();

    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&sort=date,name,asc&size=32&city=" + cityName + "&apikey=" + key,
        async: true,
        dataType: "json",
        success: function (json) {
            console.log(json._embedded.events);
            let eventsList = json._embedded.events;
            eventsList.forEach(function (elem) {
                // console.log(elem);
                let br = $("<br>");

                let newColumn = $("<div>").attr("class", "column target-event").attr("id", elem.id);
                let newImg = $("<img>").attr("class", "ui large image").attr("src", elem.images[2].url);
                let namePtag = $("<p>").text(elem.name).attr("style", "color:white");
                let datePtag = $("<p>").text(elem.dates.start.localDate).attr("style", "color:white");
                let cityPtag = $("<p>").text(elem._embedded.venues[0].city.name).attr("style", "color:white");

                newColumn.append(newImg, namePtag, datePtag, cityPtag, br, br);

                fourColumn.append(newColumn);
            });
        },
        error: function (xhr, status, err) {
            console.log(err);
        }
    });
};

document.addEventListener('DOMContentLoaded', function () {

    getUserData(cityArr[cityArr.length - 1]);
    putOnPage(cityArr);
    
    $.get("http://ipinfo.io", function (response) {
        getCurrentData(response.city);
    }, "jsonp");

}, false);


$(document).on("click", "#search-btn", function () {

    const citySearch = $("#input-field").val().trim();
    $("#input-field").val("");
    console.log(citySearch);
    let presented = cityArr.includes(citySearch);
    if (!presented) {
        cityArr.push(citySearch);
    }
    localStorage.setItem("cityInput", JSON.stringify(cityArr));
    putOnPage(cityArr);

    getUserData(citySearch);
});


$(document).on("click", ".city-select", function (event) {

    event.preventDefault();

    let cityName = $(this).attr("data-city");
    console.log(cityName);

    getUserData(cityName);
});


$(document).on("click", ".target-event", function (event) {
    console.log(event)
    console.log(event.currentTarget.id)

    let eventID = event.currentTarget.id
    window.name = "test123"
    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/events/" + eventID + "?apikey=" + key,
        async: true,
        dataType: "json",
        success: function (json) {
            console.log(json);
            window.name =
                localStorage.setItem("Details", JSON.stringify(json))
            window.open("./index2.html", "_self")
        },
        error: function (xhr, status, err) {
            console.log(err);
        }
    });
});