$(document).ready(function () {
    noHomepage();

    //Header searchbar
    $("#searchHeaderB").click(function (event) {
        var search = document.getElementById("searchHeader").value;
        console.log(search);
        $("#localPage").text("Search for '" + search + "' returns: ");
        var result = get_data_name(search);
        result.then((e) => {
            console.log(e.target.result);
            if (e.target.result.length === 0 || e.target.result.length === undefined) {
                $("#currentPage").text("No pages found!");
            }
            else {
                $("#currentPage").empty();
                for (i = 0; i < e.target.result.length; i++) {
                    var p = e.target.result[i];
                    displaySearch(p);
                }
            }
        })

    });

    //Lower searchbar
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
                if (e.target.result.length === 0 || e.target.result.length === undefined) {
                    $("#currentPage").text("No pages found!");
                } else {
                    $("#currentPage").empty();
                    for (i = 0; i < e.target.result.length; i++) {
                        var p = e.target.result[i];
                        displaySearch(p);
                    }
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
                if (e.target.result.length === 0 || e.target.result.length === undefined) {
                    $("#currentPage").text("No pages found!");
                } else {
                    $("#currentPage").empty();
                    for (i = 0; i < e.target.result.length; i++) {
                        var p = e.target.result[i];
                        console.log(p);
                        displaySearch(p);
                    }
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

//basic display, will be cleaned up later
function displaySearch(singlePage) {
    //let comment;
    let editor_url = makeURL(singlePage);
    $("#currentPage").append("<div class='pageDetails'>");
    let tr = "<tr><td>"+"<a href=" + editor_url + ">" + singlePage.name + "</a>"+"</td><td>"+singlePage.oid+"</td><td>"+singlePage.author.name+"</td></tr>";
    $("#currentPage").append(tr);
    // $("#currentPage").append("<input type='button'  value='open editor' onclick=toEditor("+editor_url+")"  + ">" );
    if (singlePage.comment === undefined) {
        comment = "There is no comments for this page"
    } else {
        comment = singlePage.comment;
    }
    $("#currentPage").append("<p> <i>" + comment + "</i> <br> Last edited online by " + singlePage.author.name + "</p>");
    $("#currentPage").append("</div>");
}

function noHomepage() {
    $("#currentPage").html("<h2>You haven't set a home page yet!</h2>");
}

function setHomepage(pageObject) {
    //Automatically populates the homepage with the PBWorks 'frontpage'; won't be hardcoded in future
    console.log(pageObject);
    $("#currentPage").html(pageObject.html);
}