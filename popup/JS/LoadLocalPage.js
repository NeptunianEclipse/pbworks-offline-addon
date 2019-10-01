var searchResult;
//this global variable simplifies the process of accessing pages in the search result, i.e. no weird handing around of strings

$(document).ready(function () {
    noHomepage();

    $("#searchOid").click(function (event) {
        $("#searchByWhat").click(function (event) {
            var search = document.getElementById("searchBy").value;
            search = parseInt(search);
            $("#localPage").text("Search oid for '" + search + "' returns: ");
            var result = get_data_oid(search);
            result.then((e) => {
                console.log(e.target.result);
                if (e.target.result === undefined) {
                    $("#currentPage").text("No pages found!");
                } else {
                    $("#currentPage").empty();
                    displaySearch(e.target.result);
                    }

                var viewButtons = document.querySelectorAll("div.pageDetails > .viewButton");


                console.log(viewButtons);
                for (var j = 0; j < viewButtons.length; j++) {
                    viewButtons[j].addEventListener('click', function (event) {
                        var viewButtonName = event.target.name.slice(5);
                        var actualPage = e.target.result.html;
                        $("#currentPage").empty();
                        console.log(viewButtonName);
                        $("#localPage").text(e.target.result.name);
                        $("#currentPage").html(actualPage);

                    })
                }
            })
        })
        });


    $("#searchName").click(function (event) {
        $("#searchByWhat").click(function (event) {
            var search = document.getElementById("searchBy").value;
            $("#localPage").text("Search name for '" + search + "' returns: ");
            var result =  get_data_name(search);
            result.then((e) => {
                console.log(e.target.result);
                searchResult = [];
                searchResult = e.target.result;
                if (e.target.result.length === 0 || e.target.result.length === undefined) {
                    $("#currentPage").text("No pages found!");
                } else {
                    $("#currentPage").empty();
                    for (i = 0; i < e.target.result.length; i++) {
                        var p = e.target.result[i];
                        if (p.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 || search.toLowerCase().indexOf(p.name.toLowerCase()) !== -1) {
                            displaySearch(p, i);
                        }
                    }
                }
                var viewButtons = document.querySelectorAll("div.pageDetails > .viewButton");


                console.log(viewButtons);
                for (var j = 0; j < viewButtons.length; j++) {
                    viewButtons[j].addEventListener('click', function (event) {
                        var viewButtonName = event.target.name.slice(5);
                        var vbnInt = parseInt(viewButtonName);
                        var actualPage = searchResult[vbnInt].html;
                        $("#currentPage").empty();
                        console.log(viewButtonName);
                        $("#localPage").text(searchResult[vbnInt].name);
                        $("#currentPage").html(actualPage);

                    })
                }

            })
        })
        });
    $("#searchAuthor").click(function (event) {
        $("#searchByWhat").click(function (event) {
            var search = document.getElementById("searchBy").value;
            $("#localPage").text("Search author for '" + search + "' returns: ");
            var result = get_data_author(search);
            result.then((e) => {
                console.log(e.target.result);
                searchResult = [];
                searchResult = e.target.result;
                if (e.target.result.length === 0 || e.target.result.length === undefined) {
                    $("#currentPage").text("No pages found!");
                } else {
                    $("#currentPage").empty();
                    for (i = 0; i < e.target.result.length; i++) {
                        var p = e.target.result[i];
                        displaySearch(p, i);
                    }
                }

                var viewButtons = document.querySelectorAll("div.pageDetails > .viewButton");


                console.log(viewButtons);
                for (var j = 0; j < viewButtons.length; j++) {
                    viewButtons[j].addEventListener('click', function (event) {
                        var viewButtonName = event.target.name.slice(5);
                        var vbnInt = parseInt(viewButtonName);
                        var actualPage = searchResult[vbnInt].html;
                        $("#currentPage").empty();
                        console.log(viewButtonName);
                        $("#localPage").text(searchResult[vbnInt].name);
                        $("#currentPage").html(actualPage);

                    })
                }
            })
        })
    })

});


function toEditor(editor_url) {
    console.log("click here");
    browser.tabs.create({
        url: editor_url
    });
}

function makeURL(singlePage) {
    let editor_url = "editor.html?";
    return editor_url + 'oid' + "=" + singlePage.oid;
}


//basic display of all search items, will be cleaned up later
function displaySearch(singlePage, pageArrayNumber) {
    let comment;
    let editor_url = makeURL(singlePage);
    if (singlePage.comment === undefined) {
        comment = "There is no comments for this page"
    } else {
        comment = singlePage.comment;
    }

    var stringEntry = "<h2>" + "<a href=" + editor_url + ">" + singlePage.name + "</a>" + "</h2>" + "<p> <i>" + comment + "</i> <br> Last edited online by " + singlePage.author.name + "</p>";
    var stringEntry1= "<p>OID: " + singlePage.oid +"</p>"
    $("#currentPage").append("<div class='pageDetails'>" + stringEntry + stringEntry1 + "<button name='view-" + pageArrayNumber + "' type='button' class='viewButton'>View</button>" + "</div>");
}

function noHomepage() {
    $("#currentPage").html("<h2>You haven't set a home page yet!</h2>");
}

function setHomepage(pageObject) {
    //Automatically populates the homepage with the PBWorks 'frontpage'; won't be hardcoded in future
    console.log(pageObject);
    $("#currentPage").html(pageObject.html);
}