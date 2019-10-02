let admin_key;
let workspace_name;
let oid_num;


//create a item in right-click menu in firefox
browser.contextMenus.create({
    id: "PBwork-download",
    title: "Download PBwork article"
});

//add an listener for item in right-click
browser.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "PBwork-download") {
        browser.tabs.executeScript({
            file: "./popup/JS/PBworkDownload.js"
        });
    }
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
            console.log("download finish");
        });
    })
}

function upload_page(data){
    return new Promise((resolve, reject) => {
        console.log("begin uploading..........");
        let pbworks = new PBWorks(workspace_name, admin_key);
        pbworks.putPage({
            page: data.name,
            html: encodeURIComponent(data.html)
        }).then(success => {
            console.log(success);
            resolve(success);
            console.log("upload finfish......");
        }).catch(error =>{
            
            console.log(error);
            reject(error);
            console.log("upload fail")
        })
    })

}

//
function handleMessage(request, sender, sendResponse) {
    console.log(request)
    if (request.current_url){
        console.log("url"+request.current_url);
        let url = request.current_url;
        let pbwork_re = new RegExp("^.+\.pbworks.com/w/page/[0-9]{9}/.*");
        let outcome = pbwork_re.test(url);
        if (outcome) {
            sendResponse({response: true});
            oid_num = new RegExp("[0-9]{9}")
                .exec(url)[0];
            workspace_name = new RegExp("^.*\.pbworks\.com")
                .exec(url)[0]
                .replace(/^http:\/\//, "")
                .replace(/\.pbworks\.com/, "");
            let p = new Promise(function (resolve, reject) {
                resolve();
            });
            p.then(open_local_storage)
                .then(get_admin_key)
                .then(download_page)
                .then(function (pageInfo) {
                    // insert page into database
                    insert(pageInfo)
                        .then(sendResponse({response: true}));
                });

        } else {
            sendResponse({response: false});
        }
    }
    if(request.data){
        console.log(request.data);
        let page = request.data;
        upload_page(page)
        .then(success =>{
            console.log(success);
            browser.tabs.sendMessage(
                request.tab_id,
                {response: true}
            ).then(response => {
                console.log(response.response)
            })
        }).catch(error =>{
            browser.tabs.sendMessage(
                request.tab_id,
                {response: false}
            ).then(response => {
                console.log(response.response)
            })
        });
    }
}

browser.runtime.onMessage.addListener(handleMessage);



// 5VXfJkL9eybJ3xuycKYU