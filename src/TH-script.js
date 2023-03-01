const TH_BASE_URL = "https://codecyprus.org/th/api/"; // the true API base url
const TH_TEST_URL = "https://codecyprus.org/th/test-api/"; // the test API base url

function redirect(url) {
    window.location.href = url.toString();
}

function getChallenges() {
    fetch(TH_BASE_URL + "list")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            loader.hidden = true;
            if (jsonObject.status === "OK") {
                let THArray = jsonObject.treasureHunts;
                console.log(THArray);
                for (let i = 0; i < THArray.length; i++) {
                    let listItem = document.createElement("li");
                    let uuid = THArray[i].uuid;
                    console.log(uuid);
                    listItem.innerHTML = "<a href=\"javascript:select(\'" + uuid + "\')\">" + THArray[i].name + "</a>";
                    challengesList.appendChild(listItem);
                }
            }
            else {
                for (let error in jsonObject.errorMessages) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = error;
                    errorList.appendChild(listItem);
                }
            }
        });
}

let challengesList = document.getElementById("challengeList");
let errorList = document.getElementById("errorList");
let loader = document.getElementById("loader");

// This block of code handles query strings and was taken from the website stackoverflow
// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

// Get the name of the team
let teamName = params.name;

function select(uuid) {

    console.log("ENTERED")
    fetch(TH_BASE_URL + "start?player=" + teamName + "&app=TH-Team6&treasure-hunt-id=" + uuid)
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK") {
                setCookie("session", jsonObject.session, 365);
                redirect("session.html");
            }
            else {

            }

        });
}

// Functions to handle cookies taken from w3schools
// https://www.w3schools.com/js/js_cookies.asp
//////////////////////////////////////////////////

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    let user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}

//////////////////////////////////////


