/**
 * @return {string}
 */
function ReadPBWorkJson(file_path, editor) {
    $.getJSON(file_path, function (result) {
            editor.html(result['html']);
            $("#article_title").text(result["name"])
        }
    );
}

