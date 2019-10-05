let admin_key;
let workspace_name;
let oid_num;


//create a item in right-click menu in firefox
browser.contextMenus.create({
    id: "PBwork-download",
    title: "Download PBwork article"
});

// promise reject callback function
function onError(error) {
    console.log(`Error: ${error}`);
}

// get admin key callback function
function get_admin_key(item) {
    return new Promise(function (resolve, reject) {
        let key = "";
        if (item.pbwork_key) {
            key = item.pbwork_key;
        }
        admin_key = key;
        resolve();
    });

}

function open_local_storage() {
    return new Promise(function (resolve, reject) {
        const getting = browser.storage.local.get("pbwork_key");
        getting.then(resolve, reject);
    });
}

function download_page() {
    return new Promise(function (resolve, reject) {
        console.log(admin_key);
        let pbworks = new PBWorks(workspace_name, admin_key);
        pbworks.getPage({
            oid: oid_num
        }).then((pageInfo) => {
            resolve(pageInfo);
        });
    })
}

function upload_page(data) {
    return new Promise((resolve, reject) => {
        console.log("begin uploading..........");
        let pbworks = new PBWorks(workspace_name, admin_key);
        pbworks.putPage({
            page: data.name,
            html: encodeURIComponent(data.html)
        }).then(success => {
            resolve(success);
            console.log("upload finish......");
        }).catch(error => {
            console.log(error);
            reject(error);
            console.log("upload fail")
        })
    })

}

function runDownload(tab) {
    console.log("tab is ");
    console.log(tab);
    let url = tab.url;
    let flag, error_string;
    console.log("url: "+url);
    let pbwork_re = new RegExp("^.+\.pbworks.com/w/page/.*");
    let outcome = pbwork_re.test(url);
    if (outcome){
        oid_num = new RegExp("^.+\.pbworks.com/w/page/([0-9]+)/").exec(url)[1];
        workspace_name = new RegExp("http://(.+)\.pbworks.com/w/page/.*").exec(url)[1];
        console.log(workspace_name);
        open_local_storage()
            .then(get_admin_key)
            .then(download_page)
            .then(function (pageInfo) {
                if (typeof pageInfo.html === "undefined") {
                    console.log("download failed!");
                    console.log(pageInfo.error_string);
                    error_string = pageInfo.error_string;
                    flag = false;
                }else {
                    insert(pageInfo)
                        .then(() => {
                            console.log("download success");
                        });
                    flag = true;
                }

                if (flag){
                    browser.tabs.sendMessage(tab.id, {
                        response: true,
                    }).then(()=>{console.log("send true signal")});
                }else{
                    browser.tabs.sendMessage(tab.id, {
                        response: false,
                        type: "PBwork API Return Error",
                        message: error_string
                    }).then(()=>{console.log("send false singal")});
                }
            });
    }else{
        browser.tabs.sendMessage(tab.id, {
            response: false,
            type: "Target Website is Invalid",
            message: "This website is not belong to PBwork!"
        }).then(()=>{console.log("false because of url")});
    }
}

//
function handleMessage(request, sender, sendResponse) {
    let page = request.data;
    upload_page(page)
        .then(success => {
            console.log(success);
            browser.tabs.sendMessage(
                request.tab_id,
                {response: true}
            ).then(response => {
                console.log(response.response)
            })
        }).catch(error => {
        browser.tabs.sendMessage(
            request.tab_id,
            {response: false}
        ).then(response => {
            console.log(response.response)
        })
    });
}

browser.runtime.onMessage.addListener(handleMessage);

//add an listener for item in right-click
browser.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "PBwork-download") {
        browser.tabs.executeScript({
            file: "./popup/JS/PBworkDownload.js"
        });
        let querying = browser.tabs.query({currentWindow: true, active: true});
        querying.then(function (tabs) {
            runDownload(tabs[0]);
        }, onError);
    }
});



// 5VXfJkL9eybJ3xuycKYU