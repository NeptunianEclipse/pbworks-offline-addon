var searchResult;

//these global variables simplify the process of accessing pages in the search result, i.e. no weird handing around of strings



$(document).ready(function () {
    setHomepage();
    setIcons();
  
    Online(function (flag) {
        
        if (flag) {
            //online
            $("#internetStatus").text("Online");
            $("#internetStatus").css("color", "#42ff4f");
            
        } else {
            //offline
            $("#internetStatus").text("Offline");
            $("#internetStatus").css("color", "#ff5d47");
        }
    });



    //Setting up the page on first load - populating with 'frontpage' object


    function setHomepage() {
        var result = get_data_name1("FrontPage");
        result.then((e) => {
            if (e.target.result.length === 0 || e.target.result.length === undefined) {
                $("#currentPage").html("<h2>You haven't downloaded a frontpage!</h2>");
            } else {
                $("#currentPage").html(e.target.result[0].html);
            }
        });

    }

    //New Page Button
    $("#createNewPage").click(function (event) {
        let newPageName = prompt("Please input new page name:");
        let editorUrl = "editor.html?";
        editorUrl = editorUrl + 'oid' + "=" + "-1" + "&name" + "=" + newPageName;
        toEditor(editorUrl);
    });

    //Search functions - button press listeners followed by functions

    document.getElementById("searchBy").onkeypress = function (event) {
        if (event.keyCode === 13 || event.which ==13) {
            event.preventDefault();
            document.getElementById("searchByWhat").click();
        }
    }



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

    //Search functions - by type

    function searchByOid(event) {
        var search = document.getElementById("searchBy").value;
        search = parseInt(search);
        if (isNaN(search) === false) {
            $("#localPage").text("Search oid for '" + search + "' returns: ");
        }
        else{
            $("#localPage").text("Please enter a number!")
        }
        var result = get_data_oid(search);
        result.then((e) => {
            console.log(e.target.result);
            searchResult = [e.target.result];
            createSearchResults();
        });
    }

    function searchByName(event) {
        var search = document.getElementById("searchBy").value;
        if (search !== "") {
            $("#localPage").text("Search name for '" + search + "' returns: ");
        }
        else{
            $("#localPage").text("Can't be empty!")
        }
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
                if (search !== "") {
                    for (i = 0; i < searchResult.length; i++) {
                        var p = searchResult[i];
                        if (p.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 || search.toLowerCase().indexOf(p.name.toLowerCase()) !== -1) {
                            displaySearch(p, i);

                        }
                        createButtonListeners();
                    }
                }
            }
        });
    }

    function searchByAuthor(event) {
        var search = document.getElementById("searchBy").value;
        if (search !== "") {
            $("#localPage").text("Search author for '" + search + "' returns: ");
        }
        else{
            $("#localPage").text("Can't be empty!")
        }
        var result = get_data_author(search);
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
        alert("one!");
        //There is a strange error causing multiple .editLink and .backB buttons to appear
        //refactoring may solve this in the future, but this works too
        resultCount = 0;
        var search = document.getElementById("searchBy").value;

        $("#localPage").text("Search for '" + search + "' returns: ");
        alert("two!");
        if (searchResult.length === 0 || searchResult.length === undefined) {
            $("#currentPage").text("No pages found!"); //not working due to changes in the IndexedDb
            alert("three!");

        }
        else {
            alert("four!");
            $("#currentPage").empty(); 
            $("#currentPage").append("<button id='previousSearchPages' style='display:none;'>Previous<button>");
            $("#currentPage").append("<button id='nextSearchPages'>Next<button>");
                for (i = 0; i < searchResult.length; i++) {
                    var p = searchResult[i];
                    displaySearch(p, i);

            }

            createButtonListeners();
            calculateShownPages();
            

        }
    }

    function calculateShownPages() {
        var displayPerRotation = 5;

        var extraPages = searchResult.length % displayPerRotation; //how many extra pages there are
        var totalRotations
        if (extraPages > 0) {
            var j = searchResult.length - extraPages;
            totalRotations = (j / displayPerRotation);
            alert("extra!")
        }
        else {
            totalRotations = (searchResult.length / e) - 1;
            alert("normal!");
        }; //the number of rotations is just however many lots of 20 there are

        var resultCount = 0;
        var nextResultsPage = false;
        while (resultCount <= totalRotations) {
            accessSearch(resultCount, displayPerRotation);
            console.log("increment c")
            resultCount++;
        }
    }

    function accessSearch(count, shownPages) {
        var loopNum;
        var lower = count * shownPages;
        var upper = lower + shownPages - 1;
        if (searchResult.length <= upper) {
            loopNum = searchResult.length;
            alert("yes??");
        }
        else { loopNum = upper; alert("no??"); };

        for (var p = lower; p < loopNum; p++) {

            console.log(p);
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


    function Online(callback) {
        let img = new Image();
        img.src = 'https://www.baidu.com/favicon.ico?_t=' + Date.now(); //will change to google
        img.onload = function () {
            if (callback) callback(true)
        };
        img.onerror = function () {
            if (callback) callback(false)
        };
    }

    searchName.click();
});


