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
        url: "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + key + "&sort=date,name,asc&city=" + city + "&classificationName=music",
        async: true,
        dataType: "json",
        success: function (json) {
            console.log(json._embedded.events);
            let eventsList = json._embedded.events;
            eventsList.forEach(function (elem) {
                console.log(elem);

                let newColumn = $("<div>").attr("class", "column");
                let outerDiv = $("<div>").attr("class", "ui segment").attr("style", "height:300px");
                let innerDiv = $("<div>").attr("class", "ui center aligned icon header");
                let newI = $("<i>").attr("class", "purple calendar outline icon");
                let newH4 = $("<h4>").attr("class", "ui header").text(elem.name);
                let newH6 = $("<h6>").text(elem.dates.start.localDate);
                let cityTag = $("<h6>").text(elem._embedded.venues[0].name + ", " + elem._embedded.venues[0].city.name)
                let br = $("<br>");
                innerDiv.append(newI, newH4, newH6, cityTag);
                outerDiv.append(innerDiv);
                newColumn.append(outerDiv, br);
                currentRow.append(newColumn);
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
        url: "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&sort=date,name,asc&size=20&city=" + cityName + "&apikey=" + key,
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