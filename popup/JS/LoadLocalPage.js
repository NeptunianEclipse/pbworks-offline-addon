$(document).ready(function () {
    //Automatically populates the homepage with the PBWorks 'frontpage'; won't be hardcoded in future
    $.getJSON('../assets/testPages/sample.json', function (localPage) {
            console.log(localPage);
            $("#currentPage").html(localPage.html);
        }
    );

    //Header searchbar
    $("#searchHeaderB").click(function (event) {
        var search = document.getElementById("searchHeader").value;
        console.log(search);
        $("#localPage").text("Search for '" + search + "' returns: ");
        var result = get_data_name(search);
        result.then((e) =>{
            console.log(e.target.result);
        })

    });

    //Lower searchbar
    $("#searchPagesB").click(function (event) {
        var search = document.getElementById("searchPages").value;
        $("#localPage").text("Search for '" + search + "' returns: ");
        var result = get_data_name(search);
        console.log(result);

    });

});

function displaySearch(list) {

}