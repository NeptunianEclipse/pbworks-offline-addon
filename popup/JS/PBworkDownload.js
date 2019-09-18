function handleError(error) {
    console.log(`Error: ${error}`);
}

function handleResponse(message) {
    if(message.response === false){
        alert("This page is not a valid PBwork page!");
    }else {
        alert("This page has been stored in database!");
    }
}

function send_url_to_background(){
    let tab_url = window.top.location.href;
    let sending = browser.runtime.sendMessage({
        current_url:tab_url
    });
    sending.then(handleResponse, handleError);
}

send_url_to_background();



