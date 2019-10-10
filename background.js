let admin_key;
let user_email;
let user_workspace;
let user_uid;
let if_load_config = false;


//create a item in right-click menu in firefox
browser.contextMenus.create({
    id: "PBwork-download",
    title: "Download this article"
});

// browser.contextMenus.create({
//     id: "PBwork-download-all",
//     title: "Download all articles"
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

        if (item.pbwork_workspace) {
            user_workspace = item.pbwork_workspace;
        }
        resolve();
    });

}

function load_configuration() {
    return new Promise(function (resolve, reject) {
        open_local_storage()
            .then(get_user_config)
            .then(() => {
                get_user_info(user_workspace, user_email)
                    .then(r => {
                        user_uid = r.uid;
                        console.log(user_uid);
                        if_load_config = true;
                        resolve();
                    });
            })
            .catch(reject);
    });
}

function get_user_info(workspace_name, email) {
    return new Promise(function (resolve, reject) {
        let pbworks = new PBWorks(workspace_name, admin_key);
        pbworks.getUserInfo(email)
            .then(resolve, reject)
    })
}


function download_single_page(workspace_name, current_oid_num) {
    return new Promise(function (resolve, reject) {
        let pbworks = new PBWorks(workspace_name, admin_key);
        pbworks.getPageContent(current_oid_num).then((pageInfo) => {
            resolve(pageInfo);
        });
    })
}

function download_all_pages(workspace_name) {
    return new Promise(function (resolve, reject) {
        let pbworks = new PBWorks(workspace_name, admin_key);
        pbworks.getAllPages().then(r => {
            for (let page of r) {
                console.log(page.oid);
                download_single_page(workspace_name, page.oid)
                    .then(pageinfo => {
                        console.log(pageinfo);
                        insert(pageinfo);
                    });
            }
            resolve();
        })
    })
}


function upload_page(data) {
    return new Promise((resolve, reject) => {
        console.log("begin uploading..........");
        if (data.oid < 0) {
            let pbworks = new PBWorks(user_workspace, admin_key);
            console.log(user_uid);
            pbworks.putPageContent(data.name, user_uid, data.html)
                .then(success => {
                    resolve(success);
                    console.log("upload finish......");
                }).catch(error => {
                console.log(error);
                reject(error);
                console.log("upload fail")
            })
        } else {
            let workspace_name = new RegExp("http://(.+)\.pbworks.com/w/page/.*").exec(data.revurl)[1];
            let pbworks = new PBWorks(workspace_name, admin_key);
            console.log(user_uid);
            pbworks.putPageContent(data.name, user_uid, data.html)
                .then(success => {
                    resolve(success);
                    console.log("upload finish......");
                }).catch(error => {
                console.log(error);
                reject(error);
                console.log("upload fail")
            })
        }

    })

}


function runSinglePageDownload(tab) {
    let url = tab.url;
    let flag, error_string;
    console.log("url: " + url);
    let pbwork_re = new RegExp("^.+\.pbworks.com/w/page/.*");
    let outcome = pbwork_re.test(url);
    if (outcome) {
        let workspace_name;
        let current_oid_num;
        let return_flag = false;
        current_oid_num = new RegExp("^.+\.pbworks.com/w/page/([0-9]+)/").exec(url)[1];
        workspace_name = new RegExp("http://(.+)\.pbworks.com/w/page/.*").exec(url)[1];
        if (workspace_name !== user_workspace) {
            return_flag = true;
            browser.tabs.sendMessage(tab.id, {
                response: false,
                type: "Target Website is Invalid",
                message: "This website does not belong to your Workspace!"
            });
        }

        if (return_flag)
            return -1;

        download_single_page(workspace_name, current_oid_num)
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
                    insert_version(pageInfo)
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


// function runManyPagesDownload(tab) {
//     download_all_pages(user_workspace)
//         .then(()=>{
//             browser.tabs.sendMessage(tab.id, {
//                 response: true
//             }).then(()=>{
//                 console.log("many page download");
//             });
//         })
// }

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
                if (page.oid < 0 && success.oid) {
                    let old_oid = page.oid;
                    let new_oid = success.oid;
                    get_data_oid(old_oid).then(e => {
                        let new_page = e.target.result;

                        new_page.oid = new_oid;
                        insert(new_page);
                        remove_data(old_oid).then((result) => {
                            browser.tabs.sendMessage(
                                request.tab_id,
                                {
                                    response: true,
                                    new_page: true
                                }
                            );
                        });
                    });
                } else {
                    browser.tabs.sendMessage(
                        request.tab_id,
                        {response: true}
                    ).then(response => {
                        console.log(response.response)
                    })
                }
            }).catch(error => {
            console.log(error);
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
                browser.tabs.sendMessage(tabs[0].id, {
                    response: false,
                    type: "Extension configuration",
                    message: "You haven't set configuration yet"
                })
            } else {
                runSinglePageDownload(tabs[0]);
            }

        }, onError);
    }

    // if (info.menuItemId === "PBwork-download-all") {
    //     let querying = browser.tabs.query({currentWindow: true, active: true});
    //     querying.then(function (tabs) {
    //         if (!if_load_config) {
    //             browser.tabs.sendMessage(tabs[0].id, {
    //                 response: false,
    //                 type: "Extension configuration",
    //                 message: "You haven't set configuration yet"
    //             })
    //         } else {
    //             runManyPagesDownload(tabs[0]);
    //         }
    //
    //     }, onError);
    // }
});

browser.tabs.onUpdated.addListener(injectScript);


// 5VXfJkL9eybJ3xuycKYU