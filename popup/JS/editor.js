
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);//search,find parameter behind '?' 
    if (r != null)
        return unescape(r[2]);
    return null;
}


/**
 *  init the editor
 */

let page;
let oid = GetQueryString('oid');
oid = parseInt(oid); // note that data type of key primary
get_data_oid(oid)
    .then(event => {
        $('#article_title').text(event.target.result.name)
        editor.html(event.target.result.html);
        page = event.target.result;
    });


KindEditor.ready(function (K) {
    window.editor = K.create('#editor_id', {
        themeType: 'editor'
    });
});


$('#button_save').click(function () {
    editor.sync();
    let new_context = $('#editor_id').val();
    alert("you click save!");
    console.log(new_context);
    // local data base API here to save change in local
});


/**
 * upload function will be called here
 */
$('#button_update').click(function () {

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


