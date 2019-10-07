let admin_key;
let workspace_name;
let current_oid_num;
let user_email;
let user_uid;
let if_load_config = false;


//create a item in right-click menu in firefox
browser.contextMenus.create({
    id: "PBwork-download",
    title: "Download this article"
});

// browser.contextMenus.create({
//     id: "PBwork-download all",
//     title: "Download All articles of this workspace"
// });

// promise reject callback function
function onError(error) {
    console.log(`Error: ${error}`);
}

function open_local_storage() {
    return new Promise(function (resolve, reject) {
        const getting = browser.storage.local.get();
        getting.then(resolve, reject);
    });
}


// get admin key callback function
function get_user_config(item) {
    console.log(item);
    return new Promise(function (resolve, reject) {
        if (item.pbwork_key) {
            admin_key = item.pbwork_key;
        }
        if (item.pbwork_user_email) {
            user_email = item.pbwork_user_email;
        }
        resolve();
    });

}

function load_configuration() {
    return new Promise(function (resolve, reject) {
        open_local_storage()
            .then(get_user_config)
            .then(() => {
                if_load_config = true;
                resolve();
            })
            .catch(reject);
    });

}

function get_user_info(email) {
    return new Promise(function (resolve, reject) {
        let pbworks = new PBWorks(workspace_name, admin_key);
        pbworks.getUserInfo(email)
            .then(resolve, reject)
    })
}


function download_page() {
    return new Promise(function (resolve, reject) {
        let pbworks = new PBWorks(workspace_name, admin_key);
        pbworks.getPageContent(current_oid_num).then((pageInfo) => {
            resolve(pageInfo);
        });
    })
}


function upload_page(data) {
    return new Promise((resolve, reject) => {
        console.log("begin uploading..........");
        console.log(data.revurl);
        let pbworks = new PBWorks(workspace_name, admin_key);
        console.log(user_uid);
        pbworks.putPageContent(data.name, data.html)
            .then(success => {
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
    let url = tab.url;
    let flag, error_string;
    console.log("url: " + url);
    let pbwork_re = new RegExp("^.+\.pbworks.com/w/page/.*");
    let outcome = pbwork_re.test(url);
    if (outcome) {
        current_oid_num = new RegExp("^.+\.pbworks.com/w/page/([0-9]+)/").exec(url)[1];
        workspace_name = new RegExp("http://(.+)\.pbworks.com/w/page/.*").exec(url)[1];
        download_page()
            .then(function (pageInfo) {
                if (typeof pageInfo.html === "undefined") {
                    console.log("download failed!");
                    console.log(pageInfo.error_string);
                    error_string = pageInfo.error_string;
                    flag = false;
                } else {
                    insert(pageInfo)
                        .then(() => {
                            console.log("download success");
                        });
                    flag = true;
                }

                if (flag) {
                    browser.tabs.sendMessage(tab.id, {
                        response: true,
                    }).then(() => {
                        console.log("send true signal")
                    })
                } else {
                    browser.tabs.sendMessage(tab.id, {
                        response: false,
                        type: "PBwork API Return Error",
                        message: error_string
                    }).then(() => {
                        console.log("send false singal")
                    });
                }
            });
    } else {
        browser.tabs.sendMessage(tab.id, {
            response: false,
            type: "Target Website is Invalid",
            message: "This website is not belong to PBwork!"
        }).then(() => {
            console.log("false because of url")
        });
    }
}

//
function handleMessage(request, sender, sendResponse) {
    if (request.message === "configuration update") {
        load_configuration();
    }

    if (request.message === "ask for config status") {
        browser.runtime.sendMessage({
            message: "config status return",
            status: if_load_config,
            email: user_email,
            key: admin_key
        });
    }

    if (request.message === "ask for uploading") {
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


}

function injectScript(tabId, changeInfo, tabInfo) {
    if (changeInfo.status === "complete" && new RegExp("^.+\.pbworks.com/w/page/.*").test(tabInfo.url)) {
        browser.tabs.executeScript(tabId, {
            file: "./popup/JS/PBworkDownload.js"
        }).then(function () {
            console.log("PBwork extension script inject successfully")
        });
    }

}

browser.runtime.onMessage.addListener(handleMessage);

//add an listener for item in right-click
browser.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "PBwork-download") {
        let querying = browser.tabs.query({currentWindow: true, active: true});
        querying.then(function (tabs) {
            if (!if_load_config) {
                browser.tabs.sendMessage(tabs[0].id,{
                    response: false,
                    type: "Extension configuration",
                    message: "You haven't set configuration yet"
                })
            } else {
                runDownload(tabs[0]);
            }

        }, onError);
    }
});

browser.tabs.onUpdated.addListener(injectScript);


// init work
// open_local_storage()
//     .then(get_admin_key)
//     .then(()=>{
//         get_user_info(user_uid).then(object => {
//             console.log(object);
//         });
//         console.log("finish init backgroud");
//     });
//
//


// 5VXfJkL9eybJ3xuycKYU