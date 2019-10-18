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

function handleError(error) {
    console.log(`Error: ${error}`);
}

function handleResponse(message) {
    console.log(message);
    if (message.response === false) {
        alert("Upload failed");
    }
    if (message.response === true) {
        alert("Upload successful");
    }

}

// receive and parse url parameters.
function GetQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);//search,find parameter behind '?'
    if (r != null)
        return unescape(r[2]);
    return null;
}

// save locally function

function saveLocal(object) {
    object.mtime = new Date().getTime();
    upgrade_data(object)
        .then(event => {
            alert("Page: " + object.name + " has been save in local!");
        }).catch(event => {
        alert("Error occured: Page has not saved.")
    })
}


function sendUploadObjectToBackground(object) {
    // get tab id
    let gettingCurrent = browser.tabs.getCurrent();
    gettingCurrent.then((tabInfo) => {
        let sending = browser.runtime.sendMessage({
            message: "ask for uploading",
            data: object,
            tab_id: tabInfo.id
        });
        sending.then(null, handleError);
    }, handleError);

}

/**
 * add a listener which receive messages from background.js
 */

browser.runtime.onMessage.addListener(request => {
    console.log("Message from the background script:");
    console.log(request);
    if (request.response === true) {
        if (request.new_page) {
            alert("New page have created in PBwork website!")
        } else {
            alert("Upload successfully")
        }
    }
    if (request.response === false) {
        alert("Error occured: upload failed")
    }
    return Promise.resolve({response: "editor.js get it"});
});


/**
 *  init the editor
 */
KindEditor.ready(function (K) {
    window.editor = K.create('#editor_id', {
        themeType: 'editor'
    });
});


let page;
let oid = GetQueryString('oid');
let newPageName;
let new_oid = -Date.parse(new Date());
oid = parseInt(oid); // note that data type of key primary
if (oid === -1) {
    newPageName = GetQueryString('name');
    $('#article_title').text(newPageName);
} else {
    get_data_oid(oid)
        .then(event => {
            $('#article_title').text(event.target.result.name);
            editor.html(event.target.result.html);
            page = event.target.result;
        });
}


$('#button_save').click(function () {
    editor.sync();
    let new_context = $('#editor_id').val();
    if (oid === -1) {
        let page = {};
        page.name = newPageName;
        page.html = new_context;
        page.oid = new_oid;
        insert(page).then(e => {
            alert("Page: " + page.name + " has been save in local!");
        }).catch(e => {
            alert("fail");
        })
    } else {
        console.log("begin save............");
        page.html = new_context;
        saveLocal(page);
    }

});


/**
 * upload function will be called here
 */
$('#button_update').click(function () {
    Online(function (flag) {
        if (!flag) {
            alert("You are currently not connected, please try again later");
        }
    });
    editor.sync();
    let new_context = $('#editor_id').val();
    if (oid === -1) {
        let page = {};
        page.name = newPageName;
        page.html = new_context;
        page.oid = new_oid;
        insert(page).then(e => {
            alert("Page: " + page.name + " has been save in local!");
        }).catch(e => {
            alert("fail");
        });
        sendUploadObjectToBackground(page);
    } else {
        page.html = new_context;
        saveLocal(page);
        sendUploadObjectToBackground(page);
    }

});



