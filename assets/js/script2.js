
$(document).ready(function () {

    let pageInfo = JSON.parse(localStorage.getItem("Details"))

    $("#concertName").text(pageInfo.name)
    $('#concertDate').text("Date of Event:  " + pageInfo.dates.start.localDate)
    $("#concertAddress").text(pageInfo._embedded.venues[0].address.line1 + ", " + pageInfo._embedded.venues[0].city.name + " " + pageInfo._embedded.venues[0].state.name)
    $('#concertVenue').text(pageInfo._embedded.venues[0].name)
    $('#concertGenre').text(pageInfo.classifications[0].genre.name)
    $('#concertImage').attr("src", pageInfo.images[2].url)
    console.log(pageInfo);

    $(".buy_ticket_btn").attr('url', pageInfo.url)
    $(document).on("click", ".buy_ticket_btn", function (event) {
        window.open(event.currentTarget.getAttribute("url"), "_self");

    })

    if (pageInfo.info) {
        $('#extraDetails').text(pageInfo.info + pageInfo.pleaseNote)
    } else {
        $('#extraDetails').text("No info provided.")
    }

    let lat = pageInfo._embedded.venues[0].location.latitude;

    console.log(lat);


    let lon = pageInfo._embedded.venues[0].location.longitude;


    $.ajax({
        type: "GET",

        url: "https://developers.zomato.com/api/v2.1/search?lat=" + lat + "&lon=" + lon + "&radius=5000&sort=rating&count=4",

        url: "https://developers.zomato.com/api/v2.1/search?lat=" + lat + "&lon=" + lon + "&radius=5000&sort=rating&count=8",

        async: true,
        dataType: "json",
        headers: { 'user-key': 'bad7750c8e32a21364c6344f9009cc75' },
        success: function (json) {

            let zomatoHeaders = $(".header")
            let zomatoDesc = $(".description")
            let zomatoButtons = $('.ui.bottom.attached.button')


            for (let i = 0; i < zomatoHeaders.length; i++) {

                zomatoHeaders[i].innerText = json.restaurants[i].restaurant.name
                zomatoDesc[i].innerText = json.restaurants[i].restaurant.cuisines
                zomatoButtons[i].setAttribute("url", json.restaurants[i].restaurant.url)

            }
        },
        error: function (xhr, status, err) {

        }
    });
})


$(document).on("click", ".ui.bottom.attached.button", function (event) {
    window.open(event.currentTarget.getAttribute("url"));
})
