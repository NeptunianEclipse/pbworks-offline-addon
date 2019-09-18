function saveOptions(e) {
    e.preventDefault();
    let key = document.querySelector("#key").value;
    browser.storage.local.set({
        pbwork_key: key
    });
    document.querySelector("#admin_key").innerHTML = key;
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#key").value = result.pbwork_key || "";
        console.log(result.pbwork_key);
        document.querySelector("#admin_key").textContent = result.pbwork_key;
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.local.get("pbwork_key");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
