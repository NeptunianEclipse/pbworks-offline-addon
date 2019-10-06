function handleError(error) {
    console.log(`Error: ${error}`);
}

function handleResponse(message) {
    console.log(message);
    if (message.response === false) {
        alert("upload fail");
    }
    if (message.response === true) {
        alert("upload successfully");
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
        alert("fail")
    })
}


function sendUploadObjectToBackground(object) {
    // get tab id
    let gettingCurrent = browser.tabs.getCurrent();
    gettingCurrent.then((tabInfo) => {
        let sending = browser.runtime.sendMessage({
            data: page,
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
        alert("Upload successfully")
    }
    if (request.response === false) {
        alert("Upload fail because some reason")
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
    console.log("begin save............");
    page.html = new_context;
    saveLocal(page);
    // local data base API here to save change in local
});


/**
 * upload function will be called here
 */
$('#button_update').click(function () {
    editor.sync();
    let new_context = $('#editor_id').val();
    page.html = new_context;
    if (oid !== -1) {
        saveLocal(page);
        sendUploadObjectToBackground(page);
    }else{

    }

});

/**
 *  This is a listener of modify title button
 *  and the callback function is "ReadPBWorkJson"
 */
$('#button_modify_title').click(function () {
    let article_title_selector = $('#article_title');
    let new_title = prompt("Please enter a new Page title", article_title_selector.text());
    if (new_title) {
        article_title_selector.text(new_title);
    }
});


