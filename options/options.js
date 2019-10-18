function saveOptions(e) {
    e.preventDefault();
    let key = document.querySelector("#key").value;
    let email = document.querySelector("#email").value;
    let workspace = document.querySelector("#workspace").value;
    browser.storage.local.set({
        pbwork_key: key,
        pbwork_user_email: email,
        pbwork_workspace: workspace
    }).then(r => {
        browser.runtime.sendMessage({
            message: "configuration update"
        }).then(()=>{
            console.log("users configuration update")});
    });
    document.querySelector("#admin_key").innerHTML = key;
    document.querySelector("#user_name").innerHTML = email;
    document.querySelector("#user_workspace").innerHTML = workspace;
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#key").value = result.pbwork_key || "";
        document.querySelector("#admin_key").textContent = result.pbwork_key || "";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.local.get("pbwork_key");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
