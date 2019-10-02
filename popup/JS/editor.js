function handleError(error) {
    console.log(`Error: ${error}`);
}

function handleResponse(message){
    console.log(message);  
    if(message.response === false){
        alert("upload fail");
    }
    if (message.response === true){
        alert("upload successfully");
    }

}

// receive and parse url parameters.
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);//search,find parameter behind '?' 
    if (r != null)
        return unescape(r[2]);
    return null;
}

// save locally function

function saveLocal(object){
    upload_data(object)
    .then(event => {
        alert("Page: "+object.name+" has been save in local!");
    }).catch(event =>{
        alert("fail")
    })
}


function sendUploadObjectToBackground(object){
    let sending = browser.runtime.sendMessage({
        data: page
    });
    sending.then(handleResponse, handleError);
}

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
oid = parseInt(oid); // note that data type of key primary
get_data_oid(oid)
    .then(event => {
        $('#article_title').text(event.target.result.name)
        editor.html(event.target.result.html);
        page = event.target.result;
    });



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
    saveLocal(page);
    sendUploadObjectToBackground(page);
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
})

