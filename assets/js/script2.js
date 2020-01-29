$(document).on("click", `.arrowbtn`, function (e) {

    let spinner = $(this).attr("data-direction")
    let direction = `flip.${spinner}`
    $("#cubeSpin").shape(direction);
    console.log(e);

})


$(document).ready(function () {
    let pageInfo = JSON.parse(localStorage.getItem("Details"))
    $("#concertName").text(pageInfo.name)
    $('#concertDate').text("Date of Event:  " + pageInfo.dates.start.localDate)
    $("#concertAddress").text(pageInfo._embedded.venues[0].address.line1 + ", " + pageInfo._embedded.venues[0].city.name + " " + pageInfo._embedded.venues[0].state.name)
    $('#concertVenue').text(pageInfo._embedded.venues[0].name)
    $('#concertGenre').text(pageInfo.classifications[0].genre.name)
    $('#concertImage').attr("src", pageInfo.images[0].url)
    if (pageInfo.info) {
        $('#extraDetails').text(pageInfo.info + pageInfo.pleaseNote)
    } else {
        $('#extraDetails').text("No info provided.")
    }
    $.ajax({
        type: "GET",
        url: "https://developers.zomato.com/api/v2.1/search?lat=47.6062&lon=-122.3321&radius=5000&sort=rating&count=4",
        async: true,
        dataType: "json",
        headers: { 'user-key': 'bad7750c8e32a21364c6344f9009cc75' },
        success: function (json) {
            console.log(json);
            let zomatoHeaders = $(".header")
            let zomatoDesc = $(".description")
            let zomatoButtons = $('.ui.bottom.attached.button')
            console.log(zomatoHeaders);
            console.log(zomatoButtons);

            for (let i = 0; i < zomatoHeaders.length; i++) {

                zomatoHeaders[i].innerText = json.restaurants[i].restaurant.name
                zomatoDesc[i].innerText = json.restaurants[i].restaurant.cuisines
                zomatoButtons[i].setAttribute("url", json.restaurants[i].restaurant.url)

            }



        },
        error: function (xhr, status, err) {
            console.log(err);
        }
    });

})
$(document).on("click", ".ui.bottom.attached.button", function (event) {
    console.log(event)
    console.log(event.currentTarget)
    window.open(event.currentTarget.getAttribute("url"))
    // let eventID = event.currentTarget.id
    // window.name = "test.getAttribute("url")
    // $.ajax({
    //     type: "GET",
    //     url: "https://app.ticketmaster.com/discovery/v2/events/" + eventID + "?apikey=" + key,
    //     async: true,
    //     dataType: "json",
    //     success: function (json) {
    //         console.log(json);
    //         window.name =
    //             localStorage.setItem("Details", JSON.stringify(json))
    //         window.open("./index2.html", "_self")
    //     },
    //     error: function (xhr, status, err) {
    //         console.log(err);
    //     }
    // });


})