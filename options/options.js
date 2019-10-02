function saveOptions(e) {
    e.preventDefault();
    let key = document.querySelector("#key").value;
    let name = document.querySelector("#name").value;
    browser.storage.local.set({
        pbwork_key: key,
        pbwork_user_name: name
    });
    document.querySelector("#admin_key").innerHTML = key;
    document.querySelector("#user_name").innerHTML = name;
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#key").value = result.pbwork_key || "5VXfJkL9eybJ3xuycKYU";
        document.querySelector("#admin_key").textContent = result.pbwork_key || "5VXfJkL9eybJ3xuycKYU";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.local.get("pbwork_key");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
