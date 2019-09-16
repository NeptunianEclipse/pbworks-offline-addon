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

Online(function(flag){
    let internet_status_dom = $('#internet_status');
    if(flag) {  //Online
        let css = {"font-size":"1.2em", "color":"blue","text-align":"center"};
        internet_status_dom.text("Online");
        document.getElementById("online_homepage").disabled = false;
        internet_status_dom.css(css);
    }else { //Offline
        let css ={"font-size":"1.2em", "color":"red", "text-align":"center"};
        internet_status_dom.text("Offline");
        document.getElementById("download_pages").disabled = true;
        document.getElementById("download_pages").classList.add('unavailable');
        document.getElementById("online_homepage").disabled = true;
        document.getElementById("online_homepage").classList.add('unavailable');

        internet_status_dom.css(css);
    }
});

document.addEventListener("click", function (e) {
    if (!(e.target.tagName === "BUTTON")) {
        console.log(e.target.tagName);
        return;
    }

    console.log("click button");

    let url_download = "http://confocal-manawatu.pbworks.com/w/page/16346911/Top"; // maybe change later
    let url_view_modify = "Homepage.html";
    let url_online = "http://159356group7.pbworks.com/";

    let chosenPage;
    if (e.target.textContent === "Download Current Page") {
        chosenPage = url_download
    } else if (e.target.textContent === "Online Homepage") {
        chosenPage = url_online;
    } else if (e.target.textContent === "Local Homepage") {
        chosenPage = url_view_modify;
    }

    browser.tabs.create({
        url: chosenPage
    });
});


