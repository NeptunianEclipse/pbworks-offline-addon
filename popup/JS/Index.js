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

Online(function (flag) {
    let internet_status_dom = $('#internet_status');
    if (flag) {
        let css = { "font-size": "1.2em", "color": "#009933", "text-align": "center"};
        internet_status_dom.text("Online");
        internet_status_dom.css(css);
    } else {
        let css = { "font-size": "1.2em", "color": "#ff3300", "text-align": "center"};
        internet_status_dom.text("Offline");
        internet_status_dom.css(css);
    }
});

document.addEventListener("click", function (e) {
    if (!(e.target.tagName === "BUTTON")) {
        console.log(e.target.tagName);
        return;
    }
    let url_view_modify = "Homepage.html";
    if (e.target.textContent === "Download Pages") {
        console.log("click!!!!!")
    } else if (e.target.textContent === "View Local Pages") {
        browser.tabs.create({
            url: url_view_modify
        });
    }

});

function handleMessage(request, sender, sendResponse){
    if (request.message === "config status return"){
        if (request.status === true){
            let node = $("#config_status");
            let css = { "font-size": "1.2em", "color": "#009933", "text-align": "center"};
            node.text("You have set user configuration");
            node.css(css);
        }
    }
}

browser.runtime.sendMessage({
    message: "ask for config status"
});

browser.runtime.onMessage.addListener(handleMessage);


