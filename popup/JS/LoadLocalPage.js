$(document).ready(function () {

    $("#showPage").click(function (event) {
        $.getJSON('../assets/testPages/sample.json', function (localPage) {
            console.log(localPage);
            $("#currentHomepage").html(localPage.html);
            }
                
         )
        });
    });