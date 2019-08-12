
document.addEventListener("click", function (e) {
    if(!e.target.classList.contains("button set")){
        return;
    }

    let url_download = "http://confocal-manawatu.pbworks.com/w/page/16346911/Top";
    let url_view_modify = "http://www.massey.ac.nz/massey/home.cfm" // not true, need to change

    let chosenPage;
    if(e.target.textContent === "Download Pages"){
        chosenPage = url_download
    }else if(e.target.textContent === "View/Modify Local Pages"){
        chosenPage = url_view_modify;
    }

    browser.tabs.create({
        url: chosenPage
    });
});