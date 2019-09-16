
function Online(callback){
    let img = new Image();
    img.src = 'https://www.baidu.com/favicon.ico?_t=' + Date.now(); //will change to google
    img.onload=function(){
        if (callback) callback(true)
    };
    img.onerror=function(){
        if (callback) callback(false)
    };
}

Online(function(flag){
    let internet_status_dom = $('#internet_status');
    if(flag){
        let css = {"font-size":"1.2em", "color":"blue","text-align":"center"};
        internet_status_dom.text("Online");
        internet_status_dom.css(css);
    }else{
        let css ={"font-size":"1.2em", "color":"blue", "text-align":"center"};
        internet_status_dom.text("Offline");
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
    let url_view_modify = "http://www.massey.ac.nz/massey/home.cfm";// not true, need to change

    let chosenPage;
    if (e.target.textContent === "Download Pages") {
        chosenPage = url_download
    } else if (e.target.textContent === "View/Modify Local Pages") {
        chosenPage = url_view_modify;
    }

    browser.tabs.create({
        url: chosenPage
    });
});


