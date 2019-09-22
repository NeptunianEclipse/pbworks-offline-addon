$(document).ready(function () {
    noHomepage();
                
    

    //Header searchbar
    $("#searchHeaderB").click(function (event) {
        var search = document.getElementById("searchHeader").value;
        $("#localPage").text("Search for '" + search + "' returns: ");
        var result = get_data_name(search);
        console.log(result);
       
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

function noHomepage() {
    $("#currentPage").html("<h2>You haven't set a home page yet!</h2>");
}

function setHomepage(pageObject) {
    //Automatically populates the homepage with the PBWorks 'frontpage'; won't be hardcoded in future
    console.log(pageObject);
    $("#currentPage").html(pageObject.html);
}