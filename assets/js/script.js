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
        let newSegment = $("<div class='ui segment city-select'>").attr("id", array[i]);
        let newPtag = $("<p>").text(array[i]);
        newSegment.append(newPtag);
        $("#city-store").prepend(newSegment);
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
                let outerDiv = $("<div>").attr("class", "ui segment").attr("style", "height:250px");
                let innerDiv = $("<div>").attr("class", "ui center aligned icon header");
                let newI = $("<i>").attr("class", "purple calendar outline icon");
                let newH4 = $("<h4>").attr("class", "ui header").text(elem.name);
                let newH6 = $("<h6>").text(elem.dates.start.localDate);
                let br = $("<br>");
                innerDiv.append(newI, newH4, newH6);
                outerDiv.append(innerDiv);
                newColumn.append(outerDiv, br);
                currentRow.append(newColumn);
            });
        },
        error: function (xhr, status, err) {
            console.log(err);
            alert("Please reload the page")
        }
    });
}

// AJAX CALL FOR SEARCHED LOCATION
function getUserData() {
    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&size=4&city=Portland&apikey=" + key,
        async: true,
        dataType: "json",
        success: function (json) {
            console.log(json._embedded.events);
            let eventsList = json._embedded.events;
            eventsList.forEach(function (elem) {
                console.log(elem);

                let newColumn = $("<div>").attr("class", "column");
                let newImg = $("<img>").attr("class", "image fluid").attr("src", elem.images[2].url).attr("style", "width:100px").attr("style", "height:100px");
                let newPtag = $("<a>").attr("class", "img-txt").text(elem.name).attr("href", elem.url);

                newColumn.append(newImg, newPtag);
                fourColumn.append(newColumn);
            });
        },
        error: function (xhr, status, err) {
            console.log(err);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {

    getUserData();
    putOnPage(cityArr);

    $.get("https://api.ipdata.co?api-key=test", function (response) {
        $("#ip").html("IP: " + response.ip);
        $("#city").html(response.city + ", " + response.region);
        getCurrentData(response.city);
    }, "jsonp");

    $("#search-btn").on("click", function () {
        const citySearch = $("#input-field").val().trim();
        $("#input-field").val("");
        console.log(citySearch);
        let presented = cityArr.includes(citySearch);
        if (!presented) {
            cityArr.push(citySearch);
        }
        localStorage.setItem("cityInput", JSON.stringify(cityArr));
        putOnPage(cityArr);
    })
}, false);