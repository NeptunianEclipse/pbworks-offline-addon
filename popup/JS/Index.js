console.log("begin");
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