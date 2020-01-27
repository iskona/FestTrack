let key = "SY7qj7qCDs1AFqjNz5S9XQrrz1n5jltR";
let cityArr = JSON.parse(localStorage.getItem("cityInput")) || [];
let demo = $("#demo");
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
    // console.log(array);
};


// AJAX CALL FOR CURRENT LOCATION
function getCurrentData(city) {
    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + key + "&sort=date,name,asc&city=" + city + "&classificationName=music&size=8",
        async: true,
        dataType: "json",
        success: function (json) {
            console.log(json._embedded.events);
            let eventsList = json._embedded.events;
            eventsList.forEach(function (elem) {
                console.log(elem);

                let outerDiv = $("<div>").attr("class", "ui segment");
                let image = $("<img class='ui medium left floated image'>").attr("src", elem.images[2].url);
                let title = $("<h4>").text(elem.name).attr("style", "color:#4183c4");
                let genre = $("<p>").text("Genre: " + elem.classifications[0].genre.name);
                let date = $("<p>").text(elem.dates.start.localDate);
                let venue = $("<p>").text(elem._embedded.venues[0].name);
                let address = $("<p>").text(elem._embedded.venues[0].address.line1 + ", " + elem._embedded.venues[0].city.name);
                let aTag = $("<a>").attr("href", elem.url);
                let button = $("<button class='fluid ui purple button' type='submit'>").text("Get Info or Buy Tickets!");
                aTag.append(button);
                outerDiv.append(image, title, genre, date, venue, address, aTag);
                currentRow.append(outerDiv);

            });
        },
        error: function (xhr, status, err) {
            console.log(err);
        }
    });
}

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
                console.log(elem);
                let br = $("<br>");
                let newColumn = $("<div>").attr("class", "column");
                let newImg = $("<img>").attr("class", "ui large image").attr("src", elem.images[2].url);
                let nameAtag = $("<a>").text(elem.name).attr("href", elem.url).attr("style", "color:white");
                let datePtag = $("<p>").text(elem.dates.start.localDate).attr("style", "color:white");
                let cityPtag = $("<p>").text(elem._embedded.venues[0].city.name).attr("style", "color:white");
                
                newColumn.append(newImg, nameAtag, datePtag, cityPtag, br, br);
                fourColumn.append(newColumn);
            });
        },
        error: function (xhr, status, err) {
            console.log(err);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {

    getUserData(cityArr[cityArr.length-1]);
    putOnPage(cityArr);

    $.get("https://api.ipdata.co?api-key=test", function (response) {
        $("#ip").html("IP: " + response.ip);
        $("#city").html(response.city + ", " + response.region);
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