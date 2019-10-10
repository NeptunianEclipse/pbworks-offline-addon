var searchResult;
var searchNavCount;
var showPerLoad = 15;
//these global variables simplify the process of accessing pages in the search result, i.e. no weird handing around of strings



$(document).ready(function () {
    setHomepage();
    setIcons();
    $("#displayNumberForm").css("display", "none");
  
    Online(function (flag) {
        
        if (flag) {
            //online
            $("#internetStatus").text("Online");
            $("#internetStatus").css("color", "#42ff4f");
            
        } else {
            //offline
            $("#internetStatus").text("Offline");
            $("#internetStatus").css("color", "#ff5d47");
            if ($('#button_update').length) {
                document.getElementById("button_update").disabled = true;
            }
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
        button.on("click", searchVersion);
    });

    let searchName = $("#searchName");
    searchName.click(function (event) {
        let button = $("#searchByWhat");
        button.off("click", searchByAuthor);
        button.off("click", searchByOid);
        button.off("click", searchVersion);
        button.on("click", searchByName);
    });


    $("#searchAuthor").click(function (event) {
        let button = $("#searchByWhat");
        button.off("click", searchByOid);
        button.off("click", searchByName);
        button.off("click", searchVersion);
        button.on("click", searchByAuthor);
    });

    $("#searchVersion").click(function (event) {
        let button = $("#searchByWhat");
        button.off("click", searchByOid);
        button.off("click", searchByName);
        button.off("click", searchByAuthor);
        button.on("click", searchVersion);
    });

    document.getElementById("displayNumber").addEventListener("change", function (event) {
        showPerLoad = parseInt($("#displayNumber :selected").val());
        console.log(showPerLoad);
        if (searchResult) {
            createSearchResults();
        }
        

    });

    //Search functions - by type

    function searchVersion(event) {
        var search = document.getElementById("searchBy").value;
        search = parseInt(search);
        if (isNaN(search) === false) {
            $("#localPage").text("Search oid for '" + search + "' returns: ");

            var result = getOid(search);
            result.then((e) => {
                console.log(e.target.result);
                searchResult = [];
                searchResult = e.target.result;
                createSearchResults();
            });
        }
        else{
                $("#localPage").text("Please enter a complete number!")
            }
        
    }


    function searchByOid(event) {
        var search = document.getElementById("searchBy").value;
        search = parseInt(search);
        if (isNaN(search) === false) {
            $("#localPage").text("Search oid for '" + search + "' returns: ");
            result.then((e) => {
                console.log(e.target.result);
                searchResult = [];
                searchResult = e.target.result;
                createSearchResults();
            });
        }
        else{
            $("#localPage").text("Please enter a number!")
        }
        var result = get_data_oid(search);
        
    }

    function searchByName(event) {
        var search = document.getElementById("searchBy").value;
        if (search !== "") {
            $("#localPage").text("Search name for '" + search + "' returns: ");
            var result = get_data_name(search);
            result.then((e) => {
                console.log(e.target.result);
                searchResult = [];
                var searchResultTemp = e.target.result;
                if (searchResultTemp.length === 0 || searchResultTemp.length === undefined) {
                    $("#currentPage").text("No pages found!");
                }
                else {
                    $("#currentPage").empty();
                    if (search !== "") {
                        for (i = 0; i < searchResultTemp.length; i++) {
                            var p = searchResultTemp[i];
                            if (p.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 || search.toLowerCase().indexOf(p.name.toLowerCase()) !== -1) {
                                searchResult.push(p);
                            }
                        }
                        createSearchResults();
                    }
                }
            });
        }
        else{
            $("#localPage").text("Can't be empty!")
        }
        
    }

    function searchByAuthor(event) {
        var search = document.getElementById("searchBy").value;
        if (search !== "") {
            $("#localPage").text("Search author for '" + search + "' returns: ");
            var result = get_data_author(search);
            result.then((e) => {
                console.log(e.target.result);
                searchResult = [];
                searchResult = e.target.result;
                createSearchResults();
            });
        }
        else{
            $("#localPage").text("Can't be empty!")
        }
        
    }

    function createSearchResults() {
        $('.editLink').remove();
        $('.backB').remove();
        //There is a strange error causing multiple .editLink and .backB buttons to appear
        //refactoring may solve this in the future, but this works too
        searchNavCount = 0;
        $("#displayNumberForm").css({
            "display": "inline-block","float": "right","margin-top": "2%","margin-right": "2%",});
        var search = document.getElementById("searchBy").value;

        $("#localPage").text("Search for '" + search + "' returns: ");
        if (searchResult.length === 0 || searchResult.length === undefined) {
            $("#currentPage").text("No pages found!"); //not working due to changes in the IndexedDb

        }
        else {
            var basicResultString = "Search for '" + search + "' returns " + searchResult.length + " result";
            if (searchResult.length !== 1) {
                var resultString = basicResultString.concat("s");
                $("#localPage").text(resultString);
            }
            else {
                $("#localPage").text(basicResultString);
            }
                
}
            
            $("#currentPage").empty();
            
            console.log('results length = ' + searchResult.length);
            searchNavCalculations();
            createButtonListeners();

        }
  

    function searchNavCalculations() {
        
        var totalRotations = calculateShownPages();
        var limitsArray = calculateSearchLimits();
        displayLimitedSearches(totalRotations, limitsArray[0], limitsArray[1]);
    }

    function calculateShownPages() {
        var extraPages = searchResult.length % showPerLoad; //how many extra pages there are
        var totalRotations
        if (extraPages > 0) {
            var j = searchResult.length - extraPages;
            totalRotations = (j / showPerLoad) + 1;
            
        }
        else {
            totalRotations = (searchResult.length / showPerLoad);
            
        }; //the number of total rotations is just however many lots of 5 there are (always rounded up, e.g. 11 = 3 rotations), for now
        return totalRotations;

        
        }

    function calculateSearchLimits() {
        var loopNum;
        var lower = (searchNavCount * showPerLoad);
        var upper = lower + showPerLoad;
        if (searchResult.length <= upper) {
            loopNum = searchResult.length;
        }
        else { loopNum = upper; };

        limitsArray = [lower, loopNum];
        console.log(limitsArray);
        return (limitsArray);
    }

    function displayLimitedSearches(totalRotations, lower, upper) {
        $("#currentPage").empty();
        $("#currentPage").append("<button class='previousSearchPages'>Previous</button>");
        $("#currentPage").append("<button class='nextSearchPages'>Next</button>");
        for (i = lower; i < upper; i++) {
            displaySearch(searchResult[i], i);
        }
        $("#currentPage").append("<button class='previousSearchPages'>Previous</button>");
        $("#currentPage").append("<button class='nextSearchPages'>Next</button>");

        if (searchNavCount >=  totalRotations - 1 ) {
            $(".nextSearchPages").css("display", "none");
        }
        if (searchNavCount <= 0) {
            $(".previousSearchPages").css("display", "none");
        }
        console.log("Navcount is not zero: " + searchNavCount);
        console.log("Total rotations: " + totalRotations);

    }


    function createButtonListeners() {
        $('.editLink').remove();
        $('.backB').remove();

        var viewButtons = document.querySelectorAll("div.pageDetails > .viewButton");
        //var editButtons = document.querySelectorAll("div.pageDetails > .editButton");
        // console.log(viewButtons);

        $(".nextSearchPages").click(function () {
            searchNavCount++;
            searchNavCalculations();
            createButtonListeners();

        })
        $(".previousSearchPages").click(function () {
            searchNavCount--;
            searchNavCalculations();
            createButtonListeners();
        });

        for (var j = 0; j < viewButtons.length; j++) {
            viewButtons[j].addEventListener('click', function (event) {
                //viewing single page
                var viewButtonName = event.target.name.slice(5);
                var vbnInt = parseInt(viewButtonName);
                var actualPage = searchResult[vbnInt].html;
                var editor_url = makeURL(searchResult[vbnInt]);
                var c_page = $("#currentPage");
                c_page.empty();
                $("#localPage").text(searchResult[vbnInt].name);
                c_page.html(actualPage);
                $("#displayNumberForm").css("display", "none");
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

        var stringEntry = "<h2>" + "<a href=" + editor_url + ">" + singlePage.name + "</a> </h2>" + "<p> <i>" + comment + "</i> <br> Last edited online by " + singlePage.author.name + "</p>";
        var stringEntry1 = "<br><p>OID: " + singlePage.oid + "</p>";
        var editTime = "<p>last modify time: " + singlePage.edittime + "</p>"
        var viewEntry = "<button name='view-" + pageArrayNumber + "' type='button' class='viewButton'>View</button>";
        var editEntry = '<a href=' + editor_url + ' class="editPage">Edit</a>';

        $("#currentPage").append("<div class='pageDetails'>" + stringEntry + stringEntry1 + editTime + editEntry + viewEntry + "</div>");
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

        //end of set Icons
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
    
});


