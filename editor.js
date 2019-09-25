/**
 *  This is a callback funtion for 
 *  modify title button
 * @return {string}
 */
function ReadPBWorkJson(file_path, editor) {
    $.getJSON(file_path, function (result) {
        editor.html(result['html']);
        $("#article_title").text(result["name"])
    }
    );
}


/**
 *  init the editor
 */
KindEditor.ready(function (K) {
    window.editor = K.create('#editor_id', {
        themeType: 'editor'
    });
    ReadPBWorkJson("sample.json", window.editor);
});


$('#button_save').click(function () {
    editor.sync();
    let new_context = $('#editor_id').val();
    alert("you click save!")
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

