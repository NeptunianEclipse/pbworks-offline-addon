function handleError(error) {
    console.log(`Error: ${error}`);
}


function handleMessage(request, sender, sendResponse) {
    if (request.response === true) {
        alert("This page has been stored in database!");

    } else {
        alert("There is ERROR in downloading: \n\n" + "Type:\n" +
            request.type + "\n\nError Message:\n" + request.message);
    }
}

browser.runtime.onMessage.addListener(handleMessage);

