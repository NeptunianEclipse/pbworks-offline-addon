var searchResult;
//this global variable simplifies the process of accessing pages in the search result, i.e. no weird handing around of strings

$(document).ready(function () {
    setHomepage();
    setIcons();


    $("#searchOid").click(function (event) {
        let button = $("#searchByWhat");
        button.off("click", searchByAuthor);
        button.off("click", searchByName);
        button.on("click", searchByOid);
    });

    let searchName = $("#searchName");
    searchName.click(function (event) {
        let button = $("#searchByWhat");
        button.off("click", searchByAuthor);
        button.off("click", searchByOid);
        button.on("click", searchByName);
    });


    $("#searchAuthor").click(function (event) {
        let button = $("#searchByWhat");
        button.off("click", searchByOid);
        button.off("click", searchByName);
        button.on("click", searchByAuthor);
    });

    function searchByOid(event) {
        var search = document.getElementById("searchBy").value;
        search = parseInt(search);
        $("#localPage").text("Search oid for '" + search + "' returns: ");
        var result = get_data_oid(search);
        result.then((e) => {
            console.log(e.target.result);
            searchResult = [e.target.result];
            createSearchResults();
        });
    }

    function searchByName(event) {
        var search = document.getElementById("searchBy").value;
        $("#localPage").text("Search name for '" + search + "' returns: ");
        var result = get_data_name(search);
        result.then((e) => {
            console.log(e.target.result);
            searchResult = [];
            searchResult = e.target.result;
            if (searchResult.length === 0 || searchResult.length === undefined) {
                $("#currentPage").text("No pages found!");
            }
            else {
                $("#currentPage").empty();
                for (i = 0; i < searchResult.length; i++) {
                    var p = searchResult[i];
                    if (p.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 || search.toLowerCase().indexOf(p.name.toLowerCase()) !== -1) {
                        displaySearch(p, i);

                    }
                    createButtonListeners();
                }
            }
        });
    }

    function searchByAuthor(event) {
        var search = document.getElementById("searchBy").value;
        $("#localPage").text("Search author for '" + search + "' returns: ");
        var result = get_data_author(search);
        result.then((e) => {
            console.log(e.target.result);
            searchResult = [];
            searchResult = e.target.result;
            createSearchResults();
        });
    }



    function searchFor(search) { //search comes from button listeners above
        $("#localPage").text("Search for '" + search + "' returns: ");
        var result = get_data_name(search);
        result.then((e) => {
            console.log(e.target.result);
            searchResult = [];
            searchResult = e.target.result;
            createSearchResults();
        });
    }

    function createSearchResults() {
        $('.editLink').remove();
        $('.backB').remove();
        var search = document.getElementById("searchBy").value;
        $("#localPage").text("Search for '" + search + "' returns: ");
        if (searchResult === 0 || searchResult === undefined) {
                $("#currentPage").text("No pages found!");
        }
        else {
                $("#currentPage").empty();
                for (i = 0; i < searchResult.length; i++) {
                    var p = searchResult[i];
                    displaySearch(p, i);

                }
            createButtonListeners();
            
            
        }
    }

    function createButtonListeners() {
        $('.editLink').remove();
        $('.backB').remove();
        
        var viewButtons = document.querySelectorAll("div.pageDetails > .viewButton");
        //var editButtons = document.querySelectorAll("div.pageDetails > .editButton");
        // console.log(viewButtons);

        for (var j = 0; j < viewButtons.length; j++) {
            viewButtons[j].addEventListener('click', function (event) {
                //viewing single page
                var viewButtonName = event.target.name.slice(5);
                var vbnInt = parseInt(viewButtonName);
                var actualPage = searchResult[vbnInt].html;
                console.log(searchResult[vbnInt]);
                var editor_url = makeURL(searchResult[vbnInt]);
                var c_page = $("#currentPage");
                c_page.empty();
                console.log(viewButtonName);
                $("#localPage").text(searchResult[vbnInt].name);
                c_page.html(actualPage);

                //can't figure out why multiple buttons are made, so this checks if any back buttons exist before adding them
                var allBackB = document.getElementsByClassName("backB");
                if (allBackB.length === 0) {
                    $('<button class="backB">Back</button><a href=' + editor_url + ' class="editLink">Edit</a>').insertBefore("#currentPage");

                    for (var p = 0; p < allBackB.length; p++) {
                        allBackB[p].addEventListener('click', createSearchResults, false);
                    }
                    
                }
            })
        }
    }


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
        //this function is iterated over for each object in the search result array
        let comment;
        let editor_url = makeURL(singlePage);
        if (singlePage.comment === undefined) {
            comment = "There are no comments for this page"
        } else {
            comment = singlePage.comment;
        }

        var stringEntry = "<h2>" + "<a href=" + editor_url + ">" + singlePage.name + "</a>" + "</h2>" + "<p> <i>" + comment + "</i> <br> Last edited online by " + singlePage.author.name + "</p>";
        var stringEntry1 = "<br><p>OID: " + singlePage.oid + "</p>";
        var viewEntry = "<button name='view-" + pageArrayNumber + "' type='button' class='viewButton'>View</button>";
        var editEntry = '<a href=' + editor_url + ' class="editPage">Edit</a>';

        $("#currentPage").append("<div class='pageDetails'>" + stringEntry + stringEntry1 + editEntry + viewEntry + "</div>");
    }

    function setIcons() {
       
        document.getElementById("hoverJam").style.display = "none";

        /*Logo changes on hover*/
        $("#leftHeader").hover(function () {
            $("#mainJam").hide();
            $("#hoverJam").show();
            document.body.style.cursor = 'pointer';
        }, function () {
            $("#mainJam").show();
            $("#hoverJam").hide();
            document.body.style.cursor = 'default';
            })

        /*'Create page' changes on hover*/
        $("#createNewPage").hover(function () {
            $("#createNewPage").width(80)
            document.body.style.cursor = 'pointer';
        }, function () {
            $("#createNewPage").width(75)
            document.body.style.cursor = 'default';
        })

        document.getElementById("createNewPage").onclick = function () {
            /*Create new page not yet implemented!*/
            alert("Create new page function not yet implemented");
        }

        var searchCheck = document.getElementById('searchDisplayButton');
        if (typeof (searchCheck) != 'undefined' && searchCheck != null) {
            document.getElementById("searchDiv").style.display = "none";
            document.getElementById("hoverSearchImg").style.display = "none";
            

            $("#searchDisplayButton").hover(function () {
                $("#mainSearchImg").hide();
                $("#hoverSearchImg").show();
                document.body.style.cursor = 'pointer';
            }, function () {
                $("#mainSearchImg").show();
                $("#hoverSearchImg").hide();
                document.body.style.cursor = 'default';
            })

            document.getElementById("hoverSearchImg").onclick = function () {
                document.getElementById("searchDiv").style.display = "inline-block";
                document.getElementById("searchDisplayButton").style.display = "none";
            }
        }

        var editorCheck = document.getElementById('homeDisplayButton');
        if (typeof (editorCheck) != 'undefined' && editorCheck != null) {
            document.getElementById("hoverHome").style.display = "none";


            $("#homeDisplayButton").hover(function () {
                $("#mainHome").hide();
                $("#hoverHome").show();
                document.body.style.cursor = 'pointer';
            }, function () {
                $("#mainHome").show();
                $("#hoverHome").hide();
                document.body.style.cursor = 'default';
            })
        }


    }

    function noHomepage() {
        $("#currentPage").html("<h2>You haven't downloaded a frontpage!</h2>");
    }

    function setHomepage() {
        //Automatically populates the homepage with the PBWorks 'frontpage'; won't be hardcoded in future
        
        var result = get_data_name1("FrontPage");
        result.then((e) => {
            if (e.target.result.length === 0 || e.target.result.length === undefined) {
                noHomepage();
            }
            else {
                $("#currentPage").html(e.target.result[0].html);
            }
        });

    }
    searchName.click();
})
