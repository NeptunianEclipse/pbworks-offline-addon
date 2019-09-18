let admin_key = "-1";
//
browser.contextMenus.create({
    id: "PBwork-download",
    title: "Download PBwork article"
});

//
browser.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "PBwork-download") {
        browser.tabs.executeScript({
            file: "./popup/JS/PBworkDownload.js"
        });
    }
});

function getAdminKey() {
    // assign admin_key
    function onError(error) {
        console.log(`Error: ${error}`);
    }

    function onGot(item) {
        let key = "";
        if (item.pbwork_key) {
            key = item.pbwork_key;
        }
        admin_key = key;
        console.log(admin_key);
    }

    const getting = browser.storage.local.get("pbwork_key");
    getting.then(onGot, onError);
}


//
function handleMessage(request, sender, sendResponse) {
    let url = request.current_url;
    let pbwork_re = new RegExp("^.+\.pbworks.com/w/page/[0-9]{9}/.*");
    let outcome = pbwork_re.test(url);
    if (outcome) {
        sendResponse({response: true});
        let oid_num = new RegExp("[0-9]{9}")
            .exec(url)[0];
        let workspace_name = new RegExp("^.*\.pbworks\.com")
            .exec(url)[0]
            .replace(/^http:\/\//, "")
            .replace(/\.pbworks\.com/, "");
        getAdminKey();
        setTimeout(()=>{
            console.log(admin_key);
            let pbworks = new PBWorks(workspace_name, admin_key);
            pbworks.getPage({
                oid: oid_num
            }).then((pageInfo) => {
                console.log(pageInfo.html);
            });
        }, 1000);
    } else {
        sendResponse({response: false});
    }


}

browser.runtime.onMessage.addListener(handleMessage);

